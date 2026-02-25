import { tourSingleContent as tourSinglePageContent } from '@/content/features/tourSingle';
import type { Tour } from '@/data/tours';
import type { TourContent } from '@/data/tourSingleContent';
import TourPhotoGallery from '@/features/tour-single/components/Galleries/TourPhotoGallery';
import type { Review } from '@/types/review';
import type { FaqItem } from '@/types/tourContent';

import Faq from './Faq';
import Included from './Included';
import ItineraryRoadmap from './ItineraryRoadmap';
import MainInformation from './MainInformation';
import OthersInformation from './OthersInformation';
import Overview from './Overview';
import Reviews from './Reviews';
import TourSingleSidebar from './TourSingleSidebar';

interface TourDetailsContentProps {
  tour: Tour;
  tourContent: TourContent;
  destinationId?: number;
  reviews?: Review[];
  galleryImageUrls?: string[];
  overviewDescription?: string | null;
  faqItems?: FaqItem[];
}

export default function TourDetailsContent({
  tour,
  tourContent,
  destinationId,
  reviews,
  galleryImageUrls,
  overviewDescription,
  faqItems,
}: TourDetailsContentProps) {
  const detailsContent = tourSinglePageContent.details;

  return (
    <>
      <section className=''>
        <div className='container'>
          <MainInformation tour={tour} />
          <TourPhotoGallery imageUrls={galleryImageUrls} imageAlt={tour.title} />
        </div>
      </section>

      <section className='layout-pt-md js-pin-container'>
        <div className='container'>
          <div className='justify-between y-gap-30 row'>
            <div className='col-lg-8'>
              <div className='justify-between items-center y-gap-20 layout-pb-md row'>
                <OthersInformation />
              </div>

              <Overview description={overviewDescription} />

              <div className='mt-60 mb-60 line'></div>

              <h2 className='text-30'>{detailsContent.includedTitle}</h2>

              <div className='mt-20'>
                <Included tourContent={tourContent} />
              </div>

              <div className='mt-60 mb-60 line'></div>

              <h2 className='text-30'>{detailsContent.itineraryTitle}</h2>

              <div className='mt-20'>
                <ItineraryRoadmap tourContent={tourContent} />
              </div>

              <div className='mt-60 mb-60 line'></div>

              <h2 className='text-30'>{detailsContent.faqTitle}</h2>

              <div className='y-gap-20 mt-20 accordion -simple row js-accordion'>
                <Faq tourContent={tourContent} items={faqItems} />
              </div>

              <div className='mt-60 mb-60 line'></div>

              <h2 className='text-30'>{detailsContent.reviewsTitle}</h2>

              <div className='mt-20'>
                <Reviews tourContent={tourContent} reviews={reviews} />
              </div>

              <button className='mt-30 -outline-accent-1 text-accent-1 button -md'>
                {detailsContent.seeMoreReviewsLabel}
                <i className='icon-arrow-top-right ml-10 text-16'></i>
              </button>
            </div>

            <div className='col-lg-4'>
              <div className='d-flex justify-end js-pin-content'>
                <TourSingleSidebar
                  key={tour.id}
                  tour={tour}
                  tourContent={tourContent}
                  destinationId={destinationId}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
