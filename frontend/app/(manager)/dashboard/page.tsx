'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { RecentActivityFeed } from '@/components/dashboard/RecentActivityFeed';
import { SubmissionStatusChart } from '@/components/dashboard/SubmissionStatusChart';
import { SummaryMetricCard } from '@/components/dashboard/SummaryMetricCard';
import { TasksTrendChart } from '@/components/dashboard/TasksTrendChart';
import { WorkloadDistributionChart } from '@/components/dashboard/WorkloadDistributionChart';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { getApiErrorMessage } from '@/lib/api/axiosClient';
import {
  getDashboardSummary,
  getRecentActivity,
  getSubmissionStatus,
  getTasksTrend,
  getWorkloadDistribution
} from '@/lib/api/dashboard.api';
import { getProjects } from '@/lib/api/projects.api';
import { currentWeekRange } from '@/lib/utils/dateHelpers';
import { formatPercent } from '@/lib/utils/formatters';
import type {
  DashboardSummary,
  RecentActivityResponse,
  SubmissionStatusResponse,
  TasksTrendPoint,
  WorkloadDistributionPoint
} from '@/lib/types/dashboard.types';
import type { Project } from '@/lib/types/project.types';

export default function DashboardPage() {
  const defaultWeek = currentWeekRange().weekStart;
  const [week, setWeek] = useState(defaultWeek);
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [status, setStatus] = useState<SubmissionStatusResponse | null>(null);
  const [trend, setTrend] = useState<TasksTrendPoint[]>([]);
  const [workload, setWorkload] = useState<WorkloadDistributionPoint[]>([]);
  const [activity, setActivity] = useState<RecentActivityResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const selectedProjectId = projectId || undefined;
    Promise.all([
      getDashboardSummary({ week, projectId: selectedProjectId }),
      getSubmissionStatus({ week, projectId: selectedProjectId }),
      getTasksTrend({ projectId: selectedProjectId }),
      getWorkloadDistribution({ week, projectId: selectedProjectId }),
      getRecentActivity({ perPage: 8, projectId: selectedProjectId }),
      getProjects()
    ])
      .then(([nextSummary, nextStatus, nextTrend, nextWorkload, nextActivity, nextProjects]) => {
        setSummary(nextSummary);
        setStatus(nextStatus);
        setTrend(nextTrend);
        setWorkload(nextWorkload);
        setActivity(nextActivity);
        setProjects(nextProjects);
      })
      .catch((error) => toast.error(getApiErrorMessage(error, 'Could not load dashboard')))
      .finally(() => setLoading(false));
  }, [projectId, week]);

  if (loading) {
    return <Spinner label="Loading dashboard" />;
  }

  if (!summary || !status) {
    return <EmptyState title="Dashboard unavailable" description="Try again after the backend API is reachable." />;
  }

  const activityRows = activity?.activity || [];

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <h2 className="section-title">Dashboard</h2>
          <p className="section-subtitle">Weekly compliance, workload, blockers, and recent submissions.</p>
        </div>
        <DashboardFilters
          week={week}
          projectId={projectId}
          projects={projects}
          onWeekChange={setWeek}
          onProjectChange={setProjectId}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryMetricCard label="Submitted this week" value={summary.submittedReports} detail={`${summary.expectedReports} expected`} />
        <SummaryMetricCard label="Compliance rate" value={formatPercent(summary.complianceRate)} detail="Submitted vs expected" />
        <SummaryMetricCard label="Open blockers" value={summary.openBlockers} detail="Reports with blockers" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <TasksTrendChart data={trend} />
        <SubmissionStatusChart members={status.members} />
        <WorkloadDistributionChart data={workload} />
        <RecentActivityFeed activity={activityRows} />
      </div>
    </div>
  );
}
