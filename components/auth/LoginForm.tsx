'use client';

import Link from 'next/link';

import AppTextField from '@/components/common/form/AppTextField';
import { authContent } from '@/content/features/auth';
import useLoginForm from '@/utils/hooks/auth/useLoginForm';

export default function LoginForm() {
  const {
    email,
    password,
    fieldErrors,
    errorMessage,
    isSubmitting,
    setEmail,
    setPassword,
    handleSubmit,
  } = useLoginForm();

  return (
    <section className='mt-header layout-pt-lg layout-pb-lg'>
      <div className='container'>
        <div className='justify-center row'>
          <div className='col-xl-6 col-lg-7 col-md-9'>
            <div className='mb-60 md:mb-30 text-center'>
              <h1 className='text-30'>{authContent.login.heading}</h1>
              <div className='mt-20 md:mt-15 text-18 fw-500'>{authContent.login.subheading}</div>
              <div className='mt-5'>
                {authContent.login.helpPrefix}{' '}
                <Link href='/contact' className='text-accent-1'>
                  {authContent.login.helpLinkLabel}
                </Link>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className='px-60 md:px-25 py-60 md:py-30 border rounded-12'
            >
              <div>
                <AppTextField
                  type='email'
                  label={authContent.login.fields.emailLabel}
                  value={email}
                  onChange={setEmail}
                  autoComplete='email'
                  required
                  errorMessage={fieldErrors.email}
                />
              </div>

              <div className='mt-30'>
                <AppTextField
                  type='password'
                  label={authContent.login.fields.passwordLabel}
                  value={password}
                  onChange={setPassword}
                  autoComplete='current-password'
                  required
                  errorMessage={fieldErrors.password}
                />
              </div>

              {errorMessage ? <div className='mt-20 text-14 text-red-2'>{errorMessage}</div> : null}

              <button
                type='submit'
                disabled={isSubmitting}
                className='mt-30 text-white bg-accent-1 button -md -dark-1 col-12 disabled'
              >
                {isSubmitting
                  ? authContent.login.actions.submittingLabel
                  : authContent.login.actions.submitLabel}
                <i className='icon-arrow-top-right ml-10' />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
