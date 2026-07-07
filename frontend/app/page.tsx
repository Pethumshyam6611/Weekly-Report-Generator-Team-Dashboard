'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/lib/auth/useAuth';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    router.replace(user.role === 'manager' ? '/dashboard' : '/reports');
  }, [loading, router, user]);

  return <Spinner label="Opening workspace" className="min-h-screen" />;
}
