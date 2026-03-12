'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchMyBookings } from '@/services/my-bookings/mutations/bookingApi';
import { myBookingQueryKeys } from '@/services/my-bookings/queries/bookingQueryKeys';
import type { MyBookingsTabKey } from '@/types/myBookings';
import { createClient } from '@/utils/supabase/client';

export default function useMyBookingsQuery(tab: MyBookingsTabKey) {
  const supabase = useMemo(() => createClient(), []);

  return useQuery({
    queryKey: myBookingQueryKeys.list(tab),
    queryFn: () => fetchMyBookings(supabase, { tab }),
    placeholderData: keepPreviousData,
  });
}
