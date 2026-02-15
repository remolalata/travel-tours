import ScrollToTop from '@/components/common/ScrollToTop';
import MessengerButton from '@/components/common/MessengerButton';
import FirstVisitPromoModal from '@/components/common/FirstVisitPromoModal';
import '@/public/css/style.css';

import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import type { Viewport } from 'next';
import ScrollTopBehaviour from '@/components/common/ScrollTopBehavier';
import Wrapper from '@/components/layout/Wrapper';

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
};
// const inter = Inter({ subsets: ["latin"] });
if (typeof window !== 'undefined') {
  import('bootstrap');
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <head></head>
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
