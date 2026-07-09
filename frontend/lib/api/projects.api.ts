import { axiosClient } from './axiosClient';
import type { ApiSuccess } from '@/lib/types/api.types';
import type { Project } from '@/lib/types/project.types';
import type { User } from '@/lib/types/user.types';

export type ProjectPayload = {
  name: string;
  description?: string | null;
};

export const getProjects = async () => {
  const response = await axiosClient.get<ApiSuccess<{ projects: Project[] }>>('/projects');
  return response.data.data.projects;
};

export const createProject = async (payload: ProjectPayload) => {
  const response = await axiosClient.post<ApiSuccess<{ project: Project }>>('/projects', payload);
  return response.data.data.project;
};

export const updateProject = async (id: number, payload: ProjectPayload & { isActive?: boolean }) => {
  const response = await axiosClient.put<ApiSuccess<{ project: Project }>>(`/projects/${id}`, payload);
  return response.data.data.project;
};

export const deactivateProject = async (id: number) => {
  const response = await axiosClient.delete<ApiSuccess<{ project: Project }>>(`/projects/${id}`);
  return response.data.data.project;
};

export const assignUserToProject = async (projectId: number, userId: number) => {
  const response = await axiosClient.post<ApiSuccess<{ assignment: unknown }>>(`/projects/${projectId}/assign`, {
    userId
  });
  return response.data.data.assignment;
};

export const unassignUserFromProject = async (projectId: number, userId: number) => {
  const response = await axiosClient.delete<ApiSuccess<{ assignment: unknown }>>(`/projects/${projectId}/members/${userId}`);
  return response.data.data.assignment;
};

export const getProjectMembers = async (projectId: number) => {
  const response = await axiosClient.get<ApiSuccess<{ members: User[] }>>(`/projects/${projectId}/members`);
  return response.data.data.members;
};
