import RegisterForm from '@/components/auth/RegisterForm';
import RouteAccessGuard from '@/components/auth/RouteAccessGuard';
import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeaderClient from '@/components/layout/header/SiteHeaderClient';
import { authContent } from '@/content/features/auth';
import { guestAuthState } from '@/utils/auth/guestAuthState';

export const dynamic = 'force-static';

export const metadata = {
  title: authContent.register.metadata.title,
  description: authContent.register.metadata.description,
};

export default function Page() {
  return (
    <main>
      <SiteHeaderClient initialAuthState={guestAuthState} />
      <RouteAccessGuard mode='guest-only'>
        <RegisterForm />
      </RouteAccessGuard>
      <SiteFooter />
    </main>
  );
}
