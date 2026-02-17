import BlogHero from '@/components/blog/sections/BlogHero';
import BlogListTwoSection from '@/components/blog/sections/BlogListTwoSection';
import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';

export default function BlogListPage() {
  return (
    <main>
      <SiteHeader />
      <BlogHero />
      <BlogListTwoSection />
      <SiteFooter />
    </main>
  );
}
