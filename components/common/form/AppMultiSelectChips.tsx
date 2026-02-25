'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';

type AppMultiSelectChipsProps<T extends string> = {
  value: T[];
  options: T[];
  onChange: (value: T[]) => void;
  maxWidth?: number;
};

export default function AppMultiSelectChips<T extends string>({
  value,
  options,
  onChange,
  maxWidth = 280,
}: AppMultiSelectChipsProps<T>) {
  return (
    <Box sx={{ mb: 2.5, maxWidth }}>
      <FormControl fullWidth size='small'>
        <Select<T[]>
          multiple
          value={value}
          onChange={(event: SelectChangeEvent<T[]>) => {
            const selectedValue = event.target.value;
            onChange(
              (typeof selectedValue === 'string' ? selectedValue.split(',') : selectedValue) as T[],
            );
          }}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(selected as T[]).map((item) => (
                <Chip
                  key={item}
                  label={item}
                  size='small'
                  sx={{
                    fontWeight: 500,
                    bgcolor: '#05073c',
                    color: '#fff',
                  }}
                />
              ))}
            </Box>
          )}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#d0d5dd',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-accent-1)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-accent-1)',
              borderWidth: 1,
            },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
