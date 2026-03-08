'use client';

import { Filter } from 'lucide-react';
import type { MouseEvent } from 'react';

type AdminFiltersTriggerButtonProps = {
  ariaLabel: string;
  isOpen: boolean;
  hasActiveFilters: boolean;
  onClick: (event: MouseEvent<HTMLElement>) => void;
};

export default function AdminFiltersTriggerButton({
  ariaLabel,
  isOpen,
  hasActiveFilters,
  onClick,
}: AdminFiltersTriggerButtonProps) {
  return (
    <button
      type='button'
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      aria-haspopup='dialog'
      className='d-inline-flex justify-center items-center bg-white border rounded-12'
      style={{
        width: '44px',
        height: '44px',
        borderColor: hasActiveFilters ? '#05073c' : '#e8edf5',
        color: '#05073c',
        backgroundColor: hasActiveFilters ? 'rgba(5, 7, 60, 0.06)' : '#fff',
      }}
      onClick={onClick}
    >
      <Filter size={18} strokeWidth={2} aria-hidden='true' />
    </button>
  );
}
