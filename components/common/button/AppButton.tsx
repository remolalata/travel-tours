'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

type AppButtonSize = 'sm' | 'md';
type AppButtonVariant = 'primary' | 'outline';

type AppButtonProps = {
  children: ReactNode;
  size?: AppButtonSize;
  variant?: AppButtonVariant;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function getSizeClass(size: AppButtonSize): string {
  if (size === 'sm') {
    return '-sm';
  }

  return '-md';
}

function getVariantClass(variant: AppButtonVariant): string {
  if (variant === 'outline') {
    return '-outline-accent-1 text-accent-1';
  }

  return '-dark-1 bg-accent-1 text-white';
}

export default function AppButton({
  children,
  size = 'md',
  variant = 'primary',
  className = '',
  type = 'button',
  ...buttonProps
}: AppButtonProps) {
  const classes = ['button', getSizeClass(size), getVariantClass(variant), className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
