import type { SupabaseClient } from '@supabase/supabase-js';
import dayjs from 'dayjs';

type SimulatedBookingPaymentOption = 'full' | 'partial' | 'reserve';

export type CreateSimulatedBookingInput = {
  destinationId: number;
  packageTitle: string;
  travelDateRange: string;
  numberOfTravelers: number;
  totalAmount: number;
  amountToChargeNow: number;
  paymentOption: SimulatedBookingPaymentOption;
  notes?: string;
};

function parseMonthDayValue(value: string, year: number) {
  const parsed = dayjs(new Date(`${value}, ${year}`));
  return parsed.isValid() ? parsed.startOf('day') : null;
}

function parseTravelDateRange(travelDateRange: string) {
  const [rawStart, rawEnd] = travelDateRange.split(' - ').map((part) => part.trim());
  if (!rawStart || !rawEnd) {
    throw new Error('BOOKING_CREATE_FAILED:INVALID_TRAVEL_DATE_RANGE');
  }

  const currentYear = dayjs().year();
  const startDate = parseMonthDayValue(rawStart, currentYear);
  let endDate = parseMonthDayValue(rawEnd, currentYear);

  if (!startDate || !endDate) {
    throw new Error('BOOKING_CREATE_FAILED:INVALID_TRAVEL_DATE_RANGE');
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

function resolveStatuses(paymentOption: SimulatedBookingPaymentOption) {
  if (paymentOption === 'full') {
    return {
      bookingStatus: 'approved' as const,
      paymentStatus: 'paid' as const,
      approvedAt: new Date().toISOString(),
    };
  }

  if (paymentOption === 'partial') {
    return {
      bookingStatus: 'pending' as const,
      paymentStatus: 'partial' as const,
      approvedAt: null,
    };
  }

  return {
    bookingStatus: 'pending' as const,
    paymentStatus: 'unpaid' as const,
    approvedAt: null,
  };
}

export async function createSimulatedBooking(
  supabase: SupabaseClient,
  input: CreateSimulatedBookingInput,
): Promise<{ bookingReference: string }> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(`BOOKING_CREATE_FAILED:${userError.message}`);
  }

  const { startDate, endDate } = parseTravelDateRange(input.travelDateRange);
  const statusPayload = resolveStatuses(input.paymentOption);
  const nowIso = new Date().toISOString();
  const bookingPayload = {
    customer_user_id: user?.id ?? null,
    destination_id: input.destinationId,
    package_title: input.packageTitle,
    booking_status: statusPayload.bookingStatus,
    payment_status: statusPayload.paymentStatus,
    currency: 'PHP',
    total_amount: input.totalAmount,
    amount_paid: input.amountToChargeNow,
    refunded_amount: 0,
    number_of_travelers: input.numberOfTravelers,
    travel_start_date: startDate.format('YYYY-MM-DD'),
    travel_end_date: endDate.format('YYYY-MM-DD'),
    booked_at: nowIso,
    approved_at: statusPayload.approvedAt,
    notes: input.notes?.trim() ? input.notes.trim() : 'Simulated payment flow (no gateway integration).',
  };

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const bookingReference = generateBookingReference();
    const { error } = await supabase.from('bookings').insert({
      booking_reference: bookingReference,
      ...bookingPayload,
    });

    if (!error) {
      return { bookingReference };
    }

    if (error.code === '23505') {
      continue;
    }

    throw new Error(`BOOKING_CREATE_FAILED:${error.message}`);
  }

  throw new Error('BOOKING_CREATE_FAILED:UNIQUE_REFERENCE_RETRY_EXHAUSTED');
}
