'use client';

import { memo, useId } from 'react';

import DateRangePickerInput from '@/components/common/date/DateRangePickerInput';
import AppSelectField from '@/components/common/form/AppSelectField';
import AppTextareaField from '@/components/common/form/AppTextareaField';
import AppTextField from '@/components/common/form/AppTextField';
import type { QuoteFormState } from '@/features/get-quote/hooks/useQuoteRequestForm';

import type { QuoteFieldConfig } from './quoteFormConfig';
import { quoteFieldSx } from './quoteFormConfig';

interface QuoteFormFieldProps {
  field: QuoteFieldConfig;
  value: string;
  errorMessage?: string;
  onValueChange: (field: keyof QuoteFormState, value: string) => void;
}

function QuoteFormFieldComponent({
  field,
  value,
  errorMessage,
  onValueChange,
}: QuoteFormFieldProps) {
  const dateRangeInputId = useId();

  if (field.component === 'date-range') {
    return (
      <div className={field.colClassName}>
        <div className='quoteDateRangeField'>
          <DateRangePickerInput
            key={`${field.name}:${value}`}
            inputId={dateRangeInputId}
            containerClassName='quoteDateRangeField__container'
            initialDisplayValue={value}
            format='MMMM DD'
            offsetY={10}
            emitInitialValue
            useMuiInput
            muiInputLabel={field.label}
            muiInputRequired={field.required}
            muiInputError={Boolean(errorMessage)}
            muiInputHelperText={errorMessage}
            muiInputSx={quoteFieldSx}
            onValueChange={(displayValue) => onValueChange(field.name, displayValue)}
          />
        </div>
      </div>
    );
  }

  if (field.selectOptions) {
    return (
      <div className={field.colClassName}>
        <AppSelectField
          label={field.label}
          value={value}
          options={field.selectOptions.map((option) => ({ value: option, label: option }))}
          onChange={(nextValue) => onValueChange(field.name, nextValue)}
          emptyOptionLabel={field.placeholder ?? `Select ${field.label}`}
          required={field.required}
          errorMessage={errorMessage}
          sx={quoteFieldSx}
        />
      </div>
    );
  }

  if (field.multiline) {
    return (
      <div className={field.colClassName}>
        <AppTextareaField
          label={field.label}
          value={value}
          onChange={(nextValue) => onValueChange(field.name, nextValue)}
          required={field.required}
          placeholder={field.placeholder}
          minRows={field.minRows}
          shrinkLabel={field.shrinkLabel}
          errorMessage={errorMessage}
          sx={quoteFieldSx}
        />
      </div>
    );
  }

  return (
    <div className={field.colClassName}>
      <AppTextField
        label={field.label}
        value={value}
        onChange={(nextValue) => onValueChange(field.name, nextValue)}
        required={field.required}
        type={field.type}
        placeholder={field.placeholder}
        shrinkLabel={field.shrinkLabel}
        inputProps={field.inputProps}
        errorMessage={errorMessage}
        sx={quoteFieldSx}
      />
    </div>
  );
}

const QuoteFormField = memo(QuoteFormFieldComponent);
QuoteFormField.displayName = 'QuoteFormField';

export default QuoteFormField;
