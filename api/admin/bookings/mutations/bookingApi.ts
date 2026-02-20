import type { SupabaseClient } from '@supabase/supabase-js';

export type RawBookingStatus = 'approved' | 'pending' | 'cancelled' | 'completed';
export type RawPaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded';

export type AdminBookingData = {
  id: number;
  bookingReference: string;
  packageTitle: string;
  destinationName: string | null;
  bookingStatus: RawBookingStatus;
  paymentStatus: RawPaymentStatus;
  currency: string;
  totalAmount: number;
  amountPaid: number;
  numberOfTravelers: number;
  travelStartDate: string;
  travelEndDate: string;
  bookedAt: string;
  customerFirstName: string;
  customerLastName: string;
};

export type FetchAdminBookingsInput = {
  status?: RawBookingStatus;
  page: number;
  pageSize: number;
};

export type PaginatedAdminBookings = {
  rows: AdminBookingData[];
  total: number;
  page: number;
  pageSize: number;
};

type BookingRow = {
  id: number;
  booking_reference: string;
  package_title: string;
  booking_status: RawBookingStatus;
  payment_status: RawPaymentStatus;
  currency: string;
  total_amount: number;
  amount_paid: number;
  number_of_travelers: number;
  travel_start_date: string;
  travel_end_date: string;
  booked_at: string;
  customer_first_name: string;
  customer_last_name: string;
  destinations:
    | {
        name: string | null;
      }
    | Array<{
        name: string | null;
      }>
    | null;
};

function getDestination(
  destination: BookingRow['destinations'],
): { name: string | null } | null {
  if (!destination) return null;

  if (Array.isArray(destination)) {
    return destination[0] ?? null;
  }

  return destination;
}

export async function fetchAdminBookings(
  supabase: SupabaseClient,
  input: FetchAdminBookingsInput,
): Promise<PaginatedAdminBookings> {
  const from = input.page * input.pageSize;
  const to = from + input.pageSize - 1;

  let query = supabase
    .from('bookings')
    .select(
      `
      id,
      booking_reference,
      package_title,
      booking_status,
      payment_status,
      currency,
      total_amount,
      amount_paid,
      number_of_travelers,
      travel_start_date,
      travel_end_date,
      booked_at,
      customer_first_name,
      customer_last_name,
      destinations(name)
    `,
      { count: 'exact' },
    )
    .order('booked_at', { ascending: false })
    .range(from, to);

  if (input.status) {
    query = query.eq('booking_status', input.status);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`BOOKINGS_FETCH_FAILED:${error.message}`);
  }

  const rows = ((data ?? []) as BookingRow[]).map((booking) => {
    const destination = getDestination(booking.destinations);

    return {
      id: booking.id,
      bookingReference: booking.booking_reference,
      packageTitle: booking.package_title,
      destinationName: destination?.name ?? null,
      bookingStatus: booking.booking_status,
      paymentStatus: booking.payment_status,
      currency: booking.currency,
      totalAmount: booking.total_amount,
      amountPaid: booking.amount_paid,
      numberOfTravelers: booking.number_of_travelers,
      travelStartDate: booking.travel_start_date,
      travelEndDate: booking.travel_end_date,
      bookedAt: booking.booked_at,
      customerFirstName: booking.customer_first_name,
      customerLastName: booking.customer_last_name,
    };
  });

  return {
    rows,
    total: count ?? 0,
    page: input.page,
    pageSize: input.pageSize,
  };
}
