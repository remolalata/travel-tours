import { contactPageContent } from '@/content/features/contact';
import ContactPage from '@/features/contact/ContactPage';

export const dynamic = 'force-static';

export const metadata = {
  title: contactPageContent.metadata.title,
  description: contactPageContent.metadata.description,
};

export default function Page() {
  return <ContactPage />;
}
