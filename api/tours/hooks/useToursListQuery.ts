'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { FetchToursListInput, PaginatedToursList } from '@/api/tours/mutations/tourApi';
import { fetchToursList } from '@/api/tours/mutations/tourApi';
import { tourQueryKeys } from '@/api/tours/queries/tourQueryKeys';
import { createClient } from '@/utils/supabase/client';

type UseToursListQueryOptions = {
  initialData?: PaginatedToursList;
};

export default function useToursListQuery(
  input: FetchToursListInput,
  options?: UseToursListQueryOptions,
) {
  const supabase = useMemo(() => createClient(), []);

  return useQuery({
    queryKey: tourQueryKeys.list(input),
    queryFn: () => fetchToursList(supabase, input),
    placeholderData: keepPreviousData,
    initialData: options?.initialData,
  });
}
