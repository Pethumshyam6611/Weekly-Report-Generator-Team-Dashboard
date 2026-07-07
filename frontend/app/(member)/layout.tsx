import { AppShell } from '@/components/layout/AppShell';
import { RoleGuard } from '@/components/layout/RoleGuard';

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['team_member']}>
      <AppShell role="team_member">{children}</AppShell>
    </RoleGuard>
  );
}
