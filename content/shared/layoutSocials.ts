import type { CSSProperties } from 'react';

export interface SocialMediaLink {
  id: number;
  href: string;
  ariaLabel: string;
  className?: string;
  type?: 'tiktok-svg';
  style?: CSSProperties;
}

export const socialMediaLinks: SocialMediaLink[] = [
  {
    id: 1,
    className: 'icon-facebook',
    href: '#',
    ariaLabel: 'Facebook',
  },
  {
    id: 2,
    type: 'tiktok-svg',
    href: '#',
    ariaLabel: 'TikTok',
  },
];
