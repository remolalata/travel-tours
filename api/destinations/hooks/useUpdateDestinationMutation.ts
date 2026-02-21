'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { updateDestination } from '@/api/destinations/mutations/destinationApi';
import { destinationQueryKeys } from '@/api/destinations/queries/destinationQueryKeys';
import type { UpdateDestinationInput } from '@/types/destination';
import { createClient } from '@/utils/supabase/client';

export default function useUpdateDestinationMutation() {
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateDestinationInput) => updateDestination(supabase, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: destinationQueryKeys.all });
    },
  });
}
