import type { SupabaseClient } from '@supabase/supabase-js';

import type { RawBookingStatus } from '@/services/admin/bookings/mutations/bookingApi';
import type { AdminDashboardBookingStatus, AdminDashboardDataset } from '@/types/adminDashboard';

type BookingRow = {
  id: number;
  booking_status: RawBookingStatus;
  total_amount: number;
  amount_paid: number;
  refunded_amount: number;
  booked_at: string;
  departure_start_date_snapshot: string;
  cancelled_at: string | null;
  tours:
    | {
        title: string | null;
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
        title: string | null;
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

type ReviewRow = {
  id: number;
  rating: number;
  created_at: string;
  is_published: boolean;
};

type TourActiveRow = {
  status: 'active' | 'inactive';
};

function getJoinedSingle<T>(value: T | T[] | null): T | null {
  if (!value) return null;
  if (Array.isArray(value)) return value[0] ?? null;
  return value;
}

function mapBookingStatus(status: RawBookingStatus): AdminDashboardBookingStatus {
  if (status === 'confirmed') {
    return 'confirmed';
  }

  if (status === 'completed') {
    return 'completed';
  }

  if (status === 'cancelled' || status === 'expired') {
    return 'cancelled';
  }

  return 'pending';
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
        departure_start_date_snapshot,
        cancelled_at,
        tours(title,destinations(name))
      `,
      )
      .order('booked_at', { ascending: false }),
    supabase
      .from('reviews')
      .select('id,rating,created_at,is_published')
      .order('created_at', { ascending: false }),
    supabase.from('tours').select('status'),
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
    const tour = getJoinedSingle(row.tours);
    const destination = getJoinedSingle(tour?.destinations ?? null);

    return {
      id: row.id,
      bookingStatus: mapBookingStatus(row.booking_status),
      totalAmount: row.total_amount,
      amountPaid: row.amount_paid,
      refundedAmount: row.refunded_amount,
      bookedAt: row.booked_at,
      travelStartDate: row.departure_start_date_snapshot,
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
    activeToursCount: tourRows.filter((row) => row.status === 'active').length,
    totalToursCount: tourRows.length,
  };
}
