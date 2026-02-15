import { locations } from '@/data/searchDDLocations';
import { tourTypeOptions } from '@/components/common/dropdownSearch/TourType';
import type { QuoteFormState } from '@/features/get-quote/hooks/useQuoteRequestForm';
import type { SxProps, Theme } from '@mui/material/styles';
import type { TextFieldProps } from '@mui/material/TextField';

export interface QuoteFieldConfig {
  name: keyof QuoteFormState;
  colClassName: string;
  label: string;
  component?: 'text' | 'date-range';
  required?: boolean;
  type?: TextFieldProps['type'];
  selectOptions?: readonly string[];
  multiline?: boolean;
  minRows?: number;
  placeholder?: string;
  shrinkLabel?: boolean;
  inputProps?: TextFieldProps['inputProps'];
}

const budgetOptions = ['Below ₱20,000', '₱20,000 - ₱50,000', '₱50,000 - ₱100,000', '₱100,000+'];
const hotelClassOptions = ['3-Star', '4-Star', '5-Star', 'Flexible'];
const destinationOptions = Array.from(new Set(locations.map((location) => location.choice)));

export const quoteFieldSx: SxProps<Theme> = {
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

export const quoteFieldConfigs: readonly QuoteFieldConfig[] = [
  {
    name: 'where',
    label: 'Where',
    colClassName: 'col-md-6',
    required: true,
    selectOptions: destinationOptions,
  },
  {
    name: 'when',
    label: 'When',
    colClassName: 'col-md-6',
    component: 'date-range',
    required: true,
  },
  {
    name: 'tourType',
    label: 'Tour Type',
    colClassName: 'col-md-6',
    required: true,
    selectOptions: tourTypeOptions,
  },
  {
    name: 'adults',
    label: 'Adults',
    colClassName: 'col-md-3',
    required: true,
    type: 'number',
    inputProps: { min: 1 },
  },
  {
    name: 'children',
    label: 'Children',
    colClassName: 'col-md-3',
    type: 'number',
    inputProps: { min: 0 },
  },
  {
    name: 'budget',
    label: 'Budget Range',
    colClassName: 'col-md-6',
    selectOptions: budgetOptions,
  },
  {
    name: 'hotelClass',
    label: 'Preferred Hotel',
    colClassName: 'col-md-6',
    selectOptions: hotelClassOptions,
  },
  {
    name: 'fullName',
    label: 'Full Name',
    colClassName: 'col-md-4',
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    colClassName: 'col-md-4',
    required: true,
    type: 'email',
  },
  {
    name: 'phone',
    label: 'Phone Number',
    colClassName: 'col-md-4',
    required: true,
  },
  {
    name: 'notes',
    label: 'Additional Notes',
    colClassName: 'col-12',
    multiline: true,
    minRows: 3,
    placeholder: 'Flight preference, activities, pickup details, or special requests.',
  },
];
