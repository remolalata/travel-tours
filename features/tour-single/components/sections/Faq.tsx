'use client';

import { useEffect, useRef, useState } from 'react';

import type { FaqItem, TourContent } from '@/data/tourSingleContent';
import { defaultTourContent } from '@/data/tourSingleContent';

interface FaqProps {
  tourContent?: TourContent;
}

export default function Faq({ tourContent }: FaqProps) {
  const faqItems = tourContent?.faqItems || defaultTourContent.faqItems;
  const [currentActiveFaq, setCurrentActiveFaq] = useState(0);
  const [contentHeights, setContentHeights] = useState<number[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const updateHeights = () => {
      setContentHeights(contentRefs.current.map((node) => node?.scrollHeight || 0));
    };

    updateHeights();
    window.addEventListener('resize', updateHeights);

    return () => {
      window.removeEventListener('resize', updateHeights);
    };
  }, [faqItems]);

  return (
    <>
      {faqItems.map((elm: FaqItem, i) => (
        <div key={i} className='col-12'>
          <div
            className={`accordion__item px-20 py-15 border-1 rounded-12 ${
              currentActiveFaq == i ? 'is-active' : ''
            } `}
          >
            <div
              className='d-flex justify-between items-center accordion__button'
              onClick={() => setCurrentActiveFaq((previousValue) => (previousValue === i ? -1 : i))}
            >
              <div className='text-16 text-dark-1 button'>{elm.question}</div>

              <div className='flex-center bg-light-2 rounded-full size-30 accordion__icon'>
                <i className='icon-plus'></i>
                <i className='icon-minus'></i>
              </div>
            </div>

            <div
              className='accordion__content'
              style={currentActiveFaq === i ? { maxHeight: `${contentHeights[i] || 0}px` } : {}}
            >
              <div
                className='pt-20'
                ref={(node) => {
                  contentRefs.current[i] = node;
                }}
              >
                <p>{elm.answer}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
