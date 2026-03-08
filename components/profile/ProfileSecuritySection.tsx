'use client';

import type { FormEvent } from 'react';

import AppTextField from '@/components/common/form/AppTextField';
import type { ProfilePasswordFormState, ProfileSecuritySectionContent } from '@/types/profile';

type ProfileSecuritySectionProps = {
  content: ProfileSecuritySectionContent;
  form: ProfilePasswordFormState;
  errors: Partial<Record<keyof ProfilePasswordFormState, string>>;
  isSaving: boolean;
  onFieldChange: (field: keyof ProfilePasswordFormState, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function ProfileSecuritySection({
  content,
  form,
  errors,
  isSaving,
  onFieldChange,
  onSubmit,
}: ProfileSecuritySectionProps) {
  return (
    <div className='rounded-12 bg-white shadow-2 px-30 py-30 md:px-20'>
      <div className='mb-30'>
        <h3 className='text-20 fw-600'>{content.title}</h3>
        <p className='mt-10'>{content.description}</p>
      </div>

      <form className='row y-gap-20' onSubmit={onSubmit}>
        {content.fields.map((field) => {
          const fieldName: keyof ProfilePasswordFormState =
            field.id === 'old-password'
              ? 'oldPassword'
              : field.id === 'new-password'
                ? 'newPassword'
                : 'confirmPassword';

          return (
            <div key={field.id} className='col-md-6'>
              <AppTextField
                type='password'
                label={field.label}
                value={form[fieldName]}
                onChange={(value) => onFieldChange(fieldName, value)}
                errorMessage={errors[fieldName]}
                autoComplete='new-password'
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
