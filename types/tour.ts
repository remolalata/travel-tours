export interface TourBase {
  id: number;
  imageSrc: string;
  location: string;
  title: string;
  ratingCount: number;
  rating: number;
  price: number;
  duration?: string;
}

export interface TourFilterItem extends TourBase {
  spead: string;
  feature: string;
  lat?: number;
  long?: number;
}

export interface TourFeatureTag {
  icon: string;
  name: string;
}

export interface TourFeaturedItem extends TourBase {
  badgeText?: string;
  featured?: boolean;
  description: string;
  fromPrice: number;
  badgeClass: string;
  features: TourFeatureTag[];
}

export type Tour = TourFilterItem | TourFeaturedItem;
