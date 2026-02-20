import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';
import PageHeader from '@/features/tours/components/sections/PageHeader';
import TourList1 from '@/features/tours/components/sections/TourList1';

export const metadata = {
  title: 'Tours | Travel & Tours',
  description: 'ViaTour - Travel & Tour React NextJS Template',
};

export default function page() {
  return (
    <>
      <main>
        <SiteHeader />
        <PageHeader />
        <TourList1 />
        <SiteFooter />
      </main>
    </>
  );
}
