import type { FetchAdminToursInput } from '@/api/admin/tours/mutations/tourApi';

export const adminTourQueryKeys = {
  all: ['admin', 'tours'] as const,
  list: (input: FetchAdminToursInput) => [...adminTourQueryKeys.all, 'list', input] as const,
  references: () => [...adminTourQueryKeys.all, 'references'] as const,
};
