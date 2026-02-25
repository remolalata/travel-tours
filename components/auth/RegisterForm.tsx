'use client';

import AuthFormShell from '@/components/auth/AuthFormShell';
import AppTextField from '@/components/common/form/AppTextField';
import { authContent } from '@/content/features/auth';
import useRegisterForm from '@/utils/hooks/auth/useRegisterForm';

export default function RegisterForm() {
  const { formState, fieldErrors, errorMessage, successMessage, isSubmitting, setField, handleSubmit } =
    useRegisterForm();
  const registerContent = authContent.register;

  return (
    <AuthFormShell
      heading={registerContent.heading}
      subheading={registerContent.subheading}
      helpPrefix={registerContent.helpPrefix}
      helpLinkLabel={registerContent.helpLinkLabel}
      helpLinkHref={registerContent.helpLinkHref}
    >
      <form onSubmit={handleSubmit} noValidate className='px-60 md:px-25 py-60 md:py-30 border rounded-12'>
        <div className='row y-gap-30'>
          <div className='col-md-6'>
            <AppTextField
              label={registerContent.fields.firstNameLabel}
              value={formState.firstName}
              onChange={(value) => setField('firstName', value)}
              autoComplete='given-name'
              required
              errorMessage={fieldErrors.firstName}
            />
          </div>

          <div className='col-md-6'>
            <AppTextField
              label={registerContent.fields.lastNameLabel}
              value={formState.lastName}
              onChange={(value) => setField('lastName', value)}
              autoComplete='family-name'
              required
              errorMessage={fieldErrors.lastName}
            />
          </div>

          <div className='col-12'>
            <AppTextField
              label={registerContent.fields.phoneLabel}
              value={formState.phone}
              onChange={(value) => setField('phone', value)}
              autoComplete='tel'
              errorMessage={fieldErrors.phone}
            />
          </div>

          <div className='col-12'>
            <AppTextField
              type='email'
              label={registerContent.fields.emailLabel}
              value={formState.email}
              onChange={(value) => setField('email', value)}
              autoComplete='email'
              required
              errorMessage={fieldErrors.email}
            />
          </div>

          <div className='col-12'>
            <AppTextField
              type='password'
              label={registerContent.fields.passwordLabel}
              value={formState.password}
              onChange={(value) => setField('password', value)}
              autoComplete='new-password'
              required
              errorMessage={fieldErrors.password}
            />
          </div>

          <div className='col-12'>
            <AppTextField
              type='password'
              label={registerContent.fields.confirmPasswordLabel}
              value={formState.confirmPassword}
              onChange={(value) => setField('confirmPassword', value)}
              autoComplete='new-password'
              required
              errorMessage={fieldErrors.confirmPassword}
            />
          </div>
        </div>

        {errorMessage ? <div className='mt-20 text-14 text-red-2'>{errorMessage}</div> : null}
        {successMessage ? <div className='mt-20 text-14 text-green-2'>{successMessage}</div> : null}

        <button
          type='submit'
          disabled={isSubmitting}
          className='mt-30 text-white bg-accent-1 button -md -dark-1 col-12 disabled'
        >
          {isSubmitting ? registerContent.actions.submittingLabel : registerContent.actions.submitLabel}
          <i className='icon-arrow-top-right ml-10' />
        </button>
      </form>
    </AuthFormShell>
  );
}
