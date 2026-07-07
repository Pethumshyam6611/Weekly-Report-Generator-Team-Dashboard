'use client';

import { UserCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/useAuth';

export function Topbar({ title, description }: { title: string; description?: string }) {
  const { user } = useAuth();
  const displayName = user?.name || 'User';
  const roleLabel = user?.role === 'manager' ? 'Manager' : 'Team member';

  return (
    <header className="border-b border-line bg-white">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-medium text-brand">Welcome back, {user?.name || 'there'}</p>
          <h1 className="text-lg font-semibold text-ink">{title}</h1>
          {description ? <p className="mt-0.5 text-sm text-ink-muted">{description}</p> : null}
        </div>
        <div className="hidden min-w-[190px] items-center gap-3 rounded-panel border border-line bg-surface-page px-3 py-2 shadow-subtle sm:flex">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-panel bg-brand-soft text-brand">
            <UserCircle className="h-5 w-5" />
          </div>
          <div className="min-w-0 text-left">
            <p className="truncate text-sm font-semibold text-ink">{displayName}</p>
            <p className="mt-0.5 text-xs font-medium text-ink-muted">{roleLabel}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
