import type { RawBookingStatus } from '@/api/admin/bookings/mutations/bookingApi';
import type { BookingStatus } from '@/types/admin';

export const bookingStatusLabelMap: Record<RawBookingStatus, BookingStatus> = {
  approved: 'Approved',
  pending: 'Pending',
  cancelled: 'Cancelled',
  completed: 'Completed',
};

export const bookingStatusValueMap: Record<BookingStatus, RawBookingStatus> = {
  Approved: 'approved',
  Pending: 'pending',
  Cancelled: 'cancelled',
  Completed: 'completed',
};
