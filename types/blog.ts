export interface BlogMetadata {
  title: string;
  description: string;
}

export interface BlogHeroContent {
  defaultTitle: string;
  defaultDescription: string;
  backgroundImageSrc: string;
  shapeImageSrc: string;
}

export interface BlogTag {
  id: number;
  name: string;
  href: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  href: string;
}

export interface BlogGalleryItem {
  id: number;
  imageSrc: string;
  caption: string;
}

export interface BlogShareLink {
  id: number;
  iconClass: string;
  href: string;
  label: string;
}

export interface BlogAuthor {
  name: string;
  role: string;
  imageSrc: string;
  bio: string;
}

export interface BlogNavigationItem {
  slug: string;
  label: string;
  title: string;
}

export interface BlogReviewItem {
  id: number;
  reviewer: string;
  ratingLabel: string;
  publishedAt: string;
  message: string;
}

export interface BlogPostArticle {
  sectionTitle: string;
  introParagraphs: string[];
  bulletPoints: string[];
  quote: string;
  bodyParagraphs: string[];
  gallery: BlogGalleryItem[];
  shareLinks: BlogShareLink[];
  tags: BlogTag[];
  author: BlogAuthor;
  navigation: {
    previous: BlogNavigationItem;
    next: BlogNavigationItem;
  };
  reviewsTitle: string;
  reviewsCtaLabel: string;
  reviews: BlogReviewItem[];
  commentForm: {
    title: string;
    nameLabel: string;
    emailLabel: string;
    commentLabel: string;
    submitLabel: string;
  };
}

export interface BlogPost {
  id: number;
  slug: string;
  image: string;
  date: string;
  author: string;
  title: string;
  excerpt: string;
  badge?: string;
  continent?: string;
  article: BlogPostArticle;
}

export interface BlogSidebarRecentPost {
  id: number;
  slug: string;
  title: string;
  date: string;
  image: string;
}

export interface BlogListContent {
  readMoreLabel: string;
  authorPrefix: string;
  resultSummary: string;
  searchPlaceholder: string;
  categoriesTitle: string;
  recentPostsTitle: string;
  tagsTitle: string;
}

export interface BlogContent {
  metadata: {
    list: BlogMetadata;
    single: BlogMetadata;
    singleTitleSuffix: string;
  };
  hero: BlogHeroContent;
  list: BlogListContent;
  posts: BlogPost[];
  sidebar: {
    categories: BlogCategory[];
    tags: BlogTag[];
    recentPosts: BlogSidebarRecentPost[];
  };
}
