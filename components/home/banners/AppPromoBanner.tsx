import Image from 'next/image';
import { useId } from 'react';

import FadeIn from '@/components/common/motion/FadeIn';
import { homeContent } from '@/content/features/home';

export default function AppPromoBanner() {
  const appPromoEmailId = useId();
  const { appPromo } = homeContent;

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
                {appPromo.titleLineOne}
                <br className='lg:d-none' />
                {appPromo.titleLineTwo}
              </FadeIn>

              <FadeIn as='p' className='mt-10 text-white'>
                {appPromo.descriptionLineOne}
                <br className='lg:d-none' />
                {appPromo.descriptionLineTwo}
              </FadeIn>

              <FadeIn className='mt-40 md:mt-20 text-18 text-white'>
                {appPromo.magicLinkLabel}
              </FadeIn>

              <FadeIn className='mt-10'>
                <div className='x-gap-10 y-gap-10 singleInput -type-2 row'>
                  <div className='col-md-auto col-12'>
                    <label className='visually-hidden' htmlFor={appPromoEmailId}>
                      {appPromo.emailLabel}
                    </label>
                    <input
                      id={appPromoEmailId}
                      type='email'
                      placeholder={appPromo.emailPlaceholder}
                      className=''
                    />
                  </div>
                  <div className='col-md-auto col-12'>
                    <button className='bg-white -accent-1 text-accent-2 button -md col-12'>
                      {appPromo.submitLabel}
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
