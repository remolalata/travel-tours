import type { SupabaseClient } from '@supabase/supabase-js';

import type {
  CreateDestinationInput,
  Destination,
  FetchDestinationsInput,
  FetchTrendingDestinationsInput,
  TrendingDestination,
  UpdateDestinationInput,
} from '@/types/destination';

type DestinationRow = {
  id: number;
  slug: string;
  name: string;
  image_src: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type TrendingDestinationRow = {
  id: number;
  slug: string;
  name: string;
  image_src: string;
  tour_count: number;
};

function mapDestinationRow(destination: DestinationRow): Destination {
  return {
    id: destination.id,
    slug: destination.slug,
    name: destination.name,
    imageSrc: destination.image_src,
    isActive: destination.is_active,
    createdAt: destination.created_at,
    updatedAt: destination.updated_at,
  };
}

function getDestinationPhotoStoragePathFromPublicUrl(url: string | null): string | null {
  if (!url) return null;

  const bucketPublicPathMarker = '/storage/v1/object/public/destination-photos/';

  try {
    const parsedUrl = new URL(url);
    const markerIndex = parsedUrl.pathname.indexOf(bucketPublicPathMarker);
    if (markerIndex === -1) return null;

    const path = parsedUrl.pathname.slice(markerIndex + bucketPublicPathMarker.length);
    return decodeURIComponent(path);
  } catch {
    return null;
  }
}

export async function fetchDestinations(
  supabase: SupabaseClient,
  input: FetchDestinationsInput,
): Promise<Destination[]> {
  let query = supabase
    .from('destinations')
    .select('id,slug,name,image_src,is_active,created_at,updated_at')
    .order('name', { ascending: true });

  if (typeof input.isActive === 'boolean') {
    query = query.eq('is_active', input.isActive);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`DESTINATIONS_FETCH_FAILED:${error.message}`);
  }

  return ((data ?? []) as DestinationRow[]).map(mapDestinationRow);
}

export async function createDestination(
  supabase: SupabaseClient,
  input: CreateDestinationInput,
): Promise<Destination> {
  let imageSrc: string | null = null;

  if (input.imageFile) {
    const fileExtension = input.imageFile.name.split('.').pop() ?? 'jpg';
    const filePath = `${input.slug}/${Date.now()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from('destination-photos')
      .upload(filePath, input.imageFile, { upsert: true });

    if (uploadError) {
      throw new Error(`DESTINATION_UPLOAD_FAILED:${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage.from('destination-photos').getPublicUrl(filePath);
    imageSrc = publicUrlData.publicUrl;
  }

  const { data, error } = await supabase
    .from('destinations')
    .insert({
      name: input.name,
      slug: input.slug,
      image_src: imageSrc,
      is_active: input.isActive,
    })
    .select('id,slug,name,image_src,is_active,created_at,updated_at')
    .single<DestinationRow>();

  if (error) {
    throw new Error(`DESTINATION_CREATE_FAILED:${error.message}`);
  }

  return mapDestinationRow(data);
}

export async function updateDestination(
  supabase: SupabaseClient,
  input: UpdateDestinationInput,
): Promise<Destination> {
  const existingImageSrc = input.currentImageSrc;
  let imageSrc: string | null = input.removeImage ? null : input.currentImageSrc;

  if (input.imageFile) {
    const fileExtension = input.imageFile.name.split('.').pop() ?? 'jpg';
    const filePath = `${input.slug}/${Date.now()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from('destination-photos')
      .upload(filePath, input.imageFile, { upsert: true });

    if (uploadError) {
      throw new Error(`DESTINATION_UPLOAD_FAILED:${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage.from('destination-photos').getPublicUrl(filePath);
    imageSrc = publicUrlData.publicUrl;
  }

  const { data, error } = await supabase
    .from('destinations')
    .update({
      name: input.name,
      slug: input.slug,
      is_active: input.isActive,
      image_src: imageSrc,
      updated_at: new Date().toISOString(),
    })
    .eq('id', input.id)
    .select('id,slug,name,image_src,is_active,created_at,updated_at')
    .single<DestinationRow>();

  if (error) {
    throw new Error(`DESTINATION_UPDATE_FAILED:${error.message}`);
  }

  const shouldDeleteOldImage = Boolean(existingImageSrc) && existingImageSrc !== imageSrc;
  if (shouldDeleteOldImage) {
    const oldImagePath = getDestinationPhotoStoragePathFromPublicUrl(existingImageSrc);
    if (oldImagePath) {
      await supabase.storage.from('destination-photos').remove([oldImagePath]);
    }
  }

  return mapDestinationRow(data);
}

export async function deleteDestination(supabase: SupabaseClient, id: number): Promise<void> {
  const { data: existingRow, error: existingError } = await supabase
    .from('destinations')
    .select('image_src')
    .eq('id', id)
    .maybeSingle<{ image_src: string | null }>();

  if (existingError) {
    throw new Error(`DESTINATION_DELETE_FAILED:${existingError.message}`);
  }

  const { error } = await supabase.from('destinations').delete().eq('id', id);

  if (error) {
    throw new Error(`DESTINATION_DELETE_FAILED:${error.message}`);
  }

  const imagePath = getDestinationPhotoStoragePathFromPublicUrl(existingRow?.image_src ?? null);
  if (imagePath) {
    await supabase.storage.from('destination-photos').remove([imagePath]);
  }
}

export async function fetchTrendingDestinations(
  supabase: SupabaseClient,
  input: FetchTrendingDestinationsInput,
): Promise<TrendingDestination[]> {
  const { data, error } = await supabase.rpc('list_trending_destinations', {
    max_items: input.limit ?? 12,
  });

  if (error) {
    throw new Error(`DESTINATIONS_FETCH_FAILED:${error.message}`);
  }

  return ((data ?? []) as TrendingDestinationRow[]).map((destination) => ({
    id: destination.id,
    slug: destination.slug,
    name: destination.name,
    imageSrc: destination.image_src,
    tourCount: destination.tour_count,
  }));
}
