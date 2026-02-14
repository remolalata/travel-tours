'use client';

import { memo } from 'react';
import useMessengerLink from './hooks/useMessengerLink';

function MessengerIcon() {
  return (
    <svg viewBox='0 0 24 24' width='28' height='28' aria-hidden='true' focusable='false'>
      <path
        d='M12 2C6.486 2 2 6.038 2 11c0 2.673 1.313 5.145 3.57 6.785V22l3.992-2.19A11.048 11.048 0 0 0 12 20c5.514 0 10-4.038 10-9S17.514 2 12 2Zm.993 12.114-2.548-2.717-4.971 2.717 5.468-5.808 2.613 2.717 4.906-2.717-5.468 5.808Z'
        fill='currentColor'
      />
    </svg>
  );
}

function MessengerButton({ pageId = process.env.NEXT_PUBLIC_FB_PAGE_ID }) {
  const messengerLink = useMessengerLink(pageId);

  if (!messengerLink) {
    return null;
  }

  return (
    <a
      href={messengerLink}
      target='_blank'
      rel='noopener noreferrer'
      aria-label='Chat with us on Facebook Messenger'
      className='messengerButton'
    >
      <MessengerIcon />
    </a>
  );
}

export default memo(MessengerButton);
