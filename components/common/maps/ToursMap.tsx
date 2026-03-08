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
import type { TourBase } from '@/types/tour';
import {
  GOOGLE_MAP_CONTAINER_STYLE,
  GOOGLE_MAP_OPTIONS,
  GOOGLE_MAPS_API_KEY,
} from '@/utils/config/googleMapConfig';
import { formatNumber } from '@/utils/helpers/formatNumber';

type MappableTour = TourBase & { slug?: string | null; lat: number; long: number };

type ToursMapProps = {
  tours?: MappableTour[];
};

export default function ToursMap({ tours = [] }: ToursMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<MappableTour | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const center = useMemo(() => ({ lat: 27.411201277163975, lng: -96.12394824867293 }), []);

  const mappableTours = useMemo(
    () =>
      tours.filter(
        (tour): tour is MappableTour =>
          typeof tour.lat === 'number' && typeof tour.long === 'number',
      ),
    [tours],
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
                href={`/tour/${selectedLocation.slug ?? selectedLocation.id}`}
                className='-hover-shadow px-10 py-10 border rounded-12 tourCard -type-1'
              >
                <div className='tourCard__header'>
                  <div className='tourCard__image ratio ratio-28:20'>
                    <Image
                      width={421}
                      height={301}
                      src={selectedLocation.imageSrc}
                      alt='image'
                      className='rounded-12 img-ratio'
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

                <div className='px-10 pt-10 tourCard__content'>
                  <div className='d-flex items-center text-13 text-light-2 tourCard__location'>
                    <i className='d-flex mr-5 text-16 text-light-2 icon-pin'></i>
                    {selectedLocation.location}
                  </div>

                  <h3 className='mt-5 text-16 tourCard__title fw-500'>
                    <span>{selectedLocation.title}</span>
                  </h3>

                  <div className='d-flex items-center mt-5 text-13 tourCard__rating'>
                    <div className='d-flex x-gap-5'>
                      <Stars star={selectedLocation.rating} />
                    </div>

                    <span className='ml-10 text-dark-1'>
                      {selectedLocation.rating} ({selectedLocation.ratingCount})
                    </span>
                  </div>

                  <div className='d-flex justify-between items-center mt-10 pt-10 border-top text-13 text-dark-1'>
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
