'use client';

import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import Aos from 'aos';

export default function Wrapper({ children }: { children: ReactNode }) {
  useEffect(() => {
    Aos.init({
      duration: 800,
      once: true,
    });
  }, []);
  return <>{children}</>;
}
