export const DEFAULT_TOURS_LIST_SORT = 'recommended';

export type ToursListSortValue =
  | 'recommended'
  | 'price-low-to-high'
  | 'price-high-to-low'
  | 'newest';

export type ToursListSortLabels = {
  recommended: string;
  priceLowToHigh: string;
  priceHighToLow: string;
  newest: string;
};

export type ToursListSortOption = {
  value: ToursListSortValue;
  label: string;
};

type SortableDeparture = {
  price: number;
  original_price: number | null;
};

type ToursListSortableItem = {
  id: number;
  price?: number;
  created_at?: string;
  is_featured?: boolean;
  is_popular?: boolean;
  is_top_trending?: boolean;
  departures?: SortableDeparture[] | null;
};

function getSortablePrice(item: ToursListSortableItem): number {
  if (typeof item.price === 'number') {
    return item.price;
  }

  return (item.departures ?? []).reduce<number>(
    (lowestPrice, departure) => Math.min(lowestPrice, departure.price),
    Number.POSITIVE_INFINITY,
  );
}

function getSortableTimestamp(createdAt?: string): number {
  if (!createdAt) {
    return 0;
  }

  const timestamp = Date.parse(createdAt);

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function compareRecommended(left: ToursListSortableItem, right: ToursListSortableItem): number {
  if (left.is_featured !== right.is_featured) {
    return Number(right.is_featured) - Number(left.is_featured);
  }

  if (left.is_top_trending !== right.is_top_trending) {
    return Number(right.is_top_trending) - Number(left.is_top_trending);
  }

  if (left.is_popular !== right.is_popular) {
    return Number(right.is_popular) - Number(left.is_popular);
  }

  const createdAtDiff =
    getSortableTimestamp(right.created_at) - getSortableTimestamp(left.created_at);

  if (createdAtDiff !== 0) {
    return createdAtDiff;
  }

  return right.id - left.id;
}

export function normalizeToursListSort(value?: string | null): ToursListSortValue {
  switch (value) {
    case 'price-low-to-high':
    case 'price-high-to-low':
    case 'newest':
    case 'recommended':
      return value;
    default:
      return DEFAULT_TOURS_LIST_SORT;
  }
}

export function getToursListSortOptions(
  labels: ToursListSortLabels,
): readonly ToursListSortOption[] {
  return [
    {
      value: 'recommended',
      label: labels.recommended,
    },
    {
      value: 'price-low-to-high',
      label: labels.priceLowToHigh,
    },
    {
      value: 'price-high-to-low',
      label: labels.priceHighToLow,
    },
    {
      value: 'newest',
      label: labels.newest,
    },
  ] as const;
}

export function sortToursListItems<T extends ToursListSortableItem>(
  items: readonly T[],
  sortBy: ToursListSortValue,
): T[] {
  return [...items].sort((left, right) => {
    switch (sortBy) {
      case 'price-low-to-high': {
        const priceDiff = getSortablePrice(left) - getSortablePrice(right);

        if (priceDiff !== 0) {
          return priceDiff;
        }

        return compareRecommended(left, right);
      }
      case 'price-high-to-low': {
        const priceDiff = getSortablePrice(right) - getSortablePrice(left);

        if (priceDiff !== 0) {
          return priceDiff;
        }

        return compareRecommended(left, right);
      }
      case 'newest': {
        const createdAtDiff =
          getSortableTimestamp(right.created_at) - getSortableTimestamp(left.created_at);

        if (createdAtDiff !== 0) {
          return createdAtDiff;
        }

        return right.id - left.id;
      }
      case 'recommended':
      default:
        return compareRecommended(left, right);
    }
  });
}
