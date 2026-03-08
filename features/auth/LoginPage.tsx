import LoginForm from '@/components/auth/LoginForm';
import RouteAccessGuard from '@/components/auth/RouteAccessGuard';
import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeaderClient from '@/components/layout/header/SiteHeaderClient';
import { guestAuthState } from '@/utils/auth/guestAuthState';

export default function LoginPage() {
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
