'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  TableProperties
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import type { UserRole } from '@/lib/types/user.types';

type SidebarProps = {
  role: UserRole;
  onLogout: () => void;
};

const memberLinks = [
  { href: '/reports', label: 'Reports', icon: ClipboardList },
  { href: '/reports/new', label: 'New report', icon: PlusCircle }
];

const managerLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/team-reports', label: 'Team reports', icon: TableProperties },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/ai-assistant', label: 'AI assistant', icon: Bot }
];

export function Sidebar({ role, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const links = role === 'manager' ? managerLinks : memberLinks;

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 shrink-0 border-r border-line bg-white lg:flex lg:flex-col">
        <div className="border-b border-line px-5 py-4">
          <p className="text-sm font-semibold text-ink">Weekly reports</p>
          <p className="mt-1 text-xs text-ink-muted">Team dashboard</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {links.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-panel px-3 py-2 text-sm font-medium transition-colors',
                  active ? 'bg-brand-soft text-brand' : 'text-ink-muted hover:bg-surface-page hover:text-ink'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-line p-3">
          <Button type="button" variant="ghost" className="w-full justify-start" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-white px-2 py-2 lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-around gap-1">
          {links.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex min-w-0 flex-1 flex-col items-center gap-1 rounded-panel px-2 py-1.5 text-[11px] font-medium',
                  active ? 'bg-brand-soft text-brand' : 'text-ink-muted'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
