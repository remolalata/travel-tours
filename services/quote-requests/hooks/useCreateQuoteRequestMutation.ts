'use client';

import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  createQuoteRequest,
  type CreateQuoteRequestInput,
} from '@/services/quote-requests/mutations/quoteRequestApi';
import { createClient } from '@/utils/supabase/client';

export default function useCreateQuoteRequestMutation() {
  const supabase = useMemo(() => createClient(), []);

  return useMutation({
    mutationFn: (input: CreateQuoteRequestInput) => createQuoteRequest(supabase, input),
  });
}
