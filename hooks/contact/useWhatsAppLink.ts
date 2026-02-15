'use client';

import { useMemo } from 'react';
import type { ContactChannelLinks } from './useMessengerLink';

const WHATSAPP_APP_BASE_URL = 'whatsapp://send?phone=';
const WHATSAPP_WEB_BASE_URL = 'https://api.whatsapp.com/send?phone=';

export default function useWhatsAppLink(
  phoneNumber: string | number | null | undefined,
): ContactChannelLinks | null {
  return useMemo(() => {
    const normalizedPhoneNumber = phoneNumber?.toString().trim();

    if (!normalizedPhoneNumber) {
      return null;
    }

    const digitsOnly = normalizedPhoneNumber.replace(/\D/g, '');

    if (!digitsOnly) {
      return null;
    }

    return {
      appUrl: `${WHATSAPP_APP_BASE_URL}${digitsOnly}`,
      webUrl: `${WHATSAPP_WEB_BASE_URL}${digitsOnly}`,
    };
  }, [phoneNumber]);
}
