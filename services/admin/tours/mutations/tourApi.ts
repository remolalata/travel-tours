import type { SupabaseClient } from '@supabase/supabase-js';

import { normalizeTourSearchTerm } from '@/services/tours/helpers/tourSearch';
import type { AdminListingItem } from '@/types/admin';
import type { AppGalleryPickerItem } from '@/types/gallery';

export type AdminTourData = AdminListingItem;

export type FetchAdminToursInput = {
  page: number;
  pageSize: number;
  searchTerm?: string;
};

export type PaginatedAdminTours = {
  rows: AdminTourData[];
  total: number;
  page: number;
  pageSize: number;
};

export type CreateAdminTourInput = {
  title: string;
  description: string | null;
  location: string;
  destinationId: number;
  tourTypeId: number;
  imageSrc: string;
  mainImage: AppGalleryPickerItem | null;
  images: AppGalleryPickerItem[];
  status: 'active' | 'inactive';
  isFeatured?: boolean;
  isPopular?: boolean;
  isTopTrending?: boolean;
  departure: {
    startDate: string;
    endDate: string;
    bookingDeadline: string;
    maximumCapacity: number;
    price: number;
    originalPrice: number | null;
    status: 'open' | 'sold_out' | 'closed' | 'cancelled';
  };
  itineraries: Array<{
    dayNumber: number;
    title: string;
    content: string | null;
    icon: string | null;
    isSummary: boolean;
  }>;
  inclusions: Array<{
    itemType: 'included' | 'excluded';
    itemOrder: number;
    content: string;
  }>;
};

export type CreatedAdminTour = {
  id: number;
  slug: string;
};

type TourRow = {
  id: number;
  title: string;
  location: string;
  image_src: string;
  departures?: Array<{
    price: number;
    original_price: number | null;
  }> | null;
};

type TourSlugRow = {
  id: number;
};

type InsertedTourRow = {
  id: number;
  slug: string;
};

type UploadedTourImage = {
  publicUrl: string;
  path: string;
};

function slugifyTitle(value: string): string {
  const sanitized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  return sanitized;
}

async function buildUniqueTourSlug(supabase: SupabaseClient, title: string): Promise<string> {
  const baseSlug = slugifyTitle(title) || `tour-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 2;

  while (true) {
    const { data, error } = await supabase
      .from('tours')
      .select('id')
      .eq('slug', slug)
      .maybeSingle<TourSlugRow>();

    if (error) {
      throw new Error(`TOUR_SLUG_LOOKUP_FAILED:${error.message}`);
    }

    if (!data) {
      return slug;
    }

    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

async function getNextTourId(supabase: SupabaseClient): Promise<number> {
  const { data, error } = await supabase
    .from('tours')
    .select('id')
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle<{ id: number }>();

  if (error) {
    throw new Error(`TOUR_ID_LOOKUP_FAILED:${error.message}`);
  }

  return (data?.id ?? 0) + 1;
}

function getFileExtension(fileName: string): string {
  const extension = fileName.split('.').pop()?.trim().toLowerCase();
  return extension || 'jpg';
}

async function uploadTourImage(
  supabase: SupabaseClient,
  slug: string,
  file: File,
  scope: 'main' | 'gallery',
  index = 0,
): Promise<UploadedTourImage> {
  const extension = getFileExtension(file.name);
  const filePath = `${slug}/${scope}-${Date.now()}-${index}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from('tour-photos')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    throw new Error(`TOUR_IMAGE_UPLOAD_FAILED:${uploadError.message}`);
  }

  const { data } = supabase.storage.from('tour-photos').getPublicUrl(filePath);

  return {
    publicUrl: data.publicUrl,
    path: filePath,
  };
}

export async function fetchAdminTours(
  supabase: SupabaseClient,
  input: FetchAdminToursInput,
): Promise<PaginatedAdminTours> {
  const normalizedSearchTerm = normalizeTourSearchTerm(input.searchTerm ?? '');
  const from = input.page * input.pageSize;
  const to = from + input.pageSize - 1;

  let query = supabase
    .from('tours')
    .select('id,title,location,image_src,departures(price,original_price)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .order('id', { ascending: false });

  if (normalizedSearchTerm.length > 0) {
    query = query.or(
      `title.ilike.%${normalizedSearchTerm}%,location.ilike.%${normalizedSearchTerm}%`,
    );
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw new Error(`TOURS_FETCH_FAILED:${error.message}`);
  }

  const rows = ((data ?? []) as TourRow[]).map((tour) => {
    const lowestDeparture = (tour.departures ?? []).reduce<{
      price: number;
      original_price: number | null;
    } | null>((lowest, departure) => {
      if (!lowest || departure.price < lowest.price) {
        return departure;
      }

      return lowest;
    }, null);

    return {
      id: tour.id,
      imageSrc: tour.image_src,
      location: tour.location,
      title: tour.title,
      rating: 0,
      ratingCount: 0,
      price: lowestDeparture?.price ?? null,
      fromPrice: lowestDeparture?.original_price ?? null,
      departureCount: tour.departures?.length ?? 0,
    };
  });

  return {
    rows,
    total: count ?? 0,
    page: input.page,
    pageSize: input.pageSize,
  };
}

export async function createAdminTour(
  supabase: SupabaseClient,
  input: CreateAdminTourInput,
): Promise<CreatedAdminTour> {
  const slug = await buildUniqueTourSlug(supabase, input.title);
  const nextTourId = await getNextTourId(supabase);
  const uploadedPaths: string[] = [];
  let createdTourId: number | null = null;
  let resolvedMainImageSrc = input.imageSrc;
  const resolvedGalleryImageUrls: string[] = [];

  try {
    if (input.mainImage?.file) {
      const uploadedMainImage = await uploadTourImage(supabase, slug, input.mainImage.file, 'main');
      resolvedMainImageSrc = uploadedMainImage.publicUrl;
      uploadedPaths.push(uploadedMainImage.path);
    }

    for (let index = 0; index < input.images.length; index += 1) {
      const image = input.images[index];

      if (image.file) {
        const uploadedGalleryImage = await uploadTourImage(
          supabase,
          slug,
          image.file,
          'gallery',
          index,
        );
        resolvedGalleryImageUrls.push(uploadedGalleryImage.publicUrl);
        uploadedPaths.push(uploadedGalleryImage.path);
      } else if (image.src) {
        resolvedGalleryImageUrls.push(image.src);
      }
    }

    const { data: createdTour, error: createTourError } = await supabase
      .from('tours')
      .insert({
        id: nextTourId,
        slug,
        destination_id: input.destinationId,
        tour_type_id: input.tourTypeId,
        title: input.title,
        location: input.location,
        image_src: resolvedMainImageSrc,
        images: resolvedGalleryImageUrls,
        description: input.description,
        status: input.status,
        is_featured: input.isFeatured ?? false,
        is_popular: input.isPopular ?? false,
        is_top_trending: input.isTopTrending ?? false,
      })
      .select('id,slug')
      .single<InsertedTourRow>();

    if (createTourError) {
      throw new Error(`TOUR_CREATE_FAILED:${createTourError.message}`);
    }
    createdTourId = createdTour.id;

    if (input.itineraries.length > 0) {
      const { error: itineraryError } = await supabase.from('tour_itinerary_steps').insert(
        input.itineraries.map((item) => ({
          tour_id: createdTour.id,
          is_summary: item.isSummary,
          day_number: item.dayNumber,
          title: item.title,
          content: item.content,
          icon: item.icon,
        })),
      );

      if (itineraryError) {
        throw new Error(`TOUR_ITINERARY_CREATE_FAILED:${itineraryError.message}`);
      }
    }

    const { error: departureError } = await supabase.from('departures').insert({
      tour_id: createdTour.id,
      start_date: input.departure.startDate,
      end_date: input.departure.endDate,
      booking_deadline: input.departure.bookingDeadline,
      maximum_capacity: input.departure.maximumCapacity,
      original_price: input.departure.originalPrice,
      price: input.departure.price,
      status: input.departure.status,
    });

    if (departureError) {
      throw new Error(`TOUR_DEPARTURE_CREATE_FAILED:${departureError.message}`);
    }

    if (input.inclusions.length > 0) {
      const { error: inclusionsError } = await supabase.from('tour_inclusions').insert(
        input.inclusions.map((item) => ({
          tour_id: createdTour.id,
          item_type: item.itemType,
          item_order: item.itemOrder,
          content: item.content,
        })),
      );

      if (inclusionsError) {
        throw new Error(`TOUR_INCLUSIONS_CREATE_FAILED:${inclusionsError.message}`);
      }
    }

    return {
      id: createdTour.id,
      slug: createdTour.slug,
    };
  } catch (error) {
    if (createdTourId !== null) {
      await supabase.from('tours').delete().eq('id', createdTourId);
    }
    if (uploadedPaths.length > 0) {
      await supabase.storage.from('tour-photos').remove(uploadedPaths);
    }
    throw error;
  }
}
