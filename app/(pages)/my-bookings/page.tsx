import { redirect } from 'next/navigation';

import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';
import { getServerAuthState } from '@/utils/auth/server';

export const metadata = {
  title: 'My Bookings | Travel & Tours',
  description: 'View your bookings.',
};

export default async function Page() {
  const { user } = await getServerAuthState();

  if (!user) {
    redirect('/login');
  }

  return (
    <main>
      <SiteHeader />
      <section className='layout-pt-lg layout-pb-lg'>
        <div className='container' />
      </section>
      <SiteFooter />
    </main>
  );
}
