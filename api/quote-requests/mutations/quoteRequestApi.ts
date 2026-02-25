import type { SupabaseClient } from '@supabase/supabase-js';
import dayjs from 'dayjs';

export type CreateQuoteRequestInput = {
  where: string;
  when: string;
  tourType: string;
  adults: string;
  children: string;
  budget: string;
  hotelClass: string;
  fullName: string;
  email: string;
  phone: string;
  notes: string;
};

function parseMonthDayValue(value: string, year: number) {
  const parsed = dayjs(new Date(`${value}, ${year}`));
  return parsed.isValid() ? parsed.startOf('day') : null;
}

function parseQuoteWhenRange(when: string) {
  const [rawStart, rawEnd] = when.split(' - ').map((part) => part.trim());
  if (!rawStart || !rawEnd) {
    throw new Error('QUOTE_REQUEST_CREATE_FAILED:INVALID_TRAVEL_DATE_RANGE');
  }

  const currentYear = dayjs().year();
  const startDate = parseMonthDayValue(rawStart, currentYear);
  let endDate = parseMonthDayValue(rawEnd, currentYear);

  if (!startDate || !endDate) {
    throw new Error('QUOTE_REQUEST_CREATE_FAILED:INVALID_TRAVEL_DATE_RANGE');
  }

  if (endDate.isBefore(startDate, 'day')) {
    endDate = endDate.add(1, 'year');
  }

  return { startDate, endDate };
}

export async function createQuoteRequest(
  supabase: SupabaseClient,
  input: CreateQuoteRequestInput,
): Promise<void> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(`QUOTE_REQUEST_CREATE_FAILED:${userError.message}`);
  }

  const { startDate, endDate } = parseQuoteWhenRange(input.when);

  const { error } = await supabase.from('quote_requests').insert({
    user_id: user?.id ?? null,
    destination_name: input.where.trim(),
    travel_start_date: startDate.format('YYYY-MM-DD'),
    travel_end_date: endDate.format('YYYY-MM-DD'),
    travel_date_range: input.when.trim(),
    tour_type_name: input.tourType.trim(),
    adults_count: Number(input.adults),
    children_count: input.children.trim() ? Number(input.children) : 0,
    budget_range: input.budget.trim(),
    preferred_hotel: input.hotelClass.trim(),
    contact_full_name: input.fullName.trim(),
    contact_email: input.email.trim(),
    contact_phone: input.phone.trim(),
    notes: input.notes.trim() ? input.notes.trim() : null,
  });

  if (error) {
    throw new Error(`QUOTE_REQUEST_CREATE_FAILED:${error.message}`);
  }
}

