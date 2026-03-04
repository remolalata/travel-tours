import { tourSingleContent } from '@/content/features/tourSingle';
import OtherInformationItem from '@/features/tour-single/components/sections/OtherInformationItem';
import type { TourSingleDeparture } from '@/types/tourSingle';
import {
  formatDepartureDate,
  formatDepartureDuration,
  formatDepartureGroupSize,
} from '@/utils/helpers/departures';

interface OthersInformationProps {
  selectedDeparture?: TourSingleDeparture | null;
}

export default function OthersInformation({ selectedDeparture }: OthersInformationProps) {
  if (!selectedDeparture) {
    return null;
  }

  const { quickFacts } = tourSingleContent.details;

  return (
    <>
      <OtherInformationItem
        iconClassName='icon-clock'
        label={quickFacts.durationLabel}
        value={formatDepartureDuration(selectedDeparture, quickFacts.duration)}
      />

      <OtherInformationItem
        iconClassName='icon-teamwork'
        label={quickFacts.groupSizeLabel}
        value={formatDepartureGroupSize(selectedDeparture.maximumCapacity, quickFacts.groupSize)}
      />

      <OtherInformationItem
        iconClassName='icon-calendar'
        label={quickFacts.bookingDeadlineLabel}
        value={formatDepartureDate(selectedDeparture.bookingDeadline)}
      />
    </>
  );
}
