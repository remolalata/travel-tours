import type { FetchReviewsInput } from '@/types/review';

export const reviewQueryKeys = {
  all: ['reviews'] as const,
  list: (input: FetchReviewsInput) => [...reviewQueryKeys.all, 'list', input] as const,
};
