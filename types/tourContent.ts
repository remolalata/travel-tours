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

export interface ReviewItem {
  id: number;
  avatar: string;
  name: string;
  date: string;
  stars: number;
  reviewText: string;
  desc: string;
  images: string[];
}

export interface TourContent {
  includedItems: IncludedExcludedItem[];
  excludedItems: IncludedExcludedItem[];
  itinerarySummarySteps: ItineraryStep[];
  itinerarySteps: ItineraryStep[];
  faqItems: FaqItem[];
  ratingItems: RatingItem[];
  reviewItems: ReviewItem[];
  timeSlots: string[];
}
