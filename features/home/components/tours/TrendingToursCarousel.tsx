import { fetchTopTrendingTours } from '@/services/tours/mutations/tourApi';
import { tourData } from '@/data/tours';
import TrendingToursCarouselClient from '@/features/home/components/tours/TrendingToursCarouselClient';
import type { TourBase } from '@/types/tour';
import { createClient } from '@/utils/supabase/server';

export default async function TrendingToursCarousel() {
  let tours: TourBase[] = tourData;

  try {
    const supabase = await createClient();
    const topTrendingTours = await fetchTopTrendingTours(supabase);

    if (topTrendingTours.length > 0) {
      tours = topTrendingTours;
    }
  } catch {
    tours = tourData;
  }

  return <TrendingToursCarouselClient tours={tours} />;
}
