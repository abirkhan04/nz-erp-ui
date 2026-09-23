import React, { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    CircleHelp,
    Eye,
    Info,
    UsersRound,
    XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { API_ROUTES } from "../../api/routes";
import { useGet } from "../../hooks/useGet";
import { api } from "../../api/client";
// import { useAuth } from "../../hooks/useAuth";

interface LeaveRequest {
    requestId: string;
    employeeId: string;
    employeeName: string;
    departmentName: string;
    leaveType: string;
    fromDate: string;
    toDate: string;
    forwardedDate: string;
    reason: string;
    forwardedBy: string;
    status: "Pending" | "Approved" | "Rejected";
}

interface LeaveRequestResponse {
    data: LeaveRequest[];
    totalCount?: number;
    total?: number;
}

interface LeaveApprovalPayload {
    requestId: string;
    leaveType: string;
    fromDate: string;
    toDate: string;
    reason: string;
    forwardedBy: string;
    forwardedDate: string;
    approvedBy: string;
    approvStatus: string;
}

const LeaveRequestList: React.FC = () => {
    const navigate = useNavigate();

    /*
     * --------------------------------------------------------------------------
     * DATA
     * --------------------------------------------------------------------------
     */

    const {
        data: leaveRequestsResponse,
        refetch: refetchRequests,
        isLoading,
    } = useGet<LeaveRequestResponse>({
        key: ["leaveRequests"],
        url: `${API_ROUTES.LEAVE}?status=FORWARDED&page=1&size=10000`,
    });

    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

    useEffect(() => {
        if (leaveRequestsResponse?.data) {
            setLeaveRequests(leaveRequestsResponse.data);
        }
    }, [leaveRequestsResponse]);

    /*
     * --------------------------------------------------------------------------
     * PAGINATION - UI SIDE ONLY
     * --------------------------------------------------------------------------
     */

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const totalCount = leaveRequests.length;

    const totalPages = Math.max(
        1,
        Math.ceil(totalCount / pageSize)
    );

    const currentPageData = useMemo(() => {
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        return leaveRequests.slice(startIndex, endIndex);
    }, [leaveRequests, pageNumber, pageSize]);

    /*
     * --------------------------------------------------------------------------
     * SELECTION
     * --------------------------------------------------------------------------
     */

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const currentPageIds = currentPageData.map(
        (request) => request.requestId
    );

    const selectedCurrentPageCount = currentPageIds.filter(
        (id) => selectedIds.includes(id)
    ).length;

    const allCurrentPageSelected =
        currentPageData.length > 0 &&
        selectedCurrentPageCount === currentPageData.length;

    const someCurrentPageSelected =
        selectedCurrentPageCount > 0 &&
        selectedCurrentPageCount < currentPageData.length;

    /*
     * --------------------------------------------------------------------------
     * SELECT / DESELECT
     * --------------------------------------------------------------------------
     */

    const handleSelectRow = (id: string) => {
        setSelectedIds((previous) => {
            if (previous.includes(id)) {
                return previous.filter(
                    (selectedId) => selectedId !== id
                );
            }

            return [...previous, id];
        });
    };

    const handleSelectCurrentPage = () => {
        if (allCurrentPageSelected) {
            setSelectedIds((previous) =>
                previous.filter(
                    (id) => !currentPageIds.includes(id)
                )
            );

            return;
        }

        setSelectedIds((previous) => {
            const ids = new Set(previous);

            currentPageIds.forEach((id) => ids.add(id));

            return Array.from(ids);
        });
    };

    /*
     * --------------------------------------------------------------------------
     * SELECTED REQUESTS
     * --------------------------------------------------------------------------
     */

    const selectedRequests = useMemo(() => {
        return leaveRequests.filter((request) =>
            selectedIds.includes(request.requestId)
        );
    }, [leaveRequests, selectedIds]);

    /*
     * --------------------------------------------------------------------------
     * APPROVE / REJECT
     * --------------------------------------------------------------------------
     */

    const [actionLoading, setActionLoading] = useState(false);

    /*
     * Replace this with your actual authenticated user ID.
     *
     * Example:
     *
     * const { user } = useAuth();
     * const approvedBy = user.userId;
     */
    const approvedBy = "CURRENT_USER_ID";

    const buildPayload = (
        requests: LeaveRequest[],
        status: "APPROVED" | "REJECTED"
    ): LeaveApprovalPayload[] => {
        return requests.map((request) => ({
            requestId: request.requestId,
            leaveType: request.leaveType,
            fromDate: request.fromDate,
            toDate: request.toDate,
            reason: request.reason,
            forwardedBy: request.forwardedBy,
            forwardedDate: request.forwardedDate,
            approvedBy,
            approvStatus: status,
        }));
    };

    const handleApprovalAction = async (
        status: "APPROVED" | "REJECTED"
    ) => {
        if (selectedRequests.length === 0) {
            return;
        }

        const payload = buildPayload(
            selectedRequests,
            status
        );

        try {
            setActionLoading(true);

            console.log(
                `${status} payload:`,
                payload
            );

            await api.put(
                API_ROUTES.LEAVE,
                payload
            );

            /*
             * Remove successfully processed requests
             * from the local UI.
             */

            setLeaveRequests((previous) =>
                previous.filter(
                    (request) =>
                        !selectedIds.includes(request.requestId)
                )
            );

            setSelectedIds([]);

            /*
             * Make sure page number remains valid
             * after removing records.
             */
            setPageNumber((previousPage) => {
                const remainingCount =
                    leaveRequests.length -
                    selectedRequests.length;

                const remainingPages = Math.max(
                    1,
                    Math.ceil(
                        remainingCount / pageSize
                    )
                );

                return Math.min(
                    previousPage,
                    remainingPages
                );
            });

            await refetchRequests();
        } catch (error) {
            console.error(
                `Failed to ${status.toLowerCase()} leave requests:`,
                error
            );
        } finally {
            setActionLoading(false);
        }
    };

    /*
     * --------------------------------------------------------------------------
     * VIEW DETAILS
     * --------------------------------------------------------------------------
     */

    const handleViewDetails = (
        request: LeaveRequest
    ) => {
        navigate(
            `/payroll-and-workforce-movement/attendance-cell/leave-requests/${request.requestId}`,
            {
                state: {
                    request,
                },
            }
        );
    };

    /*
     * --------------------------------------------------------------------------
     * PAGINATION
     * --------------------------------------------------------------------------
     */

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) {
            return;
        }
        setPageNumber(page);
    };

    const handlePageSizeChange = (
        newPageSize: number
    ) => {
        setPageSize(newPageSize);
        setPageNumber(1);
    };
    /*
     * --------------------------------------------------------------------------
     * PAGE NUMBERS
     * --------------------------------------------------------------------------
     */
    const pageNumbers = useMemo(() => {
        const pages: number[] = [];

        for (
            let page = 1;
            page <= totalPages;
            page++
        ) {
            pages.push(page);
        }

        return pages;
    }, [totalPages]);

    /*
     * --------------------------------------------------------------------------
     * DATE
     * --------------------------------------------------------------------------
     */
    const currentDate = new Date();
    const formattedDate =
        currentDate.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    const currentDay =
        currentDate.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
            }
        );

    /*
     * --------------------------------------------------------------------------
     * RENDER
     * --------------------------------------------------------------------------
     */

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6">

            {/* HEADER */}

            <header className="flex h-[66px] items-center justify-between bg-gradient-to-r from-[#063bb8] to-[#07379d] px-7 text-white">

                <div className="flex items-center gap-4">

                    <div className="flex items-center gap-3">

                        <span className="text-[42px] font-bold leading-none">
                            S
                        </span>

                        <div>
                            <h1 className="text-[20px] font-bold leading-none">
                                SYNEXIS
                            </h1>

                            <p className="mt-1 text-[8px]">
                                Creating Enterprise Synergy
                            </p>
                        </div>

                    </div>

                    <div className="h-10 w-px bg-white/30" />

                    <div>
                        <h2 className="text-[16px] font-bold leading-tight">
                            PAYROLL &amp; WORKFORCE MOVEMENT SECTION – ATTENDANCE CELL
                        </h2>

                        <p className="mt-1 text-[12px]">
                            Dashboard &gt; Attendance &gt; Section
                        </p>
                    </div>

                </div>

                <div className="flex items-center gap-4">

                    <div className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-[11px] font-semibold text-[#10245c]">

                        <CalendarDays size={15} />

                        <span>
                            {formattedDate} | {currentDay}
                        </span>

                    </div>

                    <div className="flex items-center gap-2 border-l border-white/30 pl-4">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0a48c7]">
                            <UsersRound size={20} />
                        </div>

                        <div>
                            <p className="text-[11px] font-semibold">
                                Nusrat Jahan
                            </p>

                            <p className="text-[9px]">
                                Section Incharge
                            </p>
                        </div>

                    </div>

                </div>

            </header>

            {/* TITLE */}

            <div className="mb-4 rounded-xl border border-blue-100 bg-white px-5 py-4 shadow-sm">

                <div className="flex items-center gap-2">

                    <CalendarDays
                        size={21}
                        className="text-blue-600"
                    />

                    <h1 className="text-lg font-bold text-blue-800">
                        Leave Requests
                    </h1>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                    Showing leave requests forwarded by Time Office to Attendance Cell.
                </p>

            </div>

            {/* INFORMATION / ACTION BAR */}

            <div className="mb-4 flex flex-col gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-start gap-3">

                    <Info
                        size={18}
                        className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <div>

                        <p className="text-sm font-semibold text-blue-700">
                            Leave Request List
                        </p>

                        <p className="text-xs text-blue-600">
                            {selectedIds.length} selected of{" "}
                            {totalCount} requests
                        </p>

                    </div>

                </div>

                <div className="flex gap-2">

                    <button
                        type="button"
                        disabled={
                            selectedIds.length === 0 ||
                            actionLoading
                        }
                        onClick={() =>
                            handleApprovalAction(
                                "APPROVED"
                            )
                        }
                        className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <CheckCircle2 size={16} />

                        Approve Selected
                    </button>

                    <button
                        type="button"
                        disabled={
                            selectedIds.length === 0 ||
                            actionLoading
                        }
                        onClick={() =>
                            handleApprovalAction(
                                "REJECTED"
                            )
                        }
                        className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <XCircle size={16} />

                        Reject Selected
                    </button>

                </div>

            </div>

            {/* TABLE */}

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[1300px] text-sm">

                        <thead className="bg-slate-100">

                            <tr>

                                {/* SELECT ALL */}

                                <th className="w-12 px-4 py-3 text-center">

                                    <input
                                        type="checkbox"
                                        checked={
                                            allCurrentPageSelected
                                        }
                                        ref={(element) => {
                                            if (element) {
                                                element.indeterminate =
                                                    someCurrentPageSelected;
                                            }
                                        }}
                                        onChange={
                                            handleSelectCurrentPage
                                        }
                                        className="h-4 w-4 cursor-pointer"
                                    />

                                </th>

                                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">
                                    #
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">
                                    Request ID
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">
                                    Employee ID
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">
                                    Employee Name
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">
                                    Department
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">
                                    Leave Type
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">
                                    Leave From
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">
                                    Leave To
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">
                                    Applied On
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">
                                    Reason
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">
                                    Forwarded By
                                </th>

                                <th className="px-4 py-3 text-center text-xs font-bold uppercase text-slate-600">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody className="divide-y divide-slate-100">

                            {isLoading ? (

                                <tr>
                                    <td
                                        colSpan={13}
                                        className="px-4 py-12 text-center text-sm text-slate-500"
                                    >
                                        Loading leave requests...
                                    </td>
                                </tr>

                            ) : currentPageData.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan={13}
                                        className="px-4 py-12 text-center text-sm text-slate-500"
                                    >
                                        No leave requests found.
                                    </td>
                                </tr>

                            ) : (

                                currentPageData.map(
                                    (
                                        request,
                                        index
                                    ) => {

                                        const isSelected =
                                            selectedIds.includes(
                                                request.requestId
                                            );

                                        const serialNumber =
                                            (pageNumber - 1) *
                                                pageSize +
                                            index +
                                            1;

                                        return (
                                            <tr
                                                key={
                                                    request.requestId
                                                }
                                                className={
                                                    isSelected
                                                        ? "bg-blue-50"
                                                        : "hover:bg-slate-50"
                                                }
                                            >

                                                {/* CHECKBOX */}

                                                <td className="px-4 py-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            isSelected
                                                        }
                                                        onChange={() =>
                                                            handleSelectRow(
                                                                request.requestId
                                                            )
                                                        }
                                                        className="h-4 w-4 cursor-pointer"
                                                    />

                                                </td>

                                                {/* SERIAL */}

                                                <td className="px-4 py-3 text-slate-600">
                                                    {serialNumber}
                                                </td>

                                                <td className="px-4 py-3 font-medium text-slate-700">
                                                    {
                                                        request.requestId
                                                    }
                                                </td>

                                                <td className="px-4 py-3 text-slate-600">
                                                    {
                                                        request.employeeId
                                                    }
                                                </td>

                                                <td className="px-4 py-3 font-semibold text-slate-800">
                                                    {
                                                        request.employeeName
                                                    }
                                                </td>

                                                <td className="px-4 py-3 text-slate-600">
                                                    {
                                                        request.departmentName
                                                    }
                                                </td>

                                                <td className="px-4 py-3 font-medium text-blue-700">
                                                    {
                                                        request.leaveType
                                                    }
                                                </td>

                                                <td className="px-4 py-3 text-slate-600">
                                                    {
                                                        request.fromDate
                                                    }
                                                </td>

                                                <td className="px-4 py-3 text-slate-600">
                                                    {
                                                        request.toDate
                                                    }
                                                </td>

                                                <td className="px-4 py-3 text-slate-600">
                                                    {
                                                        request.forwardedDate
                                                    }
                                                </td>

                                                <td className="max-w-[220px] px-4 py-3 text-slate-600">
                                                    {
                                                        request.reason
                                                    }
                                                </td>

                                                <td className="px-4 py-3 text-slate-600">
                                                    {
                                                        request.forwardedBy
                                                    }
                                                </td>

                                                <td className="px-4 py-3 text-center">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleViewDetails(
                                                                request
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                                                    >
                                                        <Eye
                                                            size={
                                                                14
                                                            }
                                                        />

                                                        View
                                                    </button>

                                                </td>

                                            </tr>
                                        );
                                    }
                                )

                            )}

                        </tbody>

                    </table>

                </div>

                {/* PAGINATION */}

                <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-2 text-sm text-slate-600">

                        <span>
                            Rows per page:
                        </span>

                        <select
                            value={pageSize}
                            onChange={(event) =>
                                handlePageSizeChange(
                                    Number(
                                        event.target
                                            .value
                                    )
                                )
                            }
                            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                        >
                            <option value={5}>
                                5
                            </option>

                            <option value={10}>
                                10
                            </option>

                            <option value={20}>
                                20
                            </option>

                            <option value={50}>
                                50
                            </option>

                            <option value={100}>
                                100
                            </option>
                        </select>

                        <span>
                            {totalCount === 0
                                ? "0"
                                : (pageNumber -
                                      1) *
                                      pageSize +
                                  1}
                            -
                            {Math.min(
                                pageNumber *
                                    pageSize,
                                totalCount
                            )}{" "}
                            of {totalCount}
                        </span>

                    </div>

                    <div className="flex items-center gap-1">

                        <button
                            type="button"
                            disabled={
                                pageNumber === 1
                            }
                            onClick={() =>
                                handlePageChange(
                                    pageNumber - 1
                                )
                            }
                            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>

                        {pageNumbers.map(
                            (page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() =>
                                        handlePageChange(
                                            page
                                        )
                                    }
                                    className={`min-w-9 rounded-md px-3 py-1.5 text-sm font-semibold ${
                                        page ===
                                        pageNumber
                                            ? "bg-blue-600 text-white"
                                            : "border border-slate-300 text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    {page}
                                </button>
                            )
                        )}

                        <button
                            type="button"
                            disabled={
                                pageNumber ===
                                totalPages
                            }
                            onClick={() =>
                                handlePageChange(
                                    pageNumber + 1
                                )
                            }
                            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>

                    </div>

                </div>

            </div>

            {/* SELECTION SUMMARY */}

            {selectedIds.length > 0 && (
                <div className="mt-4 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">

                    <div className="flex items-center gap-2 text-sm text-blue-700">

                        <CheckCircle2
                            size={17}
                        />

                        <span className="font-semibold">
                            {selectedIds.length}{" "}
                            request
                            {selectedIds.length !==
                            1
                                ? "s"
                                : ""}{" "}
                            selected
                        </span>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setSelectedIds([])
                        }
                        className="text-sm font-semibold text-blue-600 hover:underline"
                    >
                        Clear selection
                    </button>

                </div>
            )}

            {/* BACK */}

            <button
                type="button"
                onClick={() =>
                    navigate(
                        "/payroll-and-workforce-movement/attendance-cell"
                    )
                }
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
                <ArrowLeft size={16} />

                Back to Dashboard
            </button>

        </div>
    );
};

export default LeaveRequestList;