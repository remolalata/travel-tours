'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { type ChatOptionId,chatOptionsContent } from '@/content/shared/chatOptions';

import type { ContactChannelLinks } from './useMessengerLink';
import useMessengerLink from './useMessengerLink';
import useViberLink from './useViberLink';
import useWhatsAppLink from './useWhatsAppLink';

const MOBILE_USER_AGENT_PATTERN = /Android|iPhone|iPad|iPod/i;
const IN_APP_BROWSER_PATTERN = /FBAN|FBAV|Instagram/i;
const CONTACT_GROUP_OPEN_CLASS_NAME = 'contact-group-open';

export interface ChatOptionAction {
  id: ChatOptionId;
  label: string;
  links: ContactChannelLinks;
}

interface UseChatOptionsParams {
  pageId?: string | number;
  whatsappNumber?: string | number;
  viberNumber?: string | number;
}

function openContactChannel(links: ContactChannelLinks) {
  const userAgent = navigator.userAgent || '';
  const isMobile = MOBILE_USER_AGENT_PATTERN.test(userAgent);
  const isInAppBrowser = IN_APP_BROWSER_PATTERN.test(userAgent);

  if (!isMobile || isInAppBrowser) {
    window.location.href = links.webUrl;
    return;
  }

  let appOpened = false;
  const onVisibilityChange = () => {
    if (document.hidden) {
      appOpened = true;
    }
  };

  document.addEventListener('visibilitychange', onVisibilityChange, { once: true });
  window.location.href = links.appUrl;

  window.setTimeout(() => {
    if (!appOpened) {
      window.location.href = links.webUrl;
    }
  }, 1200);
}

export default function useChatOptions({
  pageId = process.env.NEXT_PUBLIC_FB_PAGE_ID,
  whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  viberNumber = process.env.NEXT_PUBLIC_VIBER_NUMBER,
}: UseChatOptionsParams = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const messengerLinks = useMessengerLink(pageId);
  const whatsAppLinks = useWhatsAppLink(whatsappNumber);
  const viberLinks = useViberLink(viberNumber);

  const linksByChannel = useMemo(
    () => ({
      messenger: messengerLinks,
      whatsapp: whatsAppLinks,
      viber: viberLinks,
    }),
    [messengerLinks, whatsAppLinks, viberLinks],
  );

  const actions = useMemo<ChatOptionAction[]>(
    () =>
      chatOptionsContent.channels.flatMap((channel) => {
        const links = linksByChannel[channel.id];

        if (!links) {
          return [];
        }

        return [
          {
            id: channel.id,
            label: channel.label,
            links,
          },
        ];
      }),
    [linksByChannel],
  );

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleActionClick = useCallback((action: ChatOptionAction) => {
    setIsOpen(false);
    openContactChannel(action.links);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add(CONTACT_GROUP_OPEN_CLASS_NAME);
      return () => {
        document.body.classList.remove(CONTACT_GROUP_OPEN_CLASS_NAME);
      };
    }

    document.body.classList.remove(CONTACT_GROUP_OPEN_CLASS_NAME);
    return undefined;
  }, [isOpen]);

  return {
    actions,
    isOpen,
    handleActionClick,
    handleClose,
    handleOpen,
    triggerLabel: isOpen ? chatOptionsContent.closeLabel : chatOptionsContent.openLabel,
  };
}
