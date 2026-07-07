import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatWeekRange } from '@/lib/utils/dateHelpers';
import { timeAgo } from '@/lib/utils/formatters';
import type { Report } from '@/lib/types/report.types';

export function RecentActivityFeed({ activity }: { activity: Report[] }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-ink">Recent activity</h2>
      </CardHeader>
      <CardContent>
        {activity.length === 0 ? (
          <EmptyState title="No recent submissions" description="Submitted reports will appear here." />
        ) : (
          <ul className="divide-y divide-line">
            {activity.map((report) => (
              <li key={report.id} className="py-3 text-sm">
                <p className="font-medium text-ink">
                  {report.user?.name || 'Someone'} submitted a report for {report.project?.name || 'a project'}
                </p>
                <p className="mt-1 text-ink-muted">
                  {formatWeekRange(report.week_start, report.week_end)} - {timeAgo(report.submitted_at)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
