import type { FetchAdminBookingsInput } from '@/api/admin/bookings/mutations/bookingApi';

export const adminBookingQueryKeys = {
  all: ['admin', 'bookings'] as const,
  list: (input: FetchAdminBookingsInput) => [...adminBookingQueryKeys.all, 'list', input] as const,
};
