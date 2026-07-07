import { cn } from '@/lib/utils/cn';
import type { ReportStatus } from '@/lib/types/report.types';

type BadgeProps = {
  status?: ReportStatus | 'pending' | 'active' | 'inactive';
  children?: React.ReactNode;
  className?: string;
};

const statusClasses: Record<string, string> = {
  submitted: 'bg-status-submittedBg text-status-submitted border-status-submitted/20',
  pending: 'bg-status-pendingBg text-status-pending border-status-pending/20',
  draft: 'bg-status-draftBg text-status-draft border-status-draft/20',
  late: 'bg-status-lateBg text-status-late border-status-late/20',
  active: 'bg-status-submittedBg text-status-submitted border-status-submitted/20',
  inactive: 'bg-status-draftBg text-status-draft border-status-draft/20'
};

export function Badge({ status = 'draft', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        statusClasses[status],
        className
      )}
    >
      {children || status}
    </span>
  );
}
