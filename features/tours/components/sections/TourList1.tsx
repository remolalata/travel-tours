'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef,useState } from 'react';

import Pagination from '@/components/common/Pagination';
import Stars from '@/components/common/Stars';
import { speedFeatures } from '@/data/tourFilteringOptions';
import { tourDataTwo } from '@/data/tours';
import { formatNumber } from '@/utils/helpers/formatNumber';

import Sidebar from './Sidebar';

export default function TourList1() {
  const [sortOption, setSortOption] = useState<string>('');
  const [ddActives, setDdActives] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const dropDownContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const eventTarget = event.target;
      if (
        dropDownContainer.current &&
        eventTarget instanceof Node &&
        !dropDownContainer.current.contains(eventTarget)
      ) {
        setDdActives(false);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
  return (
    <section className='layout-pb-xl'>
      <div className='container'>
        <div className='row'>
          <div className='col-xl-3 col-lg-4'>
            <div className='lg:d-none'>
              <Sidebar />
            </div>

            <div className='lg:d-flex mb-30 accordion d-none js-accordion'>
              <div className={`accordion__item col-12 ${sidebarActive ? 'is-active' : ''} `}>
                <button
                  className='bg-light-1 px-25 py-10 border-1 rounded-12 accordion__button button -dark-1'
                  onClick={() => setSidebarActive((pre) => !pre)}
                >
                  <i className='mr-10 text-16 icon-sort-down'></i>
                  Filter
                </button>

                <div
                  className='accordion__content'
                  style={sidebarActive ? { maxHeight: '2000px' } : {}}
                >
                  <div className='pt-20'>
                    <Sidebar />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='col-xl-9 col-lg-8'>
            <div className='justify-between y-gap-5 row'>
              <div className='col-auto'>
                <div>1362 results</div>
              </div>

              <div ref={dropDownContainer} className='col-auto'>
                <div
                  className={`dropdown -type-2 js-dropdown js-form-dd ${
                    ddActives ? 'is-active' : ''
                  } `}
                  data-main-value=''
                >
                  <div
                    className='dropdown__button js-button'
                    onClick={() => setDdActives((previousValue) => !previousValue)}
                  >
                    <span>Sort by: </span>
                    <span className='js-title'>{sortOption ? sortOption : 'Featured'}</span>
                    <i className='icon-chevron-down'></i>
                  </div>

                  <div className='dropdown__menu js-menu-items'>
                    {speedFeatures.map((elm, i) => (
                      <div
                        onClick={() => {
                          setSortOption((previousValue) => (previousValue === elm ? '' : elm));
                          setDdActives(false);
                        }}
                        key={i}
                        className='dropdown__item'
                        data-value='fast'
                      >
                        {elm}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className='y-gap-30 pt-30 row'>
              {tourDataTwo.map((elm, i) => (
                <div className='col-12' key={i}>
                  <div className='tourCard -type-2'>
                    <div className='tourCard__image'>
                      <Image width={420} height={390} src={elm.imageSrc} alt='image' />

                      {elm.badgeText && (
                        <div className='tourCard__badge'>
                          <div className='px-15 py-10 rounded-12 text-13 text-white bg-accent-1 lh-11'>
                            {elm.badgeText}
                          </div>
                        </div>
                      )}

                      {elm.featured && (
                        <div className='tourCard__badge'>
                          <div className='px-15 py-10 rounded-12 text-13 text-white bg-accent-2 lh-11'>
                            FEATURED
                          </div>
                        </div>
                      )}

                      <div className='tourCard__favorite'>
                        <button
                          className='flex-center bg-white rounded-full size-35 -accent-1 button'
                          aria-label='Add to favorites'
                          title='Add to favorites'
                        >
                          <i className='text-15 icon-heart'></i>
                        </button>
                      </div>
                    </div>

                    <div className='tourCard__content'>
                      <div className='tourCard__location'>
                        <i className='icon-pin'></i>
                        {elm.location}
                      </div>

                      <h3 className='mt-5 tourCard__title'>
                        <span>{elm.title}</span>
                      </h3>

                      <div className='d-flex items-center mt-5'>
                        <div className='d-flex items-center x-gap-5'>
                          <Stars star={elm.rating} font={12} />
                        </div>

                        <div className='ml-10 text-14'>
                          <span className='fw-500'>{elm.rating}</span> ({elm.ratingCount})
                        </div>
                      </div>

                      <p className='mt-5 tourCard__text'>{elm.description}</p>

                      <div className='x-gap-20 y-gap-5 pt-30 row'>
                        {elm.features?.map((elm2, i2) => (
                          <div key={i2} className='col-auto'>
                            <div className='text-14 text-accent-1'>
                              <i className={`${elm2.icon} mr-10`}></i>
                              {elm2.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className='tourCard__info'>
                      <div>
                        <div className='d-flex items-center text-14'>
                          <i className='mr-10 icon-clock'></i>
                          {elm.duration}
                        </div>

                        <div className='tourCard__price'>
                          <div>₱{formatNumber(elm.fromPrice)}</div>

                          <div className='d-flex items-center'>
                            From{' '}
                            <span className='ml-5 text-20 fw-500'>₱{formatNumber(elm.price)}</span>
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/tour/${elm.id}`}
                        className='-outline-accent-1 text-accent-1 button'
                      >
                        View Details
                        <i className='icon-arrow-top-right ml-10'></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='d-flex flex-column justify-center mt-60'>
              <Pagination />

              <div className='mt-20 text-14 text-center'>Showing results 1-30 of 1,415</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
