'use client';

import Skeleton from '@mui/material/Skeleton';
import { useRouter } from 'next/navigation';
import { type FormEvent, useCallback, useEffect, useState } from 'react';

import RouteAccessGuard from '@/components/auth/RouteAccessGuard';
import AppToast from '@/components/common/feedback/AppToast';
import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeaderClient from '@/components/layout/header/SiteHeaderClient';
import ProfileDetailsSection from '@/components/profile/ProfileDetailsSection';
import ProfileOverviewCard from '@/components/profile/ProfileOverviewCard';
import ProfileSecuritySection from '@/components/profile/ProfileSecuritySection';
import ProfileShortcutCard from '@/components/profile/ProfileShortcutCard';
import { profilePageContent } from '@/content/features/profile';
import type { AuthViewerState } from '@/services/auth/mutations/authApi';
import usePasswordEditor from '@/services/profile/hooks/usePasswordEditor';
import useProfileEditor from '@/services/profile/hooks/useProfileEditor';
import useProfileQuery from '@/services/profile/hooks/useProfileQuery';

type ProfilePageContentProps = {
  initialData: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    avatarUrl: string | null;
  };
  onUnauthorized: () => void;
};

type ProfilePageProps = {
  initialAuthState: AuthViewerState;
};

function ProfilePageContent({ initialData, onUnauthorized }: ProfilePageContentProps) {
  const [toastState, setToastState] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  const {
    profileForm,
    profileFieldErrors,
    avatarPreview,
    isSavingProfile,
    setProfileField,
    handleImageChange,
    saveProfile,
  } = useProfileEditor({ onUnauthorized, initialData });
  const { passwordForm, passwordFieldErrors, isSavingPassword, setPasswordField, savePassword } =
    usePasswordEditor({ onUnauthorized });

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const result = await handleImageChange(event);

    if (!result.message) {
      return;
    }

    setToastState({
      open: true,
      message: result.message,
      severity: result.success ? 'success' : 'error',
    });
  };

  return (
    <>
      <div className='row y-gap-30'>
        <div className='col-xl-4 col-lg-5'>
          <ProfileOverviewCard
            content={profilePageContent.overview}
            firstName={profileForm.firstName}
            lastName={profileForm.lastName}
            email={profileForm.email}
            phone={profileForm.phone}
            avatarUrl={avatarPreview}
            onImageChange={handleImageUpload}
            isSaving={isSavingProfile}
          />
          <div className='mt-30'>
            <ProfileShortcutCard content={profilePageContent.shortcuts} />
          </div>
        </div>

        <div className='col-xl-8 col-lg-7'>
          <ProfileDetailsSection
            content={profilePageContent.personalInfo}
            form={profileForm}
            errors={profileFieldErrors}
            isSaving={isSavingProfile}
            onFieldChange={setProfileField}
            onSubmit={handleSaveProfile}
          />
          <div className='mt-30'>
            <ProfileSecuritySection
              content={profilePageContent.security}
              form={passwordForm}
              errors={passwordFieldErrors}
              isSaving={isSavingPassword}
              onFieldChange={setPasswordField}
              onSubmit={handleSavePassword}
            />
          </div>
        </div>
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

function getProfileContentKey(initialData: ProfilePageContentProps['initialData']): string {
  return [
    initialData.firstName,
    initialData.lastName,
    initialData.phone,
    initialData.email,
    initialData.avatarUrl ?? '',
  ].join('|');
}

function ProfileLoadingState() {
  return (
    <div className='row y-gap-30'>
      <div className='col-xl-4 col-lg-5'>
        <div className='rounded-12 bg-white shadow-2 px-30 py-30 md:px-20'>
          <div className='d-flex flex-column items-center text-center'>
            <Skeleton variant='circular' animation='wave' width={120} height={120} />
            <Skeleton variant='text' animation='wave' width='55%' height={40} className='mt-20' />
            <Skeleton variant='text' animation='wave' width='85%' height={28} />
            <Skeleton
              variant='rounded'
              animation='wave'
              width={150}
              height={38}
              className='mt-20'
            />
          </div>

          <div className='border-top-light mt-25 pt-25'>
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={index === 0 ? 'd-flex items-center' : 'd-flex items-center mt-20'}
              >
                <Skeleton variant='circular' animation='wave' width={22} height={22} />
                <Skeleton
                  variant='text'
                  animation='wave'
                  width='70%'
                  height={28}
                  className='ml-15'
                />
              </div>
            ))}
          </div>
        </div>

        <div className='mt-30 rounded-12 bg-white shadow-2 px-30 py-30 md:px-20'>
          <Skeleton variant='text' animation='wave' width='50%' height={34} />
          <Skeleton variant='text' animation='wave' width='90%' height={24} />
          <Skeleton variant='rounded' animation='wave' width={170} height={42} className='mt-20' />
        </div>
      </div>

      <div className='col-xl-8 col-lg-7'>
        <div className='rounded-12 bg-white shadow-2 px-30 py-30 md:px-20'>
          <Skeleton variant='text' animation='wave' width='35%' height={34} />
          <Skeleton variant='text' animation='wave' width='75%' height={24} />
          <div className='row y-gap-20 mt-10'>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className='col-md-6'>
                <Skeleton variant='rounded' animation='wave' width='100%' height={56} />
              </div>
            ))}
          </div>
          <Skeleton variant='rounded' animation='wave' width={170} height={44} className='mt-20' />
        </div>

        <div className='mt-30 rounded-12 bg-white shadow-2 px-30 py-30 md:px-20'>
          <Skeleton variant='text' animation='wave' width='25%' height={34} />
          <Skeleton variant='text' animation='wave' width='68%' height={24} />
          <div className='row y-gap-20 mt-10'>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className='col-md-6'>
                <Skeleton variant='rounded' animation='wave' width='100%' height={56} />
              </div>
            ))}
          </div>
          <Skeleton variant='rounded' animation='wave' width={190} height={44} className='mt-20' />
        </div>
      </div>
    </div>
  );
}

function ProfileErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className='rounded-12 bg-white shadow-2 px-30 py-30 md:px-20'>
      <div className='text-red-3'>{profilePageContent.messages.loadError}</div>
      <button
        type='button'
        className='button -sm -outline-accent-1 text-accent-1 mt-20'
        onClick={onRetry}
      >
        {profilePageContent.messages.retry}
      </button>
    </div>
  );
}

function AuthenticatedProfilePage() {
  const router = useRouter();
  const profileQuery = useProfileQuery();
  const profileData = profileQuery.data;
  const isProfileReady = profileQuery.isSuccess && Boolean(profileData) && !profileQuery.isFetching;
  const handleUnauthorized = useCallback(() => {
    router.replace('/login');
  }, [router]);

  useEffect(() => {
    if (profileQuery.error instanceof Error && profileQuery.error.message === 'UNAUTHORIZED') {
      handleUnauthorized();
    }
  }, [handleUnauthorized, profileQuery.error]);

  if (profileQuery.isError && !profileData) {
    return <ProfileErrorState onRetry={() => void profileQuery.refetch()} />;
  }

  if (!isProfileReady) {
    return <ProfileLoadingState />;
  }

  if (!profileData) {
    return <ProfileLoadingState />;
  }

  return (
    <ProfilePageContent
      key={`${profileData.userId}:${getProfileContentKey({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        email: profileData.email,
        avatarUrl: profileData.avatarUrl,
      })}`}
      initialData={{
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        email: profileData.email,
        avatarUrl: profileData.avatarUrl,
      }}
      onUnauthorized={handleUnauthorized}
    />
  );
}

export default function ProfilePage({ initialAuthState }: ProfilePageProps) {
  return (
    <main>
      <SiteHeaderClient initialAuthState={initialAuthState} />
      <RouteAccessGuard mode='auth-required' initialAuthState={initialAuthState}>
        <section className='layout-pt-xl layout-pb-lg accountPageShell'>
          <div className='container'>
            <div className='mb-60'>
              <h1 className='text-30 fw-700'>{profilePageContent.intro.title}</h1>
              <p className='mt-10'>{profilePageContent.intro.description}</p>
            </div>

            <AuthenticatedProfilePage />
          </div>
        </section>
      </RouteAccessGuard>
      <SiteFooter />
    </main>
  );
}
