'use client';

import { useState } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';

interface CalenderProps {
  active?: boolean;
}

export default function Calender({ active: _active }: CalenderProps) {
  const [dates, setDates] = useState([new DateObject(), new DateObject().add(1, 'day')]);
  return (
    <DatePicker
      inputClass='custom_input-picker'
      containerClassName='custom_container-picker'
      value={dates}
      onChange={setDates}
      numberOfMonths={2}
      offsetY={10}
      range
      // className="yellow"
      rangeHover
      format='MMMM DD'
    />
  );
}
