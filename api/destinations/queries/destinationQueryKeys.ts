import type { FetchDestinationsInput, FetchTrendingDestinationsInput } from '@/types/destination';

export const destinationQueryKeys = {
  all: ['destinations'] as const,
  list: (input: FetchDestinationsInput) => [...destinationQueryKeys.all, 'list', input] as const,
  trending: (input: FetchTrendingDestinationsInput) =>
    [...destinationQueryKeys.all, 'trending', input] as const,
};
