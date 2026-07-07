import { ReportCard } from './ReportCard';
import { formatDate } from '@/lib/utils/dateHelpers';
import type { ReportWeekGroup } from '@/lib/types/report.types';

export function ReportHistoryList({ weeks }: { weeks: ReportWeekGroup[] }) {
  return (
    <div className="space-y-6">
      {weeks.map((week) => (
        <section key={week.weekStart}>
          <h2 className="mb-3 text-sm font-semibold text-ink-muted">Week of {formatDate(week.weekStart)}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {week.reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
