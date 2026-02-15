'use client';

import { defaultTourContent } from '@/data/tourSingleContent';
import type { ItineraryStep, TourContent } from '@/data/tourSingleContent';
import React, { useState } from 'react';

interface ItineraryRoadmapProps {
  tourContent?: TourContent;
}

export default function ItineraryRoadmap({ tourContent }: ItineraryRoadmapProps) {
  const itinerarySteps = tourContent?.itinerarySteps || defaultTourContent.itinerarySteps;
  const [activeRoadmap, setActiveRoadmap] = useState(2);
  return (
    <div className='roadmap roadMap2'>
      {itinerarySteps.map((elm: ItineraryStep, i) => (
        <div key={i} className='roadmap__item'>
          {elm.icon ? (
            <div
              className='roadmap__iconBig'
              onClick={() => setActiveRoadmap((previousValue) => (previousValue === i ? -1 : i))}
            >
              <i className={elm.icon}></i>
            </div>
          ) : (
            <div
              className='roadmap__icon'
              onClick={() => setActiveRoadmap((previousValue) => (previousValue === i ? -1 : i))}
            ></div>
          )}
          <div className='roadmap__wrap'>
            <div
              className='roadmap__title '
              onClick={() => setActiveRoadmap((previousValue) => (previousValue === i ? -1 : i))}
            >
              {elm.title}
            </div>
            {elm.content && (
              <div className={`roadmap__content ${activeRoadmap === i ? 'active' : ''} `}>
                {elm.content}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
