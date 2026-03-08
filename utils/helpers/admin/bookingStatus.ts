import type { RawBookingStatus } from '@/services/admin/bookings/mutations/bookingApi';
import type { BookingStatus } from '@/types/admin';

export const bookingStatusLabelMap: Record<RawBookingStatus, BookingStatus> = {
  draft: 'Draft',
  pending_payment: 'Pending Payment',
  partially_paid: 'Partially Paid',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  expired: 'Expired',
  completed: 'Completed',
};

export const bookingStatusValueMap: Record<BookingStatus, RawBookingStatus> = {
  Draft: 'draft',
  'Pending Payment': 'pending_payment',
  'Partially Paid': 'partially_paid',
  Confirmed: 'confirmed',
  Cancelled: 'cancelled',
  Expired: 'expired',
  Completed: 'completed',
};
