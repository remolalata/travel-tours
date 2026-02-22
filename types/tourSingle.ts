import type { TourFeaturedItem } from '@/types/tour';
import type { TourContent } from '@/types/tourContent';

export type TourSingleRouteContext = {
  id: number;
  slug: string;
  destinationId: number;
};

export type TourSinglePageTour = TourFeaturedItem & {
  slug: string;
};

export type TourSinglePageData = {
  routeContext: TourSingleRouteContext;
  tour: TourSinglePageTour;
  tourContent: TourContent;
  galleryImageUrls: string[];
  overviewDescription: string | null;
};
