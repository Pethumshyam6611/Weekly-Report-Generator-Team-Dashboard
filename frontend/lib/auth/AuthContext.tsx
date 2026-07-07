'use client';

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import * as authApi from '@/lib/api/auth.api';
import {
  clearStoredAuth,
  getAccessToken,
  getApiErrorMessage,
  getRefreshToken,
  getStoredUser,
  setAuthCookies,
  storeTokens,
  storeUser
} from '@/lib/api/axiosClient';
import type { User } from '@/lib/types/user.types';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: authApi.RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshCurrentUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

const redirectForRole = (role: User['role']) => (role === 'manager' ? '/dashboard' : '/reports');

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const persistUser = useCallback((nextUser: User) => {
    setUser(nextUser);
    storeUser(nextUser);
    setAuthCookies(nextUser.role);
  }, []);

  const refreshCurrentUser = useCallback(async () => {
    try {
      const nextUser = await authApi.me();
      persistUser(nextUser);
    } catch {
      clearStoredAuth();
      setUser(null);
    }
  }, [persistUser]);

  useEffect(() => {
    const cachedUser = getStoredUser<User>();
    const accessToken = getAccessToken();

    if (cachedUser) {
      setUser(cachedUser);
    }

    if (cachedUser || accessToken) {
      refreshCurrentUser().finally(() => setLoading(false));
      return;
    }

    setLoading(false);
  }, [refreshCurrentUser]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login({ email, password });
    storeTokens(data.tokens.accessToken, data.tokens.refreshToken);
    persistUser(data.user);
    toast.success('Logged in successfully');
    router.push(redirectForRole(data.user.role));
  }, [persistUser, router]);

  const register = useCallback(async (payload: authApi.RegisterPayload) => {
    await authApi.register(payload);
    toast.success('Account created. You can log in now.');
    router.push('/login');
  }, [router]);

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not log out cleanly'));
    } finally {
      clearStoredAuth();
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    refreshCurrentUser
  }), [loading, login, logout, refreshCurrentUser, register, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
