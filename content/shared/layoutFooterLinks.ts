export interface FooterLinkItem {
  id: number;
  text: string;
  href: string;
}

export interface FooterLinkSection {
  title: string;
  links: FooterLinkItem[];
}

export const footerLinkSections: FooterLinkSection[] = [
  {
    title: 'Company',
    links: [
      { id: 1, text: 'About Us', href: '#' },
      { id: 2, text: 'Reviews', href: '#' },
      { id: 3, text: 'Contact Us', href: '/contact' },
      { id: 4, text: 'Travel Guides', href: '#' },
      { id: 5, text: 'Data Policy', href: '#' },
      { id: 6, text: 'Cookie Policy', href: '#' },
      { id: 7, text: 'Legal', href: '#' },
      { id: 8, text: 'Sitemap', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { id: 9, text: 'Get in Touch', href: '#' },
      { id: 10, text: 'Help center', href: '#' },
      { id: 11, text: 'Live chat', href: '#' },
      { id: 12, text: 'How it works', href: '#' },
    ],
  },
];

