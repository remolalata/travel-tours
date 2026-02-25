'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchTrendingDestinations } from '@/services/destinations/mutations/destinationApi';
import { destinationQueryKeys } from '@/services/destinations/queries/destinationQueryKeys';
import type { FetchTrendingDestinationsInput, TrendingDestination } from '@/types/destination';
import { createClient } from '@/utils/supabase/client';

type UseTrendingDestinationsQueryOptions = {
  initialData?: TrendingDestination[];
};

export default function useTrendingDestinationsQuery(
  input: FetchTrendingDestinationsInput,
  options: UseTrendingDestinationsQueryOptions = {},
) {
  const supabase = useMemo(() => createClient(), []);

  return useQuery({
    queryKey: destinationQueryKeys.trending(input),
    queryFn: () => fetchTrendingDestinations(supabase, input),
    placeholderData: keepPreviousData,
    initialData: options.initialData,
  });
}
