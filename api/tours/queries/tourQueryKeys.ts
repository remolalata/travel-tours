import type { FetchToursListInput } from '@/api/tours/mutations/tourApi';

export const tourQueryKeys = {
  all: ['tours'] as const,
  popular: () => [...tourQueryKeys.all, 'popular'] as const,
  topTrending: () => [...tourQueryKeys.all, 'top-trending'] as const,
  list: (input: FetchToursListInput) => [...tourQueryKeys.all, 'list', input] as const,
  single: (routeValue: string) => [...tourQueryKeys.all, 'single', routeValue] as const,
};
