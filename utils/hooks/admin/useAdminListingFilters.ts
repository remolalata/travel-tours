'use client';

import { useMemo } from 'react';

import type {
  AdminListingStatusFilter,
  AdminListingVisibilityFilter,
} from '@/utils/helpers/adminListingFilters';
import useAdminFiltersPopover from '@/utils/hooks/admin/useAdminFiltersPopover';

export default function useAdminListingFilters() {
  const filters = useAdminFiltersPopover<{
    statusFilters: AdminListingStatusFilter[];
    visibilityFilters: AdminListingVisibilityFilter[];
  }>({
    initialFilters: {
      statusFilters: ['all'],
      visibilityFilters: [],
    },
    hasActiveFilters: (value) =>
      value.statusFilters.some((status) => status !== 'all') || value.visibilityFilters.length > 0,
  });

  return useMemo(
    () => ({
      ...filters,
      statusFilters: filters.appliedFilters.statusFilters,
      visibilityFilters: filters.appliedFilters.visibilityFilters,
      draftStatusFilters: filters.draftFilters.statusFilters,
      draftVisibilityFilters: filters.draftFilters.visibilityFilters,
      setDraftStatusFilters: (value: AdminListingStatusFilter[]) =>
        filters.setDraftFilters((previousValue) => ({
          ...previousValue,
          statusFilters: value,
        })),
      setDraftVisibilityFilters: (value: AdminListingVisibilityFilter[]) =>
        filters.setDraftFilters((previousValue) => ({
          ...previousValue,
          visibilityFilters: value,
        })),
    }),
    [filters],
  );
}
