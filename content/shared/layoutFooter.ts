import { supportContact } from '@/content/shared/supportContact';

export const footerContent = {
  support: {
    prefix: 'Speak to our expert at',
    phoneDisplay: supportContact.phone.display,
  },
  social: {
    title: 'Follow Us',
  },
  contact: {
    title: 'Contact',
    address: {
      text: 'Pangasinan, Manaoag, Philippines, 2430',
      href: '#',
    },
    phone: {
      label: supportContact.phone.display,
      href: supportContact.phone.telHref,
    },
    whatsapp: {
      label: `WhatsApp: ${supportContact.phone.display}`,
      href: supportContact.phone.whatsappHref,
      ariaLabel: 'WhatsApp',
    },
    viber: {
      label: `Viber: ${supportContact.phone.display}`,
      href: supportContact.phone.viberHref,
      ariaLabel: 'Viber',
    },
  },
  newsletter: {
    title: 'Newsletter',
    description: 'Subscribe to the free newsletter and stay up to date',
    emailLabel: 'Newsletter email address',
    emailPlaceholder: 'Your email address',
    submitLabel: 'Send',
  },
  copyright: '© Copyright Travel & Tours 2026',
} as const;
