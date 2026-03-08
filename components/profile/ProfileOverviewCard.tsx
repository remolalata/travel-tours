'use client';

import { CircleUserRound, Mail, PhoneCall } from 'lucide-react';
import Image from 'next/image';

import type { ProfileOverviewContent } from '@/types/profile';
import { buildProfileDisplayName, buildProfileInitials } from '@/utils/helpers/profile';

type ProfileOverviewCardProps = {
  content: ProfileOverviewContent;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  isSaving: boolean;
};

export default function ProfileOverviewCard({
  content,
  firstName,
  lastName,
  email,
  phone,
  avatarUrl,
  onImageChange,
  isSaving,
}: ProfileOverviewCardProps) {
  const displayName = buildProfileDisplayName({
    firstName,
    lastName,
    email,
    fallbackName: content.fallbackName,
  });
  const initials = buildProfileInitials({
    firstName,
    lastName,
    email,
    fallbackName: content.fallbackName,
  });
  const profilePhotoInputId = 'profile-photo-input';
  const detailItems = [
    {
      id: 'full-name',
      value: displayName,
      icon: CircleUserRound,
    },
    {
      id: 'email',
      value: email || '-',
      icon: Mail,
    },
    {
      id: 'phone',
      value: phone || '-',
      icon: PhoneCall,
    },
  ] as const;

  return (
    <div className='rounded-12 bg-white shadow-2 px-30 py-30 md:px-20'>
      <div className='d-flex flex-column items-center text-center'>
        {avatarUrl ? (
          <Image
            width={120}
            height={120}
            src={avatarUrl}
            alt={content.avatar.imageAlt}
            className='rounded-circle object-cover'
            style={{ borderRadius: '50%' }}
            unoptimized={avatarUrl.startsWith('blob:')}
          />
        ) : (
          <div
            className='size-120 rounded-circle bg-accent-1-05 text-accent-1 flex-center text-30 fw-700'
            style={{ borderRadius: '50%' }}
          >
            {initials}
          </div>
        )}

        <h2 className='text-22 fw-600 mt-20'>{displayName}</h2>
        <p className='mt-10'>{content.description}</p>

        <div className='d-flex flex-wrap justify-center items-center x-gap-15 y-gap-10 mt-20'>
          <label
            htmlFor={profilePhotoInputId}
            className='button -sm -dark-1 bg-accent-1 text-white d-inline-flex items-center'
            aria-disabled={isSaving}
            style={{ cursor: isSaving ? 'not-allowed' : 'pointer' }}
          >
            {content.avatar.uploadLabel}
          </label>
          <input
            id={profilePhotoInputId}
            type='file'
            accept='image/*'
            onChange={onImageChange}
            disabled={isSaving}
            style={{ display: 'none' }}
          />
          {!avatarUrl ? (
            <div className='text-14 text-light-1 d-flex items-center'>
              {content.avatar.emptyLabel}
            </div>
          ) : null}
        </div>
      </div>

      <div className='border-top-light mt-25 pt-25'>
        {detailItems.map((item, index) => (
          <div
            key={item.id}
            className={index === 0 ? 'd-flex items-center' : 'd-flex items-center mt-20'}
          >
            <div className='shrink-0 text-accent-1 d-flex items-center justify-center'>
              <item.icon size={22} strokeWidth={1.9} />
            </div>
            <div className='ml-15 text-15 fw-500'>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
