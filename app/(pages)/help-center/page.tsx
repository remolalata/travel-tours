import { helpCenterPageContent } from '@/content/features/help-center';
import HelpCenterPage from '@/features/help-center/HelpCenterPage';

export const metadata = {
  title: helpCenterPageContent.metadata.title,
  description: helpCenterPageContent.metadata.description,
};

export default function Page() {
  return <HelpCenterPage />;
}
