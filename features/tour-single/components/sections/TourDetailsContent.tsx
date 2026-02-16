import ToursMap from '@/components/common/maps/ToursMap';
import type { Tour } from '@/data/tours';
import type { TourContent } from '@/data/tourSingleContent';
import TourPhotoGallery from '@/features/tour-single/components/Galleries/TourPhotoGallery';

import CommentBox from './CommentBox';
import Faq from './Faq';
import Included from './Included';
import ItineraryRoadmap from './ItineraryRoadmap';
import MainInformation from './MainInformation';
import OthersInformation from './OthersInformation';
import Overview from './Overview';
import Rating from './Rating';
import Reviews from './Reviews';
import TourSingleSidebar from './TourSingleSidebar';

interface TourDetailsContentProps {
  tour: Tour;
  tourContent: TourContent;
}

export default function TourDetailsContent({ tour, tourContent }: TourDetailsContentProps) {
  return (
    <>
      <section className=''>
        <div className='container'>
          <MainInformation tour={tour} />
          <TourPhotoGallery />
        </div>
      </section>

      <section className='layout-pt-md js-pin-container'>
        <div className='container'>
          <div className='justify-between y-gap-30 row'>
            <div className='col-lg-8'>
              <div className='justify-between items-center y-gap-20 layout-pb-md row'>
                <OthersInformation />
              </div>

              <Overview />

              <div className='mt-60 mb-60 line'></div>

              <h2 className='text-30'>What&apos;s included</h2>

              <Included tourContent={tourContent} />

              <div className='mt-60 mb-60 line'></div>

              <h2 className='text-30'>Itinerary</h2>

              <ItineraryRoadmap tourContent={tourContent} />

              <h2 className='mt-60 mb-30 text-30'>Tour Map</h2>
              <div className='mapTourSingle'>
                <ToursMap />
              </div>

              <div className='mt-60 mb-60 line'></div>

              <h2 className='text-30'>FAQ</h2>

              <div className='y-gap-20 mt-30 accordion -simple row js-accordion'>
                <Faq tourContent={tourContent} />
              </div>

              <div className='mt-60 mb-60 line'></div>

              <h2 className='text-30'>Customer Reviews</h2>

              <div className='mt-30'>
                <Rating tourContent={tourContent} />
              </div>

              <Reviews tourContent={tourContent} />

              <button className='mt-30 -outline-accent-1 text-accent-1 button -md'>
                See more reviews
                <i className='icon-arrow-top-right ml-10 text-16'></i>
              </button>
              <CommentBox />
            </div>

            <div className='col-lg-4'>
              <div className='d-flex justify-end js-pin-content'>
                <TourSingleSidebar tour={tour} tourContent={tourContent} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
