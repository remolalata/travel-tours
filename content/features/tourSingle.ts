export const tourSingleContent = {
  mainInformation: {
    badges: {
      bestsellerLabel: 'Bestseller',
      freeCancellationLabel: 'Free cancellation',
    },
    stats: {
      bookedLabel: '30K+ booked',
    },
    actions: {
      share: {
        label: 'Share',
        ariaLabelPrefix: 'Share this tour on Facebook',
      },
      wishlist: {
        label: 'Wishlist',
        href: '#',
      },
    },
  },
  details: {
    includedTitle: "What's included",
    itineraryTitle: 'Itinerary',
    faqTitle: 'FAQ',
    reviewsTitle: 'Customer Reviews',
    seeMoreReviewsLabel: 'See more reviews',
  },
  gallery: {
    imageAltFallback: 'Tour photo',
    seeAllPhotosLabel: 'See all photos',
  },
  overview: {
    title: 'Tour Overview',
    highlightsTitle: 'Tour Highlights',
    fallbackDescription:
      'Experience the best of your destination in one hassle-free getaway. This package is designed to give you a smooth balance of guided highlights, comfortable transfers, and free time to enjoy the trip at your own pace.',
    fallbackHighlights: [
      'Enjoy curated stops and destination highlights',
      'Travel with organized transfers and guided activities',
      'Explore, relax, and enjoy free time in between tours',
      'Ideal for families, couples, and small groups',
      'Hassle-free planning with a clear itinerary flow',
    ],
  },
  relatedTours: {
    title: 'You might also like...',
    favoriteLabel: 'Add to favorites',
    pricePrefix: 'From',
    navigation: {
      previousLabel: 'Previous related tours',
      nextLabel: 'Next related tours',
    },
  },
} as const;
