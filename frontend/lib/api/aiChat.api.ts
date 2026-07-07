import { axiosClient } from './axiosClient';
import type { ApiSuccess } from '@/lib/types/api.types';
import type { AiHistoryResponse, AiQueryResult } from '@/lib/types/ai.types';

export const askAi = async (question: string) => {
  const response = await axiosClient.post<ApiSuccess<AiQueryResult>>('/ai-chat/query', { question });
  return response.data.data;
};

export const getAiHistory = async (params: { page?: number; perPage?: number } = {}) => {
  const response = await axiosClient.get<ApiSuccess<AiHistoryResponse>>('/ai-chat/history', { params });
  return response.data.data;
};
