'use client';

import { useMemo } from 'react';

const MESSENGER_BASE_URL = 'https://www.facebook.com/messages/t/';

export default function useMessengerLink(pageId) {
  return useMemo(() => {
    const normalizedPageId = pageId?.toString().trim();

    if (!normalizedPageId) {
      return null;
    }

    return `${MESSENGER_BASE_URL}${encodeURIComponent(normalizedPageId)}`;
  }, [pageId]);
}
