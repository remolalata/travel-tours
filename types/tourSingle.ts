import type { TourFeaturedItem } from '@/types/tour';
import type { TourContent } from '@/types/tourContent';

export type TourSingleRouteContext = {
  id: number;
  slug: string;
  destinationId: number;
};

export type TourSinglePageTour = TourFeaturedItem & {
  slug: string;
  tourTypeName?: string | null;
  departures: TourSingleDeparture[];
};

export type TourSingleDeparture = {
  id: number;
  startDate: string;
  endDate: string;
  bookingDeadline: string;
  maximumCapacity: number;
  price: number;
  originalPrice: number;
};

export type TourSinglePageData = {
  routeContext: TourSingleRouteContext;
  tour: TourSinglePageTour;
  tourContent: TourContent;
  galleryImageUrls: string[];
  overviewDescription: string | null;
};
