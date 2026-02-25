'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { FetchFaqItemsInput } from '@/services/faqs/mutations/faqApi';
import { fetchFaqItems } from '@/services/faqs/mutations/faqApi';
import { faqQueryKeys } from '@/services/faqs/queries/faqQueryKeys';
import { createClient } from '@/utils/supabase/client';

export default function useFaqItemsQuery(input: FetchFaqItemsInput = {}) {
  const supabase = useMemo(() => createClient(), []);

  return useQuery({
    queryKey: faqQueryKeys.list(input),
    queryFn: () => fetchFaqItems(supabase, input),
  });
}
