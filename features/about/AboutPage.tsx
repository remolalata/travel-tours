import AboutHero from '@/components/about/sections/AboutHero';
import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';
import { aboutContent } from '@/content/features/about';

export default function AboutPage() {
  const { intro } = aboutContent;

  return (
    <main>
      <SiteHeader />
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
