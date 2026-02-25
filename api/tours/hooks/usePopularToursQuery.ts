'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchPopularTours } from '@/api/tours/mutations/tourApi';
import { tourQueryKeys } from '@/api/tours/queries/tourQueryKeys';
import { createClient } from '@/utils/supabase/client';

export default function usePopularToursQuery() {
  const supabase = useMemo(() => createClient(), []);

  return useQuery({
    queryKey: tourQueryKeys.popular(),
    queryFn: () => fetchPopularTours(supabase),
  });
}
