'use client';

import type { SxProps, Theme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

import { muiFieldSx } from '@/utils/styles/muiFieldSx';

type AppTextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'tel';
  autoComplete?: string;
  errorMessage?: string;
  disabled?: boolean;
  sx?: SxProps<Theme>;
};

export default function AppTextField({
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  errorMessage,
  disabled,
  sx,
}: AppTextFieldProps) {
  return (
    <TextField
      fullWidth
      type={type}
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      autoComplete={autoComplete}
      error={Boolean(errorMessage)}
      helperText={errorMessage}
      disabled={disabled}
      sx={sx ?? muiFieldSx}
    />
  );
}
