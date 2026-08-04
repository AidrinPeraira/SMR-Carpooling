export interface PaginationMetaData {
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedPayload<T> {
  data: T;
  paginationMeta: PaginationMetaData;
}
