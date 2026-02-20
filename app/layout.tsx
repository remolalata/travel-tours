import '@/public/css/style.css';

import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';

import FirstVisitPromoModal from '@/components/common/FirstVisitPromoModal';
import MessengerButton from '@/components/common/MessengerButton';
import ScrollTopBehaviour from '@/components/common/ScrollTopBehavier';
import ScrollToTop from '@/components/common/ScrollToTop';
import Wrapper from '@/components/layout/Wrapper';
import { getSiteUrl } from '@/utils/seo';

const dmSans = localFont({
  src: [
    {
      path: './fonts/dm-sans/dm-sans-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/dm-sans/dm-sans-latin-400-italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/dm-sans/dm-sans-latin-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/dm-sans/dm-sans-latin-500-italic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: './fonts/dm-sans/dm-sans-latin-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/dm-sans/dm-sans-latin-700-italic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#E26625',
};

const siteUrl = getSiteUrl();
const siteName = 'Travel & Tours';
const defaultDescription = 'Book curated tours and travel packages with Travel & Tours.';
const logoUrl = `${siteUrl}/img/logo.svg`;

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteName,
  url: siteUrl,
  logo: logoUrl,
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  url: siteUrl,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Tours & Travel Packages`,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: siteName,
    description: defaultDescription,
    url: siteUrl,
    siteName,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};
// const inter = Inter({ subsets: ["latin"] });
if (typeof window !== 'undefined') {
  import('bootstrap');
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <script
          id='organization-jsonld'
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          id='website-jsonld'
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={dmSans.className}>
        <Wrapper>{children}</Wrapper>
        <FirstVisitPromoModal />
        <MessengerButton />
        <ScrollToTop />
        <ScrollTopBehaviour />
      </body>
    </html>
  );
}
