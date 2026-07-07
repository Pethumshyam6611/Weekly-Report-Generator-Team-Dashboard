import type { Pagination } from './api.types';

export type AiQueryResult = {
  answer: string;
  filters: Record<string, string>;
  reportCount: number;
};

export type AiHistoryItem = {
  id: number;
  manager_id: number;
  query_text: string;
  response_text: string | null;
  context_meta: Record<string, unknown> | null;
  created_at: string;
};

export type AiHistoryResponse = {
  pagination: Pagination;
  history: AiHistoryItem[];
};
