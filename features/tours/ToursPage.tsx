import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';
import PageHeader from '@/components/tours/sections/PageHeader';
import TourList from '@/components/tours/sections/TourList';
import type { PaginatedToursList } from '@/services/tours/mutations/tourApi';

type ToursPageProps = {
  initialToursPage: PaginatedToursList;
};

export default function ToursPage({ initialToursPage }: ToursPageProps) {
  return (
    <main>
      <SiteHeader />
      <PageHeader />
      <TourList initialToursPage={initialToursPage} />
      <SiteFooter />
    </main>
  );
}
