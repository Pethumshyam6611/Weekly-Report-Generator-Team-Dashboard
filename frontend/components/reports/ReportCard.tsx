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
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs text-ink-muted">{report.project?.name || 'Project'}</span>
                {report.project ? (
                  <Badge status={report.project.is_active ? 'active' : 'inactive'}>
                    {report.project.is_active ? 'active' : 'inactive'}
                  </Badge>
                ) : null}
              </div>
            </div>
            <Badge status={report.status}>{report.status}</Badge>
          </div>
          <p className="text-sm text-ink-muted">{truncate(report.tasks_completed, 160)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
