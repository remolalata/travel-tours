'use client';

import { type ReactNode, useState } from 'react';

import { adminContent } from '@/content/features/admin';
import useAdminSessionGuard from '@/utils/hooks/auth/useAdminSessionGuard';

import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

type AdminShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function AdminShell({ title, description, children }: AdminShellProps) {
  useAdminSessionGuard();
  const [sideBarOpen, setSideBarOpen] = useState(true);

  return (
    <div className={`dashboard ${sideBarOpen ? '-is-sidebar-visible' : ''} js-dashboard`}>
      <AdminSidebar onClose={() => setSideBarOpen(false)} />

      <div className='dashboard__content'>
        <AdminHeader onToggleSidebar={() => setSideBarOpen((previousValue) => !previousValue)} />

        <div className='dashboard__content_content'>
          <h1 className='text-30'>{title}</h1>
          <p>{description}</p>

          {children}

          <div className='text-center pt-30'>
            {adminContent.shell.footerPrefix} {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
}
