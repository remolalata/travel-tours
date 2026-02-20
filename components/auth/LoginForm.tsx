'use client';

import { TextField } from '@mui/material';
import Link from 'next/link';

import { authContent } from '@/content/features/auth';
import useLoginForm from '@/utils/hooks/auth/useLoginForm';
import { muiFieldSx } from '@/utils/styles/muiFieldSx';

export default function LoginForm() {
  const { email, password, errorMessage, isSubmitting, setEmail, setPassword, handleSubmit } =
    useLoginForm();

  return (
    <section className='mt-header layout-pt-lg layout-pb-lg'>
      <div className='container'>
        <div className='row justify-center'>
          <div className='col-xl-6 col-lg-7 col-md-9'>
            <div className='text-center mb-60 md:mb-30'>
              <h1 className='text-30'>{authContent.login.heading}</h1>
              <div className='text-18 fw-500 mt-20 md:mt-15'>{authContent.login.subheading}</div>
              <div className='mt-5'>
                {authContent.login.helpPrefix}{' '}
                <Link href='/contact' className='text-accent-1'>
                  {authContent.login.helpLinkLabel}
                </Link>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className='border-1 rounded-12 px-60 py-60 md:px-25 md:py-30'
            >
              <div>
                <TextField
                  fullWidth
                  required
                  type='email'
                  label={authContent.login.fields.emailLabel}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  sx={muiFieldSx}
                />
              </div>

              <div className='mt-30'>
                <TextField
                  fullWidth
                  required
                  type='password'
                  label={authContent.login.fields.passwordLabel}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete='current-password'
                  sx={muiFieldSx}
                />
              </div>

              {errorMessage ? <div className='mt-20 text-14 text-red-2'>{errorMessage}</div> : null}

              <button
                type='submit'
                disabled={isSubmitting}
                className='button -md -dark-1 bg-accent-1 text-white col-12 mt-30 disabled'
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
