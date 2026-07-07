import type { Pagination } from './api.types';
import type { Report } from './report.types';

export type DashboardSummary = {
  weekStart: string;
  expectedReports: number;
  submittedReports: number;
  complianceRate: number;
  openBlockers: number;
};

export type SubmissionProjectStatus = {
  projectId: number;
  projectName: string;
  status: 'submitted' | 'pending' | 'late';
  reportId: number | null;
  submittedAt: string | null;
};

export type SubmissionMemberStatus = {
  id: number;
  name: string;
  email: string;
  status: 'submitted' | 'pending' | 'late';
  projects: SubmissionProjectStatus[];
};

export type SubmissionStatusResponse = {
  weekStart: string;
  members: SubmissionMemberStatus[];
};

export type TasksTrendPoint = {
  weekStart: string;
  reportCount: number;
  totalHours: number;
};

export type WorkloadDistributionPoint = {
  projectId: number;
  projectName: string;
  reportCount: number;
  totalHours: number;
  openBlockers: number;
};

export type RecentActivityResponse = {
  pagination: Pagination;
  activity: Report[];
};
