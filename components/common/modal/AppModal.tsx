'use client';

import Box from '@mui/material/Box';
import type { DialogProps } from '@mui/material/Dialog';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import type { ReactNode } from 'react';

export type AppModalSize = 'small' | 'medium' | 'large';

type AppModalProps = {
  open: boolean;
  onClose: DialogProps['onClose'];
  title?: ReactNode;
  size?: AppModalSize;
  children: ReactNode;
  actions?: ReactNode;
};

const sizeToMaxWidth: Record<AppModalSize, DialogProps['maxWidth']> = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
};

export default function AppModal({
  open,
  onClose,
  title,
  size = 'small',
  children,
  actions,
}: AppModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={sizeToMaxWidth[size]}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 30px 60px rgba(15, 23, 42, 0.18)',
          },
        },
      }}
    >
      {title ? (
        <DialogTitle
          sx={{
            px: 3,
            py: 2.25,
            borderBottom: '1px solid #e6ebf2',
            background: 'linear-gradient(180deg, #f8fbff 0%, #f3f8ff 100%)',
            fontWeight: 600,
          }}
        >
          {title}
        </DialogTitle>
      ) : null}

      <DialogContent sx={{ p: 0, bgcolor: '#fcfdff' }}>
        <Box sx={{ px: 3, py: 3 }}>{children}</Box>
      </DialogContent>

      {actions ? (
        <DialogActions
          sx={{
            px: 3,
            py: 2.25,
            borderTop: '1px solid #e6ebf2',
            bgcolor: '#fff',
            gap: 1,
          }}
        >
          {actions}
        </DialogActions>
      ) : null}
    </Dialog>
  );
}
