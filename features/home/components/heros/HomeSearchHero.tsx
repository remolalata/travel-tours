'use client';

import Calender from '@/components/common/dropdownSearch/Calender';
import Location from '@/components/common/dropdownSearch/Location';
import TourType from '@/components/common/dropdownSearch/TourType';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeSearchHero() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [currentActiveDD, setCurrentActiveDD] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [tourType, setTourType] = useState<string>('');
  const dropDownContainer = useRef<HTMLDivElement | null>(null);
  const baseDuration = shouldReduceMotion ? 0 : 0.45;
  const viewport = { once: true, amount: 0.35 as const };

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
              <motion.h1
                className='hero__title'
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ duration: baseDuration, delay: shouldReduceMotion ? 0 : 0.1 }}
              >
                Your Dream Destination, Made Hassle-Free
              </motion.h1>

              <motion.p
                className='hero__text'
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ duration: baseDuration, delay: shouldReduceMotion ? 0 : 0.2 }}
              >
                From flights and hotels to tours and transfers, Gr8 Escapes Travel & Tours brings
                you complete travel packages for unforgettable local and international getaways.
              </motion.p>

              <motion.div
                ref={dropDownContainer}
                className='mt-60 md:mt-35'
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ duration: baseDuration, delay: shouldReduceMotion ? 0 : 0.3 }}
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
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
