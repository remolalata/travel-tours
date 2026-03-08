const MAX_TOUR_SEARCH_TERM_LENGTH = 80;

export function normalizeTourSearchTerm(value: string): string {
  return value.replace(/\s+/g, ' ').trim().slice(0, MAX_TOUR_SEARCH_TERM_LENGTH);
}
