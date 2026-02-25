'use client';

import MenuItem from '@mui/material/MenuItem';
import type { SxProps, Theme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

import { muiFieldSx } from '@/utils/styles/muiFieldSx';

type AppSelectOption = {
  value: string;
  label: string;
};

type AppSelectFieldProps = {
  label: string;
  value: string;
  options: readonly AppSelectOption[];
  onChange: (value: string) => void;
  emptyOptionLabel?: string;
  required?: boolean;
  errorMessage?: string;
  helperText?: string;
  disabled?: boolean;
  sx?: SxProps<Theme>;
};

export default function AppSelectField({
  label,
  value,
  options,
  onChange,
  emptyOptionLabel,
  required,
  errorMessage,
  helperText,
  disabled,
  sx,
}: AppSelectFieldProps) {
  return (
    <TextField
      fullWidth
      select
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      error={Boolean(errorMessage)}
      helperText={errorMessage ?? helperText}
      disabled={disabled}
      InputLabelProps={required ? { required: true } : undefined}
      sx={sx ?? muiFieldSx}
    >
      {emptyOptionLabel ? <MenuItem value=''>{emptyOptionLabel}</MenuItem> : null}
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
