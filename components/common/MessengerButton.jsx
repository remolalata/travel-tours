'use client';

import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import useMessengerLink from './hooks/useMessengerLink';
import useViberLink from './hooks/useViberLink';
import useWhatsAppLink from './hooks/useWhatsAppLink';

function MessengerIcon() {
  return (
    <svg viewBox='0 0 24 24' width='22' height='22' aria-hidden='true' focusable='false'>
      <path
        d='M12 2C6.486 2 2 6.038 2 11c0 2.673 1.313 5.145 3.57 6.785V22l3.992-2.19A11.048 11.048 0 0 0 12 20c5.514 0 10-4.038 10-9S17.514 2 12 2Zm.993 12.114-2.548-2.717-4.971 2.717 5.468-5.808 2.613 2.717 4.906-2.717-5.468 5.808Z'
        fill='currentColor'
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox='0 0 24 24' width='22' height='22' aria-hidden='true' focusable='false'>
      <path
        fill='currentColor'
        d='M12 2.04A9.94 9.94 0 0 0 3.39 16.9L2 22l5.24-1.37A9.96 9.96 0 1 0 12 2.04Zm0 18.18a8.22 8.22 0 0 1-4.18-1.14l-.3-.18-3.11.81.83-3.03-.2-.31A8.25 8.25 0 1 1 12 20.22Zm4.53-6.17c-.25-.13-1.47-.72-1.7-.8-.23-.09-.4-.13-.57.12-.17.25-.65.8-.8.96-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.24-.74-.65-1.24-1.45-1.38-1.7-.15-.25-.02-.38.11-.5.11-.11.25-.29.38-.43.12-.14.16-.24.25-.41.08-.17.04-.31-.02-.43-.06-.12-.57-1.36-.78-1.87-.21-.5-.42-.43-.57-.44h-.49c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.08 0 1.22.89 2.41 1.01 2.58.12.16 1.75 2.67 4.23 3.73.59.25 1.06.4 1.42.5.6.19 1.14.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.23-.17-.48-.29Z'
      />
    </svg>
  );
}

function ViberIcon() {
  return (
    <svg viewBox='0 0 24 24' width='22' height='22' aria-hidden='true' focusable='false'>
      <path
        fill='currentColor'
        d='M12.02 2C6.52 2 2.06 5.72 2.06 10.3c0 2.77 1.62 5.24 4.12 6.76V22l3.54-1.95c.76.17 1.52.25 2.3.25 5.5 0 9.96-3.72 9.96-8.3S17.52 2 12.02 2Zm2.96 12.01c-.18.39-.94.77-1.29.81-.33.05-.74.07-2.41-.63-2.13-.89-3.5-3.07-3.61-3.21-.1-.14-.86-1.15-.86-2.2 0-1.05.54-1.56.74-1.77.18-.2.4-.25.54-.25h.39c.12 0 .28-.02.43.34.16.38.54 1.32.58 1.42.05.1.08.23.02.36-.07.14-.1.23-.2.35-.1.12-.21.27-.3.36-.1.1-.21.21-.09.41.12.2.54.88 1.16 1.43.8.71 1.48.93 1.69 1.04.21.1.33.09.45-.06.12-.15.51-.59.65-.79.14-.2.28-.17.47-.1.2.06 1.24.58 1.46.69.22.1.36.16.41.26.05.1.05.58-.13.97Z'
      />
    </svg>
  );
}

function MainTriggerIcon({ isOpen }) {
  return (
    <svg viewBox='0 0 24 24' width='24' height='24' aria-hidden='true' focusable='false'>
      {isOpen ? (
        <path
          fill='currentColor'
          d='M18.3 5.71 12 12l6.3 6.29-1.42 1.42L10.59 13.4 4.29 19.7 2.88 18.3l6.29-6.3L2.88 5.71 4.3 4.29l6.29 6.3 6.29-6.3 1.42 1.42Z'
        />
      ) : (
        <path
          fill='currentColor'
          d='M12 3C7.59 3 4 6.03 4 9.75c0 2.13 1.16 4.1 3.14 5.39V19l3.04-1.68c.6.12 1.2.18 1.82.18 4.41 0 8-3.03 8-6.75S16.41 3 12 3Zm0 12.5c-.66 0-1.31-.08-1.94-.24l-.41-.1-1.51.84v-1.65l-.32-.23C6.23 12.97 5.5 11.4 5.5 9.75 5.5 6.86 8.41 4.5 12 4.5s6.5 2.36 6.5 5.25-2.91 5.25-6.5 5.25Zm-3.5-5h7v1.5h-7v-1.5Zm0-2.5h7v1.5h-7V8Z'
        />
      )}
    </svg>
  );
}

function MessengerButton({
  pageId = process.env.NEXT_PUBLIC_FB_PAGE_ID,
  whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  viberNumber = process.env.NEXT_PUBLIC_VIBER_NUMBER,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const groupRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const firstActionRef = useRef(null);

  const messengerLinks = useMessengerLink(pageId);
  const whatsAppLinks = useWhatsAppLink(whatsappNumber);
  const viberLinks = useViberLink(viberNumber);

  const handleChannelClick = useCallback((event, appUrl, webUrl) => {
    if (!appUrl || !webUrl) {
      return;
    }

    setIsOpen(false);

    const userAgent = navigator.userAgent || '';
    const isMobile = /Android|iPhone|iPad|iPod/i.test(userAgent);
    const isInAppBrowser = /FBAN|FBAV|Instagram/i.test(userAgent);

    if (!isMobile || isInAppBrowser) {
      return;
    }

    event.preventDefault();

    let appOpened = false;
    const onVisibilityChange = () => {
      if (document.hidden) {
        appOpened = true;
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange, { once: true });
    window.location.href = appUrl;

    window.setTimeout(() => {
      if (!appOpened) {
        window.location.href = webUrl;
      }
    }, 1200);
  }, []);

  const channelButtons = useMemo(
    () => [
      {
        id: 'messenger',
        label: 'Chat with us on Facebook Messenger',
        links: messengerLinks,
        icon: <MessengerIcon />,
      },
      {
        id: 'whatsapp',
        label: 'Chat with us on WhatsApp',
        links: whatsAppLinks,
        icon: <WhatsAppIcon />,
      },
      {
        id: 'viber',
        label: 'Chat with us on Viber',
        links: viberLinks,
        icon: <ViberIcon />,
      },
    ].filter((item) => item.links),
    [messengerLinks, whatsAppLinks, viberLinks]
  );

  const circularOffsets = useMemo(() => {
    const total = channelButtons.length;

    return channelButtons.map((_, index) => {
      const angleDeg = total === 1 ? -135 : -90 - (index * 90) / (total - 1);
      const angleInRadians = (angleDeg * Math.PI) / 180;

      return {
        x: Math.cos(angleInRadians),
        y: Math.sin(angleInRadians),
      };
    });
  }, [channelButtons]);

  useEffect(() => {
    const openClassName = 'contact-group-open';

    if (isOpen) {
      document.body.classList.add(openClassName);
    } else {
      document.body.classList.remove(openClassName);
    }

    return () => {
      document.body.classList.remove(openClassName);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    firstActionRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const onDocumentPointerDown = (event) => {
      if (!groupRef.current?.contains(event.target)) {
        setIsOpen(false);
        toggleButtonRef.current?.focus();
      }
    };

    const onDocumentKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        toggleButtonRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', onDocumentPointerDown);
    document.addEventListener('keydown', onDocumentKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onDocumentPointerDown);
      document.removeEventListener('keydown', onDocumentKeyDown);
    };
  }, [isOpen]);

  if (!channelButtons.length) {
    return null;
  }

  return (
    <div ref={groupRef} className={`contactButtonGroup${isOpen ? ' is-open' : ''}`}>
      <div id={menuId} className='contactButtonList' role='menu' aria-hidden={!isOpen}>
        {channelButtons.map((channel, index) => (
          <a
            key={channel.id}
            ref={index === 0 ? firstActionRef : null}
            href={channel.links.webUrl}
            onClick={(event) => handleChannelClick(event, channel.links.appUrl, channel.links.webUrl)}
            aria-label={channel.label}
            role='menuitem'
            tabIndex={isOpen ? 0 : -1}
            className={`contactButtonAction contactButtonAction--${channel.id}`}
            style={{
              '--contact-delay': `${index * 70}ms`,
              '--contact-x': circularOffsets[index].x,
              '--contact-y': circularOffsets[index].y,
            }}
          >
            {channel.icon}
          </a>
        ))}
      </div>

      <button
        ref={toggleButtonRef}
        type='button'
        aria-label={isOpen ? 'Close chat options' : 'Open chat options'}
        aria-expanded={isOpen}
        aria-controls={menuId}
        className='contactButtonMain'
        onClick={() => setIsOpen((previousState) => !previousState)}
      >
        <MainTriggerIcon isOpen={isOpen} />
      </button>
    </div>
  );
}

export default memo(MessengerButton);
