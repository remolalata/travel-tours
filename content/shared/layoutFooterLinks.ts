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
      { id: 8, text: 'Sitemap', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { id: 10, text: 'Help center', href: '/help-center' },
    ],
  },
];
