export type ApiSuccess<T> = {
  success: true;
  data: T;
  message: string;
};

export type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ field?: string; message: string }>;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type Pagination = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};
