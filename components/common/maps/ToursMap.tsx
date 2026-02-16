'use client';

import {
  GoogleMap,
  InfoWindow,
  MarkerClusterer,
  MarkerF,
  useLoadScript,
} from '@react-google-maps/api';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import Stars from '@/components/common/Stars';
import type { TourFilterItem } from '@/data/tours';
import { tourDataThree } from '@/data/tours';
import {
  GOOGLE_MAP_CONTAINER_STYLE,
  GOOGLE_MAP_OPTIONS,
  GOOGLE_MAPS_API_KEY,
} from '@/utils/config/googleMapConfig';
import { formatNumber } from '@/utils/helpers/formatNumber';

type MappableTour = TourFilterItem & { lat: number; long: number };

export default function ToursMap() {
  const [selectedLocation, setSelectedLocation] = useState<MappableTour | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
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
        <GoogleMap
          mapContainerStyle={GOOGLE_MAP_CONTAINER_STYLE}
          center={center}
          zoom={4}
          options={GOOGLE_MAP_OPTIONS}
        >
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
