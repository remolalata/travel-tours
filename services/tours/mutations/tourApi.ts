import type { SupabaseClient } from '@supabase/supabase-js';

import { normalizeTourSearchTerm } from '@/services/tours/helpers/tourSearch';
import type { TourBase, TourFeaturedItem } from '@/types/tour';
import { getDiscountPercent } from '@/utils/helpers/tourPricing';

export type HomePopularTourItem = TourBase;
export type HomeTrendingTourItem = TourBase;
export type ToursListItem = TourFeaturedItem & { slug?: string };
export type TourReviewContext = {
  id: number;
  slug: string;
  destinationId: number;
};
export type TourTypeOption = {
  id: number;
  name: string;
};
export type ToursSearchItem = {
  id: number;
  slug: string;
  title: string;
  location: string;
  imageSrc: string;
};

export type FetchToursListInput = {
  page: number;
  pageSize: number;
  tourTypeIds?: number[];
  minPrice?: number;
  maxPrice?: number;
};
export type FetchRelatedToursInput = {
  destinationId: number;
  excludeTourId?: number;
  limit?: number;
};

export type PaginatedToursList = {
  rows: ToursListItem[];
  total: number;
  page: number;
  pageSize: number;
};
export type FetchToursSearchInput = {
  searchTerm?: string;
  limit?: number;
};

type TourRow = {
  id: number;
  slug: string;
  title: string;
  location: string;
  image_src: string;
  description: string | null;
  is_featured: boolean;
  departures?: Array<{
    price: number;
    original_price: number | null;
  }> | null;
};

type TourReviewContextRow = {
  id: number;
  slug: string;
  destination_id: number;
};

type TourTypeRow = {
  id: number;
  name: string;
};

function mapTourRowToHomeTour(tour: TourRow): TourBase & { slug: string } {
  const lowestDeparture = getLowestDeparture(tour.departures);

  if (!lowestDeparture) {
    throw new Error('TOUR_HAS_NO_OPEN_DEPARTURES');
  }

  return {
    id: tour.id,
    slug: tour.slug,
    imageSrc: tour.image_src,
    location: tour.location,
    title: tour.title,
    rating: 0,
    ratingCount: 0,
    price: lowestDeparture.price,
  };
}

function mapTourRowToToursListItem(tour: TourRow): ToursListItem {
  const lowestDeparture = getLowestDeparture(tour.departures);

  if (!lowestDeparture) {
    throw new Error('TOUR_HAS_NO_OPEN_DEPARTURES');
  }

  const discountPercent = getDiscountPercent(lowestDeparture.price, lowestDeparture.original_price);

  return {
    id: tour.id,
    slug: tour.slug,
    imageSrc: tour.image_src,
    location: tour.location,
    title: tour.title,
    rating: 0,
    ratingCount: 0,
    description: tour.description ?? '',
    price: lowestDeparture.price,
    fromPrice: lowestDeparture.original_price ?? lowestDeparture.price,
    featured: tour.is_featured,
    badgeText: discountPercent ? `${discountPercent}% OFF` : '',
    badgeClass: discountPercent ? 'bg-accent-1' : '',
    features: [
      {
        icon: 'icon-price-tag',
        name: 'Best Price Guarantee',
      },
      {
        icon: 'icon-check',
        name: 'Free Cancellation',
      },
    ],
  };
}

function getLowestDeparture(
  departures: TourRow['departures'],
): { price: number; original_price: number | null } | null {
  return (departures ?? []).reduce<{ price: number; original_price: number | null } | null>(
    (lowest, departure) => {
      if (!lowest || departure.price < lowest.price) {
        return departure;
      }

      return lowest;
    },
    null,
  );
}

export async function fetchPopularTours(supabase: SupabaseClient): Promise<HomePopularTourItem[]> {
  const { data, error } = await supabase
    .from('tours')
    .select(
      'id,slug,title,location,image_src,description,is_featured,departures(price,original_price)',
    )
    .eq('status', 'active')
    .eq('is_popular', true)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(8);

  if (error) {
    throw new Error(`POPULAR_TOURS_FETCH_FAILED:${error.message}`);
  }

  return ((data ?? []) as TourRow[])
    .filter((tour) => Boolean(getLowestDeparture(tour.departures)))
    .map(mapTourRowToHomeTour);
}

export async function fetchTopTrendingTours(
  supabase: SupabaseClient,
): Promise<HomeTrendingTourItem[]> {
  const { data, error } = await supabase
    .from('tours')
    .select(
      'id,slug,title,location,image_src,description,is_featured,departures(price,original_price)',
    )
    .eq('status', 'active')
    .eq('is_top_trending', true)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(8);

  if (error) {
    throw new Error(`TOP_TRENDING_TOURS_FETCH_FAILED:${error.message}`);
  }

  return ((data ?? []) as TourRow[])
    .filter((tour) => Boolean(getLowestDeparture(tour.departures)))
    .map(mapTourRowToHomeTour);
}

export async function fetchTourTypes(supabase: SupabaseClient): Promise<TourTypeOption[]> {
  const { data, error } = await supabase
    .from('tour_types')
    .select('id,name')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`TOUR_TYPES_FETCH_FAILED:${error.message}`);
  }

  return ((data ?? []) as TourTypeRow[]).map((row) => ({
    id: row.id,
    name: row.name,
  }));
}

export async function fetchToursList(
  supabase: SupabaseClient,
  input: FetchToursListInput,
): Promise<PaginatedToursList> {
  let query = supabase
    .from('tours')
    .select(
      'id,slug,title,location,image_src,description,is_featured,departures(price,original_price)',
    )
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .order('id', { ascending: false });

  if ((input.tourTypeIds?.length ?? 0) > 0) {
    query = query.in('tour_type_id', input.tourTypeIds ?? []);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`TOURS_LIST_FETCH_FAILED:${error.message}`);
  }

  const filteredRows = ((data ?? []) as TourRow[])
    .filter((tour) => {
      const lowestDeparture = getLowestDeparture(tour.departures);

      if (!lowestDeparture) {
        return false;
      }
      if (typeof input.minPrice === 'number' && lowestDeparture.price < input.minPrice) {
        return false;
      }
      if (typeof input.maxPrice === 'number' && lowestDeparture.price > input.maxPrice) {
        return false;
      }

      return true;
    })
    .map(mapTourRowToToursListItem);

  const total = filteredRows.length;
  const from = input.page * input.pageSize;
  const rows = filteredRows.slice(from, from + input.pageSize);

  return {
    rows,
    total,
    page: input.page,
    pageSize: input.pageSize,
  };
}

export async function fetchToursSearch(
  supabase: SupabaseClient,
  input: FetchToursSearchInput,
): Promise<ToursSearchItem[]> {
  const normalizedTerm = normalizeTourSearchTerm(input.searchTerm ?? '');
  const limit = Math.min(Math.max(Math.trunc(input.limit ?? 8), 1), 20);
  let query = supabase
    .from('tours')
    .select('id,slug,title,location,image_src')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(limit);

  if (normalizedTerm.length > 0) {
    query = query.or(`title.ilike.%${normalizedTerm}%,location.ilike.%${normalizedTerm}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`TOURS_SEARCH_FETCH_FAILED:${error.message}`);
  }

  return ((data ?? []) as Pick<TourRow, 'id' | 'slug' | 'title' | 'location' | 'image_src'>[]).map(
    (row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      location: row.location,
      imageSrc: row.image_src,
    }),
  );
}

export async function fetchTourReviewContextByRouteValue(
  supabase: SupabaseClient,
  routeValue: string,
): Promise<TourReviewContext | null> {
  const parsedId = Number(routeValue);
  let query = supabase.from('tours').select('id,slug,destination_id').limit(1);

  query = Number.isFinite(parsedId) ? query.eq('id', parsedId) : query.eq('slug', routeValue);

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw new Error(`TOUR_REVIEW_CONTEXT_FETCH_FAILED:${error.message}`);
  }

  if (!data) {
    return null;
  }

  const row = data as TourReviewContextRow;

  return {
    id: row.id,
    slug: row.slug,
    destinationId: row.destination_id,
  };
}

export async function fetchRelatedToursByDestination(
  supabase: SupabaseClient,
  input: FetchRelatedToursInput,
): Promise<HomePopularTourItem[]> {
  let query = supabase
    .from('tours')
    .select(
      'id,slug,title,location,image_src,description,is_featured,departures(price,original_price)',
    )
    .eq('status', 'active')
    .eq('destination_id', input.destinationId)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false });

  if (typeof input.excludeTourId === 'number') {
    query = query.neq('id', input.excludeTourId);
  }

  if (typeof input.limit === 'number') {
    query = query.limit(input.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`RELATED_TOURS_FETCH_FAILED:${error.message}`);
  }

  return ((data ?? []) as TourRow[])
    .filter((tour) => Boolean(getLowestDeparture(tour.departures)))
    .map(mapTourRowToHomeTour);
}
