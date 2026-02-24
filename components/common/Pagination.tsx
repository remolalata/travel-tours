'use client';

import { useState } from 'react';

interface PaginationProps {
  range?: number;
  page?: number;
  onPageChange?: (page: number) => void;
}

function clampPage(page: number, range: number): number {
  return Math.max(1, Math.min(page, range));
}

export default function Pagination({ range = 20, page, onPageChange }: PaginationProps) {
  const normalizedRange = Math.max(1, range);
  const isControlled = typeof page === 'number' && typeof onPageChange === 'function';
  const [internalPage, setInternalPage] = useState<number>(1);
  const activeIndex = isControlled
    ? clampPage(page, normalizedRange)
    : clampPage(internalPage, normalizedRange);

  const setPage = (nextPage: number) => {
    const clampedPage = clampPage(nextPage, normalizedRange);
    if (isControlled) {
      onPageChange(clampedPage);
      return;
    }
    setInternalPage(clampedPage);
  };

  return (
    <div className='justify-center pagination'>
      <button
        onClick={() => setPage(activeIndex - 1)}
        className='mr-15 -accent-1 pagination__button customStylePaginationPre button -prev'
      >
        <i className='icon-arrow-left text-15'></i>
      </button>

      <div className='pagination__count'>
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => setPage(1)}
          className={activeIndex == 1 ? `is-active` : ''}
        >
          1
        </div>
        {range > 1 && (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => setPage(2)}
            className={activeIndex == 2 ? `is-active` : ''}
          >
            2
          </div>
        )}
        {range > 2 && (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => setPage(3)}
            className={activeIndex == 3 ? `is-active` : ''}
          >
            3
          </div>
        )}
        {range > 3 && (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => setPage(4)}
            className={activeIndex == 4 ? `is-active` : ''}
          >
            4
          </div>
        )}

        {activeIndex == 5 && range != 5 && (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => setPage(5)}
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
            onClick={() => setPage(normalizedRange)}
            className={activeIndex == normalizedRange ? `is-active` : ''}
          >
            {normalizedRange}
          </div>
        )}
      </div>

      <button
        onClick={() => setPage(activeIndex + 1)}
        className='ml-15 -accent-1 pagination__button customStylePaginationNext button -next'
      >
        <i className='icon-arrow-right text-15'></i>
      </button>
    </div>
  );
}
