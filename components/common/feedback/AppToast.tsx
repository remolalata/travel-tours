'use client';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

type AppToastProps = {
  open: boolean;
  message: string;
  severity?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  autoHideDuration?: number;
};

export default function AppToast({
  open,
  message,
  severity = 'info',
  onClose,
  autoHideDuration = 3500,
}: AppToastProps) {
  const resolvedAutoHideDuration = severity === 'error' ? null : autoHideDuration;

  return (
    <Snackbar
      open={open}
      autoHideDuration={resolvedAutoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity} variant='filled' sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
