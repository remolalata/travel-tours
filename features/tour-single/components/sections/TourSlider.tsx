import { fetchRelatedToursByDestination } from '@/services/tours/mutations/tourApi';
import { tourSingleContent } from '@/content/features/tourSingle';
import { tourData } from '@/data/tours';
import { createClient } from '@/utils/supabase/server';

import TourSliderClient from './TourSliderClient';

type TourSliderProps = {
  destinationId?: number | null;
  currentTourId?: number | null;
};

export default async function TourSlider({ destinationId, currentTourId }: TourSliderProps) {
  let relatedTours = [] as Awaited<ReturnType<typeof fetchRelatedToursByDestination>>;

  if (typeof destinationId === 'number') {
    try {
      const supabase = await createClient();
      relatedTours = await fetchRelatedToursByDestination(supabase, {
        destinationId,
        excludeTourId: typeof currentTourId === 'number' ? currentTourId : undefined,
        limit: 8,
      });
    } catch {
      relatedTours = [];
    }
  }

  const fallbackTours = tourData
    .filter((item) => (typeof currentTourId === 'number' ? item.id !== currentTourId : true))
    .slice(0, 8);

  const tours = relatedTours.length > 0 ? relatedTours : fallbackTours;
  const sectionContent = tourSingleContent.relatedTours;

  return (
    <TourSliderClient
      tours={tours}
      heading={sectionContent.title}
      favoriteLabel={sectionContent.favoriteLabel}
      pricePrefix={sectionContent.pricePrefix}
      previousLabel={sectionContent.navigation.previousLabel}
      nextLabel={sectionContent.navigation.nextLabel}
    />
  );
}
