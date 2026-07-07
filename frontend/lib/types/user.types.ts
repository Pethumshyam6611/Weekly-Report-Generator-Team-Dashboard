export type UserRole = 'team_member' | 'manager';

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
  tokenType: 'Bearer';
  expiresIn: string;
};

export type LoginResponse = {
  user: User;
  tokens: Required<AuthTokens>;
};

export type RefreshResponse = {
  tokens: Omit<AuthTokens, 'refreshToken'>;
};
