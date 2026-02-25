import { redirect } from 'next/navigation';

import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';
import { getServerAuthState } from '@/utils/auth/server';

export const metadata = {
  title: 'Profile | Travel & Tours',
  description: 'Manage your profile settings.',
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
        <div className='container'>
          <div className='rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 md:px-20 md:pt-20 mt-60'>
            <h1 className='text-30'>Profile</h1>
            <p className='mt-10'>Profile page setup is coming soon.</p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
