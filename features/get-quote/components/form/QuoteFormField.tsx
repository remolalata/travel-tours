'use client';

import { MenuItem, TextField } from '@mui/material';
import type { ChangeEvent } from 'react';
import { memo, useCallback, useId } from 'react';

import DateRangePickerInput from '@/components/common/date/DateRangePickerInput';
import type { QuoteFormState } from '@/features/get-quote/hooks/useQuoteRequestForm';

import type { QuoteFieldConfig } from './quoteFormConfig';
import { quoteFieldSx } from './quoteFormConfig';

interface QuoteFormFieldProps {
  field: QuoteFieldConfig;
  value: string;
  onValueChange: (field: keyof QuoteFormState, value: string) => void;
}

function QuoteFormFieldComponent({ field, value, onValueChange }: QuoteFormFieldProps) {
  const dateRangeInputId = useId();
  const handleTextFieldChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onValueChange(field.name, event.target.value);
    },
    [field.name, onValueChange],
  );

  if (field.component === 'date-range') {
    return (
      <div className={field.colClassName}>
        <div className='quoteDateRangeField'>
          <DateRangePickerInput
            inputId={dateRangeInputId}
            containerClassName='quoteDateRangeField__container'
            format='MMMM DD'
            offsetY={10}
            emitInitialValue
            useMuiInput
            muiInputLabel={field.label}
            muiInputRequired={field.required}
            muiInputSx={quoteFieldSx}
            onValueChange={(displayValue) => onValueChange(field.name, displayValue)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={field.colClassName}>
      <TextField
        select={Boolean(field.selectOptions)}
        fullWidth
        required={field.required}
        label={field.label}
        value={value}
        onChange={handleTextFieldChange}
        type={field.type}
        multiline={field.multiline}
        minRows={field.minRows}
        placeholder={field.placeholder}
        InputLabelProps={field.shrinkLabel ? { shrink: true } : undefined}
        inputProps={field.inputProps}
        sx={quoteFieldSx}
      >
        {field.selectOptions?.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}

const QuoteFormField = memo(QuoteFormFieldComponent);
QuoteFormField.displayName = 'QuoteFormField';

export default QuoteFormField;
