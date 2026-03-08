'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { UpdateAdminTourInput } from '@/services/admin/tours/mutations/tourApi';
import { updateAdminTour } from '@/services/admin/tours/mutations/tourApi';
import { adminTourQueryKeys } from '@/services/admin/tours/queries/tourQueryKeys';
import { createClient } from '@/utils/supabase/client';

export default function useUpdateAdminTourMutation() {
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateAdminTourInput) => updateAdminTour(supabase, input),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminTourQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: adminTourQueryKeys.detail(variables.id) }),
      ]);
    },
  });
}
