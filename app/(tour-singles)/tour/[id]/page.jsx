import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';
import PageHeader from '@/components/tourSingle/PageHeader';
import TourSlider from '@/components/tourSingle/TourSlider';
import TourDetailsContent from '@/components/tourSingle/pages/TourDetailsContent';
import { getTourContentById } from '@/data/tourSingleContent';
import { allTour } from '@/data/tours';

import React from 'react';

export const metadata = {
  title: 'Boracay Tour Package | Gr8 Escapes Travel & Tours',
  description:
    'Discover Boracay with Gr8 Escapes Travel & Tours. Enjoy curated Boracay tour packages, island activities, and hassle-free booking.',
};

export default async function page(props) {
  const params = await props.params;
  const id = params.id;
  const tour = allTour.find((item) => item.id == id) || allTour[0];
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
