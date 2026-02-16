'use client';

import { useState } from 'react';

interface PaginationProps {
  range?: number;
}

export default function Pagination({ range = 20 }: PaginationProps) {
  const [activeIndex, setActiveIndex] = useState<number>(1);
  return (
    <div className='justify-center pagination'>
      <button
        onClick={() => setActiveIndex((pre) => (pre > 1 ? pre - 1 : 1))}
        className='mr-15 -accent-1 pagination__button customStylePaginationPre button -prev'
      >
        <i className='icon-arrow-left text-15'></i>
      </button>

      <div className='pagination__count'>
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => setActiveIndex(1)}
          className={activeIndex == 1 ? `is-active` : ''}
        >
          1
        </div>
        {range > 1 && (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveIndex(2)}
            className={activeIndex == 2 ? `is-active` : ''}
          >
            2
          </div>
        )}
        {range > 2 && (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveIndex(3)}
            className={activeIndex == 3 ? `is-active` : ''}
          >
            3
          </div>
        )}
        {range > 3 && (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveIndex(4)}
            className={activeIndex == 4 ? `is-active` : ''}
          >
            4
          </div>
        )}

        {activeIndex == 5 && range != 5 && (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveIndex(5)}
            className={activeIndex == 5 ? `is-active` : ''}
          >
            5
          </div>
        )}

        {range > 5 && <div>...</div>}
        {activeIndex > 5 && activeIndex < range && (
          <div style={{ cursor: 'pointer' }} className='is-active'>
            {activeIndex}
          </div>
        )}
        {range > 4 && (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveIndex(range)}
            className={activeIndex == range ? `is-active` : ''}
          >
            {range}
          </div>
        )}
      </div>

      <button
        onClick={() => setActiveIndex((pre) => (pre < range ? pre + 1 : pre))}
        className='ml-15 -accent-1 pagination__button customStylePaginationNext button -next'
      >
        <i className='icon-arrow-right text-15'></i>
      </button>
    </div>
  );
}
