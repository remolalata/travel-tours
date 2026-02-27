'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';

import { headerSearchContent } from '@/content/shared/layoutHeaderSearch';
import { normalizeTourSearchTerm } from '@/services/tours/helpers/tourSearch';
import useToursSearchQuery from '@/services/tours/hooks/useToursSearchQuery';

interface HeaderSearchProps {
  white?: boolean;
}

export default function HeaderSerch({ white = false }: HeaderSearchProps) {
  const [selected, setSelected] = useState<string>('');
  const [ddActive, setDdActive] = useState<boolean>(false);
  const headerSearchInputId = useId();
  const dropDownContainer = useRef<HTMLDivElement | null>(null);
  const { labels } = headerSearchContent;
  const normalizedSearchTerm = normalizeTourSearchTerm(selected);
  const toursSearchQuery = useToursSearchQuery({
    searchTerm: normalizedSearchTerm,
    limit: 8,
  });

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const eventTarget = event.target;
      if (
        dropDownContainer.current &&
        eventTarget instanceof Node &&
        !dropDownContainer.current.contains(eventTarget)
      ) {
        setDdActive(false);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const searchResults = toursSearchQuery.data ?? [];

  return (
    <div ref={dropDownContainer} className='header__search js-liverSearch js-form-dd'>
      <i className='text-18 icon-search'></i>
      <label className='visually-hidden' htmlFor={headerSearchInputId}>
        {labels.inputLabel}
      </label>
      <input
        id={headerSearchInputId}
        value={selected}
        onChange={(event) => setSelected(event.target.value)}
        onClick={() => setDdActive((previousValue) => !previousValue)}
        type='text'
        placeholder={labels.inputPlaceholder}
        className={`js-search ${white ? 'text-white' : ''}`}
        autoComplete='off'
        autoCorrect='off'
        autoCapitalize='none'
        spellCheck={false}
      />

      <div
        className={ddActive ? 'headerSearchRecent is-active' : 'headerSearchRecent'}
        data-x='headerSearch'
      >
        <div className='headerSearchRecent__container'>
          <div className='headerSearchRecent__title'>
            <p className='text-18 fw-500'>
              {normalizedSearchTerm.length === 0 || searchResults.length === 0
                ? labels.emptySearchTitle
                : labels.searchResultsTitle}
            </p>
          </div>

          <div className='headerSearchRecent__list js-results'>
            {toursSearchQuery.isLoading && (
              <div className='headerSearchRecent__item'>
                <div className='text-14 text-light-2'>Loading tours...</div>
              </div>
            )}

            {!toursSearchQuery.isLoading &&
              searchResults.map((item) => (
                <Link
                  href={`/tour/${item.slug}`}
                  key={item.id}
                  onClick={() => {
                    setSelected(item.title);
                    setDdActive(false);
                  }}
                  className='headerSearchRecent__item js-search-option'
                  data-x-click='headerSearch'
                >
                  <div className='flex-center bg-white border rounded-12 size-50'>
                    <i className='icon-pin text-20'></i>
                  </div>
                  <div className='ml-10'>
                    <div className='fw-500 js-search-option-target'>{item.title}</div>
                    <div className='text-14 text-light-2 lh-14'>{item.location}</div>
                  </div>
                </Link>
              ))}

            {!toursSearchQuery.isLoading &&
              !toursSearchQuery.isError &&
              searchResults.length === 0 && (
                <div className='headerSearchRecent__item'>
                  <div className='text-14 text-light-2'>No available tours found.</div>
                </div>
              )}

            {toursSearchQuery.isError && (
              <div className='headerSearchRecent__item'>
                <div className='text-14 text-light-2'>
                  Unable to load tours right now. Please try again.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
