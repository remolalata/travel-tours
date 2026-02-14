import { allTour } from "./tours.js";

const includedItemsBase = [
  { id: 1, text: "Roundtrip airfare, baggage allowance, and terminal fees" },
  { id: 2, text: "Local taxes and environmental fees" },
  { id: 3, text: "Hotel pick-up and drop-off via air-conditioned van" },
  { id: 4, text: "Travel insurance and transfer to private pier" },
  { id: 5, text: "Daily breakfast and bottled water during tours" },
  { id: 6, text: "DOT-accredited tour guide" },
];

const excludedItemsBase = [
  { id: 7, text: "Personal expenses and souvenirs" },
  { id: 8, text: "Tips and gratuities" },
  { id: 9, text: "Alcoholic beverages" },
];

const itinerarySummaryStepsBase = [
  {
    id: 1,
    icon: "icon-pin",
    title: "Day 1: Airport Pick-Up and Hotel Check-In",
  },
  {
    id: 2,
    title: "Day 2: City Highlights and Cultural Tour",
    content:
      "Pagdating sa destination, we'll handle your transfers para hassle-free. On Day 2, enjoy a guided city and culture experience with photo stops, local food options, and free time for shopping.",
  },
  { id: 3, title: "Day 3: Island Hopping and Beach Time" },
  { id: 4, title: "Day 4: Nature Adventure and Local Experience" },
  { id: 5, title: "Day 5: Leisure Morning and Optional Activities" },
  { id: 6, title: "Day 6: Free Day and Sunset Experience" },
  {
    id: 7,
    icon: "icon-flag",
    title: "Day 7: Check-Out and Airport Transfer",
  },
];

const itineraryStepsBase = [
  {
    id: 1,
    icon: "icon-pin",
    title: "Day 1: Airport Pick-Up and Hotel Check-In",
    content:
      "Welcome to your destination! Our team will meet you at the airport and transfer you directly to your hotel. First day is for rest, quick orientation, and light exploration at your own pace.",
  },
  {
    id: 2,
    title: "Day 2: City Highlights and Cultural Tour",
    content:
      "Start your day with breakfast, then join a guided city tour covering key landmarks, heritage spots, and local favorites. May free time din for cafe hopping or pasalubong shopping.",
  },
  {
    id: 3,
    title: "Day 3: Island Hopping and Beach Time",
    content:
      "Enjoy a full-day island hopping adventure with scenic stops, swimming spots, and lunch by the beach. Perfect day for photos, relaxation, and bonding with family or barkada.",
  },
  {
    id: 4,
    title: "Day 4: Nature Adventure and Local Experience",
    content:
      "Explore nature attractions such as hills, rivers, caves, or eco parks depending on your package. Includes guided activities and local cultural immersion for a more meaningful trip.",
  },
  {
    id: 5,
    title: "Day 5: Leisure Morning and Optional Activities",
    content:
      "This is your flexible day-sleep in, enjoy hotel amenities, or add optional tours like spa, food crawl, or water activities. Great time to personalize your getaway.",
  },
  {
    id: 6,
    title: "Day 6: Free Day and Sunset Experience",
    content:
      "Spend your final full day your way. Chill at the beach, explore nearby spots, or enjoy a sunset cruise experience. Relax mode before heading home.",
  },
  {
    id: 7,
    icon: "icon-flag",
    title: "Day 7: Check-Out and Airport Transfer",
    content:
      "After breakfast, check out from the hotel and enjoy your scheduled transfer to the airport. Salamat and we hope to see you again on your next GR8 escape!",
  },
];

const faqItemsBase = [
  {
    question: "Can I get a refund?",
    answer:
      "Yes, refunds depend on the package terms and airline/hotel policies. For most promos, full refund is available if cancellation is made at least 24-72 hours before departure, subject to supplier rules.",
  },
  {
    question: "Can I change the travel date?",
    answer:
      "Yes, date changes are allowed for selected packages, subject to fare difference, hotel availability, and rebooking fees. Message us early so we can secure the best options for your new date.",
  },
  {
    question: "When and where does the tour end?",
    answer:
      "The tour usually ends at your hotel or designated drop-off point on the last day. For flight-included packages, we also provide airport transfer based on your confirmed departure schedule.",
  },
  {
    question: "Do you arrange airport transfers?",
    answer:
      "Yes, airport transfers are included in most packages. Depending on your booking, this may be shared (SIC) or private transfer. Final details are provided in your travel confirmation.",
  },
];

const ratingItemsBase = [
  {
    id: 1,
    category: "Overall Rating",
    icon: "icon-star-2",
    rating: "5.0",
    comment: "Excellent",
  },
  {
    id: 2,
    category: "Location",
    icon: "icon-pin-2",
    rating: "4.9",
    comment: "Excellent",
  },
  {
    id: 3,
    category: "Amenities",
    icon: "icon-application",
    rating: "4.8",
    comment: "Excellent",
  },
  {
    id: 4,
    category: "Food",
    icon: "icon-utensils",
    rating: "4.8",
    comment: "Excellent",
  },
  {
    id: 5,
    category: "Price",
    icon: "icon-price-tag",
    rating: "4.9",
    comment: "Excellent",
  },
  {
    id: 6,
    category: "Rooms",
    icon: "icon-bed-2",
    rating: "4.8",
    comment: "Excellent",
  },
  {
    id: 7,
    category: "Tour Operator",
    icon: "icon-online-support-2",
    rating: "5.0",
    comment: "Excellent",
  },
];

const reviewItemsBase = [
  {
    id: 1,
    avatar: "/img/reviews/avatars/1.png",
    name: "Carla Mae Dizon",
    date: "January 2026",
    stars: 5,
    reviewText: "Super smooth and sulit!",
    desc: "First time namin mag-book as a family and sobrang dali ng process. Complete details, on-time transfers, and very friendly guides. Hassle-free talaga from start to finish.",
    images: [
      "/img/reviews/1/1.png",
      "/img/reviews/1/2.png",
      "/img/reviews/1/3.png",
    ],
  },
  {
    id: 2,
    avatar: "/img/reviews/avatars/1.png",
    name: "Paolo Reyes",
    date: "February 2026",
    stars: 5,
    reviewText: "Worth every peso!",
    desc: "Booked the Bangkok package and it exceeded expectations. Hotel location was great, tours were organized, and support team was responsive kahit may late-night question kami.",
    images: [
      "/img/reviews/1/1.png",
      "/img/reviews/1/2.png",
      "/img/reviews/1/3.png",
    ],
  },
  {
    id: 3,
    avatar: "/img/reviews/avatars/1.png",
    name: "Jessa Ann Villanueva",
    date: "March 2026",
    stars: 5,
    reviewText: "Babalik kami for sure!",
    desc: "Sobrang na-enjoy namin yung island hopping and city tour. Clear itinerary, bait ng staff, and walang stress sa logistics. Perfect for couples and barkada trips.",
    images: [
      "/img/reviews/1/1.png",
      "/img/reviews/1/2.png",
      "/img/reviews/1/3.png",
    ],
  },
];

const timeSlotsBase = [
  "08:00",
  "09:30",
  "11:00",
  "13:00",
  "14:30",
  "16:00",
  "18:00",
];

const cloneItems = (items) =>
  items.map((item) => ({
    ...item,
    ...(Array.isArray(item.images) ? { images: [...item.images] } : {}),
  }));

export const createTourContentTemplate = () => ({
  includedItems: cloneItems(includedItemsBase),
  excludedItems: cloneItems(excludedItemsBase),
  itinerarySummarySteps: cloneItems(itinerarySummaryStepsBase),
  itinerarySteps: cloneItems(itineraryStepsBase),
  faqItems: cloneItems(faqItemsBase),
  ratingItems: cloneItems(ratingItemsBase),
  reviewItems: cloneItems(reviewItemsBase),
  timeSlots: [...timeSlotsBase],
});

export const defaultTourContent = createTourContentTemplate();

export const tourContentById = Object.fromEntries(
  allTour.map((tour) => [String(tour.id), createTourContentTemplate()]),
);

export const getTourContentById = (tourId) =>
  tourContentById[String(tourId)] || defaultTourContent;

// Backward-compatible exports for components that still use legacy keys.
export const included = defaultTourContent.includedItems;
export const excluded = defaultTourContent.excludedItems;
export const roadmapData = defaultTourContent.itinerarySummarySteps;
export const roadmapData2 = defaultTourContent.itinerarySteps;
export const faqData = defaultTourContent.faqItems;
export const overallRatingData = defaultTourContent.ratingItems;
export const reviews = defaultTourContent.reviewItems;
export const times = defaultTourContent.timeSlots;
