'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type FadeInTag = 'div' | 'h1' | 'h2' | 'h3' | 'p' | 'span';

interface FadeInProps {
  as?: FadeInTag;
  className?: string;
  children: ReactNode;
  delay?: number;
  amount?: number;
  margin?: string;
}

export default function FadeIn({
  as = 'div',
  className,
  children,
  delay = 0,
  amount = 0.45,
  margin = '0px 0px -8% 0px',
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();
  const offsetY = shouldReduceMotion ? 0 : 24;

  const animationProps = {
    className,
    initial: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: offsetY },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount, margin },
    transition: { duration: shouldReduceMotion ? 0 : 0.45, delay: shouldReduceMotion ? 0 : delay },
  };

  if (as === 'h1') {
    return <motion.h1 {...animationProps}>{children}</motion.h1>;
  }

  if (as === 'h2') {
    return <motion.h2 {...animationProps}>{children}</motion.h2>;
  }

  if (as === 'h3') {
    return <motion.h3 {...animationProps}>{children}</motion.h3>;
  }

  if (as === 'p') {
    return <motion.p {...animationProps}>{children}</motion.p>;
  }

  if (as === 'span') {
    return <motion.span {...animationProps}>{children}</motion.span>;
  }

  return <motion.div {...animationProps}>{children}</motion.div>;
}
