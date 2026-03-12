import type { SupabaseClient } from '@supabase/supabase-js';
import dayjs from 'dayjs';

import { myBookingsPageContent } from '@/content/features/myBookings';
import type { RawBookingStatus } from '@/services/admin/bookings/mutations/bookingApi';
import type { MyBookingCardData, MyBookingsTabKey } from '@/types/myBookings';

type FetchMyBookingsInput = {
  tab: MyBookingsTabKey;
};

type BookingRow = {
  id: number;
  reference_no: string;
  tour_title_snapshot: string;
  booking_status: RawBookingStatus;
  total_amount: number;
  traveler_count: number;
  departure_start_date_snapshot: string;
  departure_end_date_snapshot: string;
  tours:
    | {
        location: string;
        image_src: string;
      }
    | Array<{
        location: string;
        image_src: string;
      }>
    | null;
};

const upcomingBookingStatuses: RawBookingStatus[] = [
  'draft',
  'pending_payment',
  'partially_paid',
  'confirmed',
];
const completedBookingStatuses: RawBookingStatus[] = ['completed'];
const cancelledBookingStatuses: RawBookingStatus[] = ['cancelled', 'expired'];

function getTabStatuses(tab: MyBookingsTabKey): RawBookingStatus[] | null {
  if (tab === 'upcoming') {
    return upcomingBookingStatuses;
  }

  if (tab === 'completed') {
    return completedBookingStatuses;
  }

  if (tab === 'cancelled') {
    return cancelledBookingStatuses;
  }

  return null;
}

function getTour(tour: BookingRow['tours']): { location: string; image_src: string } | null {
  if (!tour) {
    return null;
  }

  if (Array.isArray(tour)) {
    return tour[0] ?? null;
  }

  return tour;
}

function formatTravelDate(value: string): string {
  return dayjs(value).format('MMMM DD, YYYY');
}

function formatGuestsLabel(travelerCount: number): string {
  return `${travelerCount} ${
    travelerCount === 1
      ? myBookingsPageContent.card.guestSingularLabel
      : myBookingsPageContent.card.guestPluralLabel
  }`;
}

function mapBookingStatusToDisplayStatus(bookingStatus: RawBookingStatus): string {
  if (completedBookingStatuses.includes(bookingStatus)) {
    return myBookingsPageContent.statuses.completed;
  }

  if (cancelledBookingStatuses.includes(bookingStatus)) {
    return myBookingsPageContent.statuses.cancelled;
  }

  return myBookingsPageContent.statuses.upcoming;
}

function mapBookingRowToCardData(booking: BookingRow): MyBookingCardData {
  const tour = getTour(booking.tours);

  return {
    id: String(booking.id),
    title: booking.tour_title_snapshot,
    location: tour?.location ?? myBookingsPageContent.card.fallbackLocationLabel,
    imageSrc: tour?.image_src ?? null,
    rating: 0,
    ratingCount: 0,
    checkIn: formatTravelDate(booking.departure_start_date_snapshot),
    checkOut: formatTravelDate(booking.departure_end_date_snapshot),
    guests: formatGuestsLabel(booking.traveler_count),
    bookingReference: booking.reference_no,
    totalAmount: booking.total_amount,
    status: mapBookingStatusToDisplayStatus(booking.booking_status),
    receiptHref: '#',
  };
}

export async function fetchMyBookings(
  supabase: SupabaseClient,
  input: FetchMyBookingsInput,
): Promise<MyBookingCardData[]> {
  let query = supabase
    .from('bookings')
    .select(
      `
      id,
      reference_no,
      tour_title_snapshot,
      booking_status,
      total_amount,
      traveler_count,
      departure_start_date_snapshot,
      departure_end_date_snapshot,
      tours(location,image_src)
    `,
    )
    .order('booked_at', { ascending: false });

  const statuses = getTabStatuses(input.tab);

  if (statuses && statuses.length > 0) {
    query = query.in('booking_status', statuses);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`MY_BOOKINGS_FETCH_FAILED:${error.message}`);
  }

  return ((data ?? []) as BookingRow[]).map(mapBookingRowToCardData);
}
