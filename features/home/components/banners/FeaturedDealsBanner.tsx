import FadeIn from '@/components/common/motion/FadeIn';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function FeaturedDealsBanner() {
  return (
    <section className='cta -type-2'>
      <div className='cta__bg'>
        <Image width={1530} height={600} src='/img/cta/2/bg.png' alt='image' />

        <div className='cta__image'>
          <Image width={750} height={600} src='/img/cta/banner.webp' alt='image' />
          <Image width='40' height='600' src='/img/cta/2/shape.svg' alt='image' />
          <Image width='390' height='35' src='/img/cta/2/shape2.svg' alt='image' />
        </div>
      </div>

      <div className='container'>
        <div className='row'>
          <div className='col-xxl-4 col-xl-5 col-lg-6 col-md-7'>
            <div className='cta__content'>
              <FadeIn as='h2' className='text-40 md:text-30 lh-13'>
                Grab up to <span className='text-accent-1'>35% off</span>
                <br className='lg:d-none' />
                on your favorite
                <br className='lg:d-none' />
                Destination
              </FadeIn>

              <FadeIn as='p' className='mt-10'>
                Limited time offer, don&apos;t miss the opportunity
              </FadeIn>

              <div className='mt-30 md:mt-20'>
                <FadeIn>
                  <button className='text-white bg-accent-1 button -md -dark-1'>
                    <Link href='/tours'>
                      Book Now
                      <i className='icon-arrow-top-right ml-10 text-16'></i>
                    </Link>
                  </button>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
