'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { deleteAdminTour } from '@/services/admin/tours/mutations/tourApi';
import { adminTourQueryKeys } from '@/services/admin/tours/queries/tourQueryKeys';
import { createClient } from '@/utils/supabase/client';

export default function useDeleteAdminTourMutation() {
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tourId: number) => deleteAdminTour(supabase, tourId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminTourQueryKeys.all });
    },
  });
}
