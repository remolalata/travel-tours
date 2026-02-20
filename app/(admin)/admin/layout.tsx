import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { getServerAuthState } from '@/utils/auth/server';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAdmin } = await getServerAuthState();
  if (!user || !isAdmin) {
    redirect('/login');
  }

  return children;
}
