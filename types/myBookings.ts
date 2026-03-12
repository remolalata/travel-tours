export type MyBookingsTabKey = 'all' | 'upcoming' | 'completed' | 'cancelled';

export interface MyBookingsTabItem {
  key: MyBookingsTabKey;
  label: string;
}

export interface MyBookingsPageContent {
  metadata: {
    title: string;
    description: string;
  };
  intro: {
    title: string;
    description: string;
  };
  tabs: {
    ariaLabel: string;
    items: MyBookingsTabItem[];
  };
  statuses: {
    upcoming: string;
    completed: string;
    cancelled: string;
  };
  card: {
    checkInLabel: string;
    checkOutLabel: string;
    guestsLabel: string;
    bookingReferenceLabel: string;
    totalAmountLabel: string;
    receiptCtaLabel: string;
    reviewCountLabel: string;
    guestSingularLabel: string;
    guestPluralLabel: string;
    fallbackLocationLabel: string;
    imageUnavailableLabel: string;
  };
  messages: {
    loading: string;
    loadError: string;
    retry: string;
    empty: string;
  };
}

export interface MyBookingCardData {
  id: string;
  title: string;
  location: string;
  imageSrc: string | null;
  rating: number;
  ratingCount: number;
  checkIn: string;
  checkOut: string;
  guests: string;
  bookingReference: string;
  totalAmount: number;
  status: string;
  receiptHref: string;
}

export interface MyBookingCardLabels {
  checkInLabel: string;
  checkOutLabel: string;
  guestsLabel: string;
  bookingReferenceLabel: string;
  totalAmountLabel: string;
  receiptCtaLabel: string;
  reviewCountLabel: string;
  imageUnavailableLabel: string;
}
