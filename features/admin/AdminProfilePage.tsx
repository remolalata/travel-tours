'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { type FormEvent, useCallback, useEffect, useState } from 'react';

import useAdminPasswordEditor from '@/api/admin/profile/hooks/useAdminPasswordEditor';
import useAdminProfileEditor from '@/api/admin/profile/hooks/useAdminProfileEditor';
import useAdminProfileQuery from '@/api/admin/profile/hooks/useAdminProfileQuery';
import AdminShell from '@/components/admin/layout/AdminShell';
import AppToast from '@/components/common/feedback/AppToast';
import AppTextField from '@/components/common/form/AppTextField';
import { adminContent } from '@/content/features/admin';
import type { AdminPasswordFormState, AdminProfileFormState } from '@/types/admin';

type AdminProfilePageContentProps = {
  initialData: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    avatarUrl: string | null;
  };
  onUnauthorized: () => void;
};

function AdminProfilePageContent({ initialData, onUnauthorized }: AdminProfilePageContentProps) {
  const content = adminContent.pages.profile;
  const [toastState, setToastState] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  const {
    profileForm,
    avatarPreview,
    profileFieldErrors,
    isSavingProfile,
    setProfileField,
    handleImageChange,
    clearAvatar,
    saveProfile,
  } = useAdminProfileEditor({ onUnauthorized, initialData });

  const {
    passwordForm,
    passwordFieldErrors,
    isSavingPassword,
    setPasswordField,
    savePassword,
  } = useAdminPasswordEditor({ onUnauthorized });

  const primaryPhoto = content.photos[0];

  const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await saveProfile();
    setToastState({
      open: true,
      message: result.message,
      severity: result.success ? 'success' : 'error',
    });
  };

  const handleSavePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await savePassword();
    setToastState({
      open: true,
      message: result.message,
      severity: result.success ? 'success' : 'error',
    });
  };

  return (
    <>
      <div className='rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 mt-60'>
        <h5 className='text-20 fw-500 mb-30'>{content.profileTitle}</h5>

        <form className='row y-gap-30' onSubmit={handleSaveProfile}>
          {content.profileFields.map((field) => {
            const fieldValue =
              field.id === 'first-name'
                ? profileForm.firstName
                : field.id === 'last-name'
                  ? profileForm.lastName
                  : field.id === 'phone'
                    ? profileForm.phone
                    : profileForm.email;

            const fieldName: keyof AdminProfileFormState =
              field.id === 'first-name'
                ? 'firstName'
                : field.id === 'last-name'
                  ? 'lastName'
                  : field.id === 'phone'
                    ? 'phone'
                    : 'email';

            return (
              <div key={field.id} className='col-md-6'>
                <AppTextField
                  type={field.id === 'email' ? 'email' : 'text'}
                  label={field.label}
                  value={fieldValue}
                  onChange={(value) => setProfileField(fieldName, value)}
                  errorMessage={profileFieldErrors[fieldName]}
                />
              </div>
            );
          })}

          <div className='col-12'>
            <h4 className='text-18 fw-500 mb-20'>{content.photoTitle}</h4>
            <div className='row x-gap-20 y-gap-20'>
              {avatarPreview ? (
                <div className='col-auto'>
                  <div className='relative'>
                    <Image
                      width={200}
                      height={200}
                      src={avatarPreview}
                      alt={primaryPhoto?.alt ?? content.photoTitle}
                      className='size-200 rounded-12 object-cover'
                      unoptimized={avatarPreview.startsWith('blob:')}
                    />
                    <button onClick={clearAvatar} className='absoluteIcon1 button -dark-1' type='button'>
                      <i className='icon-delete text-18'></i>
                    </button>
                  </div>
                </div>
              ) : (
                <div className='col-auto'>
                  <label
                    htmlFor={primaryPhoto?.id ?? 'profile-photo'}
                    className='size-200 rounded-12 border-dash-1 bg-accent-1-05 flex-center flex-column'
                  >
                    <Image width={40} height={40} alt={primaryPhoto?.alt ?? content.uploadLabel} src='/img/dashboard/upload.svg' />
                    <div className='text-16 fw-500 text-accent-1 mt-10'>{content.uploadLabel}</div>
                  </label>
                  <input
                    onChange={handleImageChange}
                    accept='image/*'
                    id={primaryPhoto?.id ?? 'profile-photo'}
                    type='file'
                    style={{ display: 'none' }}
                  />
                </div>
              )}
            </div>

            <button className='button -md -dark-1 bg-accent-1 text-white mt-30' type='submit' disabled={isSavingProfile}>
              {isSavingProfile ? content.savingLabel : content.profileSaveLabel}
              <i className='icon-arrow-top-right text-16 ml-10'></i>
            </button>
          </div>
        </form>
      </div>

      <div className='rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 mt-30'>
        <h5 className='text-20 fw-500 mb-30'>{content.passwordTitle}</h5>

        <form className='y-gap-30' onSubmit={handleSavePassword}>
          <div className='row y-gap-30'>
            {content.passwordFields.map((field) => {
              const fieldValue =
                field.id === 'old-password'
                  ? passwordForm.oldPassword
                  : field.id === 'new-password'
                    ? passwordForm.newPassword
                    : passwordForm.confirmPassword;

              const fieldName: keyof AdminPasswordFormState =
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
                    value={fieldValue}
                    onChange={(value) => setPasswordField(fieldName, value)}
                    autoComplete='new-password'
                    errorMessage={passwordFieldErrors[fieldName]}
                  />
                </div>
              );
            })}
          </div>

          <div className='row'>
            <div className='col-12'>
              <button className='button -md -dark-1 bg-accent-1 text-white' type='submit' disabled={isSavingPassword}>
                {isSavingPassword ? content.savingLabel : content.passwordSaveLabel}
                <i className='icon-arrow-top-right text-16 ml-10'></i>
              </button>
            </div>
          </div>
        </form>
      </div>

      <AppToast
        open={toastState.open}
        message={toastState.message}
        severity={toastState.severity}
        onClose={() => setToastState((previousValue) => ({ ...previousValue, open: false }))}
      />
    </>
  );
}

export default function AdminProfilePage() {
  const content = adminContent.pages.profile;
  const router = useRouter();
  const handleUnauthorized = useCallback(() => {
    router.replace('/login');
  }, [router]);
  const profileQuery = useAdminProfileQuery();

  useEffect(() => {
    if (profileQuery.error instanceof Error && profileQuery.error.message === 'UNAUTHORIZED') {
      handleUnauthorized();
    }
  }, [handleUnauthorized, profileQuery.error]);

  if (profileQuery.isLoading || !profileQuery.data) {
    return (
      <AdminShell title={content.intro.title} description={content.intro.description}>
        <div className='rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 mt-60'>{content.loadingLabel}</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title={content.intro.title} description={content.intro.description}>
      <AdminProfilePageContent
        key={profileQuery.data.userId}
        initialData={{
          firstName: profileQuery.data.firstName,
          lastName: profileQuery.data.lastName,
          phone: profileQuery.data.phone,
          email: profileQuery.data.email,
          avatarUrl: profileQuery.data.avatarUrl,
        }}
        onUnauthorized={handleUnauthorized}
      />
    </AdminShell>
  );
}
