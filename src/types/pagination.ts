export type PaginationType = 'offset' | 'cursor';

export interface PaginationConfig<T, P = any> {
  fetch: (params: P) => Promise<PaginationResponse<T>>;
  type: PaginationType;
  pageSize?: number;
  initialParams?: P;
  transform?: (data: any) => T[];
  dedupeKey?: (item: T) => string | number;
}

export interface PaginationResponse<T> {
  items: T[];
  total?: number;
  nextCursor?: string | null;
  hasMore: boolean;
}

export interface PaginationState<T> {
  items: T[];
  accumulatedItems: T[];
  isLoading: boolean;
  error: any | null;
  currentPage: number;
  currentCursor: string | null;
  hasMore: boolean;
}
