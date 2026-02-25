import type { FetchAdminBookingsInput } from '@/services/admin/bookings/mutations/bookingApi';

export const adminBookingQueryKeys = {
  all: ['admin', 'bookings'] as const,
  list: (input: FetchAdminBookingsInput) => [...adminBookingQueryKeys.all, 'list', input] as const,
};
