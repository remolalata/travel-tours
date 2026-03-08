export interface IncludedExcludedItem {
  id: number;
  text: string;
}

export interface ItineraryStep {
  id: number;
  title: string;
  icon?: string;
  content?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RatingItem {
  id: number;
  category: string;
  icon: string;
  rating: string;
  comment: string;
}

export interface TourContent {
  includedItems: IncludedExcludedItem[];
  excludedItems: IncludedExcludedItem[];
  itinerarySummarySteps: ItineraryStep[];
  itinerarySteps: ItineraryStep[];
  faqItems: FaqItem[];
  ratingItems: RatingItem[];
  timeSlots: string[];
}
