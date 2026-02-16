'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';

import { headerSearchContent } from '@/content/shared/layoutHeaderSearch';

interface HeaderSearchProps {
  white?: boolean;
}

export default function HeaderSerch({ white = false }: HeaderSearchProps) {
  const [selected, setSelected] = useState<string>('');
  const [ddActive, setDdActive] = useState<boolean>(false);
  const headerSearchInputId = useId();
  const dropDownContainer = useRef<HTMLDivElement | null>(null);
  const { labels, searchData } = headerSearchContent;

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

  const filteredSearchData = searchData.filter((item) =>
    item.title.toLowerCase().includes(selected.toLowerCase()),
  );

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
      />

      <div
        className={ddActive ? 'headerSearchRecent is-active' : 'headerSearchRecent'}
        data-x='headerSearch'
      >
        <div className='headerSearchRecent__container'>
          <div className='headerSearchRecent__title'>
            <p className='text-18 fw-500'>{labels.recentSearchesTitle}</p>
          </div>

          <div className='headerSearchRecent__list js-results'>
            {filteredSearchData.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelected(item.title);
                  setDdActive(false);
                }}
                className='headerSearchRecent__item js-search-option'
                data-x-click='headerSearch'
              >
                <div className='flex-center bg-white border rounded-12 size-50'>
                  {item.iconClass && <i className={item.iconClass}></i>}
                  {item.img && (
                    <Image
                      width={50}
                      height={50}
                      src={item.img}
                      alt='image'
                      className='rounded-12'
                    />
                  )}
                </div>
                <div className='ml-10'>
                  <div className='fw-500 js-search-option-target'>{item.title}</div>
                  <div className='text-14 text-light-2 lh-14'>{item.location}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
