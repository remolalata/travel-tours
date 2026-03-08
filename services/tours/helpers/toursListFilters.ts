export const DEFAULT_TOURS_PRICE_RANGE: [number, number] = [0, 100000];

type ToursListFilterInput = {
  tourTypeIds?: number[];
  priceRange?: [number, number];
};

export type ToursListFilters = {
  tourTypeIds: number[];
  priceRange: [number, number];
};

export function normalizeTourTypeIds(tourTypeIds?: number[]): number[] {
  const uniqueIds = new Set<number>();

  for (const id of tourTypeIds ?? []) {
    if (Number.isFinite(id) && id > 0) {
      uniqueIds.add(Math.trunc(id));
    }
  }

  return [...uniqueIds].sort((a, b) => a - b);
}

export function normalizePriceRange(
  priceRange?: [number, number],
  fallback: [number, number] = DEFAULT_TOURS_PRICE_RANGE,
): [number, number] {
  const start = priceRange?.[0] ?? fallback[0];
  const end = priceRange?.[1] ?? fallback[1];
  const min = Math.max(0, Math.min(start, end));
  const max = Math.max(min, Math.max(start, end));

  return [Math.trunc(min), Math.trunc(max)];
}

export function normalizeToursListFilters(input?: ToursListFilterInput): ToursListFilters {
  return {
    tourTypeIds: normalizeTourTypeIds(input?.tourTypeIds),
    priceRange: normalizePriceRange(input?.priceRange),
  };
}
