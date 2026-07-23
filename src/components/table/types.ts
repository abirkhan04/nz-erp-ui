import type { ColumnDef } from "@tanstack/react-table";

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface ReportTableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];

  loading?: boolean;

  pageNumber: number;
  pageSize: number;
  totalCount: number;

  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  pageSizeOptions?: number[];
}

export interface ReportPaginationProps {
  pageNumber: number;
  pageSize: number;
  totalCount: number;

  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  pageSizeOptions?: number[];
}