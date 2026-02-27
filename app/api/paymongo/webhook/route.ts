import { createHmac, timingSafeEqual } from 'node:crypto';

import { NextResponse } from 'next/server';

type PaymongoWebhookSignatureParts = {
  timestamp: string;
  signature: string;
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
    const body = JSON.parse(rawPayload) as {
      data?: {
        id?: string;
        type?: string;
        attributes?: {
          type?: string;
        };
      };
    };

    const eventType = body?.data?.attributes?.type ?? 'unknown';
    const eventId = body?.data?.id ?? 'unknown';

    // TODO: Persist event and update booking state after checkout integration is wired.
    console.info('[paymongo:webhook] accepted', { eventId, eventType });

    return NextResponse.json({ received: true, eventId, eventType }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }
}
