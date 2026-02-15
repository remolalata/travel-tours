'use client';

import { useMemo } from 'react';
import type { ContactChannelLinks } from './useMessengerLink';

const VIBER_APP_BASE_URL = 'viber://chat?number=';
const VIBER_WEB_BASE_URL = 'https://invite.viber.com/?number=';

export default function useViberLink(
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

    const encodedPhoneNumber = encodeURIComponent(`+${digitsOnly}`);

    return {
      appUrl: `${VIBER_APP_BASE_URL}${encodedPhoneNumber}`,
      webUrl: `${VIBER_WEB_BASE_URL}${encodedPhoneNumber}`,
    };
  }, [phoneNumber]);
}
