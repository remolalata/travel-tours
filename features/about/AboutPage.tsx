import type { AuthViewerState } from '@/api/auth/mutations/authApi';
import AboutHero from '@/components/about/sections/AboutHero';
import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeaderClient from '@/components/layout/header/SiteHeaderClient';
import { aboutContent } from '@/content/features/about';

const guestAuthState: AuthViewerState = {
  isAuthenticated: false,
  role: null,
  avatarUrl: null,
  fullName: null,
  email: null,
  phone: null,
};

export default function AboutPage() {
  const { intro } = aboutContent;

  return (
    <main>
      <SiteHeaderClient initialAuthState={guestAuthState} />
      <AboutHero />
      <section className='layout-pt-lg layout-pb-lg'>
        <div className='container'>
          <div className='row justify-center'>
            <div className='col-xl-9 col-lg-10'>
              <h2 className='text-30 fw-700'>{intro.heading}</h2>
              {intro.paragraphs.map((paragraph, index) => (
                <p key={paragraph} className={index === 0 ? 'mt-20' : 'mt-15'}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
