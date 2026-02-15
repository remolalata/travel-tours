'use client';

import Calender from '@/components/common/dropdownSearch/Calender';
import Location from '@/components/common/dropdownSearch/Location';
import TourType from '@/components/common/dropdownSearch/TourType';
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeSearchHero() {
  const router = useRouter();
  const [currentActiveDD, setCurrentActiveDD] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [tourType, setTourType] = useState<string>('');
  const dropDownContainer = useRef<HTMLDivElement | null>(null);

  const handleLocationChange: React.Dispatch<React.SetStateAction<string>> = (value) => {
    setLocation((previousValue) => (typeof value === 'function' ? value(previousValue) : value));
    setCurrentActiveDD('');
  };

  const handleTourTypeChange: React.Dispatch<React.SetStateAction<string>> = (value) => {
    setTourType((previousValue) => (typeof value === 'function' ? value(previousValue) : value));
    setCurrentActiveDD('');
  };

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const eventTarget = event.target;
      if (
        dropDownContainer.current &&
        eventTarget instanceof Node &&
        !dropDownContainer.current.contains(eventTarget)
      ) {
        setCurrentActiveDD('');
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <section className='hero -type-1'>
      <div className='hero__bg'>
        <Image
          width={1800}
          height={560}
          src='/img/hero.webp'
          alt='image'
          style={{ objectPosition: 'center bottom' }}
        />
        <Image
          width='1800'
          height='40'
          src='/img/hero/1/shape.svg'
          alt='image'
          style={{ height: 'auto' }}
        />
      </div>

      <div className='container'>
        <div className='row justify-center'>
          <div className='col-xl-8 col-lg-10'>
            <div className='hero__content'>
              <h1 data-aos={'fade-up'} data-aos-delay='100' className='hero__title'>
                Your Dream Destination, Made Hassle-Free
              </h1>

              <p data-aos={'fade-up'} data-aos-delay='300' className='hero__text'>
                From flights and hotels to tours and transfers, Gr8 Escapes Travel & Tours brings
                you complete travel packages for unforgettable local and international getaways.
              </p>

              <div
                ref={dropDownContainer}
                data-aos={'fade-up'}
                data-aos-delay='300'
                className='mt-60 md:mt-35'
              >
                <div className='searchForm -type-1'>
                  <div className='searchForm__form'>
                    <div className='searchFormItem js-select-control js-form-dd'>
                      <div
                        className='searchFormItem__button'
                        onClick={() =>
                          setCurrentActiveDD((previousValue) =>
                            previousValue === 'location' ? '' : 'location',
                          )
                        }
                      >
                        <div className='searchFormItem__icon size-50 rounded-12 border-1 flex-center'>
                          <i className='text-20 icon-pin'></i>
                        </div>
                        <div className='searchFormItem__content'>
                          <h5>Where</h5>
                          <div className='js-select-control-chosen'>
                            {location ? location : 'Search destinations'}
                          </div>
                        </div>
                      </div>

                      <Location
                        setLocation={handleLocationChange}
                        active={currentActiveDD === 'location'}
                      />
                    </div>

                    <div className='searchFormItem js-select-control js-form-dd js-calendar'>
                      <div
                        className='searchFormItem__button'
                        onClick={() =>
                          setCurrentActiveDD((previousValue) =>
                            previousValue === 'calender' ? '' : 'calender',
                          )
                        }
                      >
                        <div className='searchFormItem__icon size-50 rounded-12 border-1 flex-center'>
                          <i className='text-20 icon-calendar'></i>
                        </div>
                        <div className='searchFormItem__content'>
                          <h5>When</h5>
                          <div>
                            <span className='js-first-date'>
                              <Calender active={currentActiveDD === 'calender'} />
                            </span>
                            <span className='js-last-date'></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='searchFormItem js-select-control js-form-dd'>
                      <div
                        className='searchFormItem__button'
                        onClick={() =>
                          setCurrentActiveDD((previousValue) =>
                            previousValue === 'tourType' ? '' : 'tourType',
                          )
                        }
                      >
                        <div className='searchFormItem__icon size-50 rounded-12 border-1 flex-center'>
                          <i className='text-20 icon-flag'></i>
                        </div>
                        <div className='searchFormItem__content'>
                          <h5>Tour Type</h5>
                          <div className='js-select-control-chosen'>
                            {tourType ? tourType : 'All tour'}
                          </div>
                        </div>
                      </div>

                      <TourType
                        setTourType={handleTourTypeChange}
                        active={currentActiveDD === 'tourType'}
                      />
                    </div>
                  </div>

                  <div className='searchForm__button'>
                    <button
                      onClick={() => router.push('/tours')}
                      className='button -dark-1 bg-accent-1 text-white'
                    >
                      <i className='icon-search text-16 mr-10'></i>
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
