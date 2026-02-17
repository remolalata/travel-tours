'use client';

import Image from 'next/image';

import AdminShell from '@/components/admin/layout/AdminShell';
import { adminContent } from '@/content/features/admin';

export default function AdminMessagesPage() {
  const content = adminContent.pages.messages;

  return (
    <AdminShell title={content.intro.title} description={content.intro.description}>
      <div className='row y-gap-30 pt-60'>
        <div className='col-lg-4'>
          <div className='rounded-12 bg-white shadow-2 px-40 pt-40 pb-30'>
            <div className='dbSearch'>
              <i className='icon-search text-16'></i>
              <input type='search' placeholder={content.searchPlaceholder} />
            </div>

            <div className='row y-gap-30 pt-30'>
              {content.senders.map((sender) => (
                <div key={sender.id} className='col-12'>
                  <div className='row x-gap-10 y-gap-10 justify-between'>
                    <div className='col-auto'>
                      <div className='d-flex items-center'>
                        <Image width={50} height={50} src={sender.image} alt={sender.name} className='size-50 rounded-full' />

                        <div className='ml-10'>
                          <h5 className='text-15 lh-13 fw-500'>{sender.name}</h5>
                          <div className='text-14 lh-13'>{sender.role}</div>
                        </div>
                      </div>
                    </div>

                    <div className='col-auto'>
                      <div className='d-flex flex-column items-end md:items-start'>
                        <div className='text-14'>{sender.time}</div>

                        {sender.badgeText && (
                          <div
                            className={`size-16 flex-center rounded-full ${sender.badgeColor ?? ''} text-8 text-white`}
                          >
                            {sender.badgeText}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='col-lg-8'>
          <div className='rounded-12 bg-white shadow-2 px-40 pt-20 pb-30'>
            <div className='row x-gap-10 y-gap-10 justify-between items-center pb-20 border-1-bottom'>
              <div className='col-auto'>
                <div className='d-flex items-center'>
                  <Image
                    width={50}
                    height={50}
                    src={content.activeConversation.image}
                    alt={content.activeConversation.name}
                    className='size-50 rounded-full'
                  />

                  <div className='ml-10'>
                    <h5 className='text-15 lh-13 fw-500'>{content.activeConversation.name}</h5>
                    <div className='text-14 lh-13'>{content.activeConversation.status}</div>
                  </div>
                </div>
              </div>

              <div className='col-auto'>
                <button className='text-14' type='button'>
                  {content.deleteConversationLabel}
                </button>
              </div>
            </div>

            <div className='row pt-40 y-gap-25'>
              {content.thread.map((message) => (
                <div key={message.id} className={`col-12 ${message.align === 'right' ? 'd-flex justify-end' : ''}`}>
                  <div className='d-flex items-start x-gap-15'>
                    {message.align === 'left' && (
                      <Image
                        width={50}
                        height={50}
                        src={message.senderImage}
                        alt={message.senderName}
                        className='size-50 rounded-full'
                      />
                    )}

                    <div className={`px-20 py-15 rounded-12 ${message.align === 'right' ? 'bg-accent-1 text-white' : 'bg-light-1'}`}>
                      <div className='text-14 fw-500'>
                        {message.senderName} <span className='ml-5 text-12 fw-400'>{message.time}</span>
                      </div>
                      <div className='text-14 lh-15 mt-5'>{message.message}</div>
                    </div>

                    {message.align === 'right' && (
                      <Image
                        width={50}
                        height={50}
                        src={message.senderImage}
                        alt={message.senderName}
                        className='size-50 rounded-full'
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className='pt-30'>
              <div className='row x-gap-20 y-gap-20 items-center'>
                <div className='col'>
                  <div className='form-input'>
                    <input type='text' required />
                    <label className='lh-1 text-16 text-light-1'>{content.sendPlaceholder}</label>
                  </div>
                </div>
                <div className='col-auto'>
                  <button className='button -md -dark-1 bg-accent-1 text-white' type='button'>
                    {content.sendButtonLabel}
                    <i className='icon-arrow-top-right text-16 ml-10'></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
