'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

interface HeaderSearchProps {
  white?: boolean;
}

interface SearchItem {
  id: number;
  iconClass?: string;
  img?: string;
  title: string;
  location: string;
}

const searchData: SearchItem[] = [
  {
    id: 1,
    iconClass: 'icon-pin text-20',
    title: 'Boracay tour package',
    location: 'Philippines',
  },
  {
    id: 2,
    iconClass: 'icon-pin text-20',
    title: 'Thailand Tour package',
    location: 'Thailand',
  },
  {
    id: 3,
    iconClass: 'icon-pin text-20',
    title: 'Palawan tour package',
    location: 'Philippines',
  },
  {
    id: 4,
    iconClass: 'icon-pin text-20',
    title: 'Cebu and Bohol tour package',
    location: 'Philippines',
  },
  {
    id: 5,
    iconClass: 'icon-pin text-20',
    title: 'Siargao island hopping package',
    location: 'Philippines',
  },
  {
    id: 6,
    iconClass: 'icon-pin text-20',
    title: 'Batanes cultural tour package',
    location: 'Philippines',
  },
  {
    id: 7,
    iconClass: 'icon-pin text-20',
    title: 'Ilocos heritage tour package',
    location: 'Philippines',
  },
];

export default function HeaderSerch({ white = false }: HeaderSearchProps) {
  const [selected, setSelected] = useState<string>('');
  const [ddActive, setDdActive] = useState<boolean>(false);
  const dropDownContainer = useRef<HTMLDivElement | null>(null);

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
      <i className='icon-search text-18'></i>
      <input
        value={selected}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSelected(event.target.value)}
        onClick={() => setDdActive((previousValue) => !previousValue)}
        type='text'
        placeholder='Search destinations or activities'
        className={`js-search ${white ? 'text-white' : ''}`}
      />

      <div
        className={ddActive ? 'headerSearchRecent is-active' : 'headerSearchRecent'}
        data-x='headerSearch'
      >
        <div className='headerSearchRecent__container'>
          <div className='headerSearchRecent__title'>
            <h4 className='text-18 fw-500'>Recent Searches</h4>
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
                <div className='size-50 bg-white rounded-12 border-1 flex-center'>
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
                  <div className='lh-14 text-14 text-light-2'>{item.location}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
