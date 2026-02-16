import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';
import { allTour } from '@/data/tours';
import { getTourContentById } from '@/data/tourSingleContent';
import PageHeader from '@/features/tour-single/components/sections/PageHeader';
import TourDetailsContent from '@/features/tour-single/components/sections/TourDetailsContent';
import TourSlider from '@/features/tour-single/components/sections/TourSlider';

export const metadata = {
  title: 'Boracay Tour Package | Gr8 Escapes Travel & Tours',
  description:
    'Discover Boracay with Gr8 Escapes Travel & Tours. Enjoy curated Boracay tour packages, island activities, and hassle-free booking.',
};

interface TourPageProps {
  params: Promise<{ id: string }>;
}

export default async function page(props: TourPageProps) {
  const params = await props.params;
  const id = params.id;
  const parsedId = Number(id);
  const tour = allTour.find((item) => item.id === parsedId) || allTour[0];
  const tourContent = getTourContentById(id);

  return (
    <>
      <main>
        <SiteHeader />
        <PageHeader />

        <TourDetailsContent tour={tour} tourContent={tourContent} />
        <TourSlider />
        <SiteFooter />
      </main>
    </>
  );
}
