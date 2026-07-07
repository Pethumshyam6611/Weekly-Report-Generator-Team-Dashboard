'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import { Table, Td, Th } from '@/components/ui/Table';
import { getApiErrorMessage } from '@/lib/api/axiosClient';
import { getProjects } from '@/lib/api/projects.api';
import { getReports } from '@/lib/api/reports.api';
import { currentWeekRange, formatWeekRange } from '@/lib/utils/dateHelpers';
import { formatHours, truncate } from '@/lib/utils/formatters';
import type { Project } from '@/lib/types/project.types';
import type { ManagerReportsResponse, Report } from '@/lib/types/report.types';
import type { User } from '@/lib/types/user.types';

export default function TeamReportsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [data, setData] = useState<ManagerReportsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
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
      perPage: 10,
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

  const updateFilter = (key: keyof typeof filters, value: string | number) => {
    setFilters((current) => ({
      ...current,
      page: key === 'page' ? Number(value) : 1,
      [key]: value
    }));
  };

  if (loading && !data) {
    return <Spinner label="Loading team reports" />;
  }

  const reports = data?.reports || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="section-title">Team reports</h2>
        <p className="section-subtitle">Review report submissions across people, projects, and weeks.</p>
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

      {!loading && reports.length === 0 ? (
        <EmptyState title="No reports found" description="Try adjusting the week, project, or date range filters." />
      ) : (
        <Card>
          <Table>
            <thead>
              <tr>
                <Th>Team member</Th>
                <Th>Project</Th>
                <Th>Status</Th>
                <Th>Week</Th>
                <Th>Tasks completed</Th>
                <Th>Hours</Th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report: Report) => (
                <tr key={report.id}>
                  <Td>
                    <p className="font-medium">{report.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-ink-muted">{report.user?.email}</p>
                  </Td>
                  <Td>{report.project?.name || 'Project'}</Td>
                  <Td><Badge status={report.status}>{report.status}</Badge></Td>
                  <Td>{formatWeekRange(report.week_start, report.week_end)}</Td>
                  <Td className="max-w-sm">
                    <p className="text-sm text-ink-muted">
                      {expanded[report.id] ? report.tasks_completed || 'No details provided' : truncate(report.tasks_completed, 90)}
                    </p>
                    {(report.tasks_completed?.length || 0) > 90 ? (
                      <button
                        type="button"
                        className="mt-1 text-xs font-medium text-brand hover:text-brand-hover"
                        onClick={() => setExpanded((current) => ({ ...current, [report.id]: !current[report.id] }))}
                      >
                        {expanded[report.id] ? 'View less' : 'View more'}
                      </button>
                    ) : null}
                  </Td>
                  <Td>{formatHours(report.hours_worked)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
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
        </Card>
      )}
    </div>
  );
}
