const DEFAULT_SITE_URL = 'http://localhost:3000';

export function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredUrl) {
    return DEFAULT_SITE_URL;
  }

  try {
    return new URL(configuredUrl).toString().replace(/\/$/, '');
  } catch {
    return DEFAULT_SITE_URL;
  }
}
