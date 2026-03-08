'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchAdminTourById } from '@/services/admin/tours/mutations/tourApi';
import { adminTourQueryKeys } from '@/services/admin/tours/queries/tourQueryKeys';
import { createClient } from '@/utils/supabase/client';

export default function useAdminTourQuery(tourId: number) {
  const supabase = useMemo(() => createClient(), []);

  return useQuery({
    queryKey: adminTourQueryKeys.detail(tourId),
    queryFn: () => fetchAdminTourById(supabase, tourId),
    enabled: Number.isFinite(tourId) && tourId > 0,
  });
}
