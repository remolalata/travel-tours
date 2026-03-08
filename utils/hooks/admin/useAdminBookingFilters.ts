'use client';

import { useMemo } from 'react';

import type { AdminBookingStatusFilter } from '@/utils/helpers/adminBookingFilters';
import useAdminFiltersPopover from '@/utils/hooks/admin/useAdminFiltersPopover';

type BookingFiltersState = {
  statusFilters: AdminBookingStatusFilter[];
};

const initialFilters: BookingFiltersState = {
  statusFilters: [
    'confirmed',
    'pending_payment',
    'partially_paid',
    'cancelled',
    'expired',
    'completed',
  ],
};

export default function useAdminBookingFilters() {
  const filters = useAdminFiltersPopover<BookingFiltersState>({
    initialFilters,
    hasActiveFilters: (value) => value.statusFilters.length !== initialFilters.statusFilters.length,
  });

  return useMemo(
    () => ({
      ...filters,
      statusFilters: filters.appliedFilters.statusFilters,
      draftStatusFilters: filters.draftFilters.statusFilters,
      setDraftStatusFilters: (value: AdminBookingStatusFilter[]) =>
        filters.setDraftFilters((previousValue) => ({
          ...previousValue,
          statusFilters: value,
        })),
    }),
    [filters],
  );
}
