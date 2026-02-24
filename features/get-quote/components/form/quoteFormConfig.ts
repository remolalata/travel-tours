import type { TextFieldProps } from '@mui/material/TextField';

import { getQuoteContent } from '@/content/features/getQuote';
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

const budgetOptions = getQuoteContent.form.options.budget;
const hotelClassOptions = getQuoteContent.form.options.hotelClass;
const destinationOptions = Array.from(new Set(locations.map((location) => location.choice)));
const fieldLabels = getQuoteContent.form.fields;

export const quoteFieldSx = muiFieldSx;

export const quoteFieldConfigs: readonly QuoteFieldConfig[] = [
  {
    name: 'where',
    label: fieldLabels.where,
    colClassName: 'col-md-6',
    required: true,
    selectOptions: destinationOptions,
  },
  {
    name: 'when',
    label: fieldLabels.when,
    colClassName: 'col-md-6',
    component: 'date-range',
    required: true,
  },
  {
    name: 'tourType',
    label: fieldLabels.tourType,
    colClassName: 'col-md-6',
    required: true,
    selectOptions: tourTypeOptions,
  },
  {
    name: 'adults',
    label: fieldLabels.adults,
    colClassName: 'col-md-3',
    required: true,
    type: 'number',
    inputProps: { min: 1 },
  },
  {
    name: 'children',
    label: fieldLabels.children,
    colClassName: 'col-md-3',
    type: 'number',
    inputProps: { min: 0 },
  },
  {
    name: 'budget',
    label: fieldLabels.budget,
    colClassName: 'col-md-6',
    required: true,
    selectOptions: budgetOptions,
  },
  {
    name: 'hotelClass',
    label: fieldLabels.hotelClass,
    colClassName: 'col-md-6',
    required: true,
    selectOptions: hotelClassOptions,
  },
  {
    name: 'fullName',
    label: fieldLabels.fullName,
    colClassName: 'col-md-4',
    required: true,
  },
  {
    name: 'email',
    label: fieldLabels.email,
    colClassName: 'col-md-4',
    required: true,
    type: 'email',
  },
  {
    name: 'phone',
    label: fieldLabels.phone,
    colClassName: 'col-md-4',
    required: true,
  },
  {
    name: 'notes',
    label: fieldLabels.notes,
    colClassName: 'col-12',
    multiline: true,
    minRows: 3,
    placeholder: fieldLabels.notesPlaceholder,
  },
];
