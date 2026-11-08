/**
 * API Contract Types
 *
 * Standar amplop data respons, error handling, dan generic mutation props.
 */

export interface ArrayData<T> {
  counts: number;
  page: number;
  page_count: number;
  page_size: number;
  results: Array<T>;
}

export interface CountType {
  count: number;
}

export interface ApiErrorBody {
  message: string;
  errors?: Record<string, Array<string>>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface MutationProps<TData = unknown, TVariables = void> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: unknown, variables: TVariables) => void;
}
