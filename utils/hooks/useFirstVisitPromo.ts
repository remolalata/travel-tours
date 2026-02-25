'use client';

import { useCallback, useEffect, useState } from 'react';

const FIRST_VISIT_PROMO_KEY = 'travel-tours:first-visit-promo-seen';
const FIRST_VISIT_PROMO_DELAY_MS = 5000;

export default function useFirstVisitPromo() {
  const [isOpen, setIsOpen] = useState(false);

  const markPromoAsSeen = useCallback(() => {
    try {
      localStorage.setItem(FIRST_VISIT_PROMO_KEY, '1');
    } catch {
      // Ignore storage errors (private mode / blocked storage).
    }
  }, []);

  const closePromo = useCallback(() => {
    setIsOpen(false);
    markPromoAsSeen();
  }, [markPromoAsSeen]);

  useEffect(() => {
    let hasSeenPromo = false;

    try {
      hasSeenPromo = localStorage.getItem(FIRST_VISIT_PROMO_KEY) === '1';
    } catch {
      hasSeenPromo = false;
    }

    if (hasSeenPromo) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      markPromoAsSeen();
      setIsOpen(true);
    }, FIRST_VISIT_PROMO_DELAY_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [markPromoAsSeen]);

  return {
    isOpen,
    closePromo,
  };
}
