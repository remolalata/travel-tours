import type { SupabaseClient } from '@supabase/supabase-js';

import {
  mapTourSinglePageData,
  type TourInclusionRow,
  type TourItineraryStepRow,
  type TourSingleRow,
} from '@/api/tours/helpers/tourSingleMapper';
import type { TourSinglePageData } from '@/types/tourSingle';

export type FetchTourSinglePageInput = {
  routeValue: string;
};

export async function fetchTourSinglePageData(
  supabase: SupabaseClient,
  input: FetchTourSinglePageInput,
): Promise<TourSinglePageData | null> {
  const parsedId = Number(input.routeValue);
  let query = supabase
    .from('tours')
    .select(
      'id,slug,destination_id,title,location,image_src,images,duration_label,price,original_price,description,is_featured',
    )
    .limit(1);

  query = Number.isFinite(parsedId) ? query.eq('id', parsedId) : query.eq('slug', input.routeValue);

  const { data: tourRow, error: tourError } = await query.maybeSingle();

  if (tourError) {
    throw new Error(`TOUR_SINGLE_FETCH_FAILED:${tourError.message}`);
  }

  if (!tourRow) {
    return null;
  }

  const tour = tourRow as TourSingleRow;

  const [{ data: inclusionRows, error: inclusionError }, { data: itineraryRows, error: itineraryError }] =
    await Promise.all([
      supabase
        .from('tour_inclusions')
        .select('id,item_type,item_order,content')
        .eq('tour_id', tour.id)
        .order('item_order', { ascending: true }),
      supabase
        .from('tour_itinerary_steps')
        .select('id,is_summary,day_number,title,content,icon')
        .eq('tour_id', tour.id)
        .order('day_number', { ascending: true }),
    ]);

  if (inclusionError) {
    throw new Error(`TOUR_INCLUSIONS_FETCH_FAILED:${inclusionError.message}`);
  }

  if (itineraryError) {
    throw new Error(`TOUR_ITINERARY_FETCH_FAILED:${itineraryError.message}`);
  }

  return mapTourSinglePageData(
    tour,
    (inclusionRows ?? []) as TourInclusionRow[],
    (itineraryRows ?? []) as TourItineraryStepRow[],
  );
}
