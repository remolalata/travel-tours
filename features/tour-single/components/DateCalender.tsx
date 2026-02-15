'use client';

import { Calendar } from 'react-multi-date-picker';
export default function DateCalender() {
  return (
    <>
      <div className='calenderTourSongle'>
        <Calendar numberOfMonths={2} range />{' '}
      </div>
    </>
  );
}
