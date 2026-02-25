'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { FetchAdminBookingsInput } from '@/api/admin/bookings/mutations/bookingApi';
import { fetchAdminBookings } from '@/api/admin/bookings/mutations/bookingApi';
import { adminBookingQueryKeys } from '@/api/admin/bookings/queries/bookingQueryKeys';
import { createClient } from '@/utils/supabase/client';

export default function useAdminBookingsQuery(input: FetchAdminBookingsInput) {
  const supabase = useMemo(() => createClient(), []);

  return useQuery({
    queryKey: adminBookingQueryKeys.list(input),
    queryFn: () => fetchAdminBookings(supabase, input),
    placeholderData: keepPreviousData,
  });
}
