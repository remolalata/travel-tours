'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { deleteDestination } from '@/api/destinations/mutations/destinationApi';
import { destinationQueryKeys } from '@/api/destinations/queries/destinationQueryKeys';
import { createClient } from '@/utils/supabase/client';

export default function useDeleteDestinationMutation() {
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteDestination(supabase, id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: destinationQueryKeys.all });
    },
  });
}
