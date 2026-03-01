import type { FetchAdminToursInput } from '@/services/admin/tours/mutations/tourApi';

export const adminTourQueryKeys = {
  all: ['admin', 'tours'] as const,
  list: (input: FetchAdminToursInput) => [...adminTourQueryKeys.all, 'list', input] as const,
  detail: (tourId: number) => [...adminTourQueryKeys.all, 'detail', tourId] as const,
  references: () => [...adminTourQueryKeys.all, 'references'] as const,
};
