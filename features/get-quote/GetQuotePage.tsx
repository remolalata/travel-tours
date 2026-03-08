import { Suspense } from 'react';

import GetQuoteFormSection from '@/components/get-quote/sections/GetQuoteFormSection';
import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';

export default function GetQuotePage() {
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
