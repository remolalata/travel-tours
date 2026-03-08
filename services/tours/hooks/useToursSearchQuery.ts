'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchToursSearch, type FetchToursSearchInput } from '@/services/tours/mutations/tourApi';
import { tourQueryKeys } from '@/services/tours/queries/tourQueryKeys';
import { createClient } from '@/utils/supabase/client';

export default function useToursSearchQuery(input: FetchToursSearchInput) {
  const supabase = useMemo(() => createClient(), []);

  return useQuery({
    queryKey: tourQueryKeys.search(input),
    queryFn: () => fetchToursSearch(supabase, input),
  });
}
