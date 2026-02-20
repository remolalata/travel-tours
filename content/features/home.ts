export const homeContent = {
  faq: {
    title: 'Frequently Asked Questions',
  },
  hero: {
    title: 'Your Dream Destination, Made Hassle-Free',
    description:
      'From flights and hotels to tours and transfers, Travel & Tours brings you complete travel packages for unforgettable local and international getaways.',
    fields: {
      whereLabel: 'Where',
      wherePlaceholder: 'Search destinations',
      whenLabel: 'When',
      tourTypeLabel: 'Tour Type',
      tourTypePlaceholder: 'All tour',
    },
    submitLabel: 'Get a Quote',
  },
  whyChooseUs: {
    title: 'Why Travel & Tours',
    features: [
      {
        id: 1,
        iconSrc: '/img/icons/1/ticket.svg',
        title: 'Ultimate flexibility',
        text: 'Plan your trip your way with options that fit your schedule, budget, and travel style. We offer flexible package choices, practical add-ons, and clear guidance so you can book with confidence.',
      },
      {
        id: 2,
        iconSrc: '/img/icons/1/hot-air-balloon.svg',
        title: 'Memorable experiences',
        text: 'We design each getaway to be more than just a trip. From iconic city tours to island adventures, our curated itineraries help you create meaningful moments with the people who matter most.',
      },
      {
        id: 3,
        iconSrc: '/img/icons/1/diamond.svg',
        title: 'Seamless, hassle-free travel',
        text: 'Skip the stress of planning. We handle the essentials: flights, accommodations, transfers, and tour arrangements, so you can focus on enjoying every part of your journey.',
      },
      {
        id: 4,
        iconSrc: '/img/icons/1/medal.svg',
        title: 'Award-winning support',
        text: "Travel with peace of mind knowing our team is ready to assist you before, during, and after your trip. We're committed to fast, friendly, and reliable service at every step.",
      },
    ],
  },
  trendingDestinations: {
    title: 'Trending Locations',
    ctaLabel: 'See all',
    tourCountSuffix: '+ Tours',
  },
  popularTours: {
    title: 'Find Popular Tours',
    ctaLabel: 'See all',
    favoriteLabel: 'Add to favorites',
    pricePrefix: 'From',
  },
  featuredDeals: {
    headlinePrefix: 'Grab up to',
    headlineHighlight: '35% off',
    headlineLineTwo: 'on your favorite',
    headlineLineThree: 'Destination',
    description: "Limited time offer, don't miss the opportunity",
    ctaLabel: 'Get a Quote',
  },
  tourTypes: {
    title: 'Popular things to do',
    ctaLabel: 'See all',
  },
  trendingTours: {
    title: 'Top Trending',
    ctaLabel: 'See all',
    favoriteLabel: 'Add to favorites',
    pricePrefix: 'From',
    navigation: {
      previousLabel: 'Previous top trending tours',
      nextLabel: 'Next top trending tours',
    },
  },
  testimonials: {
    title: 'Customer Reviews',
    loadingLabel: 'Loading customer reviews...',
    emptyLabel: 'No customer reviews yet.',
    reviewerNameFallback: 'Verified Traveler',
    reviewerRoleLabel: 'Traveler',
    backgroundImageAlt: 'Customer reviews background',
    avatarImageAlt: 'Customer review avatar',
    avatarImageSrc: '/img/reviews/avatars/1.png',
  },
  appPromo: {
    titleLineOne: 'Get 5% off your 1st',
    titleLineTwo: 'app booking',
    descriptionLineOne: "Booking's better on the app. Use promo code",
    descriptionLineTwo: '"Travel & Tours" to save!',
    magicLinkLabel: 'Get a magic link sent to your email',
    emailLabel: 'Email address',
    emailPlaceholder: 'Email',
    submitLabel: 'Send',
  },
} as const;
