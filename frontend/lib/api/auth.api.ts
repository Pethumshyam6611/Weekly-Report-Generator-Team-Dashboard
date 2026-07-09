import { axiosClient } from './axiosClient';
import type { ApiSuccess } from '@/lib/types/api.types';
import type { LoginResponse, RefreshResponse, User, UserRole } from '@/lib/types/user.types';

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  managerInviteCode?: string;
};

export const login = async (payload: LoginPayload) => {
  const response = await axiosClient.post<ApiSuccess<LoginResponse>>('/auth/login', payload);
  return response.data.data;
};

export const register = async (payload: RegisterPayload) => {
  const response = await axiosClient.post<ApiSuccess<{ user: User }>>('/auth/register', payload);
  return response.data.data.user;
};

export const refresh = async (refreshToken: string) => {
  const response = await axiosClient.post<ApiSuccess<RefreshResponse>>('/auth/refresh', { refreshToken });
  return response.data.data.tokens;
};

export const logout = async (refreshToken: string) => {
  await axiosClient.post<ApiSuccess<null>>('/auth/logout', { refreshToken });
};

export const me = async () => {
  const response = await axiosClient.get<ApiSuccess<{ user: User }>>('/auth/me');
  return response.data.data.user;
};
