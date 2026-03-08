import { Buffer } from 'node:buffer';

import type { SupabaseClient } from '@supabase/supabase-js';

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type BookingRow = {
  id: number;
  reference_no: string;
  departure_id: number;
  traveler_count: number;
  total_amount: number;
  amount_paid: number;
  payment_option: 'full' | 'downpayment' | 'reserve';
  booking_status:
    | 'draft'
    | 'pending_payment'
    | 'partially_paid'
    | 'confirmed'
    | 'cancelled'
    | 'expired'
    | 'completed';
  payment_status:
    | 'unpaid'
    | 'pending'
    | 'partial'
    | 'paid'
    | 'failed'
    | 'refunded'
    | 'partially_refunded';
  inventory_status: 'none' | 'held' | 'secured' | 'released' | 'expired';
  slots_confirmed_at: string | null;
  notes: string | null;
};

type PaymentRow = {
  id: number;
  booking_id: number;
  payment_reference: string;
  payment_type: 'full' | 'downpayment' | 'balance' | 'refund';
  amount: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  provider_reference: string | null;
  provider_checkout_session_id: string | null;
  provider_payment_intent_id: string | null;
};

type DepartureRow = {
  id: number;
  maximum_capacity: number;
  confirmed_pax: number;
};

export function buildPaymongoAuthHeader(secretKey: string) {
  const basic = Buffer.from(`${secretKey}:`, 'utf8').toString('base64');
  return `Basic ${basic}`;
}

export function generateBookingReference() {
  const numericPart = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0');

  return `BK-${numericPart}`;
}

export function generatePaymentReference() {
  const numericPart = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0');

  return `PAY-${numericPart}`;
}

export function toCentavos(amount: number) {
  return Math.round(amount * 100);
}

export async function createUniqueBookingReference(supabase: SupabaseClient) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const reference = generateBookingReference();
    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('reference_no', reference)
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(`BOOKING_REFERENCE_LOOKUP_FAILED:${error.message}`);
    }

    if (!data) {
      return reference;
    }
  }

  throw new Error('BOOKING_REFERENCE_RETRY_EXHAUSTED');
}

export async function createUniquePaymentReference(supabase: SupabaseClient) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const reference = generatePaymentReference();
    const { data, error } = await supabase
      .from('payments')
      .select('id')
      .eq('payment_reference', reference)
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(`PAYMENT_REFERENCE_LOOKUP_FAILED:${error.message}`);
    }

    if (!data) {
      return reference;
    }
  }

  throw new Error('PAYMENT_REFERENCE_RETRY_EXHAUSTED');
}

export async function appendBookingStatusLog(input: {
  supabase: SupabaseClient;
  bookingId: number;
  oldBookingStatus?: string | null;
  newBookingStatus?: string | null;
  oldPaymentStatus?: string | null;
  newPaymentStatus?: string | null;
  oldInventoryStatus?: string | null;
  newInventoryStatus?: string | null;
  triggerSource: 'system' | 'webhook' | 'admin' | 'customer';
  notes?: string | null;
}) {
  const hasMeaningfulChange =
    input.oldBookingStatus !== input.newBookingStatus ||
    input.oldPaymentStatus !== input.newPaymentStatus ||
    input.oldInventoryStatus !== input.newInventoryStatus ||
    Boolean(input.notes);

  if (!hasMeaningfulChange) {
    return;
  }

  await input.supabase.from('booking_status_logs').insert({
    booking_id: input.bookingId,
    old_booking_status: input.oldBookingStatus ?? null,
    new_booking_status: input.newBookingStatus ?? null,
    old_payment_status: input.oldPaymentStatus ?? null,
    new_payment_status: input.newPaymentStatus ?? null,
    old_inventory_status: input.oldInventoryStatus ?? null,
    new_inventory_status: input.newInventoryStatus ?? null,
    trigger_source: input.triggerSource,
    notes: input.notes ?? null,
  });
}

function resolveBookingStatuses(input: {
  paymentOption: BookingRow['payment_option'];
  totalAmount: number;
  amountPaid: number;
  currentInventoryStatus: BookingRow['inventory_status'];
}) {
  const roundedAmountPaid = Math.round(input.amountPaid * 100) / 100;
  const roundedTotalAmount = Math.round(input.totalAmount * 100) / 100;
  const nextInventoryStatus =
    roundedAmountPaid > 0
      ? 'secured'
      : input.currentInventoryStatus === 'secured'
        ? 'secured'
        : 'none';

  if (roundedAmountPaid <= 0) {
    return {
      bookingStatus: 'pending_payment' as const,
      paymentStatus: 'unpaid' as const,
      inventoryStatus: nextInventoryStatus,
    };
  }

  if (roundedAmountPaid < roundedTotalAmount) {
    return {
      bookingStatus: 'partially_paid' as const,
      paymentStatus: 'partial' as const,
      inventoryStatus: 'secured' as const,
    };
  }

  return {
    bookingStatus: 'confirmed' as const,
    paymentStatus: 'paid' as const,
    inventoryStatus: 'secured' as const,
  };
}

export async function secureDepartureSlotsOnce(input: {
  supabase: SupabaseClient;
  booking: BookingRow;
  confirmedAt: string;
}) {
  if (input.booking.slots_confirmed_at) {
    return;
  }

  const { data: departure, error: departureError } = await input.supabase
    .from('departures')
    .select('id,maximum_capacity,confirmed_pax')
    .eq('id', input.booking.departure_id)
    .limit(1)
    .maybeSingle<DepartureRow>();

  if (departureError || !departure) {
    throw new Error(
      `DEPARTURE_CONFIRM_LOOKUP_FAILED:${departureError?.message ?? 'Departure not found.'}`,
    );
  }

  const nextConfirmedPax = departure.confirmed_pax + input.booking.traveler_count;
  if (nextConfirmedPax > departure.maximum_capacity) {
    throw new Error('DEPARTURE_CAPACITY_EXCEEDED');
  }

  const { data: updatedBooking, error: bookingUpdateError } = await input.supabase
    .from('bookings')
    .update({
      slots_confirmed_at: input.confirmedAt,
    })
    .eq('id', input.booking.id)
    .is('slots_confirmed_at', null)
    .select('id')
    .limit(1)
    .maybeSingle();

  if (bookingUpdateError) {
    throw new Error(`BOOKING_SLOT_CONFIRM_FAILED:${bookingUpdateError.message}`);
  }

  if (!updatedBooking) {
    return;
  }

  const { error: departureUpdateError } = await input.supabase
    .from('departures')
    .update({
      confirmed_pax: nextConfirmedPax,
    })
    .eq('id', departure.id);

  if (departureUpdateError) {
    throw new Error(`DEPARTURE_PAX_UPDATE_FAILED:${departureUpdateError.message}`);
  }
}

export async function reconcileBookingPayment(input: {
  supabase: SupabaseClient;
  paymentId: number;
  amountPaid: number;
  providerReference?: string | null;
  providerCheckoutSessionId?: string | null;
  providerPaymentIntentId?: string | null;
  triggerSource: 'webhook' | 'customer';
  rawResponse?: Json | null;
}) {
  const { data: payment, error: paymentError } = await input.supabase
    .from('payments')
    .select(
      'id,booking_id,payment_reference,payment_type,amount,payment_status,provider_reference,provider_checkout_session_id,provider_payment_intent_id',
    )
    .eq('id', input.paymentId)
    .limit(1)
    .maybeSingle<PaymentRow>();

  if (paymentError || !payment) {
    throw new Error(`PAYMENT_LOOKUP_FAILED:${paymentError?.message ?? 'Payment not found.'}`);
  }

  const { data: booking, error: bookingError } = await input.supabase
    .from('bookings')
    .select(
      'id,reference_no,departure_id,traveler_count,total_amount,amount_paid,payment_option,booking_status,payment_status,inventory_status,slots_confirmed_at,notes',
    )
    .eq('id', payment.booking_id)
    .limit(1)
    .maybeSingle<BookingRow>();

  if (bookingError || !booking) {
    throw new Error(`BOOKING_LOOKUP_FAILED:${bookingError?.message ?? 'Booking not found.'}`);
  }

  const normalizedAmountPaid = Math.max(0, Math.round(input.amountPaid * 100) / 100);
  const existingAmountPaid = Math.round(booking.amount_paid * 100) / 100;
  const paymentAlreadySettled =
    payment.payment_status === 'paid' &&
    payment.provider_reference === (input.providerReference ?? payment.provider_reference) &&
    payment.provider_payment_intent_id ===
      (input.providerPaymentIntentId ?? payment.provider_payment_intent_id);

  const nextAmountPaid = paymentAlreadySettled
    ? existingAmountPaid
    : Math.min(
        Math.round((existingAmountPaid + normalizedAmountPaid) * 100) / 100,
        Math.round(booking.total_amount * 100) / 100,
      );

  const nextBalanceAmount = Math.max(
    0,
    Math.round((Math.round(booking.total_amount * 100) / 100 - nextAmountPaid) * 100) / 100,
  );
  const nextStatuses = resolveBookingStatuses({
    paymentOption: booking.payment_option,
    totalAmount: booking.total_amount,
    amountPaid: nextAmountPaid,
    currentInventoryStatus: booking.inventory_status,
  });
  const nowIso = new Date().toISOString();

  if (!paymentAlreadySettled) {
    const { error: paymentUpdateError } = await input.supabase
      .from('payments')
      .update({
        payment_status: 'paid',
        paid_at: nowIso,
        ...(input.providerReference ? { provider_reference: input.providerReference } : {}),
        ...(input.providerCheckoutSessionId
          ? { provider_checkout_session_id: input.providerCheckoutSessionId }
          : {}),
        ...(input.providerPaymentIntentId
          ? { provider_payment_intent_id: input.providerPaymentIntentId }
          : {}),
        ...(input.rawResponse ? { raw_response: input.rawResponse } : {}),
      })
      .eq('id', payment.id);

    if (paymentUpdateError) {
      throw new Error(`PAYMENT_UPDATE_FAILED:${paymentUpdateError.message}`);
    }
  }

  await input.supabase
    .from('bookings')
    .update({
      amount_paid: nextAmountPaid,
      balance_amount: nextBalanceAmount,
      payment_status: nextStatuses.paymentStatus,
      booking_status: nextStatuses.bookingStatus,
      inventory_status: nextStatuses.inventoryStatus,
      confirmed_at: nextStatuses.bookingStatus === 'confirmed' ? nowIso : null,
    })
    .eq('id', booking.id);

  if (nextStatuses.inventoryStatus === 'secured') {
    await secureDepartureSlotsOnce({
      supabase: input.supabase,
      booking,
      confirmedAt: nowIso,
    });
  }

  await appendBookingStatusLog({
    supabase: input.supabase,
    bookingId: booking.id,
    oldBookingStatus: booking.booking_status,
    newBookingStatus: nextStatuses.bookingStatus,
    oldPaymentStatus: booking.payment_status,
    newPaymentStatus: nextStatuses.paymentStatus,
    oldInventoryStatus: booking.inventory_status,
    newInventoryStatus: nextStatuses.inventoryStatus,
    triggerSource: input.triggerSource,
    notes: `Payment ${payment.payment_reference} settled.`,
  });
}

export async function markPaymentFailed(input: {
  supabase: SupabaseClient;
  paymentId: number;
  providerReference?: string | null;
  providerCheckoutSessionId?: string | null;
  providerPaymentIntentId?: string | null;
  rawResponse?: Json | null;
}) {
  const nowIso = new Date().toISOString();

  const { data: payment, error: paymentError } = await input.supabase
    .from('payments')
    .select('id,booking_id,payment_status')
    .eq('id', input.paymentId)
    .limit(1)
    .maybeSingle<{ id: number; booking_id: number; payment_status: string }>();

  if (paymentError || !payment) {
    throw new Error(`PAYMENT_LOOKUP_FAILED:${paymentError?.message ?? 'Payment not found.'}`);
  }

  const { error: paymentUpdateError } = await input.supabase
    .from('payments')
    .update({
      payment_status: 'failed',
      failed_at: nowIso,
      ...(input.providerReference ? { provider_reference: input.providerReference } : {}),
      ...(input.providerCheckoutSessionId
        ? { provider_checkout_session_id: input.providerCheckoutSessionId }
        : {}),
      ...(input.providerPaymentIntentId
        ? { provider_payment_intent_id: input.providerPaymentIntentId }
        : {}),
      ...(input.rawResponse ? { raw_response: input.rawResponse } : {}),
    })
    .eq('id', payment.id);

  if (paymentUpdateError) {
    throw new Error(`PAYMENT_UPDATE_FAILED:${paymentUpdateError.message}`);
  }
}
