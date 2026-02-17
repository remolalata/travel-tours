export interface DestinationsMetadata {
  title: string;
  description: string;
}

export interface DestinationsHeroContent {
  title: string;
  description: string;
  backgroundImageSrc: string;
  shapeImageSrc: string;
}

export interface DestinationItem {
  id: number;
  name: string;
  imageSrc: string;
  tours: number;
  href: string;
}

export interface DestinationTourItem {
  id: number;
  title: string;
  location: string;
  imageSrc: string;
  duration: string;
  price: number;
  href: string;
}

export interface DestinationWeatherItem {
  id: number;
  period: string;
  high: string;
  low: string;
}

export interface DestinationGeneralInfoItem {
  id: number;
  label: string;
  value: string;
  note?: string;
}

export interface DestinationsPageContent {
  metadata: DestinationsMetadata;
  hero: DestinationsHeroContent;
  trending: {
    title: string;
    ctaLabel: string;
    ctaHref: string;
    tourSuffix: string;
    items: DestinationItem[];
  };
  popularTours: {
    title: string;
    ctaLabel: string;
    ctaHref: string;
    pricePrefix: string;
    items: DestinationTourItem[];
  };
  information: {
    title: string;
    paragraphs: string[];
    weatherTitle: string;
    weather: DestinationWeatherItem[];
    generalInfoTitle: string;
    generalInfo: DestinationGeneralInfoItem[];
  };
}
