'use client';

import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  createSimulatedBooking,
  type CreateSimulatedBookingInput,
} from '@/api/bookings/mutations/bookingApi';
import { createClient } from '@/utils/supabase/client';

export default function useCreateSimulatedBookingMutation() {
  const supabase = useMemo(() => createClient(), []);

  return useMutation({
    mutationFn: (input: CreateSimulatedBookingInput) => createSimulatedBooking(supabase, input),
  });
}

