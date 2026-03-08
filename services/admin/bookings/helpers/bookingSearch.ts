const MAX_BOOKING_SEARCH_TERM_LENGTH = 80;

export function normalizeBookingSearchTerm(value: string): string {
  return value.replace(/\s+/g, ' ').trim().slice(0, MAX_BOOKING_SEARCH_TERM_LENGTH);
}

export function tokenizeBookingSearchTerm(value: string): string[] {
  const normalizedValue = normalizeBookingSearchTerm(value);

  if (normalizedValue.length === 0) {
    return [];
  }

  return normalizedValue.split(' ');
}
