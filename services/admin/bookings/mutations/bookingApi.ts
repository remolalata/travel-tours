import type { SupabaseClient } from '@supabase/supabase-js';

import {
  normalizeBookingSearchTerm,
  tokenizeBookingSearchTerm,
} from '@/services/admin/bookings/helpers/bookingSearch';

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
  statuses?: RawBookingStatus[];
  searchTerm?: string;
  page: number;
  pageSize: number;
};

export type UpdateAdminBookingStatusInput = {
  bookingId: number;
  bookingStatus: RawBookingStatus;
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
  customer_user_id: string | null;
  tour_id: number | null;
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
  destinations:
    | {
        name: string | null;
      }
    | Array<{
        name: string | null;
      }>
    | null;
  tours:
    | {
        title: string;
      }
    | Array<{
        title: string;
      }>
    | null;
};

type ProfileRow = {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
};

const MAX_PROFILE_MATCH_RESULTS = 300;
const MAX_PROFILE_FILTER_IDS = 150;

function getDestination(destination: BookingRow['destinations']): { name: string | null } | null {
  if (!destination) return null;

  if (Array.isArray(destination)) {
    return destination[0] ?? null;
  }

  return destination;
}

function getTour(tour: BookingRow['tours']): { title: string } | null {
  if (!tour) return null;

  if (Array.isArray(tour)) {
    return tour[0] ?? null;
  }

  return tour;
}

async function fetchMatchingProfileUserIds(
  supabase: SupabaseClient,
  token: string,
): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('profiles')
    .select('user_id')
    .or(`first_name.ilike.%${token}%,last_name.ilike.%${token}%`)
    .limit(MAX_PROFILE_MATCH_RESULTS);

  if (error) {
    throw new Error(`BOOKINGS_PROFILE_SEARCH_FAILED:${error.message}`);
  }

  return new Set(
    ((data ?? []) as Array<{ user_id: string | null }>)
      .map((row) => row.user_id)
      .filter((userId): userId is string => Boolean(userId)),
  );
}

async function resolveCustomerUserIdsBySearchTerm(
  supabase: SupabaseClient,
  normalizedSearchTerm: string,
): Promise<string[]> {
  const tokens = tokenizeBookingSearchTerm(normalizedSearchTerm);

  if (tokens.length === 0) {
    return [];
  }

  const tokenMatches: Set<string>[] = [];

  for (const token of tokens) {
    const matches = await fetchMatchingProfileUserIds(supabase, token);
    tokenMatches.push(matches);

    if (matches.size === 0) {
      return [];
    }
  }

  const [firstTokenMatches, ...restTokenMatches] = tokenMatches;

  const filteredIds = [...firstTokenMatches].filter((userId) =>
    restTokenMatches.every((matches) => matches.has(userId)),
  );

  return filteredIds.slice(0, MAX_PROFILE_FILTER_IDS);
}

export async function updateAdminBookingStatus(
  supabase: SupabaseClient,
  input: UpdateAdminBookingStatusInput,
): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({ booking_status: input.bookingStatus })
    .eq('id', input.bookingId)
    .select('id')
    .single();

  if (error) {
    throw new Error(`BOOKING_STATUS_UPDATE_FAILED:${error.message}`);
  }
}

export async function fetchAdminBookings(
  supabase: SupabaseClient,
  input: FetchAdminBookingsInput,
): Promise<PaginatedAdminBookings> {
  const normalizedSearchTerm = normalizeBookingSearchTerm(input.searchTerm ?? '');
  const from = input.page * input.pageSize;
  const to = from + input.pageSize - 1;

  let query = supabase
    .from('bookings')
    .select(
      `
      id,
      booking_reference,
      customer_user_id,
      tour_id,
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
      destinations(name),
      tours(title)
    `,
      { count: 'exact' },
    )
    .order('booked_at', { ascending: false })
    .range(from, to);

  if (input.statuses && input.statuses.length > 0) {
    query = query.in('booking_status', input.statuses);
  }

  if (normalizedSearchTerm.length > 0) {
    const matchedCustomerUserIds = await resolveCustomerUserIdsBySearchTerm(
      supabase,
      normalizedSearchTerm,
    );

    if (matchedCustomerUserIds.length > 0) {
      query = query.or(
        `booking_reference.ilike.%${normalizedSearchTerm}%,customer_user_id.in.(${matchedCustomerUserIds.join(',')})`,
      );
    } else {
      query = query.ilike('booking_reference', `%${normalizedSearchTerm}%`);
    }
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`BOOKINGS_FETCH_FAILED:${error.message}`);
  }

  const bookings = (data ?? []) as BookingRow[];
  const customerUserIds = [
    ...new Set(bookings.map((booking) => booking.customer_user_id).filter(Boolean)),
  ];

  const profileByUserId = new Map<string, ProfileRow>();

  if (customerUserIds.length > 0) {
    const { data: profileRows } = await supabase
      .from('profiles')
      .select('user_id,first_name,last_name')
      .in('user_id', customerUserIds);

    for (const profileRow of (profileRows ?? []) as ProfileRow[]) {
      profileByUserId.set(profileRow.user_id, profileRow);
    }
  }

  const rows = bookings.map((booking) => {
    const destination = getDestination(booking.destinations);
    const tour = getTour(booking.tours);
    const profile = booking.customer_user_id ? profileByUserId.get(booking.customer_user_id) : null;

    return {
      id: booking.id,
      bookingReference: booking.booking_reference,
      packageTitle: tour?.title ?? booking.package_title,
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
      customerFirstName: profile?.first_name ?? '-',
      customerLastName: profile?.last_name ?? '',
    };
  });

  return {
    rows,
    total: count ?? 0,
    page: input.page,
    pageSize: input.pageSize,
  };
}
