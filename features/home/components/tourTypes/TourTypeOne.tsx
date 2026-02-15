import FadeIn from '@/components/common/motion/FadeIn';
import { popularThingsToDoCards } from '@/data/destinations';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function TourTypeOne() {
  return (
    <section className='layout-pt-xl layout-pb-xl'>
      <div className='container'>
        <div className='row justify-between items-end y-gap-10'>
          <div className='col-auto'>
            <FadeIn as='h2' className='text-30 md:text-24'>
              Popular things to do
            </FadeIn>
          </div>

          <div className='col-auto'>
            <FadeIn delay={0.1}>
              <Link href='/tours' className='buttonArrow d-flex items-center '>
                <span>See all</span>
                <i className='icon-arrow-top-right text-16 ml-10'></i>
              </Link>
            </FadeIn>
          </div>
        </div>

        <FadeIn className='grid -type-1 pt-40 sm:pt-20'>
          {popularThingsToDoCards.map((elm, i) => (
            <Link
              href={'/tours'}
              key={i}
              className='featureCard -type-1 -hover-1 overflow-hidden rounded-12 px-30 py-30'
            >
              <div className='featureCard__image'>
                <Image
                  width={780}
                  height={780}
                  style={{ objectFit: 'cover' }}
                  src={elm.imgSrc}
                  alt='image'
                />
              </div>

              <div className='featureCard__content'>
                <h4 className='text-white'>{elm.title}</h4>
              </div>
            </Link>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
