import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';
import GetQuoteFormSection from '@/features/get-quote/components/sections/GetQuoteFormSection';

export const metadata = {
  title: 'Get a Quote | Gr8 Escapes Travel & Tours',
  description: 'Request a custom travel package quote from Gr8 Escapes Travel & Tours.',
};

export default function Page() {
  return (
    <main>
      <SiteHeader />
      <GetQuoteFormSection />
      <SiteFooter />
    </main>
  );
}
