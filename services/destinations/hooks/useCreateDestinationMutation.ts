'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { createDestination } from '@/services/destinations/mutations/destinationApi';
import { destinationQueryKeys } from '@/services/destinations/queries/destinationQueryKeys';
import type { CreateDestinationInput } from '@/types/destination';
import { createClient } from '@/utils/supabase/client';

export default function useCreateDestinationMutation() {
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDestinationInput) => createDestination(supabase, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: destinationQueryKeys.all });
    },
  });
}
