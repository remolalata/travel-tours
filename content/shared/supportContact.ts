const supportPhoneDisplay = '+63 900 000 0000';
const supportPhoneDigits = '+639000000000';

export const supportContact = {
  phone: {
    display: supportPhoneDisplay,
    telHref: `tel:${supportPhoneDigits}`,
    whatsappHref: `https://wa.me/${supportPhoneDigits.replace('+', '')}`,
    viberHref: `viber://chat?number=${encodeURIComponent(supportPhoneDigits)}`,
  },
} as const;
