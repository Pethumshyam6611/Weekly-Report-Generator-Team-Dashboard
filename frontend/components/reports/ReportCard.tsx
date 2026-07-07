import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { formatWeekRange } from '@/lib/utils/dateHelpers';
import { truncate } from '@/lib/utils/formatters';
import type { Report } from '@/lib/types/report.types';

export function ReportCard({ report }: { report: Report }) {
  return (
    <Link href={`/reports/${report.id}`} className="block">
      <Card className="transition-colors hover:border-brand-border">
        <CardContent className="space-y-3 p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-ink">
                {formatWeekRange(report.week_start, report.week_end)}
              </p>
              <p className="mt-1 text-xs text-ink-muted">{report.project?.name || 'Project'}</p>
            </div>
            <Badge status={report.status}>{report.status}</Badge>
          </div>
          <p className="text-sm text-ink-muted">{truncate(report.tasks_completed, 160)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
