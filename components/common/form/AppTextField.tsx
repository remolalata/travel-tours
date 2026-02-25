'use client';

import type { SxProps, Theme } from '@mui/material/styles';
import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';

import { muiFieldSx } from '@/utils/styles/muiFieldSx';

type AppTextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: TextFieldProps['type'];
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
  errorMessage?: string;
  helperText?: string;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  minRows?: number;
  inputProps?: TextFieldProps['inputProps'];
  shrinkLabel?: boolean;
  sx?: SxProps<Theme>;
};

export default function AppTextField({
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  required,
  placeholder,
  errorMessage,
  helperText,
  disabled,
  multiline,
  rows,
  minRows,
  inputProps,
  shrinkLabel,
  sx,
}: AppTextFieldProps) {
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
      type={type}
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      autoComplete={autoComplete}
      error={Boolean(errorMessage)}
      helperText={errorMessage ?? helperText}
      disabled={disabled}
      multiline={multiline}
      rows={rows}
      minRows={minRows}
      placeholder={placeholder}
      inputProps={inputProps}
      InputLabelProps={inputLabelProps}
      sx={sx ?? muiFieldSx}
    />
  );
}
