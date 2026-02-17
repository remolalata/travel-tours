'use client';

import Image from 'next/image';
import { useState } from 'react';

import AdminShell from '@/components/admin/layout/AdminShell';
import { adminContent } from '@/content/features/admin';

type ProfilePhotoState = Record<string, string>;

export default function AdminProfilePage() {
  const content = adminContent.pages.profile;
  const [images, setImages] = useState<ProfilePhotoState>(
    Object.fromEntries(content.photos.map((item) => [item.id, item.src])),
  );

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const fileResult = reader.result;
      if (typeof fileResult === 'string') {
        setImages((previousValue) => ({
          ...previousValue,
          [id]: fileResult,
        }));
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <AdminShell title={content.intro.title} description={content.intro.description}>
      <div className='rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 mt-60'>
        <h5 className='text-20 fw-500 mb-30'>{content.profileTitle}</h5>

        <div className='contactForm row y-gap-30'>
          {content.profileFields.map((field) => (
            <div key={field.id} className={field.kind === 'textarea' ? 'col-12' : 'col-md-6'}>
              <div className='form-input'>
                {field.kind === 'textarea' ? <textarea required rows={8}></textarea> : <input type='text' required />}
                <label className='lh-1 text-16 text-light-1'>{field.label}</label>
              </div>
            </div>
          ))}

          <div className='col-12'>
            <h4 className='text-18 fw-500 mb-20'>{content.photoTitle}</h4>
            <div className='row x-gap-20 y-gap-20'>
              {content.photos.map((photo) => {
                const imageSrc = images[photo.id] ?? '';

                if (imageSrc) {
                  return (
                    <div key={photo.id} className='col-auto'>
                      <div className='relative'>
                        <Image
                          width={200}
                          height={200}
                          src={imageSrc}
                          alt={photo.alt}
                          className='size-200 rounded-12 object-cover'
                        />
                        <button
                          onClick={() =>
                            setImages((previousValue) => ({
                              ...previousValue,
                              [photo.id]: '',
                            }))
                          }
                          className='absoluteIcon1 button -dark-1'
                          type='button'
                        >
                          <i className='icon-delete text-18'></i>
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={photo.id} className='col-auto'>
                    <label
                      htmlFor={photo.id}
                      className='size-200 rounded-12 border-dash-1 bg-accent-1-05 flex-center flex-column'
                    >
                      <Image width={40} height={40} alt={photo.alt} src='/img/dashboard/upload.svg' />

                      <div className='text-16 fw-500 text-accent-1 mt-10'>{content.uploadLabel}</div>
                    </label>
                    <input
                      onChange={(event) => handleImageChange(event, photo.id)}
                      accept='image/*'
                      id={photo.id}
                      type='file'
                      style={{ display: 'none' }}
                    />
                  </div>
                );
              })}
            </div>

            <div className='text-14 mt-20'>{content.photoHint}</div>

            <button className='button -md -dark-1 bg-accent-1 text-white mt-30' type='button'>
              {content.profileSaveLabel}
              <i className='icon-arrow-top-right text-16 ml-10'></i>
            </button>
          </div>
        </div>
      </div>

      <div className='rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 mt-30'>
        <h5 className='text-20 fw-500 mb-30'>{content.passwordTitle}</h5>

        <div className='contactForm y-gap-30'>
          <div className='row y-gap-30'>
            {content.passwordFields.map((field) => (
              <div key={field.id} className='col-md-6'>
                <div className='form-input'>
                  <input type='text' required />
                  <label className='lh-1 text-16 text-light-1'>{field.label}</label>
                </div>
              </div>
            ))}
          </div>

          <div className='row'>
            <div className='col-12'>
              <button className='button -md -dark-1 bg-accent-1 text-white' type='button'>
                {content.passwordSaveLabel}
                <i className='icon-arrow-top-right text-16 ml-10'></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
