import { SortOrder } from "../enums";

export interface QueryRequest {
  limit: number;
  page: number;
  search?: string;
  searchFields?: string[];
  sortValue?: SortOrder;
  sortField?: string;
  filterField?: string;
  filterValue?: any;
}

export interface QueryDTO<T, K extends keyof T = keyof T> {
  limit: number;
  page: number;
  search?: string;
  searchFields?: (keyof T)[];
  sortValue?: SortOrder;
  sortField?: keyof T;
  filterField?: keyof T;
  filterValue?: T[K];
}
