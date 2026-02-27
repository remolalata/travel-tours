import type { MetadataRoute } from 'next';

import { getSiteUrl } from '@/utils/seo';
import { createClient } from '@/utils/supabase/server';

const staticRoutes = [
  '/',
  '/about',
  '/contact',
  '/get-quote',
  '/help-center',
  '/tours',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : 0.7,
  }));

  let tourEntries: MetadataRoute.Sitemap = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('tours')
      .select('slug,id')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .order('id', { ascending: false });

    tourEntries = (data ?? []).map((tour) => ({
      url: `${siteUrl}/tour/${tour.slug ?? tour.id}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch {
    tourEntries = [];
  }

  return [...staticEntries, ...tourEntries];
}
