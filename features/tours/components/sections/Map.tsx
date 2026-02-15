'use client';

import { formatNumber } from '@/helpers/formatNumber';
import { tourDataThree } from '@/data/tours';
import type { TourFilterItem } from '@/data/tours';
import {
  GoogleMap,
  MarkerClusterer,
  useLoadScript,
  InfoWindow,
  MarkerF,
} from '@react-google-maps/api';
import { useMemo, useState } from 'react';
import Stars from '@/components/common/Stars';
import Image from 'next/image';
import Link from 'next/link';

const option = {
  zoomControl: true,
  disableDefaultUI: true,
  styles: [
    {
      featureType: 'all',
      elementType: 'geometry.fill',
      stylers: [
        {
          weight: '2.00',
        },
      ],
    },
    {
      featureType: 'all',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#9c9c9c',
        },
      ],
    },
    {
      featureType: 'all',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'landscape',
      elementType: 'all',
      stylers: [
        {
          color: '#f2f2f2',
        },
      ],
    },
    {
      featureType: 'landscape',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#ffffff',
        },
      ],
    },
    {
      featureType: 'landscape.man_made',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#ffffff',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'all',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'all',
      stylers: [
        {
          saturation: -100,
        },
        {
          lightness: 45,
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#eeeeee',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#7b7b7b',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#ffffff',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'all',
      stylers: [
        {
          visibility: 'simplified',
        },
      ],
    },
    {
      featureType: 'road.arterial',
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'transit',
      elementType: 'all',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'all',
      stylers: [
        {
          color: '#46bcec',
        },
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#c8d7d4',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#070707',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#ffffff',
        },
      ],
    },
  ],
  scrollwheel: true,
};

const containerStyle = {
  width: '100%',
  height: '100%',
};

type MappableTour = TourFilterItem & { lat: number; long: number };

export default function Map() {
  const [selectedLocation, setSelectedLocation] = useState<MappableTour | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAAz77U5XQuEME6TpftaMdX0bBelQxXRlM',
  });

  const center = useMemo(() => ({ lat: 27.411201277163975, lng: -96.12394824867293 }), []);

  const mappableTours = useMemo(
    () =>
      tourDataThree.filter(
        (tour): tour is MappableTour =>
          typeof tour.lat === 'number' && typeof tour.long === 'number',
      ),
    [],
  );

  const closeCardHandler = () => {
    setSelectedLocation(null);
  };

  return (
    <>
      {!isLoaded ? (
        <p>Loading...</p>
      ) : (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={4} options={option}>
          <MarkerClusterer>
            {(clusterer) => (
              <>
                {mappableTours.slice(0, 6).map((marker) => (
                  <MarkerF
                    key={marker.id}
                    position={{
                      lat: marker.lat,
                      lng: marker.long,
                    }}
                    clusterer={clusterer}
                    onClick={() => setSelectedLocation(marker)}
                  />
                ))}
              </>
            )}
          </MarkerClusterer>
          {selectedLocation !== null && (
            <InfoWindow
              position={{
                lat: selectedLocation.lat,
                lng: selectedLocation.long,
              }}
              onCloseClick={closeCardHandler}
            >
              <Link
                href={`/tour/${selectedLocation.id}`}
                className='tourCard -type-1 py-10 px-10 border-1 rounded-12  -hover-shadow'
              >
                <div className='tourCard__header'>
                  <div className='tourCard__image ratio ratio-28:20'>
                    <Image
                      width={421}
                      height={301}
                      src={selectedLocation.imageSrc}
                      alt='image'
                      className='img-ratio rounded-12'
                    />
                  </div>

                  <button
                    className='tourCard__favorite'
                    aria-label='Add to favorites'
                    title='Add to favorites'
                  >
                    <i className='icon-heart'></i>
                  </button>
                </div>

                <div className='tourCard__content px-10 pt-10'>
                  <div className='tourCard__location d-flex items-center text-13 text-light-2'>
                    <i className='icon-pin d-flex text-16 text-light-2 mr-5'></i>
                    {selectedLocation.location}
                  </div>

                  <h3 className='tourCard__title text-16 fw-500 mt-5'>
                    <span>{selectedLocation.title}</span>
                  </h3>

                  <div className='tourCard__rating d-flex items-center text-13 mt-5'>
                    <div className='d-flex x-gap-5'>
                      <Stars star={selectedLocation.rating} />
                    </div>

                    <span className='text-dark-1 ml-10'>
                      {selectedLocation.rating} ({selectedLocation.ratingCount})
                    </span>
                  </div>

                  <div className='d-flex justify-between items-center border-1-top text-13 text-dark-1 pt-10 mt-10'>
                    <div className='d-flex items-center'>
                      <i className='icon-clock text-16 mr-5'></i>
                      {selectedLocation.duration}
                    </div>

                    <div>
                      From{' '}
                      <span className='text-16 fw-500'>
                        ${formatNumber(selectedLocation.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
    </>
  );
}
