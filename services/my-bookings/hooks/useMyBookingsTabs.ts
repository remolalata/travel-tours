'use client';

import { useState } from 'react';

import type { MyBookingsTabKey } from '@/types/myBookings';

type UseMyBookingsTabsOptions = {
  initialTab?: MyBookingsTabKey;
};

export default function useMyBookingsTabs({ initialTab = 'all' }: UseMyBookingsTabsOptions = {}) {
  const [activeTab, setActiveTab] = useState<MyBookingsTabKey>(initialTab);

  return {
    activeTab,
    setActiveTab,
  };
}
