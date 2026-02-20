export interface ContactLocationItem {
  id: number;
  title: string;
  address: string;
  contact: string;
}

export const contactPageContent = {
  metadata: {
    title: 'Contact || ViaTour - Travel & Tour React NextJS Template',
    description: 'ViaTour - Travel & Tour React NextJS Template',
  },
  form: {
    heading: 'Leave us your info',
    placeholders: {
      name: 'Name',
      phone: 'Phone',
      email: 'Email',
      message: 'Message',
    },
    submitLabel: 'Send Message',
  },
  locations: [
    {
      id: 1,
      title: 'Office Address',
      address: 'Pangasinan, Manaoag, Philippines, 2430',
      contact: 'Travel & Tours',
    },
    {
      id: 2,
      title: 'Phone',
      address: 'Call us directly',
      contact: '+63 970 551 7169',
    },
    {
      id: 3,
      title: 'WhatsApp',
      address: 'Chat with us on WhatsApp',
      contact: '+63 970 551 7169',
    },
    {
      id: 4,
      title: 'Viber',
      address: 'Message us on Viber',
      contact: '+63 970 551 7169',
    },
  ] as ContactLocationItem[],
} as const;

