import type { FetchFaqItemsInput } from '@/api/faqs/mutations/faqApi';

export const faqQueryKeys = {
  all: ['faqs'] as const,
  list: (input: FetchFaqItemsInput = {}) => [...faqQueryKeys.all, 'list', input] as const,
};
