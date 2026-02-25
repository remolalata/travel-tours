import type { SupabaseClient } from '@supabase/supabase-js';

import type { AdminDashboardDataset } from '@/types/adminDashboard';

type BookingRow = {
  id: number;
  booking_status: 'approved' | 'pending' | 'cancelled' | 'completed';
  total_amount: number;
  amount_paid: number;
  refunded_amount: number;
  booked_at: string;
  travel_start_date: string;
  cancelled_at: string | null;
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
        title: string | null;
      }
    | Array<{
        title: string | null;
      }>
    | null;
};

type ReviewRow = {
  id: number;
  rating: number;
  created_at: string;
  is_published: boolean;
};

type TourActiveRow = {
  is_active: boolean;
};

function getJoinedSingle<T>(value: T | T[] | null): T | null {
  if (!value) return null;
  if (Array.isArray(value)) return value[0] ?? null;
  return value;
}

export async function fetchAdminDashboardDataset(
  supabase: SupabaseClient,
): Promise<AdminDashboardDataset> {
  const [bookingsResult, reviewsResult, toursResult] = await Promise.all([
    supabase
      .from('bookings')
      .select(
        `
        id,
        booking_status,
        total_amount,
        amount_paid,
        refunded_amount,
        booked_at,
        travel_start_date,
        cancelled_at,
        destinations(name),
        tours(title)
      `,
      )
      .order('booked_at', { ascending: false }),
    supabase
      .from('reviews')
      .select('id,rating,created_at,is_published')
      .order('created_at', { ascending: false }),
    supabase.from('tours').select('is_active'),
  ]);

  if (bookingsResult.error) {
    throw new Error(`ADMIN_DASHBOARD_BOOKINGS_FETCH_FAILED:${bookingsResult.error.message}`);
  }

  if (reviewsResult.error) {
    throw new Error(`ADMIN_DASHBOARD_REVIEWS_FETCH_FAILED:${reviewsResult.error.message}`);
  }

  if (toursResult.error) {
    throw new Error(`ADMIN_DASHBOARD_TOURS_FETCH_FAILED:${toursResult.error.message}`);
  }

  const bookings = ((bookingsResult.data ?? []) as BookingRow[]).map((row) => {
    const destination = getJoinedSingle(row.destinations);
    const tour = getJoinedSingle(row.tours);

    return {
      id: row.id,
      bookingStatus: row.booking_status,
      totalAmount: row.total_amount,
      amountPaid: row.amount_paid,
      refundedAmount: row.refunded_amount,
      bookedAt: row.booked_at,
      travelStartDate: row.travel_start_date,
      cancelledAt: row.cancelled_at,
      destinationName: destination?.name ?? null,
      tourTitle: tour?.title ?? null,
    };
  });

  const reviews = ((reviewsResult.data ?? []) as ReviewRow[]).map((row) => ({
    id: row.id,
    rating: row.rating,
    createdAt: row.created_at,
    isPublished: row.is_published,
  }));

  const tourRows = (toursResult.data ?? []) as TourActiveRow[];

  return {
    bookings,
    reviews,
    activeToursCount: tourRows.filter((row) => row.is_active).length,
    totalToursCount: tourRows.length,
  };
}
