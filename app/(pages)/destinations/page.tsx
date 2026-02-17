import { destinationsPageContent } from '@/content/features/destinations';
import DestinationsPage from '@/features/destinations/DestinationsPage';

export const metadata = {
  title: destinationsPageContent.metadata.title,
  description: destinationsPageContent.metadata.description,
};

export default function Page() {
  return <DestinationsPage />;
}
