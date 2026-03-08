import { Buffer } from 'node:buffer';
import { createHmac, timingSafeEqual } from 'node:crypto';

import { NextResponse } from 'next/server';

import { markPaymentFailed, reconcileBookingPayment } from '@/app/api/paymongo/_lib';
import { createAdminClient } from '@/utils/supabase/admin';

type PaymongoWebhookSignatureParts = {
  timestamp: string;
  signature: string;
};

type PaymentLookupRow = {
  id: number;
  provider_checkout_session_id: string | null;
  payment_reference: string;
  provider_reference: string | null;
  provider_payment_intent_id: string | null;
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
            booking_id?: string;
            payment_id?: string;
            payment_reference?: string;
          };
          checkout_session_id?: string;
          checkout_session?: { id?: string };
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
  const webhookSecret = process.env.NEXT_PAYMONGO_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'Server misconfiguration: missing NEXT_PAYMONGO_WEBHOOK_SECRET.' },
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
    const resource = body?.data?.attributes?.data;
    const checkoutSessionId =
      resource?.id ??
      resource?.attributes?.checkout_session_id ??
      resource?.attributes?.checkout_session?.id;
    const paymentIntentId = resource?.attributes?.payment_intent?.id ?? null;
    const providerReference = resource?.attributes?.payments?.[0]?.id ?? paymentIntentId;
    const amountCentavos = resource?.attributes?.amount_total ?? resource?.attributes?.amount;
    const amountPaid =
      typeof amountCentavos === 'number' && Number.isFinite(amountCentavos)
        ? Math.max(0, Math.round(amountCentavos) / 100)
        : 0;
    const fallbackPaymentIdRaw = resource?.attributes?.metadata?.payment_id;
    const fallbackPaymentId = fallbackPaymentIdRaw ? Number(fallbackPaymentIdRaw) : NaN;
    const fallbackPaymentReference = resource?.attributes?.metadata?.payment_reference ?? null;

    if (
      !eventType ||
      (!checkoutSessionId && !fallbackPaymentReference && !Number.isInteger(fallbackPaymentId))
    ) {
      return NextResponse.json({ error: 'Missing webhook event fields.' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const [paymentBySessionResult, paymentByReferenceResult, paymentByIdResult] = await Promise.all(
      [
        checkoutSessionId
          ? supabase
              .from('payments')
              .select(
                'id,provider_checkout_session_id,payment_reference,provider_reference,provider_payment_intent_id',
              )
              .eq('provider_checkout_session_id', checkoutSessionId)
              .limit(1)
              .maybeSingle<PaymentLookupRow>()
          : Promise.resolve({ data: null, error: null }),
        fallbackPaymentReference
          ? supabase
              .from('payments')
              .select(
                'id,provider_checkout_session_id,payment_reference,provider_reference,provider_payment_intent_id',
              )
              .eq('payment_reference', fallbackPaymentReference)
              .limit(1)
              .maybeSingle<PaymentLookupRow>()
          : Promise.resolve({ data: null, error: null }),
        Number.isInteger(fallbackPaymentId)
          ? supabase
              .from('payments')
              .select(
                'id,provider_checkout_session_id,payment_reference,provider_reference,provider_payment_intent_id',
              )
              .eq('id', fallbackPaymentId)
              .limit(1)
              .maybeSingle<PaymentLookupRow>()
          : Promise.resolve({ data: null, error: null }),
      ],
    );

    const payment =
      paymentBySessionResult.data ??
      paymentByReferenceResult.data ??
      paymentByIdResult.data ??
      null;

    if (!payment) {
      return NextResponse.json(
        { received: true, ignored: true, reason: 'Payment not found.' },
        { status: 200 },
      );
    }

    const isPaidEvent =
      eventType === 'checkout_session.payment.paid' || eventType.endsWith('.payment.paid');
    const isFailedEvent =
      eventType === 'checkout_session.payment.failed' || eventType.endsWith('.payment.failed');

    if (isPaidEvent) {
      await reconcileBookingPayment({
        supabase,
        paymentId: payment.id,
        amountPaid,
        providerReference,
        providerCheckoutSessionId: checkoutSessionId ?? payment.provider_checkout_session_id,
        providerPaymentIntentId: paymentIntentId,
        triggerSource: 'webhook',
        rawResponse: body,
      });
    } else if (isFailedEvent) {
      await markPaymentFailed({
        supabase,
        paymentId: payment.id,
        providerReference,
        providerCheckoutSessionId: checkoutSessionId ?? payment.provider_checkout_session_id,
        providerPaymentIntentId: paymentIntentId,
        rawResponse: body,
      });
    }

    return NextResponse.json({ received: true, eventType, paymentId: payment.id }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }
}
