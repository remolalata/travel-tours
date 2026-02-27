import { Buffer } from 'node:buffer';

import dayjs from 'dayjs';
import { NextResponse } from 'next/server';

import {
  calculateSimulatedBookingTotals,
  type SimulatedPaymentOption,
} from '@/features/tour-single/helpers/simulatedBookingPayment';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient as createServerSupabaseClient } from '@/utils/supabase/server';

type CheckoutPayload = {
  tourId?: number;
  travelDateRange?: string;
  adults?: string;
  children?: string;
  paymentOption?: SimulatedPaymentOption;
  notes?: string;
  location?: string;
  tourType?: string;
};

type ProfileNameRow = {
  first_name: string | null;
  last_name: string | null;
};

type PaymongoCheckoutResponse = {
  data?: {
    id?: string;
    attributes?: {
      checkout_url?: string;
    };
  };
  errors?: Array<{ detail?: string }>;
};

const PAYMONGO_API_BASE_URL = process.env.PAYMONGO_API_BASE_URL || 'https://api.paymongo.com/v1';

function parseWholeNumber(value: string, fallback = 0): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.floor(parsed));
}

function parseMonthDayValue(value: string, year: number) {
  const parsed = dayjs(new Date(`${value}, ${year}`));
  return parsed.isValid() ? parsed.startOf('day') : null;
}

function parseTravelDateRange(travelDateRange: string) {
  const [rawStart, rawEnd] = travelDateRange.split(' - ').map((part) => part.trim());
  if (!rawStart || !rawEnd) {
    throw new Error('INVALID_TRAVEL_DATE_RANGE');
  }

  const currentYear = dayjs().year();
  const startDate = parseMonthDayValue(rawStart, currentYear);
  let endDate = parseMonthDayValue(rawEnd, currentYear);

  if (!startDate || !endDate) {
    throw new Error('INVALID_TRAVEL_DATE_RANGE');
  }

  if (endDate.isBefore(startDate, 'day')) {
    endDate = endDate.add(1, 'year');
  }

  return { startDate, endDate };
}

function generateBookingReference() {
  const numericPart = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0');

  return `BK-${numericPart}`;
}

function resolveStatuses(paymentOption: SimulatedPaymentOption) {
  if (paymentOption === 'full') {
    return {
      bookingStatus: 'pending' as const,
      paymentStatus: 'unpaid' as const,
      approvedAt: null,
    };
  }

  if (paymentOption === 'partial') {
    return {
      bookingStatus: 'pending' as const,
      paymentStatus: 'unpaid' as const,
      approvedAt: null,
    };
  }

  return {
    bookingStatus: 'pending' as const,
    paymentStatus: 'unpaid' as const,
    approvedAt: null,
  };
}

function toCentavos(amount: number) {
  return Math.round(amount * 100);
}

function buildPaymongoAuthHeader(secretKey: string) {
  const basic = Buffer.from(`${secretKey}:`, 'utf8').toString('base64');
  return `Basic ${basic}`;
}

function getPublicSiteUrl(request: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, '');
  }

  const requestUrl = new URL(request.url);
  return `${requestUrl.protocol}//${requestUrl.host}`;
}

function resolveBillingName(input: {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}) {
  const fullName = `${input.firstName ?? ''} ${input.lastName ?? ''}`.trim();
  if (fullName) {
    return fullName;
  }

  const emailPrefix = input.email?.split('@')[0]?.trim();
  if (emailPrefix) {
    return emailPrefix;
  }

  return 'Travel & Tours Customer';
}

export async function POST(request: Request) {
  const paymongoSecretKey = process.env.PAYMONGO_SECRET_KEY;
  if (!paymongoSecretKey) {
    return NextResponse.json(
      { error: 'Server misconfiguration: missing PAYMONGO_SECRET_KEY.' },
      { status: 500 },
    );
  }

  let body: CheckoutPayload;
  try {
    body = (await request.json()) as CheckoutPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  const paymentOption = body.paymentOption ?? 'partial';
  const adults = String(body.adults ?? '');
  const children = String(body.children ?? '0');
  const travelDateRange = String(body.travelDateRange ?? '').trim();

  if (!Number.isFinite(body.tourId) || !travelDateRange || !['full', 'partial', 'reserve'].includes(paymentOption)) {
    return NextResponse.json({ error: 'Missing or invalid checkout fields.' }, { status: 400 });
  }

  const authSupabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await authSupabase.auth.getUser();

  if (authError) {
    return NextResponse.json({ error: `Auth check failed: ${authError.message}` }, { status: 500 });
  }

  if (!user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data: profileRow } = await supabase
    .from('profiles')
    .select('first_name,last_name')
    .eq('user_id', user.id)
    .maybeSingle<ProfileNameRow>();

  const { data: tourRow, error: tourError } = await supabase
    .from('tours')
    .select('id,title,price,destination_id')
    .eq('id', body.tourId)
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();

  if (tourError) {
    return NextResponse.json({ error: `Tour lookup failed: ${tourError.message}` }, { status: 500 });
  }

  if (!tourRow) {
    return NextResponse.json({ error: 'Tour not found.' }, { status: 404 });
  }

  const normalizedAdults = Math.max(1, parseWholeNumber(adults, 1)).toString();
  const normalizedChildren = parseWholeNumber(children, 0).toString();
  const totals = calculateSimulatedBookingTotals(Number(tourRow.price) || 0, {
    adults: normalizedAdults,
    children: normalizedChildren,
    paymentOption,
    notes: body.notes ?? '',
  });

  let startDate: dayjs.Dayjs;
  let endDate: dayjs.Dayjs;
  try {
    const parsed = parseTravelDateRange(travelDateRange);
    startDate = parsed.startDate;
    endDate = parsed.endDate;
  } catch {
    return NextResponse.json({ error: 'Invalid travel date range format.' }, { status: 400 });
  }

  const statusPayload = resolveStatuses(paymentOption);
  const nowIso = new Date().toISOString();
  const notes = [
    body.notes?.trim(),
    `Location: ${body.location?.trim() || '-'}`,
    `Tour Type: ${body.tourType?.trim() || '-'}`,
    `Payment Option: ${paymentOption}`,
    'Checkout via PayMongo',
  ]
    .filter(Boolean)
    .join(' | ');

  let insertedBooking:
    | {
        id: number;
        booking_reference: string;
      }
    | null = null;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const bookingReference = generateBookingReference();
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        booking_reference: bookingReference,
        customer_user_id: user?.id ?? null,
        destination_id: tourRow.destination_id,
        tour_id: tourRow.id,
        package_title: tourRow.title,
        booking_status: statusPayload.bookingStatus,
        payment_status: statusPayload.paymentStatus,
        currency: 'PHP',
        total_amount: totals.totalAmount,
        amount_paid: 0,
        refunded_amount: 0,
        number_of_travelers: totals.travelers,
        travel_start_date: startDate.format('YYYY-MM-DD'),
        travel_end_date: endDate.format('YYYY-MM-DD'),
        booked_at: nowIso,
        approved_at: statusPayload.approvedAt,
        notes,
        payment_provider: 'paymongo',
      })
      .select('id,booking_reference')
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      insertedBooking = data;
      break;
    }

    if (error?.code === '23505') {
      continue;
    }

    return NextResponse.json({ error: `Booking create failed: ${error?.message ?? 'Unknown error'}` }, { status: 500 });
  }

  if (!insertedBooking) {
    return NextResponse.json({ error: 'Booking create failed: unique reference retry exhausted.' }, { status: 500 });
  }

  const siteUrl = getPublicSiteUrl(request);
  const amountInCentavos = toCentavos(totals.amountToChargeNow);

  if (amountInCentavos <= 0) {
    return NextResponse.json(
      { error: 'Selected payment option has no online payment amount to charge.' },
      { status: 400 },
    );
  }

  const paymongoResponse = await fetch(`${PAYMONGO_API_BASE_URL}/checkout_sessions`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: buildPaymongoAuthHeader(paymongoSecretKey),
    },
    body: JSON.stringify({
      data: {
        attributes: {
          billing: {
            name: resolveBillingName({
              firstName: profileRow?.first_name ?? null,
              lastName: profileRow?.last_name ?? null,
              email: user.email ?? null,
            }),
            email: user.email || undefined,
            address: {
              line1: 'Poblacion',
              city: 'Manaoag',
              state: 'Pangasinan',
              postal_code: '2430',
              country: 'PH',
            },
          },
          description: 'Travel & Tours',
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          line_items: [
            {
              currency: 'PHP',
              amount: amountInCentavos,
              name: `${tourRow.title} (${paymentOption})`,
              quantity: 1,
            },
          ],
          payment_method_types: ['gcash', 'paymaya', 'card'],
          success_url: `${siteUrl}/tour/${tourRow.id}?checkout=success&ref=${insertedBooking.booking_reference}`,
          cancel_url: `${siteUrl}/tour/${tourRow.id}?checkout=cancelled&ref=${insertedBooking.booking_reference}`,
          metadata: {
            booking_id: String(insertedBooking.id),
            booking_reference: insertedBooking.booking_reference,
            tour_id: String(tourRow.id),
            payment_option: paymentOption,
          },
        },
      },
    }),
  });

  const paymongoBody = (await paymongoResponse.json()) as PaymongoCheckoutResponse;
  const checkoutSessionId = paymongoBody?.data?.id;
  const checkoutUrl = paymongoBody?.data?.attributes?.checkout_url;

  if (!paymongoResponse.ok || !checkoutSessionId || !checkoutUrl) {
    await supabase
      .from('bookings')
      .update({
        notes: `${notes} | Checkout session creation failed`,
      })
      .eq('id', insertedBooking.id);

    return NextResponse.json(
      {
        error: paymongoBody?.errors?.[0]?.detail || 'PayMongo checkout creation failed.',
      },
      { status: 502 },
    );
  }

  const { error: updateBookingError } = await supabase
    .from('bookings')
    .update({
      paymongo_checkout_session_id: checkoutSessionId,
    })
    .eq('id', insertedBooking.id);

  if (updateBookingError) {
    return NextResponse.json(
      { error: `Booking checkout link failed: ${updateBookingError.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      bookingReference: insertedBooking.booking_reference,
      checkoutUrl,
    },
    { status: 200 },
  );
}
