export type Review = {
  id: number;
  destinationId: number;
  bookingId: number;
  userId: string;
  reviewTitle: string;
  reviewText: string;
  rating: number;
  createdAt: string;
  reviewerName: string | null;
  reviewerAvatarUrl: string | null;
};

export type FetchReviewsInput = {
  destinationId?: number;
  rating?: number;
  limit?: number;
  isPublished?: boolean;
};
