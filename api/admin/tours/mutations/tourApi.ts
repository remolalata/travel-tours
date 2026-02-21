import type { SupabaseClient } from '@supabase/supabase-js';

import type { AdminListingItem } from '@/types/admin';

export type AdminTourData = AdminListingItem;

export type FetchAdminToursInput = {
  page: number;
  pageSize: number;
};

export type PaginatedAdminTours = {
  rows: AdminTourData[];
  total: number;
  page: number;
  pageSize: number;
};

type TourRow = {
  id: number;
  title: string;
  location: string;
  image_src: string;
  duration_label: string | null;
  price: number;
  original_price: number | null;
};

export async function fetchAdminTours(
  supabase: SupabaseClient,
  input: FetchAdminToursInput,
): Promise<PaginatedAdminTours> {
  const from = input.page * input.pageSize;
  const to = from + input.pageSize - 1;

  const { data, error, count } = await supabase
    .from('tours')
    .select('id,title,location,image_src,duration_label,price,original_price', { count: 'exact' })
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`TOURS_FETCH_FAILED:${error.message}`);
  }

  const rows = ((data ?? []) as TourRow[]).map((tour) => ({
    id: tour.id,
    imageSrc: tour.image_src,
    location: tour.location,
    title: tour.title,
    rating: 0,
    ratingCount: 0,
    duration: tour.duration_label ?? '',
    price: tour.price,
    fromPrice: tour.original_price ?? tour.price,
  }));

  return {
    rows,
    total: count ?? 0,
    page: input.page,
    pageSize: input.pageSize,
  };
}
