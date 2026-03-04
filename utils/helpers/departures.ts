import dayjs from 'dayjs';

import type { TourSingleDeparture } from '@/types/tourSingle';

export function formatDepartureDateRange(startDate: string, endDate: string): string {
  const parsedStartDate = dayjs(startDate);
  const parsedEndDate = dayjs(endDate);

  if (!parsedStartDate.isValid() || !parsedEndDate.isValid()) {
    return '';
  }

  return `${parsedStartDate.format('MMMM DD')} - ${parsedEndDate.format('MMMM DD')}`;
}

export function sortDeparturesByStartDate<T extends { startDate: string; endDate: string }>(
  departures: T[],
): T[] {
  return [...departures].sort((left, right) => {
    const leftStartDate = dayjs(left.startDate);
    const rightStartDate = dayjs(right.startDate);

    if (leftStartDate.isBefore(rightStartDate, 'day')) return -1;
    if (leftStartDate.isAfter(rightStartDate, 'day')) return 1;

    const leftEndDate = dayjs(left.endDate);
    const rightEndDate = dayjs(right.endDate);

    if (leftEndDate.isBefore(rightEndDate, 'day')) return -1;
    if (leftEndDate.isAfter(rightEndDate, 'day')) return 1;

    return 0;
  });
}

export function findDepartureByDateRange(
  departures: TourSingleDeparture[],
  dateRange: string,
): TourSingleDeparture | null {
  const normalizedDateRange = dateRange.trim();

  if (!normalizedDateRange) {
    return null;
  }

  return (
    departures.find(
      (departure) =>
        formatDepartureDateRange(departure.startDate, departure.endDate) === normalizedDateRange,
    ) ?? null
  );
}
