import { axiosClient } from './axiosClient';
import type { ApiSuccess } from '@/lib/types/api.types';
import type {
  ManagerReportsResponse,
  MyReportsResponse,
  Report,
  ReportPayload
} from '@/lib/types/report.types';

export type ReportFilters = {
  page?: number;
  perPage?: number;
  projectId?: number | string;
  userId?: number | string;
  week?: string;
  startDate?: string;
  endDate?: string;
};

export const createReport = async (payload: ReportPayload) => {
  const response = await axiosClient.post<ApiSuccess<{ report: Report }>>('/reports', payload);
  return response.data.data.report;
};

export const updateReport = async (id: number, payload: Partial<ReportPayload>) => {
  const response = await axiosClient.put<ApiSuccess<{ report: Report }>>(`/reports/${id}`, payload);
  return response.data.data.report;
};

export const submitReport = async (id: number) => {
  const response = await axiosClient.post<ApiSuccess<{ report: Report }>>(`/reports/${id}/submit`);
  return response.data.data.report;
};

export const getMyReports = async (filters: ReportFilters = {}) => {
  const response = await axiosClient.get<ApiSuccess<MyReportsResponse>>('/reports/me', {
    params: filters
  });
  return response.data.data;
};

export const getReports = async (filters: ReportFilters = {}) => {
  const response = await axiosClient.get<ApiSuccess<ManagerReportsResponse>>('/reports', {
    params: filters
  });
  return response.data.data;
};

export const getReport = async (id: number) => {
  const response = await axiosClient.get<ApiSuccess<{ report: Report }>>(`/reports/${id}`);
  return response.data.data.report;
};
