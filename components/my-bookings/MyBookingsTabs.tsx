'use client';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import type { MyBookingsTabItem, MyBookingsTabKey } from '@/types/myBookings';

type MyBookingsTabsProps = {
  ariaLabel: string;
  activeTab: MyBookingsTabKey;
  items: MyBookingsTabItem[];
  onChange: (value: MyBookingsTabKey) => void;
};

export default function MyBookingsTabs({
  ariaLabel,
  activeTab,
  items,
  onChange,
}: MyBookingsTabsProps) {
  return (
    <Tabs
      value={activeTab}
      onChange={(_, value: MyBookingsTabItem['key']) => onChange(value)}
      aria-label={ariaLabel}
      variant='scrollable'
      scrollButtons='auto'
      TabIndicatorProps={{ style: { display: 'none' } }}
      sx={{
        minHeight: 0,
        minWidth: 0,
        '& .MuiTabs-flexContainer': {
          gap: '10px',
          flexWrap: {
            xs: 'nowrap',
            sm: 'wrap',
          },
        },
        '& .MuiTabs-scroller': {
          overflowX: {
            xs: 'auto !important',
            sm: 'hidden',
          },
        },
        '& .MuiTabs-scrollButtons': {
          color: 'var(--color-accent-1)',
        },
      }}
    >
      {items.map((item) => (
        <Tab
          key={item.key}
          value={item.key}
          label={item.label}
          disableRipple
          sx={{
            minHeight: 0,
            minWidth: 0,
            flexShrink: 0,
            px: {
              xs: '16px',
              sm: '20px',
            },
            py: '10px',
            borderRadius: '999px',
            border: '1px solid transparent',
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: 1.2,
            textTransform: 'none',
            color: 'var(--color-dark-1)',
            backgroundColor: 'var(--color-light-3)',
            transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease',
            '&:hover': {
              color: 'var(--color-accent-1)',
              backgroundColor: 'rgba(235, 102, 43, 0.08)',
              borderColor: 'var(--color-accent-1)',
            },
            '&.Mui-selected': {
              color: 'var(--color-white)',
              backgroundColor: 'var(--color-accent-1)',
            },
            '&.Mui-selected:hover': {
              backgroundColor: 'var(--color-accent-1-dark)',
            },
          }}
        />
      ))}
    </Tabs>
  );
}
