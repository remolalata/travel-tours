'use client';

import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';

type AppMultiSelectPillsProps<T extends string> = {
  options: T[];
  value: T[];
  onChange: (value: T[]) => void;
  activeBackgroundColor?: string;
  activeTextColor?: string;
  inactiveBackgroundColor?: string;
  inactiveTextColor?: string;
  inactiveBorderColor?: string;
  hoverBorderColor?: string;
  containerSx?: SxProps<Theme>;
};

export default function AppMultiSelectPills<T extends string>({
  options,
  value,
  onChange,
  activeBackgroundColor = '#05073c',
  activeTextColor = '#fff',
  inactiveBackgroundColor = '#fff',
  inactiveTextColor = '#05073c',
  inactiveBorderColor = '#d0d5dd',
  hoverBorderColor = 'var(--color-accent-1)',
  containerSx,
}: AppMultiSelectPillsProps<T>) {
  return (
    <Box sx={{ mb: 2.5, display: 'flex', flexWrap: 'wrap', gap: 1, ...containerSx }}>
      {options.map((option) => {
        const isActive = value.includes(option);

        return (
          <button
            key={option}
            type='button'
            onClick={() => {
              if (isActive) {
                onChange(value.filter((item) => item !== option));
                return;
              }

              onChange([...value, option]);
            }}
            style={{ all: 'unset', cursor: 'pointer' }}
          >
            <Box
              sx={{
                height: 34,
                borderRadius: '999px',
                px: 1.5,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid',
                borderColor: isActive ? activeBackgroundColor : inactiveBorderColor,
                backgroundColor: isActive ? activeBackgroundColor : inactiveBackgroundColor,
                color: isActive ? activeTextColor : inactiveTextColor,
                fontSize: 14,
                lineHeight: 1,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: isActive ? activeBackgroundColor : hoverBorderColor,
                },
              }}
            >
              {option}
            </Box>
          </button>
        );
      })}
    </Box>
  );
}
