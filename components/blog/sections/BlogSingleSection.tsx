import Image from 'next/image';
import Link from 'next/link';

import type { BlogPost } from '@/types/blog';

type BlogSingleSectionProps = {
  post: BlogPost;
};

export default function BlogSingleSection({ post }: BlogSingleSectionProps) {
  const article = post.article;

  return (
    <section className='layout-pt-md layout-pb-xl'>
      <div className='container'>
        <div className='row y-gap-30 justify-center'>
          <div className='col-lg-8'>
            <h2 className='text-30 md:text-24'>{article.sectionTitle}</h2>

            {article.introParagraphs.map((paragraph, index) => (
              <p key={`${post.slug}-intro-${index}`} className='mt-20'>
                {paragraph}
              </p>
            ))}

            <ul className='ulList2 mt-20'>
              {article.bulletPoints.map((point, index) => (
                <li key={`${post.slug}-point-${index}`}>{point}</li>
              ))}
            </ul>

            <div className='blockquote bg-accent-1-05 rounded-12 px-30 py-30 mt-20'>
              <div className='blockquote__text'>“{article.quote}“</div>
            </div>

            {article.bodyParagraphs.map((paragraph, index) => (
              <p key={`${post.slug}-body-${index}`} className='mt-20'>
                {paragraph}
              </p>
            ))}

            <div className='row y-gap-30 pt-20'>
              {article.gallery.map((galleryItem) => (
                <div key={galleryItem.id} className='col-md-6'>
                  <Image
                    width={410}
                    height={350}
                    src={galleryItem.imageSrc}
                    alt={galleryItem.caption}
                    className='rounded-8'
                  />
                  <div className='mt-10'>{galleryItem.caption}</div>
                </div>
              ))}
            </div>

            <div className='row y-gap-15 justify-between items-center pt-20'>
              <div className='col-auto'>
                <div className='d-flex x-gap-10'>
                  {article.shareLinks.map((shareLink) => (
                    <div key={shareLink.id}>
                      <Link
                        href={shareLink.href}
                        className='button -accent-1 size-40 flex-center bg-accent-1-05 rounded-full'
                        aria-label={shareLink.label}
                      >
                        <i className={shareLink.iconClass}></i>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              <div className='col-auto'>
                <div className='d-flex x-gap-10'>
                  {article.tags.map((tag) => (
                    <div key={tag.id}>
                      <Link
                        href={tag.href}
                        className='button -accent-1 border-1 text-14 px-15 py-10 rounded-200'
                      >
                        {tag.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className='line mt-60 mb-30'></div>

            <div className='row y-gap-20'>
              <div className='col-auto'>
                <Image width={70} height={70} src={article.author.imageSrc} alt={article.author.name} />
              </div>

              <div className='col'>
                <div className='text-18 fw-500'>{article.author.name}</div>
                <div className='lh-15'>{article.author.role}</div>
                <div className='mt-20'>{article.author.bio}</div>
              </div>
            </div>

            <div className='line mt-30 mb-30'></div>

            <div className='row y-gap-15 justify-between'>
              <div className='col-md-auto'>
                <Link href={`/blog/${article.navigation.previous.slug}`} className='d-flex'>
                  <div className='pt-5'>
                    <i className='icon-arrow-left text-16'></i>
                  </div>
                  <div className='ml-20'>
                    <div className='text-18 fw-500'>{article.navigation.previous.label}</div>
                    <div className='mt-5'>{article.navigation.previous.title}</div>
                  </div>
                </Link>
              </div>

              <div className='col-md-auto'>
                <Link href={`/blog/${article.navigation.next.slug}`} className='d-flex text-right md:text-left'>
                  <div className='mr-20'>
                    <div className='text-18 fw-500'>{article.navigation.next.label}</div>
                    <div className='mt-5'>{article.navigation.next.title}</div>
                  </div>
                  <div className='pt-5'>
                    <i className='icon-arrow-right text-16'></i>
                  </div>
                </Link>
              </div>
            </div>

            <div className='line mt-30 mb-30'></div>

            <h2 className='text-30 mt-30'>{article.reviewsTitle}</h2>

            <div className='row y-gap-20 pt-30'>
              {article.reviews.map((review) => (
                <div key={review.id} className='col-12'>
                  <div className='border-1 rounded-12 px-20 py-20'>
                    <div className='d-flex items-center justify-between'>
                      <h4 className='text-16 fw-500'>{review.reviewer}</h4>
                      <div className='text-14'>{review.publishedAt}</div>
                    </div>
                    <div className='text-14 text-accent-1 mt-5'>{review.ratingLabel}</div>
                    <p className='mt-10'>{review.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className='button -md -outline-accent-1 text-accent-1 mt-30' type='button'>
              {article.reviewsCtaLabel}
              <i className='icon-arrow-top-right text-16 ml-10'></i>
            </button>

            <div className='mt-40'>
              <h3 className='text-24 fw-500'>{article.commentForm.title}</h3>

              <div className='contactForm row y-gap-30 pt-20'>
                <div className='col-md-6'>
                  <div className='form-input'>
                    <input type='text' required />
                    <label className='lh-1 text-16 text-light-1'>{article.commentForm.nameLabel}</label>
                  </div>
                </div>

                <div className='col-md-6'>
                  <div className='form-input'>
                    <input type='text' required />
                    <label className='lh-1 text-16 text-light-1'>{article.commentForm.emailLabel}</label>
                  </div>
                </div>

                <div className='col-12'>
                  <div className='form-input'>
                    <textarea required rows={8}></textarea>
                    <label className='lh-1 text-16 text-light-1'>{article.commentForm.commentLabel}</label>
                  </div>
                </div>

                <div className='col-12'>
                  <button className='button -md -dark-1 bg-accent-1 text-white' type='button'>
                    {article.commentForm.submitLabel}
                    <i className='icon-arrow-top-right text-16 ml-10'></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
