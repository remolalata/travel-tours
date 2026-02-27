import CustomerTestimonialsClient from '@/features/home/components/testimonials/CustomerTestimonialsClient';
import { fetchReviews } from '@/services/reviews/mutations/reviewApi';
import type { FetchReviewsInput, Review } from '@/types/review';
import { createClient } from '@/utils/supabase/server';

const HOMEPAGE_REVIEW_QUERY: FetchReviewsInput = {
  isPublished: true,
  rating: 5,
  limit: 10,
};

export default async function CustomerTestimonials() {
  const supabase = await createClient();
  let reviews: Review[] = [];

  try {
    reviews = await fetchReviews(supabase, HOMEPAGE_REVIEW_QUERY);
  } catch {
    reviews = [];
  }

  return <CustomerTestimonialsClient reviews={reviews} />;
}
