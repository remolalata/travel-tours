'use client';

import type { SxProps, Theme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

import { muiFieldSx } from '@/utils/styles/muiFieldSx';

type AppTextareaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  errorMessage?: string;
  helperText?: string;
  disabled?: boolean;
  rows?: number;
  minRows?: number;
  shrinkLabel?: boolean;
  sx?: SxProps<Theme>;
};

export default function AppTextareaField({
  label,
  value,
  onChange,
  required,
  placeholder,
  errorMessage,
  helperText,
  disabled,
  rows,
  minRows,
  shrinkLabel,
  sx,
}: AppTextareaFieldProps) {
  const inputLabelProps =
    required || shrinkLabel
      ? {
          ...(required ? { required: true } : {}),
          ...(shrinkLabel ? { shrink: true } : {}),
        }
      : undefined;

  return (
    <TextField
      fullWidth
      multiline
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      error={Boolean(errorMessage)}
      helperText={errorMessage ?? helperText}
      disabled={disabled}
      rows={rows}
      minRows={minRows}
      InputLabelProps={inputLabelProps}
      sx={sx ?? muiFieldSx}
    />
  );
}
