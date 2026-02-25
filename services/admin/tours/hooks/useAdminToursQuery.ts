'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { FetchAdminToursInput } from '@/services/admin/tours/mutations/tourApi';
import { fetchAdminTours } from '@/services/admin/tours/mutations/tourApi';
import { adminTourQueryKeys } from '@/services/admin/tours/queries/tourQueryKeys';
import { createClient } from '@/utils/supabase/client';

export default function useAdminToursQuery(input: FetchAdminToursInput) {
  const supabase = useMemo(() => createClient(), []);

  return useQuery({
    queryKey: adminTourQueryKeys.list(input),
    queryFn: () => fetchAdminTours(supabase, input),
    placeholderData: keepPreviousData,
  });
}
