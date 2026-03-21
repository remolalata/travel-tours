export type ChatOptionId = 'messenger' | 'whatsapp' | 'viber';

export interface ChatOptionContentItem {
  id: ChatOptionId;
  label: string;
}

export const chatOptionsContent = {
  ariaLabel: 'Contact options',
  openLabel: 'Open chat options',
  closeLabel: 'Close chat options',
  channels: [
    {
      id: 'messenger',
      label: 'Chat with us on Facebook Messenger',
    },
    {
      id: 'whatsapp',
      label: 'Chat with us on WhatsApp',
    },
    {
      id: 'viber',
      label: 'Chat with us on Viber',
    },
  ] satisfies ChatOptionContentItem[],
} as const;
