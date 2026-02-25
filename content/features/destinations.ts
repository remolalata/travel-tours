import type { DestinationsPageContent } from '@/types/destinations';

export const destinationsPageContent: DestinationsPageContent = {
  metadata: {
    title: 'Destinations | Travel & Tours',
    description: 'Explore popular destinations, featured tours, and travel information.',
  },
  hero: {
    title: 'Phuket',
    description: 'Explore deals, travel guides and things to do in Phuket',
    backgroundImageSrc: '/img/hero.webp',
    shapeImageSrc: '/img/hero/1/shape.svg',
  },
  trending: {
    title: 'Trending destinations',
    ctaLabel: 'See all',
    ctaHref: '/tours',
    tourSuffix: '+ Tours',
    items: [
      {
        id: 1,
        name: 'Boracay',
        imageSrc: '/img/destinationCards/boracay.webp',
        tours: 124,
        href: '/tours',
      },
      {
        id: 2,
        name: 'Palawan',
        imageSrc: '/img/destinationCards/palawan.webp',
        tours: 98,
        href: '/tours',
      },
      {
        id: 3,
        name: 'Cebu',
        imageSrc: '/img/destinationCards/cebu.webp',
        tours: 76,
        href: '/tours',
      },
      {
        id: 4,
        name: 'Bohol',
        imageSrc: '/img/destinationCards/bohol.webp',
        tours: 64,
        href: '/tours',
      },
      {
        id: 5,
        name: 'Siargao',
        imageSrc: '/img/destinationCards/siargao.webp',
        tours: 52,
        href: '/tours',
      },
      {
        id: 6,
        name: 'Bangkok',
        imageSrc: '/img/destinationCards/bangkok.webp',
        tours: 88,
        href: '/tours',
      },
    ],
  },
  popularTours: {
    title: 'Popular Tour in Phuket',
    ctaLabel: 'See all',
    ctaHref: '/tours',
    pricePrefix: 'From',
    items: [
      {
        id: 1,
        title: 'Phi Phi Islands Adventure Day Trip with Seaview Lunch',
        location: 'Phuket, Thailand',
        imageSrc: '/img/dashboard/booking/1.jpg',
        duration: '1 day',
        price: 392.89,
        href: '/tours',
      },
      {
        id: 2,
        title: 'Zipline 18 Platform and ATV Adventure Tour',
        location: 'Phuket, Thailand',
        imageSrc: '/img/dashboard/booking/2.jpg',
        duration: '1 day',
        price: 412.5,
        href: '/tours',
      },
      {
        id: 3,
        title: 'Phang Nga Bay and James Bond Island by Big Boat',
        location: 'Phuket, Thailand',
        imageSrc: '/img/dashboard/booking/3.jpg',
        duration: '1 day',
        price: 550,
        href: '/tours',
      },
    ],
  },
  information: {
    title: 'What to know before visiting Phuket',
    paragraphs: [
      'Phuket is a destination known for island-hopping routes, beach activities, and vibrant local food culture.',
      'Before your trip, it helps to plan based on weather, local transportation options, and activity schedules.',
    ],
    weatherTitle: 'Local weather',
    weather: [
      { id: 1, period: 'Jan - Mar', high: '32°C', low: '24°C' },
      { id: 2, period: 'Apr - Jun', high: '34°C', low: '26°C' },
      { id: 3, period: 'Jul - Sep', high: '31°C', low: '25°C' },
      { id: 4, period: 'Oct - Dec', high: '30°C', low: '24°C' },
    ],
    generalInfoTitle: 'General info',
    generalInfo: [
      { id: 1, label: 'Time Zone', value: 'GMT +07:00', note: '7 hours ahead of UTC' },
      { id: 2, label: 'Currency', value: 'Thai Baht (THB)', note: 'Rates vary by provider' },
      {
        id: 3,
        label: 'Best time to visit',
        value: 'November to April',
        note: 'Drier season for tours',
      },
    ],
  },
};
