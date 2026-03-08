import type { SupabaseClient } from '@supabase/supabase-js';

import {
  normalizeBookingSearchTerm,
  tokenizeBookingSearchTerm,
} from '@/services/admin/bookings/helpers/bookingSearch';

export type RawBookingStatus =
  | 'draft'
  | 'pending_payment'
  | 'partially_paid'
  | 'confirmed'
  | 'cancelled'
  | 'expired'
  | 'completed';
export type RawPaymentStatus =
  | 'unpaid'
  | 'pending'
  | 'partial'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

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
  amountDueNow: number;
  balanceAmount: number;
  travelerCount: number;
  paymentOption: 'full' | 'downpayment' | 'reserve';
  travelStartDate: string;
  travelEndDate: string;
  bookedAt: string;
  customerName: string;
  customerEmail: string;
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
  reference_no: string;
  user_id: string | null;
  tour_id: number | null;
  tour_title_snapshot: string;
  booking_status: RawBookingStatus;
  payment_status: RawPaymentStatus;
  payment_option: 'full' | 'downpayment' | 'reserve';
  currency: string;
  total_amount: number;
  amount_due_now: number;
  amount_paid: number;
  balance_amount: number;
  traveler_count: number;
  departure_start_date_snapshot: string;
  departure_end_date_snapshot: string;
  booked_at: string;
  lead_traveler_name: string;
  lead_traveler_email: string;
  tours:
    | {
        title: string;
        destinations:
          | {
              name: string | null;
            }
          | Array<{
              name: string | null;
            }>
          | null;
      }
    | Array<{
        title: string;
        destinations:
          | {
              name: string | null;
            }
          | Array<{
              name: string | null;
            }>
          | null;
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

function getTour(tour: BookingRow['tours']): { title: string } | null {
  if (!tour) return null;

  if (Array.isArray(tour)) {
    return tour[0] ?? null;
  }

  return tour;
}

function getDestinationNameFromTour(tour: BookingRow['tours']): string | null {
  if (!tour) return null;

  const normalizedTour = Array.isArray(tour) ? (tour[0] ?? null) : tour;
  if (!normalizedTour?.destinations) return null;

  const destination = Array.isArray(normalizedTour.destinations)
    ? (normalizedTour.destinations[0] ?? null)
    : normalizedTour.destinations;

  return destination?.name ?? null;
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
      reference_no,
      user_id,
      tour_id,
      tour_title_snapshot,
      booking_status,
      payment_status,
      payment_option,
      currency,
      total_amount,
      amount_due_now,
      amount_paid,
      balance_amount,
      traveler_count,
      departure_start_date_snapshot,
      departure_end_date_snapshot,
      booked_at,
      lead_traveler_name,
      lead_traveler_email,
      tours(title,destinations(name))
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
        `reference_no.ilike.%${normalizedSearchTerm}%,lead_traveler_name.ilike.%${normalizedSearchTerm}%,lead_traveler_email.ilike.%${normalizedSearchTerm}%,tour_title_snapshot.ilike.%${normalizedSearchTerm}%,user_id.in.(${matchedCustomerUserIds.join(',')})`,
      );
    } else {
      query = query.or(
        `reference_no.ilike.%${normalizedSearchTerm}%,lead_traveler_name.ilike.%${normalizedSearchTerm}%,lead_traveler_email.ilike.%${normalizedSearchTerm}%,tour_title_snapshot.ilike.%${normalizedSearchTerm}%`,
      );
    }
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`BOOKINGS_FETCH_FAILED:${error.message}`);
  }

  const bookings = (data ?? []) as BookingRow[];
  const customerUserIds = [...new Set(bookings.map((booking) => booking.user_id).filter(Boolean))];

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
    const tour = getTour(booking.tours);
    const profile = booking.user_id ? profileByUserId.get(booking.user_id) : null;
    const profileName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim();

    return {
      id: booking.id,
      bookingReference: booking.reference_no,
      packageTitle: tour?.title ?? booking.tour_title_snapshot,
      destinationName: getDestinationNameFromTour(booking.tours),
      bookingStatus: booking.booking_status,
      paymentStatus: booking.payment_status,
      currency: booking.currency,
      totalAmount: booking.total_amount,
      amountDueNow: booking.amount_due_now,
      amountPaid: booking.amount_paid,
      balanceAmount: booking.balance_amount,
      travelerCount: booking.traveler_count,
      paymentOption: booking.payment_option,
      travelStartDate: booking.departure_start_date_snapshot,
      travelEndDate: booking.departure_end_date_snapshot,
      bookedAt: booking.booked_at,
      customerName: profileName || booking.lead_traveler_name,
      customerEmail: booking.lead_traveler_email,
    };
  });

  return {
    rows,
    total: count ?? 0,
    page: input.page,
    pageSize: input.pageSize,
  };
}
