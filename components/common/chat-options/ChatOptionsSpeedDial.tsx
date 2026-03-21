'use client';

import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { memo } from 'react';

import { type ChatOptionId,chatOptionsContent } from '@/content/shared/chatOptions';
import type { ChatOptionAction } from '@/utils/hooks/contact/useChatOptions';

import { ChatOptionIcon, ChatOptionsClosedIcon, ChatOptionsOpenIcon } from './ChatOptionsIcons';

interface ChatOptionsSpeedDialProps {
  actions: ChatOptionAction[];
  isOpen: boolean;
  triggerLabel: string;
  onActionClick: (action: ChatOptionAction) => void;
  onClose: () => void;
  onOpen: () => void;
}

function getActionFabSx(channelId: ChatOptionId) {
  if (channelId === 'messenger') {
    return {
      color: '#fff',
      background: 'linear-gradient(135deg, #00b2ff 0%, #006aff 100%)',
      boxShadow: '0 10px 22px rgba(0, 106, 255, 0.33)',
    };
  }

  if (channelId === 'whatsapp') {
    return {
      color: '#fff',
      background: 'linear-gradient(135deg, #25d366 0%, #12b24f 100%)',
      boxShadow: '0 10px 22px rgba(18, 178, 79, 0.33)',
    };
  }

  return {
    color: '#fff',
    background: 'linear-gradient(135deg, #8f5db7 0%, #6b3f99 100%)',
    boxShadow: '0 10px 22px rgba(107, 63, 153, 0.33)',
  };
}

function ChatOptionsSpeedDial({
  actions,
  isOpen,
  triggerLabel,
  onActionClick,
  onClose,
  onOpen,
}: ChatOptionsSpeedDialProps) {
  return (
    <Box
      className={`contactButtonGroup${isOpen ? ' is-open' : ''}`}
      sx={{
        width: { xs: 54, md: 60 },
        height: { xs: 54, md: 60 },
      }}
    >
      <SpeedDial
        ariaLabel={chatOptionsContent.ariaLabel}
        direction='up'
        open={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        icon={<ChatOptionsClosedIcon />}
        openIcon={<ChatOptionsOpenIcon />}
        FabProps={{
          'aria-label': triggerLabel,
          sx: {
            width: { xs: 54, md: 60 },
            height: { xs: 54, md: 60 },
            minWidth: { xs: 54, md: 60 },
            minHeight: { xs: 54, md: 60 },
            padding: 0,
            color: '#fff',
            background: isOpen
              ? 'linear-gradient(135deg, #006aff 0%, #0048c8 100%)'
              : 'linear-gradient(135deg, #00b2ff 0%, #006aff 100%)',
            boxShadow: isOpen
              ? '0 14px 30px rgba(0, 72, 200, 0.35)'
              : '0 12px 28px rgba(0, 106, 255, 0.35)',
            '&:hover': {
              background: isOpen
                ? 'linear-gradient(135deg, #006aff 0%, #0048c8 100%)'
                : 'linear-gradient(135deg, #00b2ff 0%, #006aff 100%)',
              boxShadow: '0 14px 30px rgba(0, 106, 255, 0.45)',
            },
            '&:focus-visible': {
              outline: '3px solid #ffffff',
              outlineOffset: 2,
            },
          },
        }}
        sx={{
          position: 'fixed',
          right: { xs: 20, md: 30 },
          bottom: {
            xs: 'calc(20px + env(safe-area-inset-bottom, 0px))',
            md: '30px',
          },
          zIndex: 101,
          width: { xs: 54, md: 60 },
          height: { xs: 54, md: 60 },
          '& .MuiSpeedDial-actions': {
            pb: '40px',
          },
          '& .MuiFab-root svg': {
            width: { xs: 24, md: 28 },
            height: { xs: 24, md: 28 },
          },
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.id}
            icon={<ChatOptionIcon channelId={action.id} />}
            tooltipTitle={action.label}
            onClick={() => onActionClick(action)}
            FabProps={{
              'aria-label': action.label,
              sx: {
                ...getActionFabSx(action.id),
                width: { xs: 54, md: 60 },
                height: { xs: 54, md: 60 },
                '&:hover': getActionFabSx(action.id),
                '&:focus-visible': {
                  outline: '3px solid #ffffff',
                  outlineOffset: 2,
                },
              },
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}

export default memo(ChatOptionsSpeedDial);
