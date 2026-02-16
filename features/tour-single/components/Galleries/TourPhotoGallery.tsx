'use client';

import Image from 'next/image';
import { useState } from 'react';

import ImageLightBox from './ImageLightBox';
const images = [
  {
    id: 1,
    image: `/img/tourSingle/1/1.png`,
  },
  {
    id: 1,
    image: `/img/tourSingle/1/2.png`,
  },
  {
    id: 1,
    image: `/img/tourSingle/1/3.png`,
  },
  {
    id: 1,
    image: `/img/tourSingle/1/4.png`,
  },
];
export default function TourPhotoGallery() {
  const [activeLightBox, setActiveLightBox] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(1);
  return (
    <>
      <div className='mt-30 tourSingleGrid -type-1'>
        <div className='tourSingleGrid__grid mobile-css-slider-2'>
          <Image width={1155} height={765} src='/img/tourSingle/1/1.png' alt='image' />
          <Image width={765} height={375} src='/img/tourSingle/1/2.png' alt='image' />
          <Image width={375} height={375} src='/img/tourSingle/1/3.png' alt='image' />
          <Image width={375} height={375} src='/img/tourSingle/1/4.png' alt='image' />
        </div>

        <div className='tourSingleGrid__button'>
          <div style={{ cursor: 'pointer' }} className='js-gallery' data-gallery='gallery1'>
            <span
              onClick={() => setActiveLightBox(true)}
              className='bg-dark-1 px-20 py-10 rounded-200 text-white -accent-1 button lh-16'
            >
              See all photos
            </span>
          </div>
          <a href='/img/tourSingle/1/2.png' className='js-gallery' data-gallery='gallery1'></a>
          <a href='/img/tourSingle/1/3.png' className='js-gallery' data-gallery='gallery1'></a>
          <a href='/img/tourSingle/1/4.png' className='js-gallery' data-gallery='gallery1'></a>
        </div>
      </div>
      <ImageLightBox
        images={images}
        activeLightBox={activeLightBox}
        setActiveLightBox={setActiveLightBox}
        currentSlideIndex={currentSlideIndex}
        setCurrentSlideIndex={setCurrentSlideIndex}
      />
    </>
  );
}
