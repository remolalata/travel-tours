import { blogContent } from '@/content/features/blog';
import BlogListPage from '@/features/blog/BlogListPage';

export const metadata = {
  title: blogContent.metadata.list.title,
  description: blogContent.metadata.list.description,
};

export default function Page() {
  return <BlogListPage />;
}
