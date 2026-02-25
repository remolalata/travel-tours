import { redirect } from 'next/navigation';

import RegisterForm from '@/components/auth/RegisterForm';
import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';
import { authContent } from '@/content/features/auth';
import { getServerAuthState } from '@/utils/auth/server';

export const metadata = {
  title: authContent.register.metadata.title,
  description: authContent.register.metadata.description,
};

export default async function Page() {
  const { user } = await getServerAuthState();
  if (user) {
    redirect('/');
  }

  return (
    <main>
      <SiteHeader />
      <RegisterForm />
      <SiteFooter />
    </main>
  );
}
