'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  ListChecks,
  MessageSquareText,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import { getApiErrorMessage } from '@/lib/api/axiosClient';
import { getProjects } from '@/lib/api/projects.api';
import { getReports } from '@/lib/api/reports.api';
import { currentWeekRange, formatWeekRange } from '@/lib/utils/dateHelpers';
import { formatHours, truncate } from '@/lib/utils/formatters';
import type { Project } from '@/lib/types/project.types';
import type { ManagerReportsResponse, Report } from '@/lib/types/report.types';
import type { User } from '@/lib/types/user.types';

function ReportSection({
  title,
  icon,
  children,
  highlighted = false
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  highlighted?: boolean;
}) {
  return (
    <section
      className={
        highlighted
          ? 'rounded-panel border border-status-late/25 bg-status-lateBg p-4'
          : 'rounded-panel border border-line bg-surface-page p-4'
      }
    >
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
        {icon}
        {title}
      </div>
      <div className={highlighted ? 'whitespace-pre-wrap text-sm leading-6 text-status-late' : 'whitespace-pre-wrap text-sm leading-6 text-ink-muted'}>
        {children}
      </div>
    </section>
  );
}

function ReportDetailsPanel({ report }: { report: Report | null }) {
  if (!report) {
    return (
      <Card className="flex h-full min-h-0">
        <CardContent className="flex flex-1 items-center justify-center text-center">
          <div>
            <FileText className="mx-auto h-8 w-8 text-brand" />
            <h3 className="mt-3 text-base font-semibold text-ink">Select a report</h3>
            <p className="mt-1 text-sm text-ink-muted">Choose a report from the list to review the full weekly update.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasBlockers = Boolean(report.blockers?.trim());

  return (
    <Card className="h-full min-h-0 overflow-hidden">
      <CardContent className="h-full space-y-4 overflow-y-auto">
        <div className="rounded-panel border border-brand/15 bg-brand-soft p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">Selected report</p>
              <h3 className="mt-1 text-xl font-semibold text-ink">{report.user?.name || 'Unknown member'}</h3>
              <p className="mt-1 text-sm text-ink-muted">{report.user?.email || 'No email available'}</p>
            </div>
            <Badge status={report.status}>{report.status}</Badge>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-panel bg-surface-panel/80 p-3">
              <p className="text-xs text-ink-muted">Project</p>
              <p className="mt-1 truncate text-sm font-semibold text-ink">{report.project?.name || 'Project'}</p>
            </div>
            <div className="rounded-panel bg-surface-panel/80 p-3">
              <p className="text-xs text-ink-muted">Week</p>
              <p className="mt-1 text-sm font-semibold text-ink">{formatWeekRange(report.week_start, report.week_end)}</p>
            </div>
            <div className="rounded-panel bg-surface-panel/80 p-3">
              <p className="text-xs text-ink-muted">Logged hours</p>
              <p className="mt-1 text-sm font-semibold text-ink">{formatHours(report.hours_worked)}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <ReportSection
            title="Completed tasks"
            icon={<CheckCircle2 className="h-4 w-4 text-status-submitted" />}
          >
            {report.tasks_completed || 'No completed tasks provided.'}
          </ReportSection>
          <ReportSection
            title="Planned for next week"
            icon={<ListChecks className="h-4 w-4 text-brand" />}
          >
            {report.tasks_planned || 'No plan provided.'}
          </ReportSection>
        </div>

        <ReportSection
          title="Blockers"
          icon={<AlertTriangle className={hasBlockers ? 'h-4 w-4 text-status-late' : 'h-4 w-4 text-ink-faint'} />}
          highlighted={hasBlockers}
        >
          {report.blockers || 'No blockers reported.'}
        </ReportSection>

        <ReportSection
          title="Notes"
          icon={<MessageSquareText className="h-4 w-4 text-brand" />}
        >
          {report.notes || 'No notes added.'}
        </ReportSection>
      </CardContent>
    </Card>
  );
}

function ReportList({
  reports,
  selectedReportId,
  onSelect
}: {
  reports: Report[];
  selectedReportId: number | null;
  onSelect: (reportId: number) => void;
}) {
  return (
    <Card className="flex h-full min-h-0 flex-col overflow-hidden">
      <CardContent className="border-b border-line p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-ink">Report inbox</h3>
            <p className="mt-1 text-sm text-ink-muted">Select a submission to review the full weekly update.</p>
          </div>
          <span className="rounded-full bg-surface-page px-3 py-1 text-xs font-medium text-ink-muted">
            {reports.length} visible
          </span>
        </div>
      </CardContent>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {reports.map((report) => {
          const hasBlockers = Boolean(report.blockers?.trim());
          const selected = selectedReportId === report.id;

          return (
            <button
              key={report.id}
              type="button"
              onClick={() => onSelect(report.id)}
              className={
                selected
                  ? 'w-full rounded-panel border border-brand bg-brand-soft p-4 text-left shadow-subtle transition'
                  : 'w-full rounded-panel border border-line bg-white p-4 text-left transition hover:border-brand/40 hover:bg-brand-soft'
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{report.user?.name || 'Unknown member'}</p>
                  <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-ink-muted">
                    <FileText className="h-3.5 w-3.5 shrink-0 text-brand" />
                    {report.project?.name || 'Project'}
                  </p>
                </div>
                <Badge status={report.status}>{report.status}</Badge>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-muted">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-brand" />
                  {formatWeekRange(report.week_start, report.week_end)}
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                  <Clock className="h-3.5 w-3.5 text-brand" />
                  {formatHours(report.hours_worked)}
                </span>
              </div>

              <div className="mt-3 rounded-panel bg-surface-page px-3 py-2">
                <p className="line-clamp-2 text-xs leading-5 text-ink-muted">
                  {truncate(report.tasks_completed || 'No completed tasks provided.', 140)}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                {hasBlockers ? (
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-status-late/25 bg-status-lateBg px-2 py-1 text-xs font-medium text-status-late">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Has blocker
                  </span>
                ) : (
                  <span className="text-xs text-ink-muted">No blocker</span>
                )}
                <ChevronRight className={selected ? 'h-4 w-4 text-brand' : 'h-4 w-4 text-ink-faint'} />
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
export default function TeamReportsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [data, setData] = useState<ManagerReportsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    page: 1,
    week: currentWeekRange().weekStart,
    userId: '',
    projectId: '',
    startDate: '',
    endDate: ''
  });

  const loadReports = () => {
    setLoading(true);
    const params = {
      page: filters.page,
      perPage: 25,
      week: filters.startDate || filters.endDate ? undefined : filters.week,
      userId: filters.userId || undefined,
      projectId: filters.projectId || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined
    };

    Promise.all([getReports(params), getProjects()])
      .then(([nextData, nextProjects]) => {
        setData(nextData);
        setProjects(nextProjects);
      })
      .catch((error) => toast.error(getApiErrorMessage(error, 'Could not load team reports')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const users = useMemo(() => {
    const byId = new Map<number, User>();
    data?.reports.forEach((report) => {
      if (report.user) byId.set(report.user.id, report.user);
    });
    return Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  const analytics = useMemo(() => {
    const reports = data?.reports || [];
    const projectTotals = new Map<string, number>();
    const totalHours = reports.reduce((sum, report) => sum + Number(report.hours_worked || 0), 0);
    const blockerReports = reports.filter((report) => Boolean(report.blockers?.trim()));

    reports.forEach((report) => {
      const projectName = report.project?.name || 'Unknown project';
      projectTotals.set(projectName, (projectTotals.get(projectName) || 0) + 1);
    });

    const topProject = Array.from(projectTotals.entries()).sort((a, b) => b[1] - a[1])[0];

    return {
      totalReports: reports.length,
      totalHours,
      blockerReports,
      topProject
    };
  }, [data]);

  const updateFilter = (key: keyof typeof filters, value: string | number) => {
    setFilters((current) => ({
      ...current,
      page: key === 'page' ? Number(value) : 1,
      [key]: value
    }));
    setSelectedReportId(null);
  };

  if (loading && !data) {
    return <Spinner label="Loading team reports" />;
  }

  const reports = data?.reports || [];
  const pagination = data?.pagination;
  const selectedReport = reports.find((report) => report.id === selectedReportId) || reports[0] || null;
  const activeReportId = selectedReport?.id || null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Team reports</h2>
        <p className="section-subtitle">Review and analyze team submissions across people, projects, and weeks.</p>
      </div>

      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-ink">Analytics & Summary</h3>
          <p className="mt-1 text-sm text-ink-muted">Filter the reporting window and scan the main team indicators.</p>
        </div>

        <Card>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              <Input label="Week" type="date" value={filters.week} onChange={(event) => updateFilter('week', event.target.value)} />
              <Select label="Team member" value={filters.userId} onChange={(event) => updateFilter('userId', event.target.value)}>
                <option value="">All members</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
              <Select label="Project" value={filters.projectId} onChange={(event) => updateFilter('projectId', event.target.value)}>
                <option value="">All projects</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </Select>
              <Input label="Start date" type="date" value={filters.startDate} onChange={(event) => updateFilter('startDate', event.target.value)} />
              <Input label="End date" type="date" value={filters.endDate} onChange={(event) => updateFilter('endDate', event.target.value)} />
            </div>
          </CardContent>
        </Card>

        {loading ? <Spinner label="Refreshing reports" /> : null}

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-ink-muted">Reports reviewed</p>
                <FileText className="h-4 w-4 text-brand" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-ink">{analytics.totalReports}</p>
              <p className="mt-1 text-xs text-ink-faint">Matching current filters</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-ink-muted">Logged hours</p>
                <Clock className="h-4 w-4 text-brand" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-ink">{formatHours(analytics.totalHours)}</p>
              <p className="mt-1 text-xs text-ink-faint">Across visible reports</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-ink-muted">Open blockers</p>
                <AlertTriangle className="h-4 w-4 text-status-late" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-ink">{analytics.blockerReports.length}</p>
              <p className="mt-1 text-xs text-ink-faint">Reports that mention blockers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-ink-muted">Most active project</p>
                <BarChart3 className="h-4 w-4 text-brand" />
              </div>
              <p className="mt-2 truncate text-lg font-semibold text-ink">{analytics.topProject?.[0] || 'No project'}</p>
              <p className="mt-1 text-xs text-ink-faint">{analytics.topProject?.[1] || 0} reports</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <hr className="my-8 border-line" />

      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-ink">Detailed Reports Inbox</h3>
          <p className="mt-1 text-sm text-ink-muted">Select a report on the left and review the details without stretching the whole page.</p>
        </div>

        {!loading && reports.length === 0 ? (
          <EmptyState title="No reports found" description="Try adjusting the week, project, or date range filters." />
        ) : (
          <div className="grid h-[720px] min-h-0 grid-rows-[260px_minmax(0,1fr)] gap-4 lg:h-[620px] lg:grid-cols-[390px_minmax(0,1fr)] lg:grid-rows-1">
            <ReportList
              reports={reports}
              selectedReportId={activeReportId}
              onSelect={setSelectedReportId}
            />
            <ReportDetailsPanel report={selectedReport} />
          </div>
        )}

        {pagination ? (
          <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm text-ink-muted">
            <span>
              Page {pagination.page} of {Math.max(pagination.totalPages, 1)}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => updateFilter('page', pagination.page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => updateFilter('page', pagination.page + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
