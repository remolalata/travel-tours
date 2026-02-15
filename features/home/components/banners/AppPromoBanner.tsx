import FadeIn from '@/components/common/motion/FadeIn';
import Image from 'next/image';
import React, { useId } from 'react';

export default function AppPromoBanner() {
  const appPromoEmailId = useId();

  return (
    <section className='cta -type-1'>
      <div className='cta__bg'>
        <Image width={1530} height={500} src='/img/cta/1/bg.png' alt='image' />
      </div>

      <div className='container'>
        <div className='justify-between row'>
          <div className='col-xl-5 col-lg-6'>
            <div className='cta__content'>
              <FadeIn as='h2' className='text-40 text-white md:text-24 lh-13'>
                Get 5% off your 1st
                <br className='lg:d-none' />
                app booking
              </FadeIn>

              <FadeIn as='p' className='mt-10 text-white'>
                Booking&apos;s better on the app. Use promo code
                <br className='lg:d-none' />
                &quot;Gr8Escapes&quot; to save!
              </FadeIn>

              <FadeIn className='mt-40 md:mt-20 text-18 text-white'>
                Get a magic link sent to your email
              </FadeIn>

              <FadeIn className='mt-10'>
                <div className='x-gap-10 y-gap-10 singleInput -type-2 row'>
                  <div className='col-md-auto col-12'>
                    <label className='visually-hidden' htmlFor={appPromoEmailId}>
                      Email address
                    </label>
                    <input id={appPromoEmailId} type='email' placeholder='Email' className='' />
                  </div>
                  <div className='col-md-auto col-12'>
                    <button className='bg-white -accent-1 text-accent-2 button -md col-12'>
                      Send
                    </button>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>

          <div className='d-flex justify-content-lg-end align-items-end justify-content-center col-lg-6'>
            <div
              className='text-center cta__image cta__image--promo'
              style={{ height: '80%', display: 'flex', alignItems: 'flex-end' }}
            >
              <Image
                width={667}
                height={500}
                src='/img/cta/promo.png'
                alt='image'
                style={{ height: '100%', width: 'auto', maxWidth: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
