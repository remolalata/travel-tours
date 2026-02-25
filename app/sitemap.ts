import type { MetadataRoute } from 'next';

import { allTour } from '@/data/tours';
import { getSiteUrl } from '@/utils/seo';

const staticRoutes = [
  '/',
  '/about',
  '/contact',
  '/destinations',
  '/get-quote',
  '/help-center',
  '/tours',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : 0.7,
  }));

  const tourEntries: MetadataRoute.Sitemap = allTour.map((tour) => ({
    url: `${siteUrl}/tour/${tour.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticEntries, ...tourEntries];
}
