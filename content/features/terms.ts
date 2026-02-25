import type { TermsPageContent } from '@/types/terms';

const commonParagraphs = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus nascetur morbi nisl, mi, in semper metus porttitor non. Augue nunc amet fringilla sit.',
  'Massa ultricies a arcu velit eget gravida purus ultrices eget. Orci, fames eu facilisi justo. Lacus netus a at sed justo vel leo leo pellentesque.',
];

export const termsPageContent: TermsPageContent = {
  metadata: {
    title: 'Terms | Travel & Tours',
    description: 'Read the terms governing bookings, payments, and site usage.',
  },
  pageHeader: {
    breadcrumbs: [
      { id: 1, label: 'Home', href: '/' },
      { id: 2, label: 'Terms' },
    ],
    subtitle: 'TRAVEL BOOKING TERMS AND CONDITIONS',
    title: 'Terms and Conditions',
  },
  tabs: [
    {
      id: 'account-payments',
      label: 'Account and Payments',
      sections: [
        { id: 'introduction', title: '1. Introduction', paragraphs: commonParagraphs },
        {
          id: 'account-usage',
          title: '2. Account Use',
          paragraphs: commonParagraphs,
        },
      ],
    },
    {
      id: 'manage-orders',
      label: 'Manage Orders',
      sections: [
        {
          id: 'order-management',
          title: '1. Managing Existing Orders',
          paragraphs: commonParagraphs,
        },
        { id: 'schedule-changes', title: '2. Schedule Changes', paragraphs: commonParagraphs },
      ],
    },
    {
      id: 'returns-refunds',
      label: 'Returns and Refunds',
      sections: [
        { id: 'refund-policy', title: '1. Refund Policy', paragraphs: commonParagraphs },
        {
          id: 'processing-time',
          title: '2. Processing Timelines',
          paragraphs: commonParagraphs,
        },
      ],
    },
    {
      id: 'covid-19',
      label: 'COVID-19',
      sections: [
        {
          id: 'travel-advisories',
          title: '1. Travel Advisories',
          paragraphs: commonParagraphs,
        },
        {
          id: 'health-compliance',
          title: '2. Health Compliance',
          paragraphs: commonParagraphs,
        },
      ],
    },
    {
      id: 'other',
      label: 'Other',
      sections: [
        { id: 'liability', title: '1. Liability', paragraphs: commonParagraphs },
        {
          id: 'policy-updates',
          title: '2. Policy Updates',
          paragraphs: commonParagraphs,
        },
      ],
    },
  ],
};
