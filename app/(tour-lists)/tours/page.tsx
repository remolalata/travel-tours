import ToursPage from '@/features/tours/ToursPage';
import type { PaginatedToursList } from '@/services/tours/mutations/tourApi';
import { fetchToursList } from '@/services/tours/mutations/tourApi';
import { createClient } from '@/utils/supabase/server';

export const metadata = {
  title: 'Tours | Travel & Tours',
  description: 'ViaTour - Travel & Tour React NextJS Template',
};

const TOURS_PAGE_SIZE = 8;

export default async function Page() {
  const supabase = await createClient();
  let initialToursPage: PaginatedToursList = {
    rows: [],
    total: 0,
    page: 0,
    pageSize: TOURS_PAGE_SIZE,
  };

  try {
    initialToursPage = await fetchToursList(supabase, {
      page: 0,
      pageSize: TOURS_PAGE_SIZE,
    });
  } catch {
    initialToursPage = {
      rows: [],
      total: 0,
      page: 0,
      pageSize: TOURS_PAGE_SIZE,
    };
  }

  return <ToursPage initialToursPage={initialToursPage} />;
}
