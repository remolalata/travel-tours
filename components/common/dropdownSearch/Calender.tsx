'use client';

import DateRangePickerInput from '@/components/common/date/DateRangePickerInput';
import type { Dayjs } from 'dayjs';

interface CalenderProps {
  active?: boolean;
  inputId?: string;
  onValueChange?: (displayValue: string, selectedDates: [Dayjs, Dayjs]) => void;
}

export default function Calender({ active: _active, inputId, onValueChange }: CalenderProps) {
  return (
    <DateRangePickerInput
      inputId={inputId}
      inputClassName='custom_input-picker'
      containerClassName='custom_container-picker'
      format='MMMM DD'
      offsetY={10}
      emitInitialValue
      onValueChange={onValueChange}
    />
  );
}
