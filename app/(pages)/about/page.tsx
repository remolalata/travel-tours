import { aboutContent } from '@/content/features/about';
import AboutPage from '@/features/about/AboutPage';

export const metadata = {
  title: aboutContent.metadata.title,
  description: aboutContent.metadata.description,
};

export default function Page() {
  return <AboutPage />;
}
