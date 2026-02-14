import ScrollToTop from '@/components/common/ScrollToTop';
import MessengerButton from '@/components/common/MessengerButton';
import FirstVisitPromoModal from '@/components/common/FirstVisitPromoModal';
import '../public/css/style.css';

import { DM_Sans } from 'next/font/google';
import ScrollTopBehaviour from '@/components/common/ScrollTopBehavier';
import Wrapper from '@/components/layout/Wrapper';
const dmsans = DM_Sans({
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};
// const inter = Inter({ subsets: ["latin"] });
if (typeof window !== 'undefined') {
  import('bootstrap');
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head></head>
      <body className={dmsans.className}>
        <Wrapper>{children}</Wrapper>
        <FirstVisitPromoModal />
        <MessengerButton />
        <ScrollToTop />
        <ScrollTopBehaviour />
      </body>
    </html>
  );
}
