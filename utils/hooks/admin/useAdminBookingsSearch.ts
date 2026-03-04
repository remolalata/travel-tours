'use client';

import { useMemo, useState } from 'react';

import { normalizeBookingSearchTerm } from '@/services/admin/bookings/helpers/bookingSearch';

export default function useAdminBookingsSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const normalizedSearchTerm = useMemo(() => normalizeBookingSearchTerm(searchTerm), [searchTerm]);

  return {
    searchTerm,
    normalizedSearchTerm,
    setSearchTerm,
  };
}
