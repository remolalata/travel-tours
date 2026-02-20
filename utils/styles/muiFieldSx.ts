import type { SxProps, Theme } from '@mui/material/styles';

export const muiFieldSx: SxProps<Theme> = {
  '& .MuiInputLabel-root': {
    color: 'rgba(5, 7, 60, 0.68)',
    zIndex: 1,
  },
  '& .MuiInputLabel-root.MuiInputLabel-shrink': {
    backgroundColor: '#fff',
    padding: '0 6px',
    borderRadius: '6px',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'var(--color-accent-1)',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    backgroundColor: '#fff',
    transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(235, 102, 43, 0.45)',
    },
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--color-accent-1)',
  },
  '& .MuiOutlinedInput-root.Mui-focused': {
    boxShadow: '0 0 0 3px rgba(235, 102, 43, 0.12)',
  },
};
