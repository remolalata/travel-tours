'use client';

import Image from 'next/image';
import { useState } from 'react';

import AdminShell from '@/components/admin/layout/AdminShell';
import { adminContent } from '@/content/features/admin';

type GalleryState = Record<string, string>;

export default function AdminAddTourPage() {
  const content = adminContent.pages.addTour;
  const [activeTabId, setActiveTabId] = useState(content.tabs[0]?.id ?? 'content');
  const [images, setImages] = useState<GalleryState>(
    Object.fromEntries(content.gallery.map((item) => [item.id, item.src])),
  );

  const activeTab = content.tabs.find((tab) => tab.id === activeTabId) ?? content.tabs[0];

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
        <div className='tabs -underline-2 js-tabs'>
          <div className='tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20 js-tabs-controls'>
            {content.tabs.map((tab, index) => (
              <div key={tab.id} className='col-auto'>
                <button
                  className={`tabs__button text-20 lh-12 fw-500 pb-15 lg:pb-0 js-tabs-button ${
                    activeTab.id === tab.id ? 'is-tab-el-active' : ''
                  }`}
                  onClick={() => setActiveTabId(tab.id)}
                  type='button'
                >
                  {index + 1}. {tab.label}
                </button>
              </div>
            ))}
          </div>

          <div className='row pt-40'>
            <div className='col-xl-9 col-lg-10'>
              <div className='tabs__content js-tabs-content'>
                <div className='tabs__pane is-tab-el-active'>
                  <div className='contactForm row y-gap-30'>
                    {activeTab.fields.map((field) => (
                      <div key={field.id} className='col-12'>
                        <div className='form-input'>
                          {field.kind === 'textarea' ? (
                            <textarea required rows={8}></textarea>
                          ) : (
                            <input type='text' required />
                          )}
                          <label className='lh-1 text-16 text-light-1'>{field.label}</label>
                        </div>
                      </div>
                    ))}

                    {activeTab.id === content.tabs[0]?.id && (
                      <div className='col-12'>
                        <h4 className='text-18 fw-500 mb-20'>{content.galleryTitle}</h4>

                        <div className='row x-gap-20 y-gap-20'>
                          {content.gallery.map((galleryItem) => {
                            const imageSrc = images[galleryItem.id] ?? '';

                            if (imageSrc) {
                              return (
                                <div key={galleryItem.id} className='col-auto'>
                                  <div className='relative'>
                                    <Image
                                      width={200}
                                      height={200}
                                      src={imageSrc}
                                      alt={galleryItem.alt}
                                      className='size-200 rounded-12 object-cover'
                                    />
                                    <button
                                      onClick={() =>
                                        setImages((previousValue) => ({
                                          ...previousValue,
                                          [galleryItem.id]: '',
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
                              <div key={galleryItem.id} className='col-auto'>
                                <label
                                  htmlFor={galleryItem.id}
                                  className='size-200 rounded-12 border-dash-1 bg-accent-1-05 flex-center flex-column'
                                >
                                  <Image width={40} height={40} alt={galleryItem.alt} src='/img/dashboard/upload.svg' />

                                  <div className='text-16 fw-500 text-accent-1 mt-10'>{content.uploadLabel}</div>
                                </label>
                                <input
                                  onChange={(event) => handleImageChange(event, galleryItem.id)}
                                  accept='image/*'
                                  id={galleryItem.id}
                                  type='file'
                                  style={{ display: 'none' }}
                                />
                              </div>
                            );
                          })}
                        </div>

                        <div className='text-14 mt-20'>{content.uploadHint}</div>
                      </div>
                    )}

                    <div className='col-12'>
                      <button className='button -md -dark-1 bg-accent-1 text-white mt-10' type='button'>
                        {content.saveLabel}
                        <i className='icon-arrow-top-right text-16 ml-10'></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
