'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { CreateAdminTourInput } from '@/services/admin/tours/mutations/tourApi';
import { createAdminTour } from '@/services/admin/tours/mutations/tourApi';
import { adminTourQueryKeys } from '@/services/admin/tours/queries/tourQueryKeys';
import { createClient } from '@/utils/supabase/client';

export default function useCreateAdminTourMutation() {
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAdminTourInput) => createAdminTour(supabase, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminTourQueryKeys.all });
    },
  });
}
