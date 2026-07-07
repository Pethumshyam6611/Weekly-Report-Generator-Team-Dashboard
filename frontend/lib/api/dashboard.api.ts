import { axiosClient } from './axiosClient';
import type { ApiSuccess } from '@/lib/types/api.types';
import type {
  DashboardSummary,
  RecentActivityResponse,
  SubmissionStatusResponse,
  TasksTrendPoint,
  WorkloadDistributionPoint
} from '@/lib/types/dashboard.types';

export const getDashboardSummary = async (params: { week?: string } = {}) => {
  const response = await axiosClient.get<ApiSuccess<DashboardSummary>>('/dashboard/summary', { params });
  return response.data.data;
};

export const getSubmissionStatus = async (params: { week?: string } = {}) => {
  const response = await axiosClient.get<ApiSuccess<SubmissionStatusResponse>>('/dashboard/submission-status', { params });
  return response.data.data;
};

export const getTasksTrend = async (params: { userId?: number | string; startDate?: string; endDate?: string } = {}) => {
  const response = await axiosClient.get<ApiSuccess<{ trend: TasksTrendPoint[] }>>('/dashboard/tasks-trend', { params });
  return response.data.data.trend;
};

export const getWorkloadDistribution = async (params: { week?: string } = {}) => {
  const response = await axiosClient.get<ApiSuccess<{ distribution: WorkloadDistributionPoint[] }>>('/dashboard/workload-distribution', { params });
  return response.data.data.distribution;
};

export const getRecentActivity = async (params: { page?: number; perPage?: number } = {}) => {
  const response = await axiosClient.get<ApiSuccess<RecentActivityResponse>>('/dashboard/recent-activity', { params });
  return response.data.data;
};
