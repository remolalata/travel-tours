import Link from 'next/link';

import type { ProfileShortcutSectionContent } from '@/types/profile';

type ProfileShortcutCardProps = {
  content: ProfileShortcutSectionContent;
};

export default function ProfileShortcutCard({ content }: ProfileShortcutCardProps) {
  return (
    <div className='rounded-12 bg-white shadow-2 px-30 py-30 md:px-20'>
      <h3 className='text-20 fw-600'>{content.title}</h3>
      <p className='mt-10'>{content.description}</p>

      <Link href={content.ctaHref} className='button -md -outline-accent-1 text-accent-1 mt-20'>
        {content.ctaLabel}
      </Link>
    </div>
  );
}
