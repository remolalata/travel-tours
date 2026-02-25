import Image from 'next/image';
import Link from 'next/link';

import { destinationsPageContent } from '@/content/features/destinations';

export default function PopularToursSection() {
  const { popularTours } = destinationsPageContent;

  return (
    <section className='relative layout-pt-xl layout-pb-xl'>
      <div className='rounded-12 -w-1530 sectionBg'></div>

      <div className='container'>
        <div className='justify-between items-end y-gap-10 row'>
          <div className='col-auto'>
            <h2 className='text-30 md:text-24'>{popularTours.title}</h2>
          </div>

          <div className='col-auto'>
            <Link href={popularTours.ctaHref} className='d-flex items-center buttonArrow'>
              <span>{popularTours.ctaLabel}</span>
              <i className='icon-arrow-top-right ml-10 text-16'></i>
            </Link>
          </div>
        </div>

        <div className='y-gap-30 pt-40 sm:pt-20 row'>
          {popularTours.items.map((item) => (
            <div key={item.id} className='col-lg-4 col-md-6'>
              <Link
                href={item.href}
                className='bg-white -hover-shadow px-10 py-10 border rounded-12 tourCard -type-1'
              >
                <div className='tourCard__header'>
                  <div className='tourCard__image ratio ratio-28:20'>
                    <Image
                      width={421}
                      height={301}
                      src={item.imageSrc}
                      alt={item.title}
                      className='rounded-12 img-ratio'
                    />
                  </div>
                </div>

                <div className='px-10 pt-10 tourCard__content'>
                  <div className='d-flex items-center text-13 text-light-2 tourCard__location'>
                    <i className='d-flex mr-5 text-16 text-light-2 icon-pin'></i>
                    {item.location}
                  </div>

                  <h3 className='mt-5 text-16 tourCard__title fw-500'>
                    <span>{item.title}</span>
                  </h3>

                  <div className='d-flex justify-between items-center mt-10 pt-10 border-top text-13 text-dark-1'>
                    <div className='d-flex items-center'>
                      <i className='mr-5 text-16 icon-clock'></i>
                      {item.duration}
                    </div>

                    <div>
                      {popularTours.pricePrefix}{' '}
                      <span className='text-16 fw-500'>${item.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
