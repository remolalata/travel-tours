import type { SupabaseClient } from '@supabase/supabase-js';

export type AdminQuoteRequestRow = {
  id: number;
  userId: string | null;
  destinationName: string;
  travelDateRange: string;
  travelStartDate: string;
  travelEndDate: string;
  tourTypeName: string;
  adultsCount: number;
  childrenCount: number;
  budgetRange: string;
  preferredHotel: string;
  contactFullName: string;
  contactEmail: string;
  contactPhone: string;
  notes: string | null;
  submittedAt: string;
};

export type FetchAdminQuoteRequestsInput = {
  page: number;
  pageSize: number;
};

export type PaginatedAdminQuoteRequests = {
  rows: AdminQuoteRequestRow[];
  total: number;
  page: number;
  pageSize: number;
};

type QuoteRequestDbRow = {
  id: number;
  user_id: string | null;
  destination_name: string;
  travel_date_range: string;
  travel_start_date: string;
  travel_end_date: string;
  tour_type_name: string;
  adults_count: number;
  children_count: number;
  budget_range: string;
  preferred_hotel: string;
  contact_full_name: string;
  contact_email: string;
  contact_phone: string;
  notes: string | null;
  submitted_at: string;
};

export async function fetchAdminQuoteRequests(
  supabase: SupabaseClient,
  input: FetchAdminQuoteRequestsInput,
): Promise<PaginatedAdminQuoteRequests> {
  const from = input.page * input.pageSize;
  const to = from + input.pageSize - 1;

  const { data, error, count } = await supabase
    .from('quote_requests')
    .select(
      `
      id,
      user_id,
      destination_name,
      travel_date_range,
      travel_start_date,
      travel_end_date,
      tour_type_name,
      adults_count,
      children_count,
      budget_range,
      preferred_hotel,
      contact_full_name,
      contact_email,
      contact_phone,
      notes,
      submitted_at
    `,
      { count: 'exact' },
    )
    .order('submitted_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`QUOTE_REQUESTS_FETCH_FAILED:${error.message}`);
  }

  const rows = ((data ?? []) as QuoteRequestDbRow[]).map((row) => ({
    id: row.id,
    userId: row.user_id,
    destinationName: row.destination_name,
    travelDateRange: row.travel_date_range,
    travelStartDate: row.travel_start_date,
    travelEndDate: row.travel_end_date,
    tourTypeName: row.tour_type_name,
    adultsCount: row.adults_count,
    childrenCount: row.children_count,
    budgetRange: row.budget_range,
    preferredHotel: row.preferred_hotel,
    contactFullName: row.contact_full_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    notes: row.notes,
    submittedAt: row.submitted_at,
  }));

  return {
    rows,
    total: count ?? 0,
    page: input.page,
    pageSize: input.pageSize,
  };
}

