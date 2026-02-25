import type { AuthViewerState } from '@/services/auth/mutations/authApi';
import SiteHeaderClient from '@/components/layout/header/SiteHeaderClient';
import { getServerAuthState } from '@/utils/auth/server';

export default async function SiteHeader() {
  const authState = await getServerAuthState();

  const initialAuthState: AuthViewerState = {
    isAuthenticated: Boolean(authState.user),
    role: authState.role,
    avatarUrl: authState.avatarUrl,
    fullName: authState.fullName,
    email: authState.email,
    phone: null,
  };

  return <SiteHeaderClient initialAuthState={initialAuthState} />;
}
