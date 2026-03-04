import RegisterForm from '@/components/auth/RegisterForm';
import RouteAccessGuard from '@/components/auth/RouteAccessGuard';
import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeaderClient from '@/components/layout/header/SiteHeaderClient';
import { guestAuthState } from '@/utils/auth/guestAuthState';

export default function RegisterPage() {
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
