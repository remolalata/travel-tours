import BlogHero from '@/components/blog/sections/BlogHero';
import BlogSingleSection from '@/components/blog/sections/BlogSingleSection';
import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';
import type { BlogPost } from '@/types/blog';

type BlogSinglePageProps = {
  post: BlogPost;
};

export default function BlogSinglePage({ post }: BlogSinglePageProps) {
  return (
    <main>
      <SiteHeader />
      <BlogHero post={post} />
      <BlogSingleSection post={post} />
      <SiteFooter />
    </main>
  );
}
