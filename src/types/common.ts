/**
 * Common Shared Types
 *
 * Tipe data global yang digunakan lintas fitur dan domain.
 */

export interface FilterParams {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  order?: "asc" | "desc";
  [key: string]: unknown;
}

export interface ItemOptionType {
  id: string;
  name: string;
  [key: string]: unknown;
}

export type CommonStatusType = "active" | "inactive" | "pending" | "archived";

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface BreadcrumbType {
  title: string;
  path?: string;
}
