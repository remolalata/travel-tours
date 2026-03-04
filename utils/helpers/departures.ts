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

export function getDepartureDurationInDays(departure?: TourSingleDeparture | null): number {
  if (!departure) {
    return 0;
  }

  const parsedStartDate = dayjs(departure.startDate);
  const parsedEndDate = dayjs(departure.endDate);

  if (!parsedStartDate.isValid() || !parsedEndDate.isValid()) {
    return 0;
  }

  return parsedEndDate.diff(parsedStartDate, 'day') + 1;
}

export function formatDepartureDuration(
  departure: TourSingleDeparture | null | undefined,
  labels: {
    daySingular: string;
    dayPlural: string;
    nightSingular: string;
    nightPlural: string;
  },
): string {
  const durationInDays = getDepartureDurationInDays(departure);

  if (durationInDays <= 0) {
    return '';
  }

  const durationInNights = Math.max(durationInDays - 1, 0);
  const dayLabel = durationInDays === 1 ? labels.daySingular : labels.dayPlural;
  const nightLabel = durationInNights === 1 ? labels.nightSingular : labels.nightPlural;

  return `${durationInDays} ${dayLabel} / ${durationInNights} ${nightLabel}`;
}

export function formatDepartureGroupSize(
  maximumCapacity: number | null | undefined,
  labels: {
    upToPrefix: string;
    paxSuffix: string;
  },
): string {
  if (!maximumCapacity || maximumCapacity < 1) {
    return '';
  }

  return `${labels.upToPrefix} ${maximumCapacity} ${labels.paxSuffix}`;
}

export function formatDepartureDate(value?: string | null): string {
  if (!value) {
    return '';
  }

  const parsedDate = dayjs(value);

  if (!parsedDate.isValid()) {
    return '';
  }

  return parsedDate.format('MMMM DD, YYYY');
}
