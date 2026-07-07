'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/lib/auth/useAuth';
import type { UserRole } from '@/lib/types/user.types';

type RoleGuardProps = {
  allowedRoles: UserRole[];
  children: React.ReactNode;
};

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (!allowedRoles.includes(user.role)) {
      router.replace(user.role === 'manager' ? '/dashboard' : '/reports');
    }
  }, [allowedRoles, loading, router, user]);

  if (loading || !user || !allowedRoles.includes(user.role)) {
    return <Spinner label="Checking access" className="min-h-screen" />;
  }

  return <>{children}</>;
}
