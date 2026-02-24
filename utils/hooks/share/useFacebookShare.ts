'use client';

import { useCallback } from 'react';

import { buildCenteredPopupFeatures, buildFacebookShareUrl } from '@/utils/helpers/share';

const FACEBOOK_SHARE_WINDOW_NAME = 'facebook-share-dialog';
const FACEBOOK_SHARE_POPUP_SIZE = {
  width: 640,
  height: 720,
} as const;

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
      const popupFeatures = buildCenteredPopupFeatures(
        {
          screenX: window.screenX,
          screenY: window.screenY,
          outerWidth: window.outerWidth,
          outerHeight: window.outerHeight,
        },
        FACEBOOK_SHARE_POPUP_SIZE,
      );

      const popupWindow = window.open(shareUrl, FACEBOOK_SHARE_WINDOW_NAME, popupFeatures);

      if (popupWindow) {
        popupWindow.focus();
        return;
      }

      window.location.href = shareUrl;
    },
    [options?.url],
  );

  return { share };
}
