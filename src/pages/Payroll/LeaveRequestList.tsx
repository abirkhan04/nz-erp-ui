import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    CircleHelp,
    Eye,
    Info,
    RefreshCw,
    XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";

import ReportTable from "../../components/table/ReportTable";

interface LeaveRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    leaveType: string;
    leaveFrom: string;
    leaveTo: string;
    appliedOn: string;
    reason: string;
    forwardedBy: string;
    status: "Pending" | "Approved" | "Rejected";
}

interface LeaveRequestResponse {
    data: LeaveRequest[];
    totalCount: number;
}

/*
 * --------------------------------------------------------------------------
 * MOCK DATA
 * --------------------------------------------------------------------------
 *
 * 18 records are intentionally provided so server-side pagination can be
 * demonstrated with multiple pages.
 *
 * Replace fetchLeaveRequests() with your actual API call later.
 */

const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
    {
        id: "LR250515001",
        employeeId: "10023",
        employeeName: "Rokon Uddin",
        department: "Weaving",
        leaveType: "Casual Leave (CL)",
        leaveFrom: "18-May-2025",
        leaveTo: "20-May-2025",
        appliedOn: "15-May-2025 08:15 AM",
        reason: "Family function",
        forwardedBy: "Time Officer",
        status: "Pending",
    },
    {
        id: "LR250515002",
        employeeId: "10087",
        employeeName: "Ripon Miah",
        department: "Spinning",
        leaveType: "Sick Leave (SL)",
        leaveFrom: "22-May-2025",
        leaveTo: "23-May-2025",
        appliedOn: "15-May-2025 08:20 AM",
        reason: "Fever & cold",
        forwardedBy: "Time Officer",
        status: "Pending",
    },
    {
        id: "LR250515003",
        employeeId: "10102",
        employeeName: "Sabina Akter",
        department: "Dyeing",
        leaveType: "Annual Leave (AL)",
        leaveFrom: "05-Jun-2025",
        leaveTo: "11-Jun-2025",
        appliedOn: "15-May-2025 08:25 AM",
        reason: "Personal vacation",
        forwardedBy: "Time Officer",
        status: "Pending",
    },
    {
        id: "LR250515004",
        employeeId: "10145",
        employeeName: "Nazma Akter",
        department: "Finishing",
        leaveType: "Maternity Leave (ML)",
        leaveFrom: "30-Aug-2025",
        leaveTo: "28-Nov-2025",
        appliedOn: "15-May-2025 08:30 AM",
        reason: "Maternity",
        forwardedBy: "Time Officer",
        status: "Pending",
    },
    {
        id: "LR250515005",
        employeeId: "10211",
        employeeName: "Shakil Ahmed",
        department: "Maintenance",
        leaveType: "Paternity Leave (PL)",
        leaveFrom: "10-Jun-2025",
        leaveTo: "14-Jun-2025",
        appliedOn: "15-May-2025 08:32 AM",
        reason: "Wife delivery",
        forwardedBy: "Time Officer",
        status: "Pending",
    },
    {
        id: "LR250515006",
        employeeId: "10234",
        employeeName: "Mizanur Rahman",
        department: "Production",
        leaveType: "Casual Leave (CL)",
        leaveFrom: "25-May-2025",
        leaveTo: "26-May-2025",
        appliedOn: "15-May-2025 08:40 AM",
        reason: "Personal work",
        forwardedBy: "Time Officer",
        status: "Pending",
    },
    {
        id: "LR250515007",
        employeeId: "10278",
        employeeName: "Jannatul Ferdous",
        department: "HR",
        leaveType: "Annual Leave (AL)",
        leaveFrom: "01-Jun-2025",
        leaveTo: "03-Jun-2025",
        appliedOn: "15-May-2025 08:45 AM",
        reason: "Travel",
        forwardedBy: "Time Officer",
        status: "Pending",
    },
    {
        id: "LR250515008",
        employeeId: "10305",
        employeeName: "Masud Rana",
        department: "Knitting",
        leaveType: "Sick Leave (SL)",
        leaveFrom: "19-May-2025",
        leaveTo: "19-May-2025",
        appliedOn: "15-May-2025 08:50 AM",
        reason: "Medical appointment",
        forwardedBy: "Time Officer",
        status: "Pending",
    },
    {
        id: "LR250515009",
        employeeId: "10342",
        employeeName: "Farzana Yasmin",
        department: "Accounts",
        leaveType: "Casual Leave (CL)",
        leaveFrom: "27-May-2025",
        leaveTo: "28-May-2025",
        appliedOn: "15-May-2025 09:00 AM",
        reason: "Family matter",
        forwardedBy: "Time Officer",
        status: "Pending",
    },
    {
        id: "LR250515010",
        employeeId: "10381",
        employeeName: "Rashedul Islam",
        department: "Logistics",
        leaveType: "Annual Leave (AL)",
        leaveFrom: "15-Jun-2025",
        leaveTo: "20-Jun-2025",
        appliedOn: "15-May-2025 09:10 AM",
        reason: "Vacation",
        forwardedBy: "Time Officer",
        status: "Pending",
    },
    {
        id: "LR250515011",
        employeeId: "10413",
        employeeName: "Sumaiya Akter",
        department: "Quality",
        leaveType: "Casual Leave (CL)",
        leaveFrom: "03-Jun-2025",
        leaveTo: "04-Jun-2025",
        appliedOn: "15-May-2025 09:20 AM",
        reason: "Personal work",
        forwardedBy: "Time Officer",
        status: "Pending",
    },
    {
        id: "LR250515012",
        employeeId: "10456",
        employeeName: "Hasan Mahmud",
        department: "Warehouse",
        leaveType: "Sick Leave (SL)",
        leaveFrom: "21-May-2025",
        leaveTo: "22-May-2025",
        appliedOn: "15-May-2025 09:25 AM",
        reason: "Fever",
        forwardedBy: "Time Officer",
        status: "Pending",
    },
    {
        id: "LR250515013",
        employeeId: "10489",
        employeeName: "Nusrat Jahan",
        department: "Administration",
        leaveType: "Annual Leave (AL)",
        leaveFrom: "10-Jul-2025",
        leaveTo: "14-Jul-2025",
        appliedOn: "15-May-2025 09:30 AM",
        reason: "Family vacation",
        forwardedBy: "Time Officer",
        status: "Pending",
    },
    {
        id: "LR250515014",
        employeeId: "10521",
        employeeName: "Tanvir Hossain",
        department: "Cutting",
        leaveType: "Casual Leave (CL)",
        leaveFrom: "29-May-2025",
        leaveTo: "30-May-2025",
        appliedOn: "15-May-2025 09:35 AM",
        reason: "Urgent personal work",
        forwardedBy: "Time Officer",
        status: "Pending",
    },
    {
        id: "LR250515015",
        employeeId: "10567",
        employeeName: "Moumita Das",
        department: "Merchandising",
        leaveType: "Sick Leave (SL)",
        leaveFrom: "02-Jun-2025",
        leaveTo: "02-Jun-2025",
        appliedOn: "15-May-2025 09:40 AM",
        reason: "Illness",
        forwardedBy: "Time Officer",
        status: "Pending",
    },
    {
        id: "LR250515016",
        employeeId: "10602",
        employeeName: "Imran Khan",
        department: "Security",
        leaveType: "Casual Leave (CL)",
        leaveFrom: "06-Jun-2025",
        leaveTo: "07-Jun-2025",
        appliedOn: "15-May-2025 09:45 AM",
        reason: "Family event",
        forwardedBy: "Time Officer",
        status: "Pending",
    },
    {
        id: "LR250515017",
        employeeId: "10634",
        employeeName: "Shamim Ahmed",
        department: "Printing",
        leaveType: "Annual Leave (AL)",
        leaveFrom: "18-Jun-2025",
        leaveTo: "22-Jun-2025",
        appliedOn: "15-May-2025 09:50 AM",
        reason: "Travel",
        forwardedBy: "Time Officer",
        status: "Pending",
    },
    {
        id: "LR250515018",
        employeeId: "10678",
        employeeName: "Rumana Akter",
        department: "IT",
        leaveType: "Casual Leave (CL)",
        leaveFrom: "12-Jun-2025",
        leaveTo: "13-Jun-2025",
        appliedOn: "15-May-2025 10:00 AM",
        reason: "Personal matter",
        forwardedBy: "Time Officer",
        status: "Pending",
    },
];

/*
 * --------------------------------------------------------------------------
 * SERVER-SIDE READY DATA FUNCTION
 * --------------------------------------------------------------------------
 *
 * Current implementation:
 *   - receives pageNumber/pageSize
 *   - simulates network delay
 *   - slices mock data
 *
 * Later replace the body with:
 *
 * const response = await api.get("/leave-requests", {
 *     params: {
 *         pageNumber,
 *         pageSize,
 *     },
 * });
 *
 * return response.data;
 */

const fetchLeaveRequests = async (
    pageNumber: number,
    pageSize: number,
): Promise<LeaveRequestResponse> => {
    await new Promise((resolve) =>
        setTimeout(resolve, 500),
    );

    const startIndex =
        (pageNumber - 1) * pageSize;

    const endIndex =
        startIndex + pageSize;

    return {
        data: MOCK_LEAVE_REQUESTS.slice(
            startIndex,
            endIndex,
        ),
        totalCount: MOCK_LEAVE_REQUESTS.length,
    };
};

const LeaveRequestList: React.FC = () => {
    const navigate = useNavigate();

    const [data, setData] = useState<LeaveRequest[]>(
        [],
    );

    const [loading, setLoading] =
        useState<boolean>(false);

    const [pageNumber, setPageNumber] =
        useState<number>(1);

    const [pageSize, setPageSize] =
        useState<number>(5);

    const [totalCount, setTotalCount] =
        useState<number>(0);

    const [selectedRequest, setSelectedRequest] =
        useState<LeaveRequest | null>(null);

    /*
     * ----------------------------------------------------------------------
     * FETCH DATA
     * ----------------------------------------------------------------------
     *
     * This is the only place that needs to change when the real API
     * is connected.
     */
    const loadLeaveRequests = useCallback(
        async () => {
            try {
                setLoading(true);

                const response =
                    await fetchLeaveRequests(
                        pageNumber,
                        pageSize,
                    );

                setData(response.data);
                setTotalCount(
                    response.totalCount,
                );

                /*
                 * Clear selected item if it isn't
                 * available on the current page.
                 */
                setSelectedRequest(null);
            } catch (error) {
                console.error(
                    "Failed to load leave requests:",
                    error,
                );
                setData([]);
                setTotalCount(0);
            } finally {
                setLoading(false);
            }
        },
        [pageNumber, pageSize],
    );

    useEffect(() => {
        loadLeaveRequests();
    }, [loadLeaveRequests]);

    /*
     * ----------------------------------------------------------------------
     * PAGINATION
     * ----------------------------------------------------------------------
     */

    const handlePageChange = (
        newPage: number,
    ) => {
        setPageNumber(newPage);
    };

    const handlePageSizeChange = (
        newPageSize: number,
    ) => {
        /*
         * When page size changes, always return
         * to page 1.
         */
        setPageSize(newPageSize);
        setPageNumber(1);
    };

    /*
     * ----------------------------------------------------------------------
     * ACTIONS
     * ----------------------------------------------------------------------
     */

    const handleApprove = () => {
        if (!selectedRequest) return;

        console.log(
            "Approve Leave:",
            selectedRequest,
        );

        /*
         * Real API example:
         *
         * await api.post(
         *     `/leave-requests/${selectedRequest.id}/approve`
         * );
         *
         * await loadLeaveRequests();
         */
    };

    const handleReject = () => {
        if (!selectedRequest) return;

        console.log(
            "Reject Leave:",
            selectedRequest,
        );

        /*
         * Real API example:
         *
         * await api.post(
         *     `/leave-requests/${selectedRequest.id}/reject`
         * );
         */
    };

    const handleRequestInformation = () => {
        if (!selectedRequest) return;

        console.log(
            "Request More Information:",
            selectedRequest,
        );
    };

    const handleViewDetails = (
        request: LeaveRequest,
    ) => {
        setSelectedRequest(request);

        console.log(
            "View leave request:",
            request,
        );

        /*
         * If you have a details page:
         *
         * navigate(
         *     `/leave-requests/${request.id}`
         * );
         */
    };

    /*
     * ----------------------------------------------------------------------
     * TABLE COLUMNS
     * ----------------------------------------------------------------------
     */

    const columns =
        useMemo<ColumnDef<LeaveRequest>[]>(
            () => [
                {
                    id: "serial",
                    header: "#",
                    cell: ({ row }) =>
                        (pageNumber - 1) *
                            pageSize +
                        row.index +
                        1,
                },

                {
                    accessorKey: "id",
                    header: "Request ID",
                },

                {
                    accessorKey: "employeeId",
                    header: "Employee ID",
                },

                {
                    accessorKey: "employeeName",
                    header: "Employee Name",
                    cell: ({ getValue }) => (
                        <span className="font-semibold text-slate-800">
                            {getValue<string>()}
                        </span>
                    ),
                },

                {
                    accessorKey: "department",
                    header: "Department",
                },

                {
                    accessorKey: "leaveType",
                    header: "Leave Type",
                    cell: ({ getValue }) => (
                        <span className="font-medium text-blue-700">
                            {getValue<string>()}
                        </span>
                    ),
                },

                {
                    accessorKey: "leaveFrom",
                    header: "Leave From",
                },

                {
                    accessorKey: "leaveTo",
                    header: "Leave To",
                },

                {
                    accessorKey: "appliedOn",
                    header: "Applied On",
                },

                {
                    accessorKey: "reason",
                    header: "Reason",
                },

                {
                    accessorKey: "forwardedBy",
                    header: "Forwarded By",
                },

                {
                    accessorKey: "status",
                    header: "Status",
                    cell: ({ getValue }) => {
                        const status =
                            getValue<LeaveRequest["status"]>();

                        return (
                            <span
                                className={`
                                    inline-flex
                                    rounded-md
                                    px-2.5
                                    py-1
                                    text-xs
                                    font-semibold
                                    ${
                                        status ===
                                        "Pending"
                                            ? "bg-orange-50 text-orange-600"
                                            : status ===
                                                "Approved"
                                              ? "bg-green-50 text-green-600"
                                              : "bg-red-50 text-red-600"
                                    }
                                `}
                            >
                                {status}
                            </span>
                        );
                    },
                },

                {
                    id: "action",
                    header: "Action",
                    cell: ({ row }) => (
                        <button
                            type="button"
                            onClick={() =>
                                handleViewDetails(
                                    row.original,
                                )
                            }
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-md
                                border
                                border-blue-200
                                bg-white
                                px-3
                                py-1.5
                                text-xs
                                font-semibold
                                text-blue-600
                                transition
                                hover:bg-blue-50
                            "
                        >
                            <Eye size={14} />
                            View Details
                        </button>
                    ),
                },
            ],
            [pageNumber, pageSize],
        );

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6">

            {/* --------------------------------------------------------------
             * PAGE HEADER
             * -------------------------------------------------------------- */}

            <div className="mb-4 rounded-xl border border-blue-100 bg-white px-5 py-4 shadow-sm">

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                    <div>
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
                            Showing leave requests
                            forwarded by Time Office
                            to Attendance Cell.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={loadLeaveRequests}
                        disabled={loading}
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
                                loading
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        Refresh
                    </button>

                </div>

            </div>

            {/* --------------------------------------------------------------
             * INFORMATION BAR
             * -------------------------------------------------------------- */}

            <div className="mb-4 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">

                <Info
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-600"
                />

                <div>
                    <p className="text-sm font-semibold text-blue-700">
                        Leave Request List
                    </p>

                    <p className="text-xs text-blue-600">
                        Select a leave request from
                        the table to view details and
                        perform an action.
                    </p>
                </div>

            </div>

            {/* --------------------------------------------------------------
             * TABLE + ACTION PANEL
             * -------------------------------------------------------------- */}

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">

                {/* TABLE */}

                <div className="min-w-0">

                    <ReportTable<LeaveRequest>
                        data={data}
                        columns={columns}
                        loading={loading}
                        pageNumber={pageNumber}
                        pageSize={pageSize}
                        totalCount={totalCount}
                        onPageChange={
                            handlePageChange
                        }
                        onPageSizeChange={
                            handlePageSizeChange
                        }
                        pageSizeOptions={[
                            5,
                            10,
                            20,
                            50,
                        ]}
                    />

                </div>

                {/* ACTION PANEL */}

                <div className="h-fit overflow-hidden rounded-xl border border-slate-200 bg-white">

                    <div className="border-b border-slate-200 bg-blue-50 px-4 py-3">

                        <h2 className="text-sm font-bold uppercase tracking-wide text-blue-800">
                            Actions
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            {selectedRequest
                                ? "Selected leave request"
                                : "Select a request to view full details and take action."}
                        </p>

                    </div>

                    <div className="space-y-2 p-4">

                        <button
                            type="button"
                            disabled={
                                !selectedRequest
                            }
                            onClick={handleApprove}
                            className="
                                flex
                                w-full
                                items-center
                                gap-2
                                rounded-md
                                border
                                border-green-200
                                px-3
                                py-2
                                text-left
                                text-sm
                                font-semibold
                                text-green-600
                                transition
                                hover:bg-green-50
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >
                            <CheckCircle2
                                size={16}
                            />

                            Approve Leave
                        </button>

                        <button
                            type="button"
                            disabled={
                                !selectedRequest
                            }
                            onClick={handleReject}
                            className="
                                flex
                                w-full
                                items-center
                                gap-2
                                rounded-md
                                border
                                border-red-200
                                px-3
                                py-2
                                text-left
                                text-sm
                                font-semibold
                                text-red-600
                                transition
                                hover:bg-red-50
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >
                            <XCircle size={16} />

                            Reject Leave
                        </button>

                        <button
                            type="button"
                            disabled={
                                !selectedRequest
                            }
                            onClick={
                                handleRequestInformation
                            }
                            className="
                                flex
                                w-full
                                items-center
                                gap-2
                                rounded-md
                                border
                                border-blue-200
                                px-3
                                py-2
                                text-left
                                text-sm
                                font-semibold
                                text-blue-600
                                transition
                                hover:bg-blue-50
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >
                            <CircleHelp
                                size={16}
                            />

                            Request More Information
                        </button>

                    </div>

                    {/* Selected request summary */}

                    {selectedRequest && (
                        <div className="border-t border-slate-200 bg-slate-50 p-4">

                            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                                Selected Request
                            </p>

                            <div className="space-y-2 text-xs">

                                <div className="flex justify-between gap-3">
                                    <span className="text-slate-500">
                                        Request ID
                                    </span>

                                    <span className="font-semibold text-slate-700">
                                        {
                                            selectedRequest.id
                                        }
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span className="text-slate-500">
                                        Employee
                                    </span>

                                    <span className="font-semibold text-slate-700">
                                        {
                                            selectedRequest.employeeName
                                        }
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span className="text-slate-500">
                                        Leave Type
                                    </span>

                                    <span className="font-semibold text-slate-700">
                                        {
                                            selectedRequest.leaveType
                                        }
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span className="text-slate-500">
                                        Period
                                    </span>

                                    <span className="text-right font-semibold text-slate-700">
                                        {
                                            selectedRequest.leaveFrom
                                        }
                                        {" - "}
                                        {
                                            selectedRequest.leaveTo
                                        }
                                    </span>
                                </div>

                            </div>

                        </div>
                    )}

                    {/* Notes */}

                    <div className="border-t border-slate-200 p-4">

                        <p className="text-xs font-bold text-slate-700">
                            Note:
                        </p>

                        <ul className="mt-2 space-y-2 text-[11px] leading-4 text-slate-500">

                            <li>
                                <strong className="text-slate-700">
                                    Approve:
                                </strong>{" "}
                                Leave will be granted
                                and informed to
                                employee.
                            </li>

                            <li>
                                <strong className="text-slate-700">
                                    Reject:
                                </strong>{" "}
                                Leave will be rejected
                                and employee will be
                                informed.
                            </li>

                            <li>
                                <strong className="text-slate-700">
                                    Request More
                                    Information:
                                </strong>{" "}
                                Additional information
                                will be requested from
                                employee.
                            </li>

                        </ul>

                    </div>

                </div>

            </div>

            {/* --------------------------------------------------------------
             * BACK BUTTON
             * -------------------------------------------------------------- */}

            <button
                type="button"
                onClick={() => navigate("/payroll-and-workforce-movement/attendance-cell")}
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

export default LeaveRequestList;
