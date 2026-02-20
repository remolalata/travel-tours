import type { MetadataRoute } from 'next';

import { getSiteUrl } from '@/utils/seo';

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = getSiteUrl();

  return {
    name: 'Gr8 Escapes Travel & Tours',
    short_name: 'Gr8 Escapes',
    description: 'Book curated tours and travel packages with Gr8 Escapes Travel & Tours.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#E26625',
    icons: [
      {
        src: `${siteUrl}/favicon.ico`,
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
