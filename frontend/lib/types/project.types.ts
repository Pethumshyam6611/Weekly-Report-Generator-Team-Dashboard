import type { User } from './user.types';

export type Project = {
  id: number;
  name: string;
  description: string | null;
  created_by: number;
  is_active: boolean;
  created_at: string;
};

export type ProjectWithMembers = Project & {
  members?: User[];
  memberCount?: number;
};
