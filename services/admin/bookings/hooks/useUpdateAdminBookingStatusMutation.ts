'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  updateAdminBookingStatus,
  type UpdateAdminBookingStatusInput,
} from '@/services/admin/bookings/mutations/bookingApi';
import { adminBookingQueryKeys } from '@/services/admin/bookings/queries/bookingQueryKeys';
import { createClient } from '@/utils/supabase/client';

export default function useUpdateAdminBookingStatusMutation() {
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateAdminBookingStatusInput) => updateAdminBookingStatus(supabase, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminBookingQueryKeys.all });
    },
  });
}
