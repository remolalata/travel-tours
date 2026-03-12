import type { MyBookingsTabKey } from '@/types/myBookings';

export const myBookingQueryKeys = {
  all: ['my-bookings'] as const,
  list: (tab: MyBookingsTabKey) => [...myBookingQueryKeys.all, 'list', tab] as const,
};
