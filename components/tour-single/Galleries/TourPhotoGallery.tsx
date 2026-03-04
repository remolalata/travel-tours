'use client';

import Image from 'next/image';
import { useState } from 'react';

import { tourSingleContent } from '@/content/features/tourSingle';

import ImageLightBox from './ImageLightBox';
const defaultImages = [
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
    id: 4,
    image: `/img/tourSingle/1/4.png`,
  },
];

type TourPhotoGalleryProps = {
  imageUrls?: string[];
  imageAlt?: string;
};

function buildGalleryImages(imageUrls?: string[]) {
  if (!imageUrls || imageUrls.length === 0) {
    return defaultImages;
  }

  return imageUrls.map((image, index) => ({
    id: index + 1,
    image,
  }));
}

function buildGridImages(images: { id: number; image: string }[]) {
  if (images.length >= 4) {
    return images.slice(0, 4);
  }

  const fallback = [...images];

  while (fallback.length < 4) {
    fallback.push(images[fallback.length % images.length] ?? defaultImages[fallback.length]);
  }

  return fallback.slice(0, 4);
}

export default function TourPhotoGallery({ imageUrls, imageAlt }: TourPhotoGalleryProps) {
  const [activeLightBox, setActiveLightBox] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const galleryImages = buildGalleryImages(imageUrls);
  const gridImages = buildGridImages(galleryImages);
  const galleryContent = tourSingleContent.gallery;
  const resolvedAlt = imageAlt || galleryContent.imageAltFallback;

  return (
    <>
      <div className='mt-30 tourSingleGrid -type-1'>
        <div className='tourSingleGrid__grid mobile-css-slider-2'>
          <Image width={1155} height={765} src={gridImages[0].image} alt={resolvedAlt} />
          <Image width={765} height={375} src={gridImages[1].image} alt={resolvedAlt} />
          <Image width={375} height={375} src={gridImages[2].image} alt={resolvedAlt} />
          <Image width={375} height={375} src={gridImages[3].image} alt={resolvedAlt} />
        </div>

        <div className='tourSingleGrid__button'>
          <div style={{ cursor: 'pointer' }} className='js-gallery' data-gallery='gallery1'>
            <span
              onClick={() => setActiveLightBox(true)}
              className='bg-dark-1 px-20 py-10 rounded-200 text-white -accent-1 button lh-16'
            >
              {galleryContent.seeAllPhotosLabel}
            </span>
          </div>
          {galleryImages.slice(1).map((image) => (
            <a key={image.id} href={image.image} className='js-gallery' data-gallery='gallery1'></a>
          ))}
        </div>
      </div>
      <ImageLightBox
        images={galleryImages}
        activeLightBox={activeLightBox}
        setActiveLightBox={setActiveLightBox}
        currentSlideIndex={currentSlideIndex}
        setCurrentSlideIndex={setCurrentSlideIndex}
      />
    </>
  );
}
