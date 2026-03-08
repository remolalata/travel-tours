import type { AdminListingContent } from '@/types/admin';

export type AdminListingStatusFilter = 'all' | 'active' | 'inactive';
export type AdminListingVisibilityFilter = 'featured' | 'popular' | 'top-trending';

type FilterOption<T extends string> = {
  value: T;
  label: string;
};

export const ADMIN_LISTING_STATUS_FILTER_VALUES: AdminListingStatusFilter[] = [
  'all',
  'active',
  'inactive',
];

export const ADMIN_LISTING_VISIBILITY_FILTER_VALUES: AdminListingVisibilityFilter[] = [
  'featured',
  'popular',
  'top-trending',
];

export function getAdminListingStatusFilterOptions(
  content: AdminListingContent,
): FilterOption<AdminListingStatusFilter>[] {
  return [
    {
      value: 'all',
      label: content.filters.groups.status.options.all,
    },
    {
      value: 'active',
      label: content.filters.groups.status.options.active,
    },
    {
      value: 'inactive',
      label: content.filters.groups.status.options.inactive,
    },
  ];
}

export function getAdminListingVisibilityFilterOptions(
  content: AdminListingContent,
): FilterOption<AdminListingVisibilityFilter>[] {
  return [
    {
      value: 'featured',
      label: content.filters.groups.visibility.options.featured,
    },
    {
      value: 'popular',
      label: content.filters.groups.visibility.options.popular,
    },
    {
      value: 'top-trending',
      label: content.filters.groups.visibility.options.topTrending,
    },
  ];
}

export function mapFilterValuesToLabels<T extends string>(
  values: T[],
  options: FilterOption<T>[],
): string[] {
  const optionMap = new Map(options.map((option) => [option.value, option.label]));

  return values
    .map((value) => optionMap.get(value))
    .filter((label): label is string => Boolean(label));
}

export function mapFilterLabelsToValues<T extends string>(
  labels: string[],
  options: FilterOption<T>[],
): T[] {
  const optionMap = new Map(options.map((option) => [option.label, option.value]));

  return labels.map((label) => optionMap.get(label)).filter((value): value is T => Boolean(value));
}

export function normalizeSingleSelectFilter<T extends string>(
  nextValues: T[],
  fallbackValue: T,
): T[] {
  if (nextValues.length === 0) {
    return [fallbackValue];
  }

  return [nextValues[nextValues.length - 1]];
}
