import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';
import PageHeader from '@/components/tour-single/sections/PageHeader';
import TourDetailsContent from '@/components/tour-single/sections/TourDetailsContent';
import TourSlider from '@/components/tour-single/sections/TourSlider';
import type { Review } from '@/types/review';
import type { FaqItem } from '@/types/tourContent';
import type { TourSinglePageData } from '@/types/tourSingle';

type TourSinglePageProps = {
  singlePageData: TourSinglePageData;
  reviews: Review[];
  faqItems: FaqItem[];
  paymentsEnabled: boolean;
};

export default function TourSinglePage({
  singlePageData,
  reviews,
  faqItems,
  paymentsEnabled,
}: TourSinglePageProps) {
  const { tour, tourContent, galleryImageUrls, overviewDescription, routeContext } = singlePageData;

  return (
    <main>
      <SiteHeader />
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tours', href: '/tours' },
          { label: tour.title },
        ]}
      />
      <TourDetailsContent
        tour={tour}
        tourContent={tourContent}
        destinationId={routeContext.destinationId}
        reviews={reviews}
        galleryImageUrls={galleryImageUrls}
        overviewDescription={overviewDescription}
        faqItems={faqItems}
        paymentsEnabled={paymentsEnabled}
      />
      <TourSlider destinationId={routeContext.destinationId} currentTourId={routeContext.id} />
      <SiteFooter />
    </main>
  );
}
