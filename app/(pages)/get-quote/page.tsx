import { Suspense } from 'react';

import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';
import GetQuoteFormSection from '@/features/get-quote/components/sections/GetQuoteFormSection';

export const metadata = {
  title: 'Get a Quote | Travel & Tours',
  description: 'Request a custom travel package quote from Travel & Tours.',
};

export default function Page() {
  return (
    <main>
      <SiteHeader />
      <Suspense
        fallback={<div className='layout-pt-lg layout-pb-lg container'>Loading form...</div>}
      >
        <GetQuoteFormSection />
      </Suspense>
      <SiteFooter />
    </main>
  );
}
