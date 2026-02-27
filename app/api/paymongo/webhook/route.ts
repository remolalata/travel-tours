import { createHmac, timingSafeEqual } from 'node:crypto';

import { NextResponse } from 'next/server';

import { createAdminClient } from '@/utils/supabase/admin';

type PaymongoWebhookSignatureParts = {
  timestamp: string;
  signature: string;
};

type BookingLookupRow = {
  id: number;
  total_amount: number;
  paymongo_last_event_id: string | null;
};

type PaymongoWebhookPayload = {
  data?: {
    id?: string;
    attributes?: {
      type?: string;
      data?: {
        id?: string;
        attributes?: {
          metadata?: {
            booking_reference?: string;
          };
          payments?: Array<{ id?: string }>;
          payment_intent?: { id?: string };
          amount_total?: number;
          amount?: number;
        };
      };
    };
  };
};

function parseSignatureHeader(signatureHeader: string): PaymongoWebhookSignatureParts | null {
  const segments = signatureHeader.split(',').map((segment) => segment.trim());
  const timestamp = segments.find((segment) => segment.startsWith('t='))?.slice(2);
  const signature = segments.find((segment) => segment.startsWith('v1='))?.slice(3);

  if (!timestamp || !signature) {
    return null;
  }

  return { timestamp, signature };
}

function verifyPaymongoSignature(input: {
  payload: string;
  signatureHeader: string;
  webhookSecret: string;
}): boolean {
  const signatureParts = parseSignatureHeader(input.signatureHeader);
  if (!signatureParts) {
    return false;
  }

  const signedPayload = `${signatureParts.timestamp}.${input.payload}`;
  const computedSignature = createHmac('sha256', input.webhookSecret)
    .update(signedPayload, 'utf8')
    .digest('hex');

  try {
    return timingSafeEqual(
      Buffer.from(computedSignature, 'utf8'),
      Buffer.from(signatureParts.signature, 'utf8'),
    );
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'Server misconfiguration: missing PAYMONGO_WEBHOOK_SECRET.' },
      { status: 500 },
    );
  }

  const signatureHeader = request.headers.get('paymongo-signature');
  if (!signatureHeader) {
    return NextResponse.json({ error: 'Missing Paymongo-Signature header.' }, { status: 400 });
  }

  const rawPayload = await request.text();
  const isValidSignature = verifyPaymongoSignature({
    payload: rawPayload,
    signatureHeader,
    webhookSecret,
  });

  if (!isValidSignature) {
    return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 401 });
  }

  try {
    const body = JSON.parse(rawPayload) as PaymongoWebhookPayload;
    const eventType = body?.data?.attributes?.type;
    const eventId = body?.data?.id;
    const resource = body?.data?.attributes?.data;
    const checkoutSessionId = resource?.id;
    const fallbackBookingReference = resource?.attributes?.metadata?.booking_reference;

    if (!eventType || !eventId || !checkoutSessionId) {
      return NextResponse.json({ error: 'Missing webhook event fields.' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const [{ data: bookingBySession, error: bookingBySessionError }, fallbackLookupResult] =
      await Promise.all([
        supabase
          .from('bookings')
          .select('id,total_amount,paymongo_last_event_id')
          .eq('paymongo_checkout_session_id', checkoutSessionId)
          .limit(1)
          .maybeSingle<BookingLookupRow>(),
        fallbackBookingReference
          ? supabase
              .from('bookings')
              .select('id,total_amount,paymongo_last_event_id')
              .eq('booking_reference', fallbackBookingReference)
              .limit(1)
              .maybeSingle<BookingLookupRow>()
          : Promise.resolve({ data: null, error: null }),
      ]);

    if (bookingBySessionError) {
      return NextResponse.json({ error: bookingBySessionError.message }, { status: 500 });
    }
    if (fallbackLookupResult.error) {
      return NextResponse.json({ error: fallbackLookupResult.error.message }, { status: 500 });
    }

    const booking = bookingBySession ?? fallbackLookupResult.data ?? null;
    if (!booking) {
      return NextResponse.json(
        { received: true, ignored: true, reason: 'Booking not found.' },
        { status: 200 },
      );
    }

    if (booking.paymongo_last_event_id === eventId) {
      return NextResponse.json(
        { received: true, ignored: true, reason: 'Event already processed.' },
        { status: 200 },
      );
    }

    const paymentId =
      resource?.attributes?.payments?.[0]?.id ?? resource?.attributes?.payment_intent?.id ?? null;
    const amountCentavos = resource?.attributes?.amount_total ?? resource?.attributes?.amount;
    const amountPaid =
      typeof amountCentavos === 'number' && Number.isFinite(amountCentavos)
        ? Math.max(0, Math.round(amountCentavos) / 100)
        : Number(booking.total_amount);

    if (eventType === 'checkout_session.payment.paid') {
      const { error: updatePaidError } = await supabase
        .from('bookings')
        .update({
          booking_status: 'approved',
          payment_status: 'paid',
          amount_paid: amountPaid,
          approved_at: new Date().toISOString(),
          payment_provider: 'paymongo',
          paymongo_payment_id: paymentId,
          paymongo_last_event_id: eventId,
        })
        .eq('id', booking.id);

      if (updatePaidError) {
        return NextResponse.json({ error: updatePaidError.message }, { status: 500 });
      }
    } else if (eventType === 'checkout_session.payment.failed') {
      const { error: updateFailedError } = await supabase
        .from('bookings')
        .update({
          booking_status: 'pending',
          payment_status: 'unpaid',
          payment_provider: 'paymongo',
          paymongo_payment_id: paymentId,
          paymongo_last_event_id: eventId,
        })
        .eq('id', booking.id);

      if (updateFailedError) {
        return NextResponse.json({ error: updateFailedError.message }, { status: 500 });
      }
    } else {
      const { error: updateUnhandledEventError } = await supabase
        .from('bookings')
        .update({
          payment_provider: 'paymongo',
          paymongo_last_event_id: eventId,
        })
        .eq('id', booking.id);

      if (updateUnhandledEventError) {
        return NextResponse.json({ error: updateUnhandledEventError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ received: true, eventId, eventType, bookingId: booking.id }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }
}
