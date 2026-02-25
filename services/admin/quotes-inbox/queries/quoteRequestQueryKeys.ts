import type { FetchAdminQuoteRequestsInput } from '@/services/admin/quotes-inbox/mutations/quoteRequestApi';

export const adminQuoteRequestQueryKeys = {
  all: ['admin', 'quote-requests'] as const,
  list: (input: FetchAdminQuoteRequestsInput) =>
    [...adminQuoteRequestQueryKeys.all, 'list', input] as const,
};

