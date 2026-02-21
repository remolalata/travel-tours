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
  options: AppSelectOption[];
  onChange: (value: string) => void;
  emptyOptionLabel: string;
  errorMessage?: string;
  disabled?: boolean;
  sx?: SxProps<Theme>;
};

export default function AppSelectField({
  label,
  value,
  options,
  onChange,
  emptyOptionLabel,
  errorMessage,
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
      helperText={errorMessage}
      disabled={disabled}
      sx={sx ?? muiFieldSx}
    >
      <MenuItem value=''>{emptyOptionLabel}</MenuItem>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
