import type { Pagination } from './api.types';
import type { Project } from './project.types';
import type { User } from './user.types';

export type ReportStatus = 'draft' | 'submitted' | 'late';

export type Report = {
  id: number;
  user_id: number;
  project_id: number;
  week_start: string;
  week_end: string;
  tasks_completed: string | null;
  tasks_planned: string | null;
  blockers: string | null;
  hours_worked: number | null;
  notes: string | null;
  status: ReportStatus;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
  project?: Project;
  user?: User;
};

export type ReportWeekGroup = {
  weekStart: string;
  reports: Report[];
};

export type MyReportsResponse = {
  pagination: Pagination;
  weeks: ReportWeekGroup[];
};

export type ManagerReportsResponse = {
  pagination: Pagination;
  reports: Report[];
};

export type ReportPayload = {
  projectId: number;
  weekStart: string;
  weekEnd: string;
  tasksCompleted?: string | null;
  tasksPlanned?: string | null;
  blockers?: string | null;
  hoursWorked?: number | null;
  notes?: string | null;
};
