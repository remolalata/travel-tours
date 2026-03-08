'use client';

import type { FormEvent } from 'react';

import AppTextField from '@/components/common/form/AppTextField';
import type { ProfileFormSectionContent, ProfileFormState } from '@/types/profile';

type ProfileDetailsSectionProps = {
  content: ProfileFormSectionContent;
  form: ProfileFormState;
  errors: Partial<Record<keyof ProfileFormState, string>>;
  isSaving: boolean;
  onFieldChange: (field: keyof ProfileFormState, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function ProfileDetailsSection({
  content,
  form,
  errors,
  isSaving,
  onFieldChange,
  onSubmit,
}: ProfileDetailsSectionProps) {
  return (
    <div className='rounded-12 bg-white shadow-2 px-30 py-30 md:px-20'>
      <div className='mb-30'>
        <h3 className='text-20 fw-600'>{content.title}</h3>
        <p className='mt-10'>{content.description}</p>
      </div>

      <form className='row y-gap-20' onSubmit={onSubmit}>
        {content.fields.map((field) => {
          const fieldName: keyof ProfileFormState =
            field.id === 'first-name'
              ? 'firstName'
              : field.id === 'last-name'
                ? 'lastName'
                : field.id === 'email'
                  ? 'email'
                  : 'phone';

          return (
            <div key={field.id} className='col-md-6'>
              <AppTextField
                type={field.id === 'email' ? 'email' : 'text'}
                label={field.label}
                value={form[fieldName]}
                onChange={(value) => onFieldChange(fieldName, value)}
                errorMessage={errors[fieldName]}
                autoComplete={
                  field.id === 'first-name'
                    ? 'given-name'
                    : field.id === 'last-name'
                      ? 'family-name'
                      : field.id === 'email'
                        ? 'email'
                        : 'tel'
                }
              />
            </div>
          );
        })}

        <div className='col-12'>
          <button
            className='button -md -dark-1 bg-accent-1 text-white'
            type='submit'
            disabled={isSaving}
          >
            {isSaving ? content.savingLabel : content.submitLabel}
            <i className='icon-arrow-top-right text-16 ml-10' />
          </button>
        </div>
      </form>
    </div>
  );
}
