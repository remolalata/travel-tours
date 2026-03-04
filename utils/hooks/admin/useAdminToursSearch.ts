'use client';

import { useMemo, useState } from 'react';

import { normalizeTourSearchTerm } from '@/services/tours/helpers/tourSearch';

export default function useAdminToursSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const normalizedSearchTerm = useMemo(() => normalizeTourSearchTerm(searchTerm), [searchTerm]);

  return {
    searchTerm,
    normalizedSearchTerm,
    setSearchTerm,
  };
}
