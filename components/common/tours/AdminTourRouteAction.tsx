'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';

import useAdminViewerTourActions from '@/utils/hooks/tours/useAdminViewerTourActions';

type AdminTourRouteActionMode = 'edit' | 'view';

type AdminTourRouteActionProps = {
  mode: AdminTourRouteActionMode;
  tourId: number;
  publicRouteValue?: string | number | null;
  label: string;
  compact?: boolean;
  className?: string;
  style?: CSSProperties;
};

const compactStylesByMode: Record<AdminTourRouteActionMode, CSSProperties> = {
  edit: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 10,
    border: '1px solid rgba(5, 7, 60, 0.08)',
    background: '#fff',
    color: '#05073c',
    boxShadow: '0 10px 24px rgba(5, 7, 60, 0.08)',
  },
  view: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 10,
    border: '1px solid rgba(235, 102, 43, 0.16)',
    background: '#fff',
    color: 'var(--color-accent-1)',
    boxShadow: '0 10px 24px rgba(5, 7, 60, 0.08)',
  },
};

const iconClassByMode: Record<AdminTourRouteActionMode, string> = {
  edit: 'icon-pencil text-14',
  view: 'icon-arrow-top-right text-14',
};

export default function AdminTourRouteAction({
  mode,
  tourId,
  publicRouteValue,
  label,
  compact = false,
  className,
  style,
}: AdminTourRouteActionProps) {
  const { isAdminViewer, editHref, viewHref } = useAdminViewerTourActions({
    tourId,
    publicRouteValue,
  });

  if (!isAdminViewer) {
    return null;
  }

  const href = mode === 'edit' ? editHref : viewHref;

  if (!href) {
    return null;
  }

  if (compact) {
    return (
      <Link
        href={href}
        aria-label={label}
        title={label}
        className={className}
        style={{ ...compactStylesByMode[mode], ...style }}
      >
        <i className={iconClassByMode[mode]} aria-hidden='true'></i>
      </Link>
    );
  }

  return (
    <Link href={href} className={className} style={style}>
      {label}
      <i
        className={`${mode === 'edit' ? 'icon-pencil' : 'icon-arrow-top-right'} ml-10 text-16`}
        aria-hidden='true'
      ></i>
    </Link>
  );
}
