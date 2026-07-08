'use client';

import { Moon, Sun, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth/useAuth';
import { useTheme } from '@/lib/theme/ThemeContext';

export function Topbar({ title, description }: { title: string; description?: string }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const displayName = user?.name || 'User';
  const roleLabel = user?.role === 'manager' ? 'Manager' : 'Team member';
  const darkMode = theme === 'dark';

  return (
    <header className="border-b border-line bg-white">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-medium text-brand">Welcome back, {user?.name || 'there'}</p>
          <h1 className="text-lg font-semibold text-ink">{title}</h1>
          {description ? <p className="mt-0.5 text-sm text-ink-muted">{description}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-10 w-10 px-0"
            onClick={toggleTheme}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to night mode'}
            title={darkMode ? 'Light mode' : 'Night mode'}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

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
      </div>
    </header>
  );
}
