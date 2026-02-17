import { notFound } from 'next/navigation';

import { blogContent, getBlogPostBySlug } from '@/content/features/blog';
import BlogSinglePage from '@/features/blog/BlogSinglePage';

type BlogSingleRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogContent.posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: BlogSingleRouteProps) {
  const params = await props.params;
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: blogContent.metadata.single.title,
      description: blogContent.metadata.single.description,
    };
  }

  return {
    title: `${post.title} | ${blogContent.metadata.singleTitleSuffix}`,
    description: post.excerpt,
  };
}

export default async function Page(props: BlogSingleRouteProps) {
  const params = await props.params;
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return <BlogSinglePage post={post} />;
}
