import TrendingDestinationsClient from '@/features/home/components/destinations/TrendingDestinationsClient';
import { fetchTrendingDestinations } from '@/services/destinations/mutations/destinationApi';
import type { FetchTrendingDestinationsInput, TrendingDestination } from '@/types/destination';
import { createClient } from '@/utils/supabase/server';

const HOMEPAGE_TRENDING_DESTINATIONS_QUERY: FetchTrendingDestinationsInput = {
  limit: 12,
};

export default async function TrendingDestinations() {
  const supabase = await createClient();
  let destinations: TrendingDestination[] = [];

  try {
    destinations = await fetchTrendingDestinations(supabase, HOMEPAGE_TRENDING_DESTINATIONS_QUERY);
  } catch {
    destinations = [];
  }

  return (
    <TrendingDestinationsClient
      initialDestinations={destinations}
      queryInput={HOMEPAGE_TRENDING_DESTINATIONS_QUERY}
    />
  );
}
