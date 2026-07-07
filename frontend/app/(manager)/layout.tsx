import { AppShell } from '@/components/layout/AppShell';
import { RoleGuard } from '@/components/layout/RoleGuard';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['manager']}>
      <AppShell role="manager">{children}</AppShell>
    </RoleGuard>
  );
}
