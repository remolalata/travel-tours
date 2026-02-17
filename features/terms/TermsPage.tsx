import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';
import TermsContent from '@/components/terms/sections/TermsContent';
import TermsPageHeader from '@/components/terms/sections/TermsPageHeader';

export default function TermsPage() {
  return (
    <main>
      <SiteHeader />
      <TermsPageHeader />
      <TermsContent />
      <SiteFooter />
    </main>
  );
}
