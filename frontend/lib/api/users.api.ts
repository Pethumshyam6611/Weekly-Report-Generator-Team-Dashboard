import { axiosClient } from './axiosClient';
import type { ApiSuccess } from '@/lib/types/api.types';
import type { User } from '@/lib/types/user.types';

export const getTeamMembers = async () => {
  const response = await axiosClient.get<ApiSuccess<{ users: User[] }>>('/users/team-members');
  return response.data.data.users;
};
