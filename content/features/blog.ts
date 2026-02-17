import type { BlogContent, BlogPost } from '@/types/blog';

const sharedArticle = {
  sectionTitle: 'The Brazen Head',
  introParagraphs: [
    'Sed viverra ipsum nunc aliquet bibendum enim facilisis gravida. Diam phasellus vestibulum lorem sed risus ultricies. Magna sit amet purus gravida quis blandit.',
    'Arcu cursus vitae congue mauris. Nunc mattis enim ut tellus elementum sagittis vitae et leo. Semper risus in hendrerit gravida rutrum quisque non.',
  ],
  bulletPoints: [
    'Sed viverra ipsum nunc aliquet bibendum enim facilisis gravida.',
    'At urna condimentum mattis pellentesque id nibh. Laoreet non curabitur.',
    'Magna etiam tempor orci eu lobortis elementum.',
    'Bibendum est ultricies integer quis. Semper eget duis at tellus.',
  ],
  quote:
    'Sed viverra ipsum nunc aliquet bibendum enim facilisis gravida. Diam phasellus vestibulum lorem sed risus ultricies. Magna sit amet purus gravida quis blandit. Arcu cursus vitae congue mauris.',
  bodyParagraphs: [
    'Donec purus posuere nullam lacus aliquam egestas arcu. A egestas a, tellus massa, ornare vulputate. Erat enim eget laoreet ullamcorper lectus aliquet nullam tempus id.',
    'Dignissim convallis quam aliquam rhoncus, lectus nullam viverra. Bibendum dignissim tortor, phasellus pellentesque commodo, turpis vel eu. Donec consectetur ipsum nibh lobortis elementum mus velit tincidunt elementum.',
  ],
  gallery: [
    {
      id: 1,
      imageSrc: '/img/blogSingle/1.png',
      caption: 'Donec purus posuere nullam lacus aliquam.',
    },
    {
      id: 2,
      imageSrc: '/img/blogSingle/2.png',
      caption: 'Donec purus posuere nullam lacus aliquam.',
    },
  ],
  shareLinks: [
    { id: 1, iconClass: 'icon-facebook text-14', href: '#', label: 'Share on Facebook' },
    { id: 2, iconClass: 'icon-twitter text-14', href: '#', label: 'Share on Twitter' },
    { id: 3, iconClass: 'icon-instagram text-14', href: '#', label: 'Share on Instagram' },
    { id: 4, iconClass: 'icon-linkedin text-14', href: '#', label: 'Share on LinkedIn' },
  ],
  tags: [
    { id: 1, name: 'Adventure', href: '/blog' },
    { id: 2, name: 'Nature', href: '/blog' },
    { id: 3, name: 'Culture', href: '/blog' },
  ],
  author: {
    name: 'Brooklyn Simmons',
    role: 'Medical Assistant',
    imageSrc: '/img/blogSingle/3.png',
    bio: 'Etiam vitae leo et diam pellentesque porta. Sed eleifend ultricies risus, vel rutrum erat commodo ut. Praesent finibus congue euismod.',
  },
  navigation: {
    previous: {
      slug: 'beauty-of-wildlife-safari-perspective',
      label: 'Prev',
      title: 'The Beauty of Wildlife: A Safari Perspective',
    },
    next: {
      slug: 'kenya-vs-tanzania-safari-experience',
      label: 'Next',
      title: 'Kenya vs Tanzania Safari: The Better African Safari Experience',
    },
  },
  reviewsTitle: 'Customer Reviews',
  reviewsCtaLabel: 'See more reviews',
  reviews: [
    {
      id: 1,
      reviewer: 'Cameron Williamson',
      ratingLabel: '5.0 Excellent',
      publishedAt: 'April 14 2023',
      message: 'Nibh vel aliquet lectus proin nibh nisl condimentum id. Tellus id interdum velit laoreet id donec ultrices tincidunt.',
    },
    {
      id: 2,
      reviewer: 'Kristin Watson',
      ratingLabel: '4.8 Great',
      publishedAt: 'April 18 2023',
      message: 'Praesent elementum facilisis leo vel fringilla est ullamcorper eget nulla. Dictumst quisque sagittis purus sit amet volutpat consequat.',
    },
  ],
  commentForm: {
    title: 'Leave a Reply',
    nameLabel: 'Name',
    emailLabel: 'Email',
    commentLabel: 'Write a comment',
    submitLabel: 'Post Comment',
  },
};

export const blogContent: BlogContent = {
  metadata: {
    list: {
      title: 'Blog | Gr8 Escapes Travel & Tours',
      description: 'Travel guides, destination stories, and tips from Gr8 Escapes.',
    },
    single: {
      title: 'Blog Article | Gr8 Escapes Travel & Tours',
      description: 'Detailed travel stories and destination insights.',
    },
    singleTitleSuffix: 'Gr8 Escapes Travel & Tours',
  },
  hero: {
    defaultTitle: 'Your guide to everywhere',
    defaultDescription:
      "Find inspiration, guides and stories for wherever you're going. Select a destination.",
    backgroundImageSrc: '/img/hero/1.png',
    shapeImageSrc: '/img/hero/1/shape.svg',
  },
  list: {
    readMoreLabel: 'Read More',
    authorPrefix: 'By',
    resultSummary: 'Showing results 1-30 of 1,415',
    searchPlaceholder: 'Search',
    categoriesTitle: 'Blog Categories',
    recentPostsTitle: 'Recent Posts',
    tagsTitle: 'Tags',
  },
  posts: [
    {
      id: 1,
      slug: 'kenya-vs-tanzania-safari-experience',
      image: '/img/blogCards/1/1.png',
      date: 'April 06 2023',
      author: 'Ali Tufan',
      title: 'Kenya vs Tanzania Safari: The Better African Safari Experience',
      excerpt: 'From creepy coach rides with comedic theatrics to somber strolls through tragic neighborhoods.',
      badge: 'Trips',
      continent: 'Africa',
      article: {
        ...sharedArticle,
        navigation: {
          previous: {
            slug: 'beauty-of-wildlife-safari-perspective',
            label: 'Prev',
            title: 'The Beauty of Wildlife: A Safari Perspective',
          },
          next: {
            slug: 'exploring-serengeti-wildlife-adventure',
            label: 'Next',
            title: 'Exploring the Serengeti: A Wildlife Adventure',
          },
        },
      },
    },
    {
      id: 2,
      slug: 'exploring-serengeti-wildlife-adventure',
      image: '/img/blogCards/1/2.png',
      date: 'April 07 2023',
      author: 'Emily Johnson',
      title: 'Exploring the Serengeti: A Wildlife Adventure',
      excerpt: 'From creepy coach rides with comedic theatrics to somber strolls through tragic neighborhoods.',
      badge: 'Trips',
      continent: 'North America',
      article: sharedArticle,
    },
    {
      id: 3,
      slug: 'unforgettable-safari-journey',
      image: '/img/blogCards/1/3.png',
      date: 'April 08 2023',
      author: 'Maxwell Rhodes',
      title: 'Into the Wild: An Unforgettable Safari Journey',
      excerpt: 'From creepy coach rides with comedic theatrics to somber strolls through tragic neighborhoods.',
      badge: 'Trips',
      continent: 'North America',
      article: sharedArticle,
    },
    {
      id: 4,
      slug: 'safari-photography-capturing-wildlife',
      image: '/img/blogCards/1/4.png',
      date: 'April 09 2023',
      author: 'Sophia Martinez',
      title: 'Safari Photography: Capturing the Essence of Wildlife',
      excerpt: 'From creepy coach rides with comedic theatrics to somber strolls through tragic neighborhoods.',
      badge: 'Trips',
      continent: 'Africa',
      article: sharedArticle,
    },
    {
      id: 5,
      slug: 'surviving-the-safari-guide',
      image: '/img/blogCards/1/5.png',
      date: 'April 10 2023',
      author: 'Elijah Williams',
      title: 'Surviving the Safari: A Comprehensive Guide',
      excerpt: 'From creepy coach rides with comedic theatrics to somber strolls through tragic neighborhoods.',
      badge: 'Trips',
      continent: 'South America Guide',
      article: sharedArticle,
    },
    {
      id: 6,
      slug: 'luxury-safari-comfort-meets-wilderness',
      image: '/img/blogCards/1/6.png',
      date: 'April 11 2023',
      author: 'Ava Thompson',
      title: 'Luxury Safari Experience: Where Comfort Meets Wilderness',
      excerpt: 'From creepy coach rides with comedic theatrics to somber strolls through tragic neighborhoods.',
      badge: 'Trips',
      continent: 'Europe',
      article: sharedArticle,
    },
    {
      id: 7,
      slug: 'african-safari-natures-wonders',
      image: '/img/blogCards/1/7.png',
      date: 'April 12 2023',
      author: 'Oliver Davis',
      title: 'African Safari: A Journey Through Nature’s Wonders',
      excerpt: 'From creepy coach rides with comedic theatrics to somber strolls through tragic neighborhoods.',
      badge: 'Trips',
      continent: 'Asia',
      article: sharedArticle,
    },
    {
      id: 8,
      slug: 'safari-camping-tips-wild-outdoors',
      image: '/img/blogCards/1/8.png',
      date: 'April 13 2023',
      author: 'Harper Garcia',
      title: 'Safari Camping Tips: Making the Most of the Wild Outdoors',
      excerpt: 'From creepy coach rides with comedic theatrics to somber strolls through tragic neighborhoods.',
      badge: 'Trips',
      continent: 'Asia',
      article: sharedArticle,
    },
    {
      id: 9,
      slug: 'beauty-of-wildlife-safari-perspective',
      image: '/img/blogCards/1/9.png',
      date: 'April 14 2023',
      author: 'Evelyn Cooper',
      title: 'The Beauty of Wildlife: A Safari Perspective',
      excerpt: 'From creepy coach rides with comedic theatrics to somber strolls through tragic neighborhoods.',
      badge: 'Trips',
      continent: 'Asia',
      article: sharedArticle,
    },
  ],
  sidebar: {
    categories: [
      { id: 1, name: 'Nature', href: '/blog' },
      { id: 2, name: 'Adventure', href: '/blog' },
      { id: 3, name: 'Cultural', href: '/blog' },
      { id: 4, name: 'Food', href: '/blog' },
      { id: 5, name: 'City', href: '/blog' },
      { id: 6, name: 'Cruises', href: '/blog' },
    ],
    tags: [
      { id: 1, name: 'Nature', href: '/blog' },
      { id: 2, name: 'Food', href: '/blog' },
      { id: 3, name: 'City', href: '/blog' },
      { id: 4, name: 'Cruises', href: '/blog' },
    ],
    recentPosts: [
      {
        id: 1,
        slug: 'kenya-vs-tanzania-safari-experience',
        title: '10 of the best solo travel destinations for women',
        date: 'April 06 2023',
        image: '/img/blogCards/1/1.png',
      },
      {
        id: 2,
        slug: 'exploring-serengeti-wildlife-adventure',
        title: 'Another blog title',
        date: 'May 15 2023',
        image: '/img/blogCards/1/2.png',
      },
      {
        id: 3,
        slug: 'unforgettable-safari-journey',
        title: 'Yet another blog title',
        date: 'June 22 2023',
        image: '/img/blogCards/1/3.png',
      },
    ],
  },
};

export const blogPosts: BlogPost[] = blogContent.posts;

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostById(id: number): BlogPost | undefined {
  return blogPosts.find((post) => post.id === id);
}
