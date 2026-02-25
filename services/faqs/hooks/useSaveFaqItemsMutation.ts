'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { saveFaqItems, type SaveFaqItemsInput } from '@/services/faqs/mutations/faqApi';
import { faqQueryKeys } from '@/services/faqs/queries/faqQueryKeys';
import { createClient } from '@/utils/supabase/client';

export default function useSaveFaqItemsMutation() {
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveFaqItemsInput) => saveFaqItems(supabase, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: faqQueryKeys.all });
    },
  });
}
