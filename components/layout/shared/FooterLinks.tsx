import Link from 'next/link';

import { footerLinkSections } from '@/content/shared/layoutFooterLinks';

export default function FooterLinks() {
  return (
    <>
      {footerLinkSections.map((section) => (
        <div key={section.title} className='col-lg-auto col-6'>
          <h3 className='text-20 fw-500'>{section.title}</h3>

          <div className='y-gap-10 mt-20'>
            {section.links.map((link) => (
              <Link key={link.id} className='d-block fw-500' href={link.href}>
                {link.text}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
