import type { PaginatedToursList } from '@/api/tours/mutations/tourApi';
import { fetchToursList } from '@/api/tours/mutations/tourApi';
import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';
import PageHeader from '@/features/tours/components/sections/PageHeader';
import TourList1 from '@/features/tours/components/sections/TourList1';
import { createClient } from '@/utils/supabase/server';

export const metadata = {
  title: 'Tours | Travel & Tours',
  description: 'ViaTour - Travel & Tour React NextJS Template',
};

const TOURS_PAGE_SIZE = 8;

export default async function page() {
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

  return (
    <>
      <main>
        <SiteHeader />
        <PageHeader />
        <TourList1 initialToursPage={initialToursPage} />
        <SiteFooter />
      </main>
    </>
  );
}
