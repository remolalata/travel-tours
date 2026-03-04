'use client';

import { useState } from 'react';

import type { TourSingleDeparture } from '@/types/tourSingle';

const EMPTY_DEPARTURES: TourSingleDeparture[] = [];

export default function useSelectedTourDeparture(departures?: TourSingleDeparture[]) {
  const availableDepartures = departures ?? EMPTY_DEPARTURES;
  const [storedSelectedDepartureId, setSelectedDepartureId] = useState<number | null>(
    availableDepartures[0]?.id ?? null,
  );
  const selectedDepartureId = availableDepartures.some(
    (departure) => departure.id === storedSelectedDepartureId,
  )
    ? storedSelectedDepartureId
    : (availableDepartures[0]?.id ?? null);

  const selectedDeparture =
    availableDepartures.find((departure) => departure.id === selectedDepartureId) ??
    availableDepartures[0] ??
    null;

  return {
    availableDepartures,
    selectedDeparture,
    selectedDepartureId,
    setSelectedDepartureId,
  };
}
