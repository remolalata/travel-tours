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
      editTourLabel: 'Edit this tour',
      wishlist: {
        label: 'Wishlist',
        href: '#',
      },
    },
  },
  details: {
    quickFacts: {
      durationLabel: 'Duration',
      groupSizeLabel: 'Group Size',
      bookingDeadlineLabel: 'Booking Deadline',
      duration: {
        daySingular: 'day',
        dayPlural: 'days',
        nightSingular: 'night',
        nightPlural: 'nights',
      },
      groupSize: {
        upToPrefix: 'Up to',
        paxSuffix: 'pax',
      },
    },
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
      whenPlaceholder: 'Select departure',
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
      sections: {
        travelersTitle: 'Traveler Details',
        travelersHelper: 'Traveler 1 is used as the primary booking contact automatically.',
        travelerTitlePrefix: 'Traveler',
      },
      fields: {
        adults: 'Adults',
        children: 'Children',
        paymentOption: 'Payment Option',
        travelerFirstName: 'First Name',
        travelerLastName: 'Last Name',
        travelerEmail: 'Email',
        travelerPhone: 'Phone',
        notes: 'Booking Notes',
        notesPlaceholder: 'Special requests, pickup details, or notes for this booking.',
      },
      helpers: {
        selectDatesFirst: 'Select travel dates in the sidebar before confirming payment.',
        paymentOption:
          'Choose whether to settle the booking in full or pay the initial downpayment.',
        paymentsUnavailable:
          'Online payments are currently unavailable. Add the PayMongo server keys to enable booking confirmation.',
      },
      summary: {
        title: 'Booking Summary',
        packageLabel: 'Package',
        destinationLabel: 'Destination',
        datesLabel: 'Travel Dates',
        tourTypeLabel: 'Tour Type',
        travelersLabel: 'Travelers',
        totalAmountLabel: 'Estimated Total',
        amountDueNowLabel: 'Amount Due Now',
        balanceAmountLabel: 'Remaining Balance',
      },
      paymentOptions: [
        { value: 'full', label: 'Full Payment (100%)' },
        { value: 'downpayment', label: 'Downpayment (30%)' },
      ],
      validationMessages: {
        required_when: 'Please select travel dates first.',
        required_adults: 'Please enter at least 1 adult.',
        invalid_adults: 'Adults must be a whole number greater than 0.',
        invalid_children: 'Children must be a whole number of 0 or higher.',
        required_lead_traveler_email: 'Please enter the lead traveler email.',
        invalid_lead_traveler_email: 'Please enter a valid email address.',
        required_lead_traveler_phone: 'Please enter the lead traveler phone number.',
        required_traveler_first_name: 'Please enter the traveler first name.',
        required_traveler_last_name: 'Please enter the traveler last name.',
      },
      toasts: {
        missingDates: 'Please select travel dates before proceeding to payment.',
        success: 'Payment successful.',
        successWithReference: 'Payment successful. Reference:',
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
