'use client';

import { useCallback, useMemo, useState } from 'react';

import {
  DEFAULT_TOURS_PRICE_RANGE,
  normalizeToursListFilters,
} from '@/services/tours/helpers/toursListFilters';

export default function useToursListFilters() {
  const [selectedTourTypeIds, setSelectedTourTypeIds] = useState<number[]>([]);
  const [priceRangeDraft, setPriceRangeDraft] =
    useState<[number, number]>(DEFAULT_TOURS_PRICE_RANGE);
  const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_TOURS_PRICE_RANGE);

  const toggleTourType = useCallback((tourTypeId: number) => {
    setSelectedTourTypeIds((previousIds) =>
      previousIds.includes(tourTypeId)
        ? previousIds.filter((id) => id !== tourTypeId)
        : [...previousIds, tourTypeId],
    );
  }, []);

  const setPriceRangeDraftValue = useCallback((nextPriceRange: [number, number]) => {
    const normalized = normalizeToursListFilters({ priceRange: nextPriceRange });
    setPriceRangeDraft(normalized.priceRange);
  }, []);

  const commitPriceRange = useCallback((nextPriceRange: [number, number]) => {
    const normalized = normalizeToursListFilters({ priceRange: nextPriceRange });
    setPriceRangeDraft(normalized.priceRange);
    setPriceRange(normalized.priceRange);
  }, []);

  const queryFilters = useMemo(() => {
    const normalized = normalizeToursListFilters({
      tourTypeIds: selectedTourTypeIds,
      priceRange,
    });

    return {
      tourTypeIds: normalized.tourTypeIds,
      minPrice:
        normalized.priceRange[0] > DEFAULT_TOURS_PRICE_RANGE[0]
          ? normalized.priceRange[0]
          : undefined,
      maxPrice:
        normalized.priceRange[1] < DEFAULT_TOURS_PRICE_RANGE[1]
          ? normalized.priceRange[1]
          : undefined,
    };
  }, [priceRange, selectedTourTypeIds]);

  return {
    selectedTourTypeIds,
    priceRangeDraft,
    toggleTourType,
    setPriceRangeDraft: setPriceRangeDraftValue,
    commitPriceRange,
    queryFilters,
  };
}
