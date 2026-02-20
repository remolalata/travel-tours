import { redirect } from 'next/navigation';

import LoginForm from '@/components/auth/LoginForm';
import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';
import { authContent } from '@/content/features/auth';
import { getServerAuthState } from '@/utils/auth/server';

export const metadata = {
  title: authContent.login.metadata.title,
  description: authContent.login.metadata.description,
};

export default async function Page() {
  const { user, isAdmin } = await getServerAuthState();
  if (user) {
    redirect(isAdmin ? '/admin/dashboard' : '/');
  }

  return (
    <main>
      <SiteHeader />
      <LoginForm />
      <SiteFooter />
    </main>
  );
}
