import Image from 'next/image';
import Link from 'next/link';

import { destinationsPageContent } from '@/content/features/destinations';

export default function TrendingDestinationsSection() {
  const { trending } = destinationsPageContent;

  return (
    <section className='layout-pt-xl'>
      <div className='container'>
        <div className='row y-gap-10 justify-between items-end'>
          <div className='col-auto'>
            <h2 className='text-30 md:text-24'>{trending.title}</h2>
          </div>

          <div className='col-auto'>
            <Link href={trending.ctaHref} className='buttonArrow d-flex items-center'>
              <span>{trending.ctaLabel}</span>
              <i className='icon-arrow-top-right text-16 ml-10'></i>
            </Link>
          </div>
        </div>

        <div className='row y-gap-30 justify-between xl:justify-center sm:justify-start pt-40 sm:pt-20 mobile-css-slider -w-160'>
          {trending.items.map((item) => (
            <div key={item.id} className='col-xl-auto col-lg-2 col-md-3 col-sm-4 col-6'>
              <Link href={item.href} className='featureImage -type-1 text-center d-block'>
                <div className='featureImage__image mx-auto'>
                  <Image
                    width={260}
                    height={260}
                    src={item.imageSrc}
                    alt={item.name}
                    className='size-130 object-cover rounded-full'
                  />
                </div>

                <h3 className='featureImage__title text-16 fw-500 mt-20'>{item.name}</h3>
                <p className='featureImage__text text-14'>
                  {item.tours}
                  {trending.tourSuffix}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
