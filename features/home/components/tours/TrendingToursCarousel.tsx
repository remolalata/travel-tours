import TrendingToursCarouselClient from '@/features/home/components/tours/TrendingToursCarouselClient';
import { fetchTopTrendingTours } from '@/services/tours/mutations/tourApi';
import type { TourBase } from '@/types/tour';
import { createClient } from '@/utils/supabase/server';

export default async function TrendingToursCarousel() {
  let tours: TourBase[] = [];

  try {
    const supabase = await createClient();
    const topTrendingTours = await fetchTopTrendingTours(supabase);

    tours = topTrendingTours;
  } catch {
    tours = [];
  }

  return <TrendingToursCarouselClient tours={tours} />;
}
