import type { MyBookingsPageContent } from '@/types/myBookings';

export const myBookingsPageContent: MyBookingsPageContent = {
  metadata: {
    title: 'My Bookings | Travel & Tours',
    description: 'Manage and review your bookings.',
  },
  intro: {
    title: 'My Bookings',
    description: 'Track your upcoming trips and review your past reservations in one place.',
  },
  tabs: {
    ariaLabel: 'Booking status filters',
    items: [
      { key: 'all', label: 'All Bookings' },
      { key: 'upcoming', label: 'Upcoming' },
      { key: 'completed', label: 'Completed' },
      { key: 'cancelled', label: 'Cancelled' },
    ],
  },
  statuses: {
    upcoming: 'Upcoming',
    completed: 'Completed',
    cancelled: 'Cancelled',
  },
  card: {
    checkInLabel: 'Check-in',
    checkOutLabel: 'Check-out',
    guestsLabel: 'Guests',
    bookingReferenceLabel: 'Booking Reference',
    totalAmountLabel: 'Total Amount',
    receiptCtaLabel: 'Download Receipt',
    reviewCountLabel: 'reviews',
    guestSingularLabel: 'Guest',
    guestPluralLabel: 'Guests',
    fallbackLocationLabel: 'Travel & Tours',
    imageUnavailableLabel: 'Image unavailable',
  },
  messages: {
    loading: 'Loading bookings...',
    loadError: 'Unable to load your bookings right now.',
    retry: 'Try Again',
    empty: 'No bookings found for this filter.',
  },
};
