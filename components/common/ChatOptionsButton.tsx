'use client';

import { memo } from 'react';

import ChatOptionsSpeedDial from '@/components/common/chat-options/ChatOptionsSpeedDial';
import useChatOptions from '@/utils/hooks/contact/useChatOptions';

interface ChatOptionsButtonProps {
  pageId?: string | number;
  whatsappNumber?: string | number;
  viberNumber?: string | number;
}

function ChatOptionsButton({
  pageId = process.env.NEXT_PUBLIC_FB_PAGE_ID,
  whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  viberNumber = process.env.NEXT_PUBLIC_VIBER_NUMBER,
}: ChatOptionsButtonProps) {
  const { actions, handleActionClick, handleClose, handleOpen, isOpen, triggerLabel } =
    useChatOptions({
      pageId,
      whatsappNumber,
      viberNumber,
    });

  if (!actions.length) {
    return null;
  }

  return (
    <ChatOptionsSpeedDial
      actions={actions}
      isOpen={isOpen}
      triggerLabel={triggerLabel}
      onActionClick={handleActionClick}
      onClose={handleClose}
      onOpen={handleOpen}
    />
  );
}

export default memo(ChatOptionsButton);
