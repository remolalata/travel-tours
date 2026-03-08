'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchTourTypes } from '@/services/tours/mutations/tourApi';
import { tourQueryKeys } from '@/services/tours/queries/tourQueryKeys';
import { createClient } from '@/utils/supabase/client';

export default function useTourTypesQuery() {
  const supabase = useMemo(() => createClient(), []);

  return useQuery({
    queryKey: tourQueryKeys.types(),
    queryFn: () => fetchTourTypes(supabase),
  });
}
