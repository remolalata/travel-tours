'use client';

import { useCallback, useMemo, useState } from 'react';

import type {
  ToursListSortLabels,
  ToursListSortValue,
} from '@/services/tours/helpers/toursListSort';
import {
  DEFAULT_TOURS_LIST_SORT,
  getToursListSortOptions,
  normalizeToursListSort,
} from '@/services/tours/helpers/toursListSort';

type UseToursListSortInput = {
  labels: ToursListSortLabels;
  initialSort?: ToursListSortValue;
};

export default function useToursListSort({
  labels,
  initialSort = DEFAULT_TOURS_LIST_SORT,
}: UseToursListSortInput) {
  const [selectedSort, setSelectedSortState] = useState<ToursListSortValue>(
    normalizeToursListSort(initialSort),
  );

  const sortOptions = useMemo(() => getToursListSortOptions(labels), [labels]);

  const selectedSortLabel = useMemo(
    () =>
      sortOptions.find((option) => option.value === selectedSort)?.label ??
      sortOptions[0]?.label ??
      '',
    [selectedSort, sortOptions],
  );

  const setSelectedSort = useCallback((nextSort: string) => {
    setSelectedSortState(normalizeToursListSort(nextSort));
  }, []);

  return {
    selectedSort,
    selectedSortLabel,
    sortOptions,
    setSelectedSort,
  };
}
