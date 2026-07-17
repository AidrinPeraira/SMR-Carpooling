export interface PaginationMetaData {
  currentPage: number;
  limit: number;
  totatlItems: number;
  totalPages: number;
}

export interface PaginatedPayload<T> {
  data: T;
  paginationMeta: PaginationMetaData;
}
