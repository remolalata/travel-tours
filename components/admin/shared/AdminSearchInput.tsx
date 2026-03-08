'use client';

import { type CSSProperties } from 'react';

type AdminSearchInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
  placeholder: string;
  containerClassName?: string;
  containerStyle?: CSSProperties;
  inputClassName?: string;
};

export default function AdminSearchInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  containerClassName,
  containerStyle,
  inputClassName,
}: AdminSearchInputProps) {
  return (
    <div
      className={`d-flex items-center px-20 py-5 border rounded-200 dashboard__content_header_search ${containerClassName ?? ''}`.trim()}
      style={containerStyle}
    >
      <i className='mr-10 text-18 icon-search'></i>
      <label className='visually-hidden' htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type='text'
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        className={inputClassName}
        placeholder={placeholder}
        autoComplete='off'
        autoCorrect='off'
        autoCapitalize='none'
        spellCheck={false}
      />
    </div>
  );
}
