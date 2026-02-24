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
  sidebar: {
    pricePrefix: 'From',
    fields: {
      whereLabel: 'Where',
      wherePlaceholder: 'Search destinations',
      whenLabel: 'When',
      tourTypeLabel: 'Tour Type',
      tourTypePlaceholder: 'All tour',
    },
    ctaLabel: 'Book Now',
    paymentFlow: {
      modalTitle: 'Complete Booking',
      actions: {
        cancel: 'Cancel',
        confirm: 'Confirm Booking',
        processing: 'Processing...',
      },
      fields: {
        adults: 'Adults',
        children: 'Children',
        paymentOption: 'Payment Option',
        notes: 'Booking Notes',
        notesPlaceholder: 'Special requests, pickup details, or notes for this booking.',
      },
      helpers: {
        selectDatesFirst: 'Select travel dates in the sidebar before confirming payment.',
        paymentOption: '',
      },
      summary: {
        title: 'Booking Summary',
        destinationLabel: 'Destination',
        datesLabel: 'Travel Dates',
        tourTypeLabel: 'Tour Type',
        travelersLabel: 'Travelers',
        totalAmountLabel: 'Estimated Total',
        amountDueNowLabel: 'Amount Due Now',
      },
      paymentOptions: [
        { value: 'full', label: 'Full Payment (100%)' },
        { value: 'partial', label: 'Down Payment (35%)' },
        { value: 'reserve', label: 'Reserve Now, Pay Later' },
      ],
      validationMessages: {
        required_when: 'Please select travel dates first.',
        required_adults: 'Please enter at least 1 adult.',
        invalid_adults: 'Adults must be a whole number greater than 0.',
        invalid_children: 'Children must be a whole number of 0 or higher.',
      },
      toasts: {
        missingDates: 'Please select travel dates before proceeding to payment.',
        successPrefix: 'Booking placed successfully. Reference',
        error: 'Failed to create booking. Please try again.',
      },
    },
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
