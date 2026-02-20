import type { TextFieldProps } from '@mui/material/TextField';

import { tourTypeOptions } from '@/content/shared/tourTypeOptions';
import { locations } from '@/data/searchDDLocations';
import type { QuoteFormState } from '@/features/get-quote/hooks/useQuoteRequestForm';
import { muiFieldSx } from '@/utils/styles/muiFieldSx';

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

export const quoteFieldSx = muiFieldSx;

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
