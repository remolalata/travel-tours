import type { SupabaseClient } from '@supabase/supabase-js';

import type { FetchReviewsInput, Review } from '@/types/review';

type ReviewRow = {
  id: number;
  destination_id: number;
  booking_id: number;
  user_id: string;
  review_title: string;
  review_text: string;
  rating: number;
  created_at: string;
};

type PublicReviewerProfileRow = {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
};

function buildFullName(firstName: string | null, lastName: string | null): string | null {
  const fullName = `${firstName ?? ''} ${lastName ?? ''}`.trim();
  return fullName || null;
}

export async function fetchReviews(
  supabase: SupabaseClient,
  input: FetchReviewsInput,
): Promise<Review[]> {
  let query = supabase
    .from('reviews')
    .select(
      `
      id,
      destination_id,
      booking_id,
      user_id,
      review_title,
      review_text,
      rating,
      created_at
    `,
    )
    .order('created_at', { ascending: false });

  if (typeof input.isPublished === 'boolean') {
    query = query.eq('is_published', input.isPublished);
  }

  if (typeof input.destinationId === 'number') {
    query = query.eq('destination_id', input.destinationId);
  }

  if (typeof input.rating === 'number') {
    query = query.eq('rating', input.rating);
  }

  if (typeof input.limit === 'number') {
    query = query.limit(input.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`REVIEWS_FETCH_FAILED:${error.message}`);
  }

  const reviews = (data ?? []) as ReviewRow[];
  const userIds = [...new Set(reviews.map((review) => review.user_id))];

  const profileByUserId = new Map<string, PublicReviewerProfileRow>();

  if (userIds.length > 0) {
    const { data: profileRows } = await supabase
      .from('public_reviewer_profiles')
      .select('user_id,first_name,last_name,avatar_url')
      .in('user_id', userIds);

    for (const profileRow of (profileRows ?? []) as PublicReviewerProfileRow[]) {
      profileByUserId.set(profileRow.user_id, profileRow);
    }
  }

  return reviews.map((review) => {
    const profile = profileByUserId.get(review.user_id);

    return {
      id: review.id,
      destinationId: review.destination_id,
      bookingId: review.booking_id,
      userId: review.user_id,
      reviewTitle: review.review_title,
      reviewText: review.review_text,
      rating: review.rating,
      createdAt: review.created_at,
      reviewerName: buildFullName(profile?.first_name ?? null, profile?.last_name ?? null),
      reviewerAvatarUrl: profile?.avatar_url ?? null,
    };
  });
}
