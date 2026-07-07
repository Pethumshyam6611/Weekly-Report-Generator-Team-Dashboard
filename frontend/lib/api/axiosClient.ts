import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiSuccess } from '@/lib/types/api.types';
import type { RefreshResponse } from '@/lib/types/user.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const ACCESS_TOKEN_KEY = 'wr_access_token';
const REFRESH_TOKEN_KEY = 'wr_refresh_token';
const USER_KEY = 'wr_user';

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

const isBrowser = () => typeof window !== 'undefined';

export const getAccessToken = () => (isBrowser() ? localStorage.getItem(ACCESS_TOKEN_KEY) : null);

export const getRefreshToken = () => (isBrowser() ? localStorage.getItem(REFRESH_TOKEN_KEY) : null);

export const storeTokens = (accessToken: string, refreshToken?: string) => {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const storeUser = (user: unknown) => {
  if (!isBrowser()) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getStoredUser = <T>() => {
  if (!isBrowser()) return null;
  const rawUser = localStorage.getItem(USER_KEY);
  if (!rawUser) return null;
  try {
    return JSON.parse(rawUser) as T;
  } catch {
    return null;
  }
};

export const clearStoredAuth = () => {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = 'wr_auth=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'wr_role=; path=/; max-age=0; SameSite=Lax';
};

export const setAuthCookies = (role: string) => {
  if (!isBrowser()) return;
  document.cookie = 'wr_auth=1; path=/; max-age=604800; SameSite=Lax';
  document.cookie = `wr_role=${role}; path=/; max-age=604800; SameSite=Lax`;
};

const redirectToLogin = () => {
  if (!isBrowser()) return;
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

const resolveQueue = (token: string | null) => {
  pendingQueue.forEach((callback) => callback(token));
  pendingQueue = [];
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const response = await axios.post<ApiSuccess<RefreshResponse>>(`${API_URL}/auth/refresh`, {
    refreshToken
  });

  const accessToken = response.data.data.tokens.accessToken;
  storeTokens(accessToken);
  return accessToken;
};

export const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push((token) => {
          if (!token) {
            reject(error);
            return;
          }
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axiosClient(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();
      resolveQueue(newToken);

      if (!newToken) {
        clearStoredAuth();
        redirectToLogin();
        return Promise.reject(error);
      }

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axiosClient(originalRequest);
    } catch (refreshError) {
      resolveQueue(null);
      clearStoredAuth();
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export const getApiErrorMessage = (error: unknown, fallback = 'Something went wrong') => {
  if (axios.isAxiosError(error)) {
    const response = error.response?.data as { error?: { message?: string } } | undefined;
    return response?.error?.message || fallback;
  }
  return fallback;
};
