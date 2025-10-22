export interface PaginationParams {
  per_page?: number;
  page?: number;
}

export interface Pagination {
  url?: string;
  page: number;
  per_page: number;
  next_page: number;
}
