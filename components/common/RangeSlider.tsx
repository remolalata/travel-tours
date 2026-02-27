'use client';
import type { SliderProps } from '@mui/material/Slider';
import Slider from '@mui/material/Slider';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { useState } from 'react';

type RangeSliderProps = {
  value?: [number, number];
  min?: number;
  max?: number;
  onChange?: (value: [number, number]) => void;
  onChangeCommitted?: (value: [number, number]) => void;
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#EB662B', // Change this color to your desired primary color
    },
    secondary: {
      main: '#f50057', // Change this color to your desired secondary color
    },
  },
});

export default function RangeSlider({
  value: valueProp,
  min = 0,
  max = 100000,
  onChange,
  onChangeCommitted,
}: RangeSliderProps) {
  const [internalValue, setInternalValue] = useState<[number, number]>([200, 60000]);
  const value = valueProp ?? internalValue;

  const handleChange: NonNullable<SliderProps['onChange']> = (_event, newValue) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      const nextValue: [number, number] = [newValue[0], newValue[1]];
      if (valueProp === undefined) {
        setInternalValue(nextValue);
      }
      onChange?.(nextValue);
    }
  };

  const handleChangeCommitted: NonNullable<SliderProps['onChangeCommitted']> = (
    _event,
    newValue,
  ) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      onChangeCommitted?.([newValue[0], newValue[1]]);
    }
  };

  return (
    <>
      <div className='js-price-rangeSlider' style={{ padding: '20px 15px' }}>
        <div className='px-5'>
          <ThemeProvider theme={theme}>
            <Slider
              getAriaLabel={() => 'Minimum distance'}
              value={value}
              onChange={handleChange}
              onChangeCommitted={handleChangeCommitted}
              valueLabelDisplay='auto'
              max={max}
              min={min}
              disableSwap
            />
          </ThemeProvider>
        </div>

        <div className='d-flex justify-between mt-20'>
          <div className=''>
            <span className=''>Price:</span>
            <span className='fw-500 js-lower'>{value[0]}</span>
            <span> - </span>
            <span className='fw-500 js-upper'>{value[1]}</span>
          </div>
        </div>
      </div>
    </>
  );
}
