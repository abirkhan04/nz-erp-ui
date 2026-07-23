import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import ReportPagination from "./ReportPagination";

import EmptyState from "./EmptyState";
import LoadingTable from "./LoadingTable";
import type { ReportTableProps } from "./types";

export default function ReportTable<T>({
    data,
    columns,
    loading = false,

    pageNumber,
    pageSize,
    totalCount,

    onPageChange,
    onPageSizeChange,

    pageSizeOptions,
}: ReportTableProps<T>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

            <div className="overflow-x-auto">

                <table className="min-w-full">

                    <thead className="bg-slate-50">

                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>

                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="border-b px-4 py-3 text-left text-sm font-semibold text-slate-700 whitespace-nowrap"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}

                            </tr>
                        ))}

                    </thead>

                    {loading ? (
                        <LoadingTable
                            rows={10}
                            columns={columns.length}
                        />
                    ) : (
                        <tbody>

                            {table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                    >
                                        <EmptyState />
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className="border-b px-4 py-3 text-sm whitespace-nowrap"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}

                        </tbody>
                    )}

                </table>

            </div>

            <ReportPagination
                pageNumber={pageNumber}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                pageSizeOptions={pageSizeOptions}
            />

        </div>
    );
}