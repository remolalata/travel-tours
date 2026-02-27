import { Buffer } from 'node:buffer';

import { NextResponse } from 'next/server';

import { createAdminClient } from '@/utils/supabase/admin';

const PAYMONGO_API_BASE_URL = process.env.PAYMONGO_API_BASE_URL || 'https://api.paymongo.com/v1';

type PaymongoCheckoutSessionResponse = {
  data?: {
    attributes?: {
      status?: string;
      amount_total?: number;
      amount?: number;
      payments?: Array<{ id?: string; attributes?: { amount?: number } }>;
      payment_intent?: {
        id?: string;
        status?: string;
        attributes?: { status?: string };
      };
    };
  };
};

function buildPaymongoAuthHeader(secretKey: string) {
  const basic = Buffer.from(`${secretKey}:`, 'utf8').toString('base64');
  return `Basic ${basic}`;
}

function isPaidCheckout(
  attributes: PaymongoCheckoutSessionResponse['data'] extends infer T
    ? T extends { attributes?: infer A }
      ? A
      : never
    : never,
): boolean {
  const checkoutStatus = String(attributes?.status ?? '').toLowerCase();
  if (['paid', 'completed', 'succeeded'].includes(checkoutStatus)) {
    return true;
  }

  const paymentIntentStatus = String(
    attributes?.payment_intent?.attributes?.status ?? attributes?.payment_intent?.status ?? '',
  ).toLowerCase();
  if (['paid', 'completed', 'succeeded'].includes(paymentIntentStatus)) {
    return true;
  }

  return Array.isArray(attributes?.payments) && attributes.payments.length > 0;
}

function resolveAmountPaid(input: {
  attributes: PaymongoCheckoutSessionResponse['data'] extends infer T
    ? T extends { attributes?: infer A }
      ? A
      : never
    : never;
  fallback: number;
}) {
  const amountCandidates = [
    input.attributes?.amount_total,
    input.attributes?.amount,
    input.attributes?.payments?.[0]?.attributes?.amount,
  ];
  const amountCentavos = amountCandidates.find(
    (value): value is number => typeof value === 'number' && Number.isFinite(value),
  );

  if (typeof amountCentavos === 'number') {
    return Math.max(0, Math.round(amountCentavos) / 100);
  }

  return input.fallback;
}

function resolvePaymentId(
  attributes: PaymongoCheckoutSessionResponse['data'] extends infer T
    ? T extends { attributes?: infer A }
      ? A
      : never
    : never,
) {
  return attributes?.payments?.[0]?.id ?? attributes?.payment_intent?.id ?? null;
}

function buildRedirectUrl(input: {
  requestUrl: URL;
  tourId: string;
  checkoutStatus: string;
  reference: string;
}) {
  const params = new URLSearchParams();
  params.set('checkout', input.checkoutStatus);
  params.set('ref', input.reference);

  return new URL(`/tour/${input.tourId}?${params.toString()}`, input.requestUrl.origin);
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const checkoutStatus = requestUrl.searchParams.get('checkout') ?? 'cancelled';
  const tourId = requestUrl.searchParams.get('tourId');
  const reference = requestUrl.searchParams.get('ref') ?? '';

  if (!tourId) {
    return NextResponse.redirect(new URL('/tours', requestUrl.origin));
  }

  const redirectUrl = buildRedirectUrl({
    requestUrl,
    tourId,
    checkoutStatus,
    reference,
  });

  if (checkoutStatus !== 'success' || !reference) {
    return NextResponse.redirect(redirectUrl);
  }

  const paymongoSecretKey = process.env.PAYMONGO_SECRET_KEY;
  if (!paymongoSecretKey) {
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const supabase = createAdminClient();
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id,total_amount,payment_status,paymongo_checkout_session_id')
      .eq('booking_reference', reference)
      .limit(1)
      .maybeSingle<{
        id: number;
        total_amount: number;
        payment_status: string;
        paymongo_checkout_session_id: string | null;
      }>();

    if (
      bookingError ||
      !booking?.paymongo_checkout_session_id ||
      booking.payment_status === 'paid'
    ) {
      return NextResponse.redirect(redirectUrl);
    }

    const paymongoResponse = await fetch(
      `${PAYMONGO_API_BASE_URL}/checkout_sessions/${booking.paymongo_checkout_session_id}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: buildPaymongoAuthHeader(paymongoSecretKey),
        },
      },
    );

    const paymongoBody = (await paymongoResponse.json()) as PaymongoCheckoutSessionResponse;
    const attributes = paymongoBody?.data?.attributes;

    if (!paymongoResponse.ok || !attributes || !isPaidCheckout(attributes)) {
      return NextResponse.redirect(redirectUrl);
    }

    const amountPaid = resolveAmountPaid({
      attributes,
      fallback: Number(booking.total_amount),
    });

    const paymentId = resolvePaymentId(attributes);

    await supabase
      .from('bookings')
      .update({
        payment_status: 'paid',
        amount_paid: amountPaid,
        payment_provider: 'paymongo',
        ...(paymentId ? { paymongo_payment_id: paymentId } : {}),
      })
      .eq('id', booking.id);
  } catch {
    // Keep customer flow uninterrupted if reconciliation fails.
  }

  return NextResponse.redirect(redirectUrl);
}
