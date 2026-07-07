'use client';

import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAuth } from '@/lib/auth/useAuth';
import type { UserRole } from '@/lib/types/user.types';

const titles: Record<UserRole, { title: string; description: string }> = {
  team_member: {
    title: 'My weekly reports',
    description: 'Create, submit, and review your project updates.'
  },
  manager: {
    title: 'Team dashboard',
    description: 'Track weekly reporting, blockers, workload, and team activity.'
  }
};

export function AppShell({ role, children }: { role: UserRole; children: React.ReactNode }) {
  const { logout } = useAuth();
  const copy = titles[role];

  return (
    <div className="min-h-screen bg-surface-page pb-16 lg:pb-0">
      <Sidebar role={role} onLogout={logout} />
      <div className="min-w-0 lg:pl-64">
        <Topbar title={copy.title} description={copy.description} />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
