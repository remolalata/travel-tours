'use client';

import { defaultTourContent } from '@/data/tourSingleContent';
import React, { useEffect, useRef, useState } from 'react';

export default function Faq({ tourContent }) {
  const faqItems = tourContent?.faqItems || defaultTourContent.faqItems;
  const [currentActiveFaq, setCurrentActiveFaq] = useState(0);
  const [contentHeights, setContentHeights] = useState([]);
  const contentRefs = useRef([]);

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
      {faqItems.map((elm, i) => (
        <div key={i} className='col-12'>
          <div
            className={`accordion__item px-20 py-15 border-1 rounded-12 ${
              currentActiveFaq == i ? 'is-active' : ''
            } `}
          >
            <div
              className='accordion__button d-flex items-center justify-between'
              onClick={() => setCurrentActiveFaq((pre) => (pre == i ? -1 : i))}
            >
              <div className='button text-16 text-dark-1'>{elm.question}</div>

              <div className='accordion__icon size-30 flex-center bg-light-2 rounded-full'>
                <i className='icon-plus'></i>
                <i className='icon-minus'></i>
              </div>
            </div>

            <div
              className='accordion__content'
              style={currentActiveFaq == i ? { maxHeight: `${contentHeights[i] || 0}px` } : {}}
            >
              <div className='pt-20' ref={(node) => (contentRefs.current[i] = node)}>
                <p>{elm.answer}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
