import Stars from '@/components/common/Stars';
import type { Tour } from '@/data/tours';

interface MainInformationProps {
  tour?: Tour;
}

export default function MainInformation({ tour }: MainInformationProps) {
  return (
    <>
      <div className='justify-between items-end y-gap-20 row'>
        <div className='col-auto'>
          <div className='items-center x-gap-10 y-gap-10 row'>
            <div className='col-auto'>
              <button className='px-15 py-5 rounded-200 text-14 -accent-1 bg-accent-1-05 text-accent-1 button'>
                Bestseller
              </button>
            </div>
            <div className='col-auto'>
              <button className='bg-light-1 px-15 py-5 rounded-200 text-14 -accent-1 button'>
                Free cancellation
              </button>
            </div>
          </div>

          <h2 className='mt-20 text-40 sm:text-30 lh-14'>
            {tour?.title.split(' ').slice(0, 7).join(' ')}

            <br />
            {tour?.title.split(' ').slice(7).join(' ')}
          </h2>

          <div className='items-center x-gap-20 y-gap-20 pt-20 row'>
            <div className='col-auto'>
              <div className='d-flex items-center'>
                <div className='d-flex x-gap-5 pr-10'>
                  <Stars star={tour?.rating} font={12} />
                </div>
                {tour?.rating} ({tour?.ratingCount})
              </div>
            </div>

            <div className='col-auto'>
              <div className='d-flex items-center'>
                <i className='mr-5 text-16 icon-pin'></i>
                {tour?.location}
              </div>
            </div>

            <div className='col-auto'>
              <div className='d-flex items-center'>
                <i className='mr-5 text-16 icon-reservation'></i>
                30K+ booked
              </div>
            </div>
          </div>
        </div>

        <div className='col-auto'>
          <div className='d-flex x-gap-30 y-gap-10'>
            <a href='#' className='d-flex items-center'>
              <i className='flex-center mr-10 text-16 icon-share'></i>
              Share
            </a>

            <a href='#' className='d-flex items-center'>
              <i className='flex-center mr-10 text-16 icon-heart'></i>
              Wishlist
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
