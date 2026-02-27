import Link from 'next/link';

import FadeIn from '@/components/common/motion/FadeIn';
import { homeContent } from '@/content/features/home';
import HomeTourCard from '@/features/home/components/tours/HomeTourCard';
import { fetchPopularTours } from '@/services/tours/mutations/tourApi';
import type { TourBase } from '@/types/tour';
import { createClient } from '@/utils/supabase/server';

export default async function PopularToursSection() {
  const { popularTours } = homeContent;
  let tours: TourBase[] = [];

  try {
    const supabase = await createClient();
    const popularTourRows = await fetchPopularTours(supabase);

    tours = popularTourRows;
  } catch {
    tours = [];
  }

  return (
    <section className='layout-pt-xl layout-pb-xl'>
      <div className='container'>
        <div className='justify-between items-end y-gap-10 row'>
          <div className='col-auto'>
            <FadeIn as='h2' className='text-30 md:text-24'>
              {popularTours.title}
            </FadeIn>
          </div>

          <div className='col-auto'>
            <FadeIn delay={0.1}>
              <Link href='/tours' className='d-flex items-center buttonArrow'>
                <span>{popularTours.ctaLabel}</span>
                <i className='icon-arrow-top-right ml-10 text-16'></i>
              </Link>
            </FadeIn>
          </div>
        </div>

        <FadeIn
          className='justify-between y-gap-30 pt-40 sm:pt-20 -w-300 row mobile-css-slider'
          amount={0.08}
          margin='0px'
        >
          {tours.map((tour) => (
            <div key={tour.id} className='col-lg-3 col-md-6'>
              <HomeTourCard
                item={tour}
                favoriteLabel={popularTours.favoriteLabel}
                pricePrefix={popularTours.pricePrefix}
              />
            </div>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
