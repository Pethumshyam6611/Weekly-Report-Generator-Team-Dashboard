import { CalendarDays, Clock, FileText, FolderKanban, Lock, MessageSquareText } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { formatDate, formatWeekRange } from '@/lib/utils/dateHelpers';
import { formatHours } from '@/lib/utils/formatters';
import type { Report } from '@/lib/types/report.types';

const DetailBlock = ({
  title,
  value,
  muted
}: {
  title: string;
  value: string | number | null | undefined;
  muted?: boolean;
}) => (
  <div className="rounded-panel border border-line bg-white p-4">
    <p className="text-xs font-semibold uppercase tracking-normal text-ink-muted">{title}</p>
    <p className={muted ? 'mt-2 text-sm text-ink-muted' : 'mt-2 whitespace-pre-wrap text-sm leading-6 text-ink'}>
      {value || 'No details provided'}
    </p>
  </div>
);

export function ReportReadOnlyView({ report }: { report: Report }) {
  return (
    <div className="space-y-5">
      <Card className="overflow-hidden">
        <div className="border-b border-line bg-white px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-panel bg-status-submittedBg text-status-submitted">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-ink">{report.project?.name || 'Weekly report'}</h3>
                  <Badge status={report.status}>{report.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-ink-muted">{formatWeekRange(report.week_start, report.week_end)}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {report.project ? (
                <Badge status={report.project.is_active ? 'active' : 'inactive'}>
                  {report.project.is_active ? 'active project' : 'inactive project'}
                </Badge>
              ) : null}
              <Badge status="submitted">read-only</Badge>
            </div>
          </div>
        </div>

        <CardContent className="space-y-5">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-panel border border-line bg-surface-page p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <CalendarDays className="h-4 w-4 text-brand" />
                Week
              </div>
              <p className="mt-2 text-sm text-ink-muted">{formatWeekRange(report.week_start, report.week_end)}</p>
            </div>
            <div className="rounded-panel border border-line bg-surface-page p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Clock className="h-4 w-4 text-brand" />
                Hours
              </div>
              <p className="mt-2 text-sm text-ink-muted">{formatHours(report.hours_worked)}</p>
            </div>
            <div className="rounded-panel border border-line bg-surface-page p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <FileText className="h-4 w-4 text-brand" />
                Submitted
              </div>
              <p className="mt-2 text-sm text-ink-muted">{formatDate(report.submitted_at)}</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <FolderKanban className="h-4 w-4 text-brand" />
                Work update
              </div>
              <DetailBlock title="Tasks completed" value={report.tasks_completed} />
              <DetailBlock title="Tasks planned next" value={report.tasks_planned} />
            </div>

            <aside className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <MessageSquareText className="h-4 w-4 text-brand" />
                Extra details
              </div>
              <DetailBlock title="Blockers" value={report.blockers} muted={!report.blockers} />
              <DetailBlock title="Notes or links" value={report.notes} muted={!report.notes} />
            </aside>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
