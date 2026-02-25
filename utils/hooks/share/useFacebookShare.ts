'use client';

import { useCallback } from 'react';

import { buildFacebookShareUrl } from '@/utils/helpers/share';

interface UseFacebookShareOptions {
  url?: string;
}

interface FacebookShareOverrides {
  url?: string;
}

export default function useFacebookShare(options?: UseFacebookShareOptions) {
  const share = useCallback(
    (overrides?: FacebookShareOverrides) => {
      if (typeof window === 'undefined') {
        return;
      }

      const currentPageUrl = `${window.location.origin}${window.location.pathname}`;
      const targetUrl = (overrides?.url ?? options?.url ?? currentPageUrl)?.trim();

      if (!targetUrl) {
        return;
      }

      const shareUrl = buildFacebookShareUrl(targetUrl);

      const popupWindow = window.open(shareUrl, '_blank', 'noopener,noreferrer');

      if (popupWindow) {
        popupWindow.focus();
        return;
      }

      window.open(shareUrl, '_blank');
    },
    [options?.url],
  );

  return { share };
}
