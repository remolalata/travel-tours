'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchDestinations } from '@/api/destinations/mutations/destinationApi';
import { destinationQueryKeys } from '@/api/destinations/queries/destinationQueryKeys';
import type { Destination, FetchDestinationsInput } from '@/types/destination';
import { createClient } from '@/utils/supabase/client';

type UseDestinationsQueryOptions = {
  initialData?: Destination[];
};

export default function useDestinationsQuery(
  input: FetchDestinationsInput,
  options: UseDestinationsQueryOptions = {},
) {
  const supabase = useMemo(() => createClient(), []);

  return useQuery({
    queryKey: destinationQueryKeys.list(input),
    queryFn: () => fetchDestinations(supabase, input),
    placeholderData: keepPreviousData,
    initialData: options.initialData,
  });
}
