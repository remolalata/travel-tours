import { createTourContentTemplate } from '@/data/tourSingleContent';
import type { IncludedExcludedItem, ItineraryStep } from '@/types/tourContent';
import type { TourSingleDeparture, TourSinglePageData } from '@/types/tourSingle';
import { sortDeparturesByStartDate } from '@/utils/helpers/departures';

type TourSingleRow = {
  id: number;
  slug: string;
  destination_id: number;
  title: string;
  location: string;
  image_src: string;
  images: string[] | null;
  description: string | null;
  is_featured: boolean;
  departures?: Array<{
    id: number;
    start_date: string;
    end_date: string;
    booking_deadline: string;
    maximum_capacity: number;
    price: number;
    original_price: number | null;
  }> | null;
  tour_types:
    | {
        name: string | null;
      }
    | Array<{
        name: string | null;
      }>
    | null;
};

type TourInclusionRow = {
  id: number;
  item_type: 'included' | 'excluded';
  item_order: number;
  content: string;
};

type TourItineraryStepRow = {
  id: number;
  is_summary: boolean;
  day_number: number;
  title: string;
  content: string | null;
  icon: string | null;
};

function mapInclusionRows(
  rows: TourInclusionRow[],
  itemType: 'included' | 'excluded',
): IncludedExcludedItem[] {
  return rows
    .filter((row) => row.item_type === itemType)
    .sort((a, b) => a.item_order - b.item_order)
    .map((row) => ({
      id: row.id,
      text: row.content,
    }));
}

function mapItineraryRows(rows: TourItineraryStepRow[], isSummary: boolean): ItineraryStep[] {
  return rows
    .filter((row) => row.is_summary === isSummary)
    .sort((a, b) => a.day_number - b.day_number)
    .map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content ?? undefined,
      icon: row.icon ?? undefined,
    }));
}

function buildGalleryImageUrls(tour: TourSingleRow): string[] {
  const images = (tour.images ?? []).filter(Boolean);

  if (images.length > 0) {
    return images;
  }

  return tour.image_src ? [tour.image_src] : [];
}

function getTourType(row: TourSingleRow['tour_types']): { name: string | null } | null {
  if (!row) return null;

  if (Array.isArray(row)) {
    return row[0] ?? null;
  }

  return row;
}

function getLowestDeparture(departures: TourSingleRow['departures']): {
  id: number;
  start_date: string;
  end_date: string;
  price: number;
  original_price: number | null;
} | null {
  return (departures ?? []).reduce<{
    id: number;
    start_date: string;
    end_date: string;
    price: number;
    original_price: number | null;
  } | null>((lowest, departure) => {
    if (!lowest || departure.price < lowest.price) {
      return departure;
    }

    return lowest;
  }, null);
}

function mapDepartures(departures: TourSingleRow['departures']): TourSingleDeparture[] {
  return sortDeparturesByStartDate(
    (departures ?? []).map((departure) => ({
      id: departure.id,
      startDate: departure.start_date,
      endDate: departure.end_date,
      bookingDeadline: departure.booking_deadline,
      maximumCapacity: departure.maximum_capacity,
      price: departure.price,
      originalPrice: departure.original_price ?? departure.price,
    })),
  );
}

export function mapTourSinglePageData(
  tour: TourSingleRow,
  inclusionRows: TourInclusionRow[],
  itineraryRows: TourItineraryStepRow[],
): TourSinglePageData {
  const baseTourContent = createTourContentTemplate();
  const includedItems = mapInclusionRows(inclusionRows, 'included');
  const excludedItems = mapInclusionRows(inclusionRows, 'excluded');
  const itinerarySummarySteps = mapItineraryRows(itineraryRows, true);
  const itinerarySteps = mapItineraryRows(itineraryRows, false);
  const tourType = getTourType(tour.tour_types);
  const lowestDeparture = getLowestDeparture(tour.departures);
  const departures = mapDepartures(tour.departures);

  if (!lowestDeparture) {
    throw new Error('TOUR_HAS_NO_OPEN_DEPARTURES');
  }

  return {
    routeContext: {
      id: tour.id,
      slug: tour.slug,
      destinationId: tour.destination_id,
    },
    tour: {
      id: tour.id,
      slug: tour.slug,
      tourTypeName: tourType?.name ?? null,
      imageSrc: tour.image_src,
      location: tour.location,
      title: tour.title,
      rating: 0,
      ratingCount: 0,
      description: tour.description ?? '',
      price: lowestDeparture.price,
      fromPrice: lowestDeparture.original_price ?? lowestDeparture.price,
      featured: tour.is_featured,
      badgeText: '',
      badgeClass: '',
      features: [],
      departures,
    },
    tourContent: {
      ...baseTourContent,
      includedItems: includedItems.length > 0 ? includedItems : baseTourContent.includedItems,
      excludedItems: excludedItems.length > 0 ? excludedItems : baseTourContent.excludedItems,
      itinerarySummarySteps:
        itinerarySummarySteps.length > 0
          ? itinerarySummarySteps
          : baseTourContent.itinerarySummarySteps,
      itinerarySteps: itinerarySteps.length > 0 ? itinerarySteps : baseTourContent.itinerarySteps,
    },
    galleryImageUrls: buildGalleryImageUrls(tour),
    overviewDescription: tour.description,
  };
}

export type { TourInclusionRow, TourItineraryStepRow, TourSingleRow };
