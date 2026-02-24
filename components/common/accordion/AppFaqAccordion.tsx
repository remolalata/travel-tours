'use client';

import { useEffect, useRef, useState } from 'react';

import type { FaqItem } from '@/types/tourContent';

type AppFaqAccordionProps = {
  items: FaqItem[];
};

export default function AppFaqAccordion({ items }: AppFaqAccordionProps) {
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
  }, [items]);

  return (
    <>
      {items.map((item, index) => (
        <div key={`${item.question}-${index}`} className='col-12'>
          <div
            className={`accordion__item px-20 py-15 border rounded-12 ${
              currentActiveFaq == index ? 'is-active' : ''
            } `}
          >
            <div
              className='d-flex justify-between items-center accordion__button'
              onClick={() =>
                setCurrentActiveFaq((previousValue) => (previousValue === index ? -1 : index))
              }
            >
              <div className='text-16 text-dark-1 button'>{item.question}</div>

              <div className='flex-center bg-light-2 rounded-full size-30 accordion__icon'>
                <i className='icon-plus'></i>
                <i className='icon-minus'></i>
              </div>
            </div>

            <div
              className='accordion__content'
              style={
                currentActiveFaq === index ? { maxHeight: `${contentHeights[index] || 0}px` } : {}
              }
            >
              <div
                className='pt-20'
                ref={(node) => {
                  contentRefs.current[index] = node;
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: item.answer }} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
