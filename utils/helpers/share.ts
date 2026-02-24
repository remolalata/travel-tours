const FACEBOOK_SHARE_BASE_URL = 'https://www.facebook.com/sharer/sharer.php';

export interface SharePopupViewport {
  screenX: number;
  screenY: number;
  outerWidth: number;
  outerHeight: number;
}

export interface SharePopupSize {
  width: number;
  height: number;
}

export function buildFacebookShareUrl(targetUrl: string): string {
  const normalizedTargetUrl = targetUrl.trim();
  const searchParams = new URLSearchParams({ u: normalizedTargetUrl });

  return `${FACEBOOK_SHARE_BASE_URL}?${searchParams.toString()}`;
}

export function buildCenteredPopupFeatures(
  viewport: SharePopupViewport,
  size: SharePopupSize,
): string {
  const left = Math.max(0, viewport.screenX + Math.round((viewport.outerWidth - size.width) / 2));
  const top = Math.max(0, viewport.screenY + Math.round((viewport.outerHeight - size.height) / 2));

  return [
    'noopener',
    'noreferrer',
    'resizable',
    'scrollbars',
    `width=${size.width}`,
    `height=${size.height}`,
    `left=${left}`,
    `top=${top}`,
  ].join(',');
}
