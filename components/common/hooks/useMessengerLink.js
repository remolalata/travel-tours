'use client';

import { useMemo } from 'react';

const MESSENGER_SHORT_BASE_URL = 'https://m.me/';
const MESSENGER_THREAD_BASE_URL = 'https://www.facebook.com/messages/t/';
const MESSENGER_APP_BASE_URL = 'fb-messenger://user-thread/';
const NUMERIC_ID_PATTERN = /^\d+$/;

export default function useMessengerLink(pageId) {
  return useMemo(() => {
    const normalizedPageId = pageId?.toString().trim();

    if (!normalizedPageId) {
      return null;
    }

    const encodedId = encodeURIComponent(normalizedPageId);
    const isNumericId = NUMERIC_ID_PATTERN.test(normalizedPageId);

    return {
      appUrl: `${MESSENGER_APP_BASE_URL}${encodedId}`,
      webUrl: isNumericId
        ? `${MESSENGER_THREAD_BASE_URL}${encodedId}`
        : `${MESSENGER_SHORT_BASE_URL}${encodedId}`,
    };
  }, [pageId]);
}
