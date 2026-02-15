'use client';

import React from 'react';

interface StarsProps {
  star: number | string | null | undefined;
  font?: number | string;
}

export default function Stars({ star, font }: StarsProps) {
  const ratingCount = Math.max(0, Math.round(Number(star) || 0));

  return (
    <>
      {Array.from({ length: ratingCount }).map((_, i) => (
        <div key={i}>
          <i className={`icon-star text-${font ? font : '10'} text-yellow-2`}></i>
        </div>
      ))}
    </>
  );
}
