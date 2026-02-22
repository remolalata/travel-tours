'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  fetchTourSinglePageData,
  type FetchTourSinglePageInput,
} from '@/api/tours/mutations/tourSingleApi';
import { tourQueryKeys } from '@/api/tours/queries/tourQueryKeys';
import { createClient } from '@/utils/supabase/client';

export default function useTourSingleQuery(input: FetchTourSinglePageInput) {
  const supabase = useMemo(() => createClient(), []);

  return useQuery({
    queryKey: tourQueryKeys.single(input.routeValue),
    queryFn: () => fetchTourSinglePageData(supabase, input),
    enabled: Boolean(input.routeValue),
  });
}
