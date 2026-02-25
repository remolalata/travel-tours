import type { HelpCenterPageContent } from '@/types/help-center';

export const helpCenterPageContent: HelpCenterPageContent = {
  metadata: {
    title: 'Help Center | Travel & Tours',
    description: 'Find answers about bookings, payments, changes, and travel support.',
  },
  hero: {
    title: 'Welcome to the Help Center',
    description: 'Find quick answers and guides for common travel concerns.',
    backgroundImageSrc: '/img/pageHeader/2.jpg',
    backgroundImageAlt: 'Help center header background',
    shapeImageSrc: '/img/hero/1/shape.svg',
    shapeImageAlt: 'Help center header shape',
    searchPlaceholder: 'Search for a topic',
    searchButtonAriaLabel: 'Search help topics',
  },
  topics: {
    title: 'Popular Help Topics',
    items: [
      {
        id: 1,
        iconSrc: '/img/icons/6/1.svg',
        title: 'Booking your activity',
        content: 'Learn how to reserve tours, check availability, and secure your slot.',
      },
      {
        id: 2,
        iconSrc: '/img/icons/6/2.svg',
        title: 'Payment and receipts',
        content: 'Understand payment options, confirmation timing, and receipt requests.',
      },
      {
        id: 3,
        iconSrc: '/img/icons/6/3.svg',
        title: 'Booking changes and refunds',
        content: 'Review cancellation windows, rebooking policies, and refund processing.',
      },
      {
        id: 4,
        iconSrc: '/img/icons/6/4.svg',
        title: 'Promo codes and credits',
        content: 'Apply discounts correctly and check eligible trips for promo credits.',
      },
      {
        id: 5,
        iconSrc: '/img/icons/6/5.svg',
        title: 'On the participation day',
        content: 'Know where to meet, what to bring, and how to contact your coordinator.',
      },
      {
        id: 6,
        iconSrc: '/img/icons/6/6.svg',
        title: 'Value packs',
        content: 'Explore bundled options for flights, hotels, and curated activities.',
      },
    ],
  },
  faq: {
    title: 'Frequently Asked Questions',
  },
};
