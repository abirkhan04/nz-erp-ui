export interface PaginationRequest {
  pageNumber: number;
  pageSize: number;
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
