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
export type AdminTourEditorData = {
  id: number;
  title: string;
  description: string;
  location: string;
  destinationId: string;
  tourTypeId: string;
  imageSrc: string;
  mainImage: AppGalleryPickerItem | null;
  images: AppGalleryPickerItem[];
  status: 'active' | 'inactive';
  isFeatured: boolean;
  isPopular: boolean;
  isTopTrending: boolean;
  departureStartDate: string;
  departureEndDate: string;
  departureBookingDeadline: string;
  departureMaximumCapacity: string;
  departurePrice: string;
  departureOriginalPrice: string;
  departureStatus: 'open' | 'sold_out' | 'closed' | 'cancelled';
  itineraries: Array<{
    id: string;
    dayNumber: string;
    title: string;
    content: string;
    icon: string;
    isSummary: boolean;
  }>;
  inclusions: Array<{
    id: string;
    itemType: 'included' | 'excluded';
    itemOrder: string;
    content: string;
  }>;
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
export type UpdateAdminTourInput = CreateAdminTourInput & {
  id: number;
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
type EditableTourRow = {
  id: number;
  title: string;
  description: string | null;
  location: string;
  destination_id: number;
  tour_type_id: number | null;
  image_src: string;
  images: string[] | null;
  status: 'active' | 'inactive';
  is_featured: boolean;
  is_popular: boolean;
  is_top_trending: boolean;
  slug: string;
};
type DepartureRow = {
  id: number;
  start_date: string;
  end_date: string;
  booking_deadline: string;
  maximum_capacity: number;
  price: number;
  original_price: number | null;
  status: 'open' | 'sold_out' | 'closed' | 'cancelled';
};
type ItineraryRow = {
  id: number;
  day_number: number;
  title: string;
  content: string | null;
  icon: string | null;
  is_summary: boolean;
};
type InclusionRow = {
  id: number;
  item_type: 'included' | 'excluded';
  item_order: number;
  content: string;
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

function mapGalleryItems(imageUrls: string[] | null | undefined): AppGalleryPickerItem[] {
  return (imageUrls ?? []).filter(Boolean).map((src, index) => ({
    id: `gallery-${index + 1}`,
    src,
    alt: `Gallery image ${index + 1}`,
    file: null,
  }));
}

function mapItineraryItems(
  rows: ItineraryRow[] | null | undefined,
): AdminTourEditorData['itineraries'] {
  return (rows ?? [])
    .sort((left, right) => left.day_number - right.day_number)
    .map((row) => ({
      id: `itinerary-${row.id}`,
      dayNumber: String(row.day_number),
      title: row.title,
      content: row.content ?? '',
      icon: row.icon ?? '',
      isSummary: row.is_summary,
    }));
}

function mapInclusionItems(
  rows: InclusionRow[] | null | undefined,
): AdminTourEditorData['inclusions'] {
  return (rows ?? [])
    .sort((left, right) => left.item_order - right.item_order)
    .map((row) => ({
      id: `inclusion-${row.id}`,
      itemType: row.item_type,
      itemOrder: String(row.item_order),
      content: row.content,
    }));
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

export async function fetchAdminTourById(
  supabase: SupabaseClient,
  tourId: number,
): Promise<AdminTourEditorData | null> {
  const { data: tourRow, error: tourError } = await supabase
    .from('tours')
    .select(
      'id,title,description,location,destination_id,tour_type_id,image_src,images,status,is_featured,is_popular,is_top_trending,slug',
    )
    .eq('id', tourId)
    .maybeSingle<EditableTourRow>();

  if (tourError) {
    throw new Error(`TOUR_FETCH_FAILED:${tourError.message}`);
  }

  if (!tourRow) {
    return null;
  }

  const [
    { data: departures, error: departureError },
    { data: itineraryRows, error: itineraryError },
    { data: inclusionRows, error: inclusionError },
  ] = await Promise.all([
    supabase
      .from('departures')
      .select(
        'id,start_date,end_date,booking_deadline,maximum_capacity,price,original_price,status',
      )
      .eq('tour_id', tourRow.id)
      .order('start_date', { ascending: true })
      .limit(1),
    supabase
      .from('tour_itinerary_steps')
      .select('id,day_number,title,content,icon,is_summary')
      .eq('tour_id', tourRow.id)
      .order('day_number', { ascending: true }),
    supabase
      .from('tour_inclusions')
      .select('id,item_type,item_order,content')
      .eq('tour_id', tourRow.id)
      .order('item_order', { ascending: true }),
  ]);

  if (departureError) {
    throw new Error(`TOUR_DEPARTURE_FETCH_FAILED:${departureError.message}`);
  }
  if (itineraryError) {
    throw new Error(`TOUR_ITINERARY_FETCH_FAILED:${itineraryError.message}`);
  }
  if (inclusionError) {
    throw new Error(`TOUR_INCLUSIONS_FETCH_FAILED:${inclusionError.message}`);
  }

  const departure = ((departures ?? []) as DepartureRow[])[0] ?? null;

  return {
    id: tourRow.id,
    title: tourRow.title,
    description: tourRow.description ?? '',
    location: tourRow.location,
    destinationId: String(tourRow.destination_id),
    tourTypeId: tourRow.tour_type_id ? String(tourRow.tour_type_id) : '',
    imageSrc: tourRow.image_src,
    mainImage: tourRow.image_src
      ? {
          id: 'main-image',
          src: tourRow.image_src,
          alt: tourRow.title,
          file: null,
        }
      : null,
    images: mapGalleryItems(tourRow.images),
    status: tourRow.status,
    isFeatured: tourRow.is_featured,
    isPopular: tourRow.is_popular,
    isTopTrending: tourRow.is_top_trending,
    departureStartDate: departure?.start_date ?? '',
    departureEndDate: departure?.end_date ?? '',
    departureBookingDeadline: departure?.booking_deadline ?? '',
    departureMaximumCapacity: departure ? String(departure.maximum_capacity) : '10',
    departurePrice: departure ? String(departure.price) : '',
    departureOriginalPrice:
      departure && typeof departure.original_price === 'number'
        ? String(departure.original_price)
        : '',
    departureStatus: departure?.status ?? 'open',
    itineraries: mapItineraryItems((itineraryRows ?? []) as ItineraryRow[]),
    inclusions: mapInclusionItems((inclusionRows ?? []) as InclusionRow[]),
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

export async function updateAdminTour(
  supabase: SupabaseClient,
  input: UpdateAdminTourInput,
): Promise<void> {
  const uploadedPaths: string[] = [];
  const { data: currentTour, error: currentTourError } = await supabase
    .from('tours')
    .select('slug')
    .eq('id', input.id)
    .single<{ slug: string }>();

  if (currentTourError) {
    throw new Error(`TOUR_FETCH_FAILED:${currentTourError.message}`);
  }

  let resolvedMainImageSrc = input.imageSrc;
  const resolvedGalleryImageUrls: string[] = [];

  try {
    if (input.mainImage?.file) {
      const uploadedMainImage = await uploadTourImage(
        supabase,
        currentTour.slug,
        input.mainImage.file,
        'main',
      );
      resolvedMainImageSrc = uploadedMainImage.publicUrl;
      uploadedPaths.push(uploadedMainImage.path);
    }

    for (let index = 0; index < input.images.length; index += 1) {
      const image = input.images[index];

      if (image.file) {
        const uploadedGalleryImage = await uploadTourImage(
          supabase,
          currentTour.slug,
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

    const { error: updateTourError } = await supabase
      .from('tours')
      .update({
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
      .eq('id', input.id);

    if (updateTourError) {
      throw new Error(`TOUR_UPDATE_FAILED:${updateTourError.message}`);
    }

    const [
      { error: deleteDepartureError },
      { error: deleteItineraryError },
      { error: deleteInclusionError },
    ] = await Promise.all([
      supabase.from('departures').delete().eq('tour_id', input.id),
      supabase.from('tour_itinerary_steps').delete().eq('tour_id', input.id),
      supabase.from('tour_inclusions').delete().eq('tour_id', input.id),
    ]);

    if (deleteDepartureError) {
      throw new Error(`TOUR_DEPARTURE_UPDATE_FAILED:${deleteDepartureError.message}`);
    }
    if (deleteItineraryError) {
      throw new Error(`TOUR_ITINERARY_UPDATE_FAILED:${deleteItineraryError.message}`);
    }
    if (deleteInclusionError) {
      throw new Error(`TOUR_INCLUSIONS_UPDATE_FAILED:${deleteInclusionError.message}`);
    }

    const { error: departureError } = await supabase.from('departures').insert({
      tour_id: input.id,
      start_date: input.departure.startDate,
      end_date: input.departure.endDate,
      booking_deadline: input.departure.bookingDeadline,
      maximum_capacity: input.departure.maximumCapacity,
      original_price: input.departure.originalPrice,
      price: input.departure.price,
      status: input.departure.status,
    });

    if (departureError) {
      throw new Error(`TOUR_DEPARTURE_UPDATE_FAILED:${departureError.message}`);
    }

    if (input.itineraries.length > 0) {
      const { error: itineraryError } = await supabase.from('tour_itinerary_steps').insert(
        input.itineraries.map((item) => ({
          tour_id: input.id,
          is_summary: item.isSummary,
          day_number: item.dayNumber,
          title: item.title,
          content: item.content,
          icon: item.icon,
        })),
      );

      if (itineraryError) {
        throw new Error(`TOUR_ITINERARY_UPDATE_FAILED:${itineraryError.message}`);
      }
    }

    if (input.inclusions.length > 0) {
      const { error: inclusionsError } = await supabase.from('tour_inclusions').insert(
        input.inclusions.map((item) => ({
          tour_id: input.id,
          item_type: item.itemType,
          item_order: item.itemOrder,
          content: item.content,
        })),
      );

      if (inclusionsError) {
        throw new Error(`TOUR_INCLUSIONS_UPDATE_FAILED:${inclusionsError.message}`);
      }
    }
  } catch (error) {
    if (uploadedPaths.length > 0) {
      await supabase.storage.from('tour-photos').remove(uploadedPaths);
    }
    throw error;
  }
}

export async function deleteAdminTour(supabase: SupabaseClient, tourId: number): Promise<void> {
  const { error } = await supabase.from('tours').delete().eq('id', tourId);

  if (error) {
    throw new Error(`TOUR_DELETE_FAILED:${error.message}`);
  }
}
