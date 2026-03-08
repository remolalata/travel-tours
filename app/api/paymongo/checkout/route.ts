import { NextResponse } from 'next/server';

import {
  buildPaymongoAuthHeader,
  createUniqueBookingReference,
  createUniquePaymentReference,
  toCentavos,
} from '@/app/api/paymongo/_lib';
import type {
  BookingPaymentFormState,
  BookingPaymentOption,
  BookingTravelerFormState,
} from '@/utils/helpers/tour-single/bookingPayment';
import { calculateBookingTotals } from '@/utils/helpers/tour-single/bookingPayment';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient as createServerSupabaseClient } from '@/utils/supabase/server';

type CheckoutPayload = {
  tourId?: number;
  departureId?: number;
  travelDateRange?: string;
  paymentOption?: BookingPaymentOption;
  notes?: string;
  travelers?: BookingTravelerFormState[];
  adults?: string;
  children?: string;
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

type TourRow = {
  id: number;
  title: string;
};

type DepartureRow = {
  id: number;
  tour_id: number;
  start_date: string;
  end_date: string;
  booking_deadline: string;
  maximum_capacity: number;
  confirmed_pax: number;
  price: number;
  status: 'open' | 'sold_out' | 'closed' | 'cancelled';
};

const PAYMONGO_API_BASE_URL = process.env.PAYMONGO_API_BASE_URL || 'https://api.paymongo.com/v1';

function getPublicSiteUrl(request: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, '');
  }

  const requestUrl = new URL(request.url);
  return `${requestUrl.protocol}//${requestUrl.host}`;
}

function normalizeTravelerCounts(payload: CheckoutPayload) {
  const adults = String(payload.adults ?? '');
  const children = String(payload.children ?? '0');

  return {
    adults,
    children,
  };
}

function resolveBillingContact(travelers: BookingTravelerFormState[]) {
  const leadTraveler = travelers[0];

  if (!leadTraveler) {
    throw new Error('At least one traveler is required.');
  }

  return {
    name: `${leadTraveler.firstName} ${leadTraveler.lastName}`.trim(),
    email: leadTraveler.email.trim(),
    phone: leadTraveler.phone.trim(),
  };
}

function normalizePaymentType(paymentOption: BookingPaymentOption) {
  return paymentOption === 'downpayment' ? 'downpayment' : 'full';
}

function buildCheckoutFormState(input: CheckoutPayload): BookingPaymentFormState {
  return {
    adults: String(input.adults ?? '1'),
    children: String(input.children ?? '0'),
    paymentOption: input.paymentOption ?? 'downpayment',
    travelers: input.travelers ?? [],
    notes: String(input.notes ?? ''),
  };
}

export async function POST(request: Request) {
  const paymongoSecretKey = process.env.NEXT_PAYMONGO_SECRET_KEY;
  if (!paymongoSecretKey) {
    return NextResponse.json(
      { error: 'Server misconfiguration: missing NEXT_PAYMONGO_SECRET_KEY.' },
      { status: 500 },
    );
  }

  let body: CheckoutPayload;
  try {
    body = (await request.json()) as CheckoutPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  const departureId = Number(body.departureId);
  const paymentOption = body.paymentOption ?? 'downpayment';
  const travelers = body.travelers ?? [];

  if (
    !Number.isFinite(body.tourId) ||
    !Number.isFinite(departureId) ||
    !['full', 'downpayment'].includes(paymentOption) ||
    travelers.length === 0
  ) {
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

  const { data: tourRow, error: tourError } = await supabase
    .from('tours')
    .select('id,title')
    .eq('id', body.tourId)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle<TourRow>();

  if (tourError) {
    return NextResponse.json(
      { error: `Tour lookup failed: ${tourError.message}` },
      { status: 500 },
    );
  }

  if (!tourRow) {
    return NextResponse.json({ error: 'Tour not found.' }, { status: 404 });
  }

  const { data: departureRow, error: departureError } = await supabase
    .from('departures')
    .select(
      'id,tour_id,start_date,end_date,booking_deadline,maximum_capacity,confirmed_pax,price,status',
    )
    .eq('id', departureId)
    .eq('tour_id', body.tourId)
    .limit(1)
    .maybeSingle<DepartureRow>();

  if (departureError) {
    return NextResponse.json(
      { error: `Departure lookup failed: ${departureError.message}` },
      { status: 500 },
    );
  }

  if (!departureRow || departureRow.status !== 'open') {
    return NextResponse.json({ error: 'Departure not found or unavailable.' }, { status: 404 });
  }

  const today = new Date();
  const bookingDeadline = new Date(`${departureRow.booking_deadline}T23:59:59Z`);
  if (today > bookingDeadline) {
    return NextResponse.json(
      { error: 'Booking deadline has passed for this departure.' },
      { status: 400 },
    );
  }

  if (departureRow.confirmed_pax + travelers.length > departureRow.maximum_capacity) {
    return NextResponse.json(
      { error: 'Selected departure no longer has enough available slots.' },
      { status: 409 },
    );
  }

  const counts = normalizeTravelerCounts(body);
  const totals = calculateBookingTotals(
    Number(departureRow.price) || 0,
    buildCheckoutFormState(body),
  );
  const travelerCount = travelers.length;
  const expectedTravelerCount = Number(counts.adults || '0') + Number(counts.children || '0');

  if (travelerCount !== expectedTravelerCount) {
    return NextResponse.json(
      { error: 'Traveler details do not match the selected passenger counts.' },
      { status: 400 },
    );
  }

  const bookingReference = await createUniqueBookingReference(supabase);
  const paymentReference = await createUniquePaymentReference(supabase);
  const billingContact = resolveBillingContact(travelers);
  const siteUrl = getPublicSiteUrl(request);
  const nowIso = new Date().toISOString();

  const { data: insertedBooking, error: bookingInsertError } = await supabase
    .from('bookings')
    .insert({
      reference_no: bookingReference,
      user_id: user.id,
      tour_id: tourRow.id,
      departure_id: departureRow.id,
      tour_title_snapshot: tourRow.title,
      departure_start_date_snapshot: departureRow.start_date,
      departure_end_date_snapshot: departureRow.end_date,
      lead_traveler_name: billingContact.name,
      lead_traveler_email: billingContact.email,
      lead_traveler_phone: billingContact.phone,
      traveler_count: travelerCount,
      currency: 'PHP',
      payment_option: paymentOption,
      booking_status: 'pending_payment',
      payment_status: 'unpaid',
      inventory_status: 'none',
      price_per_pax_snapshot: departureRow.price,
      downpayment_per_pax_snapshot:
        paymentOption === 'downpayment' ? Math.round(departureRow.price * 0.3 * 100) / 100 : null,
      total_amount: totals.totalAmount,
      amount_due_now: totals.amountToChargeNow,
      amount_paid: 0,
      balance_amount: totals.totalAmount,
      refunded_amount: 0,
      booked_at: nowIso,
      notes: body.notes?.trim() || null,
    })
    .select('id,reference_no')
    .limit(1)
    .maybeSingle<{ id: number; reference_no: string }>();

  if (bookingInsertError || !insertedBooking) {
    return NextResponse.json(
      { error: `Booking create failed: ${bookingInsertError?.message ?? 'Unknown error'}` },
      { status: 500 },
    );
  }

  const { error: travelerInsertError } = await supabase.from('booking_travelers').insert(
    travelers.map((traveler, index) => ({
      booking_id: insertedBooking.id,
      traveler_type: traveler.travelerType,
      is_lead: index === 0,
      first_name: traveler.firstName.trim(),
      last_name: traveler.lastName.trim(),
      email: traveler.email.trim() || null,
      phone: traveler.phone.trim() || null,
    })),
  );

  if (travelerInsertError) {
    return NextResponse.json(
      { error: `Traveler save failed: ${travelerInsertError.message}` },
      { status: 500 },
    );
  }

  const { data: paymentRow, error: paymentInsertError } = await supabase
    .from('payments')
    .insert({
      booking_id: insertedBooking.id,
      payment_reference: paymentReference,
      payment_type: normalizePaymentType(paymentOption),
      provider: 'paymongo',
      amount: totals.amountToChargeNow,
      currency: 'PHP',
      payment_status: 'pending',
      attempted_at: nowIso,
      raw_response: {
        source: 'checkout_request',
      },
    })
    .select('id,payment_reference')
    .limit(1)
    .maybeSingle<{ id: number; payment_reference: string }>();

  if (paymentInsertError || !paymentRow) {
    return NextResponse.json(
      { error: `Payment create failed: ${paymentInsertError?.message ?? 'Unknown error'}` },
      { status: 500 },
    );
  }

  const amountInCentavos = toCentavos(totals.amountToChargeNow);
  if (amountInCentavos <= 0) {
    return NextResponse.json(
      { error: 'Selected payment option has no amount to charge.' },
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
            name: billingContact.name || 'Travel & Tours Customer',
            email: billingContact.email || user.email || undefined,
            phone: billingContact.phone || undefined,
            address: {
              line1: 'Poblacion',
              city: 'Manaoag',
              state: 'Pangasinan',
              postal_code: '2430',
              country: 'PH',
            },
          },
          description: tourRow.title,
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
          success_url: `${siteUrl}/api/paymongo/return?checkout=success&tourId=${tourRow.id}&ref=${encodeURIComponent(insertedBooking.reference_no)}`,
          cancel_url: `${siteUrl}/api/paymongo/return?checkout=cancelled&tourId=${tourRow.id}&ref=${encodeURIComponent(insertedBooking.reference_no)}`,
          metadata: {
            booking_id: String(insertedBooking.id),
            booking_reference: insertedBooking.reference_no,
            payment_id: String(paymentRow.id),
            payment_reference: paymentRow.payment_reference,
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
      .from('payments')
      .update({
        payment_status: 'failed',
        failed_at: new Date().toISOString(),
        raw_response: paymongoBody,
      })
      .eq('id', paymentRow.id);

    return NextResponse.json(
      { error: paymongoBody?.errors?.[0]?.detail || 'PayMongo checkout creation failed.' },
      { status: 502 },
    );
  }

  const { error: paymentUpdateError } = await supabase
    .from('payments')
    .update({
      provider_checkout_session_id: checkoutSessionId,
      raw_response: paymongoBody,
    })
    .eq('id', paymentRow.id);

  if (paymentUpdateError) {
    return NextResponse.json(
      { error: `Payment checkout link failed: ${paymentUpdateError.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      bookingReference: insertedBooking.reference_no,
      checkoutUrl,
    },
    { status: 200 },
  );
}
