import { termsPageContent } from '@/content/features/terms';
import TermsPage from '@/features/terms/TermsPage';

export const metadata = {
  title: termsPageContent.metadata.title,
  description: termsPageContent.metadata.description,
};

export default function Page() {
  return <TermsPage />;
}
