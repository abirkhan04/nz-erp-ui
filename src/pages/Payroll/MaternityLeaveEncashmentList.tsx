import React, { useMemo, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Eye,
    Info,
    RefreshCw,
    XCircle,
    UsersRound
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { API_ROUTES } from "../../api/routes";
import { useGet } from "../../hooks/useGet";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/client";

/* ==========================================================================
 * TYPES
 * ========================================================================== */

interface MaternityLeaveEncashmentRequest {
    requestId: string;
    employeeId: string;
    employeeName: string;
    leaveType: string;
    encashDate: string;
    encashDays: number;
    reason: string;
    instalment: string;
    createdBy: string | null;
    createdDate: string | null;
    modifiedBy: string | null;
    modifiedDate: string | null;
    forwardedBy: string;
    forwardedDate: string;
    leaveBalance: number;
    leaveAccruedThisYear: number;
    fromDate: string | null;
    toDate: string | null;
    status: string;
    employeeCode: string;
    department: string;
}

interface EarnedLeaveEncashmentResponse {
    success: boolean;
    data: MaternityLeaveEncashmentRequest[];
    total: number;
}

interface EncashmentActionPayload {
    requestId: string;
    leaveType: string;
    employeeId: string;
    employeeName: string;
    encashDate: string;
    encashDays: number;
    reason: string;
    forwardedBy: string;
    forwardedDate: string;
    modifiedBy: string | undefined;
    status: string;
}

/* ==========================================================================
 * HELPERS
 * ========================================================================== */

const formatDate = (date: string | null) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatDateTime = (date: string | null) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

/* ==========================================================================
 * PAGE
 * ========================================================================== */

const MaternityLeaveEncashmentList: React.FC = () => {
    const navigate = useNavigate();

    /* ----------------------------------------------------------------------
     * GET ALL DATA
     * ---------------------------------------------------------------------- */

    const {
        data: response,
        isLoading,
        refetch,
    } = useGet<EarnedLeaveEncashmentResponse>({
        key: ["encashRequests"],
        url: `${API_ROUTES.LEAVE_ENCASHMENT_REQUESTS}?status=FORWARDED&leaveType=ML&page=1&size=10000`,
    });

    const encashRequests = response?.data ?? [];

    /* ----------------------------------------------------------------------
     * PAGINATION
     * ---------------------------------------------------------------------- */

    const [pageNumber, setPageNumber] = useState(1);

    const [pageSize, setPageSize] = useState(5);

    const totalCount = encashRequests.length;

    const totalPages = Math.max(
        1,
        Math.ceil(totalCount / pageSize),
    );

    const paginatedRequests = useMemo(() => {
        const startIndex =
            (pageNumber - 1) * pageSize;

        const endIndex =
            startIndex + pageSize;

        return encashRequests.slice(
            startIndex,
            endIndex,
        );
    }, [
        encashRequests,
        pageNumber,
        pageSize,
    ]);

    /* ----------------------------------------------------------------------
     * SELECTION
     *
     * Store requestId instead of the complete object.
     * This allows selections to remain active while changing pages.
     * ---------------------------------------------------------------------- */

    const [selectedIds, setSelectedIds] =
        useState<Set<string>>(new Set());

    /* ----------------------------------------------------------------------
     * CURRENT PAGE SELECTION
     * ---------------------------------------------------------------------- */

    const currentPageIds = useMemo(
        () =>
            paginatedRequests.map(
                (request) => request.requestId,
            ),
        [paginatedRequests],
    );

    const allCurrentPageSelected =
        currentPageIds.length > 0 &&
        currentPageIds.every((id) =>
            selectedIds.has(id),
        );

    const someCurrentPageSelected =
        currentPageIds.some((id) =>
            selectedIds.has(id),
        );

    /* ----------------------------------------------------------------------
     * SELECT / UNSELECT SINGLE ROW
     * ---------------------------------------------------------------------- */

    const handleSelectRow = (
        requestId: string,
    ) => {
        setSelectedIds((previous) => {
            const next = new Set(previous);

            if (next.has(requestId)) {
                next.delete(requestId);
            } else {
                next.add(requestId);
            }

            return next;
        });
    };

    /* ----------------------------------------------------------------------
     * SELECT / UNSELECT CURRENT PAGE
     * ---------------------------------------------------------------------- */

    const handleSelectCurrentPage = () => {
        setSelectedIds((previous) => {
            const next = new Set(previous);

            if (allCurrentPageSelected) {
                currentPageIds.forEach((id) =>
                    next.delete(id),
                );
            } else {
                currentPageIds.forEach((id) =>
                    next.add(id),
                );
            }

            return next;
        });
    };

    /* ----------------------------------------------------------------------
     * SELECTED REQUESTS
     * ---------------------------------------------------------------------- */

    const selectedRequests = useMemo(
        () =>
            encashRequests.filter((request) =>
                selectedIds.has(
                    request.requestId,
                ),
            ),
        [encashRequests, selectedIds],
    );

    /* ----------------------------------------------------------------------
     * PAGINATION HANDLERS
     * ---------------------------------------------------------------------- */

    const handlePageChange = (
        newPage: number,
    ) => {
        if (
            newPage < 1 ||
            newPage > totalPages
        ) {
            return;
        }

        setPageNumber(newPage);
    };

    const handlePageSizeChange = (
        newPageSize: number,
    ) => {
        setPageSize(newPageSize);
        setPageNumber(1);
    };

    /* ----------------------------------------------------------------------
     * VIEW DETAILS
     * ---------------------------------------------------------------------- */

    const handleViewDetails = (
        request: MaternityLeaveEncashmentRequest,
    ) => {
        navigate(
            `/payroll-and-workforce-movement/attendance-cell/maternity-leave-encashment-requests/${request.requestId}`,
            {
                state: {
                    request,
                },
            },
        );
    };

    /* ----------------------------------------------------------------------
     * FORWARD SELECTED
     * ---------------------------------------------------------------------- */

    const { user } = useAuth();

    const handleForwardSelected = async () => {
        if (selectedRequests.length === 0) {
            return;
        }

        const payload: EncashmentActionPayload[] =
            selectedRequests.map((request) => ({
                requestId: request.requestId,
                leaveType: request.leaveType,
                employeeId: request.employeeId,
                employeeName: request.employeeName,
                encashDate: request.encashDate,
                encashDays: request.encashDays,
                reason: request.reason,
                forwardedBy: request.forwardedBy,
                forwardedDate: request.forwardedDate.split("T")[0],
                modifiedBy: user?.userId,
                status: "FORWARDED_TO_HR",
            }));

        try {
            console.log("Approve payload:", payload);

            await api.put(
                API_ROUTES.LEAVE_ENCASHMENT_REQUESTS,
                payload
            );

            setSelectedIds(new Set());

            await refetch();
        } catch (error) {
            console.error(
                "Failed to approve selected requests:",
                error,
            );
        }
    };

    /* ----------------------------------------------------------------------
     * REJECT SELECTED
     * ---------------------------------------------------------------------- */

    const handleRejectSelected = async () => {
        if (selectedRequests.length === 0) {
            return;
        }

        const payload: EncashmentActionPayload[] =
            selectedRequests.map((request) => ({
                requestId: request.requestId,
                leaveType: request.leaveType,
                employeeId: request.employeeId,
                employeeName: request.employeeName,
                encashDate: request.encashDate,
                encashDays: request.encashDays,
                reason: request.reason,
                forwardedBy: request.forwardedBy,
                forwardedDate: request.forwardedDate,
                modifiedBy: user?.userId,
                status: "REJECTED",
            }));

        try {
            console.log("Reject payload:", payload);

            await api.put(
                API_ROUTES.LEAVE_ENCASHMENT_REQUESTS,
                payload
            );

            setSelectedIds(new Set());

            await refetch();
        } catch (error) {
            console.error(
                "Failed to reject selected requests:",
                error,
            );
        }
    };

    /* ----------------------------------------------------------------------
     * CLEAR SELECTION
     * ---------------------------------------------------------------------- */

    const handleClearSelection = () => {
        setSelectedIds(new Set());
    };

    /* ----------------------------------------------------------------------
     * PAGE NUMBER LIST
     * ---------------------------------------------------------------------- */

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

    /* ==========================================================================
     * UI
     * ========================================================================== */

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

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6">

            {/* ==================================================================
                PAGE HEADER
            ================================================================== */}
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

            <div className="mb-4 rounded-xl border border-blue-100 bg-white px-5 py-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                    <div>
                        <div className="flex items-center gap-2">
                            <CalendarDays
                                size={21}
                                className="text-blue-600"
                            />

                            <h1 className="text-lg font-bold text-blue-800">
                                Maternity Leave Encashment Requests
                            </h1>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                            Review forwarded earned leave
                            encashment requests and take
                            action on selected requests.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        disabled={isLoading}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            border
                            border-blue-200
                            bg-white
                            px-4
                            py-2
                            text-sm
                            font-semibold
                            text-blue-600
                            transition
                            hover:bg-blue-50
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        <RefreshCw
                            size={15}
                            className={
                                isLoading
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        Refresh
                    </button>
                </div>
            </div>

            {/* ==================================================================
                INFORMATION BAR
            ================================================================== */}

            <div className="mb-4 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                <Info
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-600"
                />

                <div>
                    <p className="text-sm font-semibold text-blue-700">
                        Encashment Request List
                    </p>

                    <p className="text-xs text-blue-600">
                        Select one or more requests using
                        the checkboxes, then use the action
                        buttons below the table.
                    </p>
                </div>
            </div>

            {/* ==================================================================
                TABLE CARD
            ================================================================== */}

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                {/* ----------------------------------------------------------------
                    TABLE HEADER
                ---------------------------------------------------------------- */}

                <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">

                    <div>
                        <h2 className="text-sm font-bold text-slate-800">
                            Requests
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            {totalCount} request
                            {totalCount !== 1
                                ? "s"
                                : ""}{" "}
                            found
                        </p>
                    </div>

                    {selectedIds.size > 0 && (
                        <div className="flex items-center gap-3">
                            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                                {selectedIds.size} selected
                            </span>

                            <button
                                type="button"
                                onClick={
                                    handleClearSelection
                                }
                                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                            >
                                Clear selection
                            </button>
                        </div>
                    )}
                </div>

                {/* ----------------------------------------------------------------
                    TABLE
                ---------------------------------------------------------------- */}

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[1250px] border-collapse">

                        <thead>
                            <tr className="bg-slate-50 text-left">

                                {/* Select all */}

                                <th className="w-12 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={
                                            allCurrentPageSelected
                                        }
                                        ref={(element) => {
                                            if (element) {
                                                element.indeterminate =
                                                    !allCurrentPageSelected &&
                                                    someCurrentPageSelected;
                                            }
                                        }}
                                        onChange={
                                            handleSelectCurrentPage
                                        }
                                        className="
                                            h-4
                                            w-4
                                            cursor-pointer
                                            rounded
                                            border-slate-300
                                            text-blue-600
                                            focus:ring-blue-500
                                        "
                                    />
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                                    #
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                                    Request ID
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                                    Employee
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                                    Department
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                                    Encash Date
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                                    Days
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                                    Leave Balance
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                                    Applied
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                                    Status
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {/* ----------------------------------------------------
                                LOADING
                            ---------------------------------------------------- */}

                            {isLoading && (
                                <tr>
                                    <td
                                        colSpan={11}
                                        className="px-4 py-12 text-center"
                                    >
                                        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                                            <RefreshCw
                                                size={16}
                                                className="animate-spin"
                                            />

                                            Loading requests...
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {/* ----------------------------------------------------
                                EMPTY
                            ---------------------------------------------------- */}

                            {!isLoading &&
                                paginatedRequests.length ===
                                0 && (
                                    <tr>
                                        <td
                                            colSpan={11}
                                            className="px-4 py-12 text-center text-sm text-slate-500"
                                        >
                                            No maternity leave
                                            encashment
                                            requests found.
                                        </td>
                                    </tr>
                                )}

                            {/* ----------------------------------------------------
                                DATA
                            ---------------------------------------------------- */}

                            {!isLoading &&
                                paginatedRequests.map(
                                    (
                                        request,
                                        index,
                                    ) => {
                                        const serial =
                                            (pageNumber -
                                                1) *
                                            pageSize +
                                            index +
                                            1;

                                        const isSelected =
                                            selectedIds.has(
                                                request.requestId,
                                            );

                                        return (
                                            <tr
                                                key={
                                                    request.requestId
                                                }
                                                className={`
                                                    transition
                                                    hover:bg-slate-50
                                                    ${isSelected
                                                        ? "bg-blue-50/50"
                                                        : "bg-white"
                                                    }
                                                `}
                                            >

                                                {/* Checkbox */}

                                                <td className="px-4 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            isSelected
                                                        }
                                                        onChange={() =>
                                                            handleSelectRow(
                                                                request.requestId,
                                                            )
                                                        }
                                                        className="
                                                            h-4
                                                            w-4
                                                            cursor-pointer
                                                            rounded
                                                            border-slate-300
                                                            text-blue-600
                                                            focus:ring-blue-500
                                                        "
                                                    />
                                                </td>

                                                {/* Serial */}

                                                <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-500">
                                                    {serial}
                                                </td>

                                                {/* Request ID */}

                                                <td className="whitespace-nowrap px-4 py-4">
                                                    <span className="font-mono text-xs font-semibold text-slate-700">
                                                        {
                                                            request.requestId
                                                        }
                                                    </span>
                                                </td>

                                                {/* Employee */}

                                                <td className="px-4 py-4">
                                                    <div>
                                                        <p className="whitespace-nowrap text-sm font-semibold text-slate-800">
                                                            {
                                                                request.employeeName
                                                            }
                                                        </p>

                                                        <p className="mt-0.5 text-xs text-slate-500">
                                                            {
                                                                request.employeeCode
                                                            }
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* Department */}

                                                <td className="max-w-[220px] px-4 py-4">
                                                    <span className="text-sm text-slate-600">
                                                        {
                                                            request.department
                                                        }
                                                    </span>
                                                </td>

                                                {/* Encash Date */}

                                                <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                                                    {formatDate(
                                                        request.encashDate,
                                                    )}
                                                </td>

                                                {/* Days */}

                                                <td className="whitespace-nowrap px-4 py-4">
                                                    <span className="font-semibold text-slate-700">
                                                        {
                                                            request.encashDays
                                                        }
                                                    </span>
                                                </td>

                                                {/* Leave Balance */}

                                                <td className="whitespace-nowrap px-4 py-4">
                                                    <span className="text-sm font-semibold text-slate-700">
                                                        {
                                                            request.leaveBalance
                                                        }
                                                    </span>
                                                </td>

                                                {/* Forwarded Date */}

                                                <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                                                    {formatDateTime(
                                                        request.forwardedDate,
                                                    )}
                                                </td>

                                                {/* Status */}

                                                <td className="whitespace-nowrap px-4 py-4">
                                                    <span className="inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
                                                        {
                                                            request.status
                                                        }
                                                    </span>
                                                </td>

                                                {/* View Details */}

                                                <td className="whitespace-nowrap px-4 py-4 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleViewDetails(
                                                                request,
                                                            )
                                                        }
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            gap-1.5
                                                            rounded-md
                                                            bg-blue-50
                                                            px-3
                                                            py-2
                                                            text-xs
                                                            font-semibold
                                                            text-blue-600
                                                            transition
                                                            hover:bg-blue-100
                                                        "
                                                    >
                                                        <Eye
                                                            size={
                                                                14
                                                            }
                                                        />

                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    },
                                )}
                        </tbody>
                    </table>
                </div>

                {/* ==================================================================
                    PAGINATION
                ================================================================== */}

                <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">

                    {/* Page size */}

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">
                            Rows per page
                        </span>

                        <select
                            value={pageSize}
                            onChange={(event) =>
                                handlePageSizeChange(
                                    Number(
                                        event.target
                                            .value,
                                    ),
                                )
                            }
                            className="
                                rounded-md
                                border
                                border-slate-200
                                bg-white
                                px-2
                                py-1.5
                                text-xs
                                text-slate-700
                                outline-none
                                focus:border-blue-400
                            "
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

                        <span className="text-xs text-slate-500">
                            {totalCount === 0
                                ? "0"
                                : `${(pageNumber - 1) * pageSize + 1}-${Math.min(
                                    pageNumber *
                                    pageSize,
                                    totalCount,
                                )}`}{" "}
                            of {totalCount}
                        </span>
                    </div>

                    {/* Page controls */}

                    <div className="flex items-center gap-1">

                        <button
                            type="button"
                            disabled={
                                pageNumber === 1
                            }
                            onClick={() =>
                                handlePageChange(
                                    pageNumber - 1,
                                )
                            }
                            className="
                                rounded-md
                                border
                                border-slate-200
                                bg-white
                                px-3
                                py-1.5
                                text-xs
                                font-semibold
                                text-slate-600
                                hover:bg-slate-50
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
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
                                            page,
                                        )
                                    }
                                    className={`
                                        min-w-8
                                        rounded-md
                                        px-2.5
                                        py-1.5
                                        text-xs
                                        font-semibold
                                        transition
                                        ${page ===
                                            pageNumber
                                            ? "bg-blue-600 text-white"
                                            : "text-slate-600 hover:bg-slate-100"
                                        }
                                    `}
                                >
                                    {page}
                                </button>
                            ),
                        )}

                        <button
                            type="button"
                            disabled={
                                pageNumber ===
                                totalPages
                            }
                            onClick={() =>
                                handlePageChange(
                                    pageNumber + 1,
                                )
                            }
                            className="
                                rounded-md
                                border
                                border-slate-200
                                bg-white
                                px-3
                                py-1.5
                                text-xs
                                font-semibold
                                text-slate-600
                                hover:bg-slate-50
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* ==================================================================
                BOTTOM ACTION BAR
            ================================================================== */}

            <div className="mt-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    {/* Selection information */}

                    <div>
                        <p className="text-sm font-semibold text-slate-800">
                            {selectedIds.size > 0
                                ? `${selectedIds.size} request${selectedIds.size !==
                                    1
                                    ? "s"
                                    : ""
                                } selected`
                                : "No requests selected"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Select requests from the table
                            to perform bulk actions.
                        </p>
                    </div>

                    {/* Actions */}

                    <div className="flex flex-col gap-2 sm:flex-row">

                        <button
                            type="button"
                            disabled={
                                selectedIds.size ===
                                0
                            }
                            onClick={
                                handleForwardSelected
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
                                bg-green-600
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-green-700
                                disabled:cursor-not-allowed
                                disabled:bg-slate-200
                                disabled:text-slate-400
                            "
                        >
                            <CheckCircle2
                                size={17}
                            />

                            Forward Selected
                        </button>

                        <button
                            type="button"
                            disabled={
                                selectedIds.size ===
                                0
                            }
                            onClick={
                                handleRejectSelected
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
                                bg-red-600
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-red-700
                                disabled:cursor-not-allowed
                                disabled:bg-slate-200
                                disabled:text-slate-400
                            "
                        >
                            <XCircle size={17} />

                            Reject Selected
                        </button>
                    </div>
                </div>
            </div>

            {/* ==================================================================
                BACK BUTTON
            ================================================================== */}

            <button
                type="button"
                onClick={() =>
                    navigate(
                        "/payroll-and-workforce-movement/attendance-cell",
                    )
                }
                className="
                    mt-4
                    inline-flex
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-blue-300
                    bg-white
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-blue-600
                    transition
                    hover:bg-blue-50
                "
            >
                <ArrowLeft size={16} />

                Back to Dashboard
            </button>
        </div>
    );
};

export default MaternityLeaveEncashmentList;