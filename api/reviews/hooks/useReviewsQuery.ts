'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchReviews } from '@/api/reviews/mutations/reviewApi';
import { reviewQueryKeys } from '@/api/reviews/queries/reviewQueryKeys';
import type { FetchReviewsInput } from '@/types/review';
import { createClient } from '@/utils/supabase/client';

export default function useReviewsQuery(input: FetchReviewsInput) {
  const supabase = useMemo(() => createClient(), []);

  return useQuery({
    queryKey: reviewQueryKeys.list(input),
    queryFn: () => fetchReviews(supabase, input),
    placeholderData: keepPreviousData,
  });
}
