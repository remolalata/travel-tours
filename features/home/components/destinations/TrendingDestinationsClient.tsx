'use client';

import Link from 'next/link';

import useTrendingDestinationsQuery from '@/api/destinations/hooks/useTrendingDestinationsQuery';
import FadeIn from '@/components/common/motion/FadeIn';
import { homeContent } from '@/content/features/home';
import DestinationSlider from '@/features/home/components/destinations/DestinationSlider';
import type { FetchTrendingDestinationsInput, TrendingDestination } from '@/types/destination';

type TrendingDestinationsClientProps = {
  initialDestinations: TrendingDestination[];
  queryInput: FetchTrendingDestinationsInput;
};

export default function TrendingDestinationsClient({
  initialDestinations,
  queryInput,
}: TrendingDestinationsClientProps) {
  const { trendingDestinations } = homeContent;
  const destinationsQuery = useTrendingDestinationsQuery(queryInput, {
    initialData: initialDestinations,
  });
  const destinations = destinationsQuery.data ?? initialDestinations;

  return (
    <section className='layout-pt-xl'>
      <div className='container'>
        <div className='justify-between items-end y-gap-10 row'>
          <div className='col-auto'>
            <FadeIn as='h2' className='text-30 md:text-24'>
              {trendingDestinations.title}
            </FadeIn>
          </div>

          <div className='col-auto'>
            <FadeIn delay={0.1}>
              <Link href='/tours' className='buttonArrow d-flex items-center'>
                <span>{trendingDestinations.ctaLabel}</span>
                <i className='icon-arrow-top-right text-16 ml-10'></i>
              </Link>
            </FadeIn>
          </div>
        </div>

        <DestinationSlider
          destinations={destinations}
          paginationClass='pbutton-trending-locations'
        />
      </div>
    </section>
  );
}
