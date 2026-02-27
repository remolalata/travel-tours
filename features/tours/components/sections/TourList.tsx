'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

import Pagination from '@/components/common/Pagination';
import Stars from '@/components/common/Stars';
import { speedFeatures } from '@/data/tourFilteringOptions';
import useToursListFilters from '@/features/tours/hooks/useToursListFilters';
import useToursListQuery from '@/services/tours/hooks/useToursListQuery';
import type { PaginatedToursList } from '@/services/tours/mutations/tourApi';
import { formatNumber } from '@/utils/helpers/formatNumber';

import Sidebar from './Sidebar';

type TourListProps = {
  initialToursPage: PaginatedToursList;
};

export default function TourList({ initialToursPage }: TourListProps) {
  const [sortOption, setSortOption] = useState<string>('');
  const [ddActives, setDdActives] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [page, setPage] = useState(0);
  const {
    selectedTourTypeIds,
    priceRangeDraft,
    toggleTourType,
    setPriceRangeDraft,
    commitPriceRange,
    queryFilters,
  } = useToursListFilters();
  const dropDownContainer = useRef<HTMLDivElement | null>(null);
  const toursQuery = useToursListQuery(
    { page, pageSize: initialToursPage.pageSize || 8, ...queryFilters },
    {
      initialData:
        page === 0 &&
        selectedTourTypeIds.length === 0 &&
        queryFilters.minPrice === undefined &&
        queryFilters.maxPrice === undefined
          ? initialToursPage
          : undefined,
    },
  );
  const pageSize = toursQuery.data?.pageSize ?? initialToursPage.pageSize ?? 8;
  const totalResults = toursQuery.data?.total ?? initialToursPage.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  const currentPage = page + 1;
  const tours = useMemo(() => {
    if ((toursQuery.data?.rows?.length ?? 0) > 0) {
      return toursQuery.data!.rows;
    }

    return [];
  }, [toursQuery.data]);
  const showingStart = totalResults === 0 ? 0 : page * pageSize + 1;
  const showingEnd = Math.min(totalResults, page * pageSize + tours.length);
  const handleToggleTourType = (tourTypeId: number) => {
    setPage(0);
    toggleTourType(tourTypeId);
  };
  const handlePriceRangeCommit = (nextPriceRange: [number, number]) => {
    setPage(0);
    commitPriceRange(nextPriceRange);
  };

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
              <Sidebar
                selectedTourTypeIds={selectedTourTypeIds}
                onToggleTourType={handleToggleTourType}
                priceRange={priceRangeDraft}
                onPriceRangeChange={setPriceRangeDraft}
                onPriceRangeCommit={handlePriceRangeCommit}
              />
            </div>

            <div className='lg:d-flex mb-30 accordion d-none js-accordion'>
              <div className={`accordion__item col-12 ${sidebarActive ? 'is-active' : ''} `}>
                <button
                  className='bg-light-1 px-25 py-10 border rounded-12 accordion__button button -dark-1'
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
                    <Sidebar
                      selectedTourTypeIds={selectedTourTypeIds}
                      onToggleTourType={handleToggleTourType}
                      priceRange={priceRangeDraft}
                      onPriceRangeChange={setPriceRangeDraft}
                      onPriceRangeCommit={handlePriceRangeCommit}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='col-xl-9 col-lg-8'>
            <div className='justify-between y-gap-5 row'>
              <div className='col-auto'>
                <div>{totalResults} results</div>
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
              {tours.map((elm, i) => (
                <div className='col-12' key={elm.id ?? i}>
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
                      <div className='d-flex items-center text-13 text-light-2 tourCard__location'>
                        <i className='d-flex mr-5 text-16 text-light-2 icon-pin'></i>
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
                          {elm.fromPrice > elm.price ? (
                            <>
                              <div className='tourCard__priceOld'>
                                ₱{formatNumber(elm.fromPrice)}
                              </div>

                              <div className='d-flex items-center tourCard__priceCurrent'>
                                From{' '}
                                <span className='ml-5 text-20 fw-500'>
                                  ₱{formatNumber(elm.price)}
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className='tourCard__priceCurrentOnly'>
                              <span className='text-20 fw-500'>₱{formatNumber(elm.price)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/tour/${'slug' in elm && elm.slug ? elm.slug : elm.id}`}
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

            {totalResults > 0 ? (
              <div className='d-flex flex-column justify-center mt-60'>
                <Pagination
                  range={totalPages}
                  page={currentPage}
                  onPageChange={(nextPage) => {
                    setPage(nextPage - 1);
                  }}
                />

                <div className='mt-20 text-14 text-center'>
                  Showing results {showingStart}-{showingEnd} of {totalResults}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
