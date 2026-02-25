import LoginForm from '@/components/auth/LoginForm';
import RouteAccessGuard from '@/components/auth/RouteAccessGuard';
import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeaderClient from '@/components/layout/header/SiteHeaderClient';
import { authContent } from '@/content/features/auth';
import { guestAuthState } from '@/utils/auth/guestAuthState';

export const dynamic = 'force-static';

export const metadata = {
  title: authContent.login.metadata.title,
  description: authContent.login.metadata.description,
};

export default function Page() {
  return (
    <main>
      <SiteHeaderClient initialAuthState={guestAuthState} />
      <RouteAccessGuard mode='guest-only'>
        <LoginForm />
      </RouteAccessGuard>
      <SiteFooter />
    </main>
  );
}
