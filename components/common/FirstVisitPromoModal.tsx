'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import type { MouseEvent } from 'react';
import useFirstVisitPromo from '@/hooks/useFirstVisitPromo';

export default function FirstVisitPromoModal() {
  const { isOpen, closePromo } = useFirstVisitPromo();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const onDocumentKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePromo();
      }
    };

    document.body.classList.add('promoModal-open');
    document.addEventListener('keydown', onDocumentKeyDown);

    return () => {
      document.body.classList.remove('promoModal-open');
      document.removeEventListener('keydown', onDocumentKeyDown);
    };
  }, [isOpen, closePromo]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className='promoModal'
      onClick={(event: MouseEvent<HTMLDivElement>) =>
        event.target === event.currentTarget && closePromo()
      }
    >
      <div
        className='promoModal__dialog'
        role='dialog'
        aria-modal='true'
        aria-labelledby='first-visit-promo-title'
      >
        <button
          type='button'
          className='promoModal__close'
          aria-label='Close first-time visitor promo'
          onClick={closePromo}
        >
          <span aria-hidden='true'>×</span>
        </button>

        <p className='promoModal__eyebrow'>Welcome to Gr8 Escapes</p>
        <h2 id='first-visit-promo-title' className='promoModal__title'>
          First-Time Visitor Promo
        </h2>
        <p className='promoModal__text'>
          Get <strong>10% OFF</strong> your first booking inquiry. Mention code{' '}
          <strong>FIRST10</strong> when you message us.
        </p>

        <div className='promoModal__actions'>
          <Link
            href='/tours'
            className='button -md -dark-1 bg-accent-1 text-white'
            onClick={closePromo}
          >
            Explore Tours
          </Link>
          <button
            type='button'
            className='button -md -outline-accent-1 text-accent-1'
            onClick={closePromo}
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
