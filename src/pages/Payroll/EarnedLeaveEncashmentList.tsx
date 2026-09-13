import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
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

/* ==========================================================================
 * TYPES
 * ========================================================================== */

interface EarnedLeaveEncashmentRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    designation: string;
    appliedOn: string;
    status: "Pending" | "Approved" | "Rejected";
    forwardedBy: string;
}

interface EarnedLeaveEncashmentResponse {
    data: EarnedLeaveEncashmentRequest[];
    totalCount: number;
}

/* ==========================================================================
 * MOCK DATA
 * ========================================================================== */

const MOCK_ENCASHMENT_REQUESTS: EarnedLeaveEncashmentRequest[] = [
    {
        id: "ELENC2505001",
        employeeId: "10211",
        employeeName: "Shakil Ahmed",
        department: "Maintenance",
        designation: "Technician",
        appliedOn: "14-May-2025 09:15 AM",
        status: "Pending",
        forwardedBy: "Production Floor",
    },
    {
        id: "ELENC2505002",
        employeeId: "10075",
        employeeName: "Abul Kashem",
        department: "Production",
        designation: "Senior Operator",
        appliedOn: "14-May-2025 09:20 AM",
        status: "Pending",
        forwardedBy: "Production Floor",
    },
    {
        id: "ELENC2505003",
        employeeId: "10102",
        employeeName: "Mohammad Hasan",
        department: "Spinning",
        designation: "Supervisor",
        appliedOn: "14-May-2025 09:25 AM",
        status: "Pending",
        forwardedBy: "Spinning Floor",
    },
    {
        id: "ELENC2505004",
        employeeId: "10145",
        employeeName: "Nazma Akter",
        department: "Finishing",
        designation: "Senior Operator",
        appliedOn: "14-May-2025 09:30 AM",
        status: "Pending",
        forwardedBy: "Finishing Floor",
    },
    {
        id: "ELENC2505005",
        employeeId: "10234",
        employeeName: "Mizanur Rahman",
        department: "Production",
        designation: "Operator",
        appliedOn: "14-May-2025 09:35 AM",
        status: "Pending",
        forwardedBy: "Production Floor",
    },
    {
        id: "ELENC2505006",
        employeeId: "10278",
        employeeName: "Jannatul Ferdous",
        department: "HR",
        designation: "Executive",
        appliedOn: "14-May-2025 09:40 AM",
        status: "Pending",
        forwardedBy: "HR Department",
    },
    {
        id: "ELENC2505007",
        employeeId: "10305",
        employeeName: "Masud Rana",
        department: "Knitting",
        designation: "Operator",
        appliedOn: "14-May-2025 09:45 AM",
        status: "Pending",
        forwardedBy: "Knitting Floor",
    },
    {
        id: "ELENC2505008",
        employeeId: "10342",
        employeeName: "Farzana Yasmin",
        department: "Accounts",
        designation: "Senior Executive",
        appliedOn: "14-May-2025 09:50 AM",
        status: "Pending",
        forwardedBy: "Accounts Department",
    },
    {
        id: "ELENC2505009",
        employeeId: "10381",
        employeeName: "Rashedul Islam",
        department: "Logistics",
        designation: "Officer",
        appliedOn: "14-May-2025 10:00 AM",
        status: "Pending",
        forwardedBy: "Logistics Department",
    },
    {
        id: "ELENC2505010",
        employeeId: "10413",
        employeeName: "Sumaiya Akter",
        department: "Quality",
        designation: "Quality Officer",
        appliedOn: "14-May-2025 10:05 AM",
        status: "Pending",
        forwardedBy: "Quality Department",
    },
    {
        id: "ELENC2505011",
        employeeId: "10456",
        employeeName: "Hasan Mahmud",
        department: "Warehouse",
        designation: "Warehouse Officer",
        appliedOn: "14-May-2025 10:10 AM",
        status: "Pending",
        forwardedBy: "Warehouse",
    },
    {
        id: "ELENC2505012",
        employeeId: "10489",
        employeeName: "Nusrat Jahan",
        department: "Administration",
        designation: "Executive",
        appliedOn: "14-May-2025 10:15 AM",
        status: "Pending",
        forwardedBy: "Administration",
    },
    {
        id: "ELENC2505013",
        employeeId: "10521",
        employeeName: "Tanvir Hossain",
        department: "Cutting",
        designation: "Operator",
        appliedOn: "14-May-2025 10:20 AM",
        status: "Pending",
        forwardedBy: "Cutting Floor",
    },
    {
        id: "ELENC2505014",
        employeeId: "10567",
        employeeName: "Moumita Das",
        department: "Merchandising",
        designation: "Merchandiser",
        appliedOn: "14-May-2025 10:25 AM",
        status: "Pending",
        forwardedBy: "Merchandising",
    },
    {
        id: "ELENC2505015",
        employeeId: "10602",
        employeeName: "Imran Khan",
        department: "Security",
        designation: "Security Officer",
        appliedOn: "14-May-2025 10:30 AM",
        status: "Pending",
        forwardedBy: "Security",
    },
    {
        id: "ELENC2505016",
        employeeId: "10634",
        employeeName: "Shamim Ahmed",
        department: "Printing",
        designation: "Printer",
        appliedOn: "14-May-2025 10:35 AM",
        status: "Pending",
        forwardedBy: "Printing Floor",
    },
    {
        id: "ELENC2505017",
        employeeId: "10678",
        employeeName: "Rumana Akter",
        department: "IT",
        designation: "IT Executive",
        appliedOn: "14-May-2025 10:40 AM",
        status: "Pending",
        forwardedBy: "IT Department",
    },
    {
        id: "ELENC2505018",
        employeeId: "10712",
        employeeName: "Rakib Hasan",
        department: "Dyeing",
        designation: "Operator",
        appliedOn: "14-May-2025 10:45 AM",
        status: "Pending",
        forwardedBy: "Dyeing Floor",
    },
];

/* ==========================================================================
 * DATA FUNCTION
 * ========================================================================== */

const fetchEncashmentRequests = async (
    pageNumber: number,
    pageSize: number,
): Promise<EarnedLeaveEncashmentResponse> => {
    await new Promise((resolve) =>
        setTimeout(resolve, 500),
    );

    const startIndex =
        (pageNumber - 1) * pageSize;

    const endIndex =
        startIndex + pageSize;

    return {
        data: MOCK_ENCASHMENT_REQUESTS.slice(
            startIndex,
            endIndex,
        ),
        totalCount:
            MOCK_ENCASHMENT_REQUESTS.length,
    };
};

/* ==========================================================================
 * PAGE
 * ========================================================================== */

const EarnedLeaveEncashmentList: React.FC = () => {
    const navigate = useNavigate();

    const [data, setData] = useState<
        EarnedLeaveEncashmentRequest[]
    >([]);

    const [loading, setLoading] =
        useState<boolean>(false);

    const [pageNumber, setPageNumber] =
        useState<number>(1);

    const [pageSize, setPageSize] =
        useState<number>(5);

    const [totalCount, setTotalCount] =
        useState<number>(0);

    const [selectedRequest, setSelectedRequest] =
        useState<EarnedLeaveEncashmentRequest | null>(
            null,
        );

    /* ==========================================================================
     * FETCH
     * ========================================================================== */

    const loadEncashmentRequests =
        useCallback(async () => {
            try {
                setLoading(true);

                const response =
                    await fetchEncashmentRequests(
                        pageNumber,
                        pageSize,
                    );

                setData(response.data);
                setTotalCount(
                    response.totalCount,
                );

                setSelectedRequest(null);
            } catch (error) {
                console.error(
                    "Failed to load earned leave encashment requests:",
                    error,
                );

                setData([]);
                setTotalCount(0);
            } finally {
                setLoading(false);
            }
        }, [pageNumber, pageSize]);

    useEffect(() => {
        loadEncashmentRequests();
    }, [loadEncashmentRequests]);

    /* ==========================================================================
     * PAGINATION
     * ========================================================================== */

    const handlePageChange = (
        newPage: number,
    ) => {
        setPageNumber(newPage);
    };

    const handlePageSizeChange = (
        newPageSize: number,
    ) => {
        setPageSize(newPageSize);
        setPageNumber(1);
    };

    /* ==========================================================================
     * ACTIONS
     * ========================================================================== */

    const handleForward = () => {
        if (!selectedRequest) return;

        console.log(
            "Forward Earned Leave Encashment:",
            selectedRequest,
        );

        /*
         * Real API example:
         *
         * await api.post(
         *     `/earned-leave-encashment/${selectedRequest.id}/forward`
         * );
         */
    };

    const handleReject = () => {
        if (!selectedRequest) return;

        console.log(
            "Reject Earned Leave Encashment:",
            selectedRequest,
        );

        /*
         * Real API example:
         *
         * await api.post(
         *     `/earned-leave-encashment/${selectedRequest.id}/reject`
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

    /* ==========================================================================
     * VIEW DETAILS
     * ========================================================================== */

    const handleViewDetails = (
        request: EarnedLeaveEncashmentRequest,
    ) => {
        setSelectedRequest(request);

        navigate(
            `/payroll-and-workforce-movement/attendance-cell/earned-leave-encashment-requests/${request.id}`,
            {
                state: {
                    request,
                },
            },
        );
    };

    /* ==========================================================================
     * TABLE COLUMNS
     * ========================================================================== */

    const columns = useMemo<
        ColumnDef<EarnedLeaveEncashmentRequest>[]
    >(
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
                accessorKey: "designation",
                header: "Designation",
            },

            {
                accessorKey: "appliedOn",
                header: "Applied On",
            },

            {
                accessorKey: "status",
                header: "Status",
                cell: ({ getValue }) => {
                    const status =
                        getValue<
                            EarnedLeaveEncashmentRequest["status"]
                        >();

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
                accessorKey: "forwardedBy",
                header: "Forwarded By",
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

    /* ==========================================================================
     * UI
     * ========================================================================== */

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6">
            {/* ==================================================================
                PAGE HEADER
            ================================================================== */}

            <div className="mb-4 rounded-xl border border-blue-100 bg-white px-5 py-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <CalendarDays
                                size={21}
                                className="text-blue-600"
                            />

                            <h1 className="text-lg font-bold text-blue-800">
                                Earned Leave Encashment Requests
                            </h1>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                            Showing earned leave encashment
                            requests forwarded to Attendance
                            Cell.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={
                            loadEncashmentRequests
                        }
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
                        Earned Leave Encashment Request List
                    </p>

                    <p className="text-xs text-blue-600">
                        Select an encashment request from
                        the table to view details and
                        perform an action.
                    </p>
                </div>
            </div>

            {/* ==================================================================
                TABLE + ACTION PANEL
            ================================================================== */}

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
                {/* TABLE */}

                <div className="min-w-0">
                    <ReportTable<EarnedLeaveEncashmentRequest>
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
                                ? "Selected encashment request"
                                : "Select a request to view details and take action."}
                        </p>
                    </div>

                    <div className="space-y-2 p-4">
                        {/* Forward */}

                        <button
                            type="button"
                            disabled={
                                !selectedRequest
                            }
                            onClick={handleForward}
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

                            Forward to HR Manager
                        </button>

                        {/* Reject */}

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

                            Reject Request
                        </button>

                        {/* Request More Information */}

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

                    {/* Selected Request */}

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
                                        Department
                                    </span>

                                    <span className="font-semibold text-slate-700">
                                        {
                                            selectedRequest.department
                                        }
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span className="text-slate-500">
                                        Status
                                    </span>

                                    <span className="font-semibold text-slate-700">
                                        {
                                            selectedRequest.status
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
                                    Forward:
                                </strong>{" "}
                                Encashment request will be
                                forwarded to HR Manager for
                                further processing.
                            </li>

                            <li>
                                <strong className="text-slate-700">
                                    Reject:
                                </strong>{" "}
                                Encashment request will be
                                rejected and employee will
                                be informed.
                            </li>

                            <li>
                                <strong className="text-slate-700">
                                    Request More
                                    Information:
                                </strong>{" "}
                                Additional information will
                                be requested from employee.
                            </li>
                        </ul>
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

export default EarnedLeaveEncashmentList;