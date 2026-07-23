import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type { ReportPaginationProps } from "./types";

export default function ReportPagination({
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}: ReportPaginationProps) {
  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / pageSize)
  );

  const start = totalCount === 0
    ? 0
    : (pageNumber - 1) * pageSize + 1;

  const end = Math.min(
    pageNumber * pageSize,
    totalCount
  );

  const pages = getVisiblePages(
    pageNumber,
    totalPages
  );

  return (
    <div className="flex flex-col gap-4 border-t bg-white px-6 py-4 md:flex-row md:items-center md:justify-between">

      <div className="text-sm text-slate-600">
        Showing{" "}
        <span className="font-semibold">{start}</span> to{" "}
        <span className="font-semibold">{end}</span> of{" "}
        <span className="font-semibold">{totalCount}</span> entries
      </div>

      <div className="flex items-center gap-3">

        <div className="flex items-center gap-2">

          <span className="text-sm text-slate-600">
            Rows
          </span>

          <select
            className="rounded-lg border px-3 py-2 text-sm outline-none"
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
            }}
          >
            {pageSizeOptions.map((size) => (
              <option
                key={size}
                value={size}
              >
                {size}
              </option>
            ))}
          </select>

        </div>

        <button
          disabled={pageNumber === 1}
          onClick={() => onPageChange(pageNumber - 1)}
          className="rounded-lg border p-2 disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2">

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`h-9 w-9 rounded-lg border text-sm transition
              ${
                page === pageNumber
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-slate-100"
              }`}
            >
              {page}
            </button>
          ))}

        </div>

        <button
          disabled={pageNumber === totalPages}
          onClick={() => onPageChange(pageNumber + 1)}
          className="rounded-lg border p-2 disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>

      </div>

    </div>
  );
}

function getVisiblePages(
  current: number,
  total: number
) {
  const delta = 2;

  const pages: number[] = [];

  const start = Math.max(
    1,
    current - delta
  );

  const end = Math.min(
    total,
    current + delta
  );

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}