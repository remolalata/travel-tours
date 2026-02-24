import Image from 'next/image';
import Link from 'next/link';

import { destinationsPageContent } from '@/content/features/destinations';

export default function PopularToursSection() {
  const { popularTours } = destinationsPageContent;

  return (
    <section className='layout-pt-xl layout-pb-xl relative'>
      <div className='sectionBg -w-1530 rounded-12'></div>

      <div className='container'>
        <div className='row justify-between items-end y-gap-10'>
          <div className='col-auto'>
            <h2 className='text-30 md:text-24'>{popularTours.title}</h2>
          </div>

          <div className='col-auto'>
            <Link href={popularTours.ctaHref} className='buttonArrow d-flex items-center'>
              <span>{popularTours.ctaLabel}</span>
              <i className='icon-arrow-top-right text-16 ml-10'></i>
            </Link>
          </div>
        </div>

        <div className='row y-gap-30 pt-40 sm:pt-20'>
          {popularTours.items.map((item) => (
            <div key={item.id} className='col-lg-4 col-md-6'>
              <Link
                href={item.href}
                className='tourCard -type-1 py-10 px-10 border-1 rounded-12 bg-white -hover-shadow'
              >
                <div className='tourCard__header'>
                  <div className='tourCard__image ratio ratio-28:20'>
                    <Image
                      width={421}
                      height={301}
                      src={item.imageSrc}
                      alt={item.title}
                      className='img-ratio rounded-12'
                    />
                  </div>
                </div>

                <div className='tourCard__content px-10 pt-10'>
                  <div className='tourCard__location d-flex items-center text-13 text-light-2'>
                    <i className='icon-pin d-flex text-16 text-light-2 mr-5'></i>
                    {item.location}
                  </div>

                  <h3 className='tourCard__title text-16 fw-500 mt-5'>
                    <span>{item.title}</span>
                  </h3>

                  <div className='d-flex justify-between items-center border-1-top text-13 text-dark-1 pt-10 mt-10'>
                    <div className='d-flex items-center'>
                      <i className='icon-clock text-16 mr-5'></i>
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
