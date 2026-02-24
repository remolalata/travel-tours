import Image from 'next/image';
import Link from 'next/link';

import Pagination from '@/components/common/Pagination';
import { blogContent } from '@/content/features/blog';

export default function BlogListTwoSection() {
  const listContent = blogContent.list;
  const sidebar = blogContent.sidebar;

  return (
    <section className='layout-pt-md layout-pb-xl'>
      <div className='container'>
        <div className='row y-gap-30 justify-between'>
          <div className='col-lg-8'>
            <div className='row y-gap-60'>
              {blogContent.posts.slice(0, 3).map((post) => (
                <div key={post.id} className='col-12'>
                  <Link href={`/blog/${post.slug}`} className='blogCard -type-1'>
                    <div className='blogCard__image ratio ratio-41:30'>
                      <Image
                        width={616}
                        height={451}
                        src={post.image}
                        alt={post.title}
                        className='img-ratio rounded-12'
                      />
                    </div>

                    <div className='blogCard__content mt-30'>
                      <div className='d-flex x-gap-10 text-14'>
                        <div className='lh-13'>{post.date}</div>
                        <div className='lh-13'>
                          {listContent.authorPrefix} {post.author}
                        </div>
                      </div>

                      <h3 className='blogCard__title text-30 lh-15 mt-10'>{post.title}</h3>

                      <p className='mt-10'>{post.excerpt}</p>

                      <div className='fw-500 mt-10 d-flex items-center'>
                        <span className='mr-10'>{listContent.readMoreLabel}</span>
                        <i className='icon-arrow-top-right text-12'></i>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            <div className='d-flex justify-center flex-column mt-60'>
              <Pagination />

              <div className='text-14 text-center mt-20'>{listContent.resultSummary}</div>
            </div>
          </div>

          <div className='col-lg-auto'>
            <div className='sidebar -type-2'>
              <div className='sidebar__search'>
                <i className='icon-search text-14'></i>
                <input type='text' placeholder={listContent.searchPlaceholder} />
              </div>

              <div className='sidebar__item'>
                <h4 className='text-18 fw-500 mb-20'>{listContent.categoriesTitle}</h4>

                <div className='d-flex flex-column y-gap-5'>
                  {sidebar.categories.map((category) => (
                    <Link key={category.id} href={category.href}>
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className='sidebar__item'>
                <h4 className='text-18 fw-500 mb-20'>{listContent.recentPostsTitle}</h4>

                <div className='d-flex y-gap-20 flex-column'>
                  {sidebar.recentPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className='d-flex align-center'>
                      <div className='size-70 overflow-hidden rounded-12'>
                        <Image
                          width={616}
                          height={451}
                          src={post.image}
                          alt={post.title}
                          className='img-cover'
                        />
                      </div>

                      <div className='ml-20'>
                        <h5 className='text-15 lh-14 fw-500'>{post.title}</h5>
                        <div className='text-14 lh-1 mt-10'>{post.date}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className='sidebar__item'>
                <h4 className='text-18 fw-500 mb-20'>{listContent.tagsTitle}</h4>

                <div className='sidebar__tags d-flex y-gap-10 x-gap-10'>
                  {sidebar.tags.map((tag) => (
                    <div key={tag.id}>
                      <Link href={tag.href}>{tag.name}</Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
