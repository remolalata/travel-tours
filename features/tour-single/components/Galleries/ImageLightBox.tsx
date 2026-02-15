'use client';

import Image from 'next/image';
import React from 'react';

interface ImageLightBoxImage {
  image: string;
}

interface ImageLightBoxProps {
  images: ImageLightBoxImage[];
  setActiveLightBox: React.Dispatch<React.SetStateAction<boolean>>;
  activeLightBox: boolean;
  currentSlideIndex: number;
  setCurrentSlideIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function ImageLightBox({
  images,
  setActiveLightBox,
  activeLightBox,
  currentSlideIndex,
  setCurrentSlideIndex,
}: ImageLightBoxProps) {
  return (
    <div id='myModal' className={`modal ${activeLightBox ? 'activeImageLightBox' : ''}`}>
      <div
        className='close cursor'
        style={{ zIndex: 1000 }}
        onClick={() => {
          setActiveLightBox(false);
        }}
      >
        <span>&times;</span>
      </div>
      <div className='modal-content'>
        {images.map((elm, i) => (
          <div
            key={i}
            className={`mySlides ${currentSlideIndex == i ? 'fadein' : ''} `}
            style={
              currentSlideIndex == i
                ? { display: 'block', height: '100%' }
                : { display: 'none', height: '100%' }
            }
          >
            <div className='numbertext'>
              {i + 1} / {images.length}
            </div>
            <Image
              width={850}
              height={510}
              src={elm.image}
              style={{
                height: '100%',
                width: '100%',
                objectFit: 'contain',
                margin: 'auto auto',
              }}
              alt='image'
            />
          </div>
        ))}

        <a
          className='prev'
          onClick={() =>
            setCurrentSlideIndex((previousValue) =>
              previousValue === 0 ? images.length - 1 : previousValue - 1,
            )
          }
        >
          &#10094;
        </a>
        <a
          className='next'
          onClick={() =>
            setCurrentSlideIndex((previousValue) =>
              previousValue === images.length - 1 ? 0 : previousValue + 1,
            )
          }
        >
          &#10095;
        </a>
      </div>
    </div>
  );
}
