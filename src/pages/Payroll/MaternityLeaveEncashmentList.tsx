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

interface MaternityLeaveEncashmentRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    requestPart: string;
    appliedOn: string;
    status: "Pending" | "Approved" | "Rejected";
    forwardedBy: string;
}

interface MaternityLeaveEncashmentResponse {
    data: MaternityLeaveEncashmentRequest[];
    totalCount: number;
}

/* ==========================================================================
 * MOCK DATA
 * ========================================================================== */

const MOCK_MATERNITY_LEAVE_ENCASHMENT_REQUESTS: MaternityLeaveEncashmentRequest[] =
    [
        {
            id: "MLENC2505001",
            employeeId: "10102",
            employeeName: "Sabina Akter",
            requestPart: "Part-1 (Pre-Delivery)",
            appliedOn: "14-May-2025 02:35 PM",
            status: "Pending",
            forwardedBy: "Production Floor",
        },
        {
            id: "MLENC2505002",
            employeeId: "10245",
            employeeName: "Nusrat Jahan",
            requestPart: "Part-1 (Pre-Delivery)",
            appliedOn: "14-May-2025 02:40 PM",
            status: "Pending",
            forwardedBy: "HR Department",
        },
        {
            id: "MLENC2505003",
            employeeId: "10321",
            employeeName: "Farzana Yasmin",
            requestPart: "Part-2 (Post-Delivery)",
            appliedOn: "14-May-2025 02:45 PM",
            status: "Pending",
            forwardedBy: "Finishing Floor",
        },
        {
            id: "MLENC2505004",
            employeeId: "10456",
            employeeName: "Sumaiya Akter",
            requestPart: "Part-1 (Pre-Delivery)",
            appliedOn: "14-May-2025 02:50 PM",
            status: "Pending",
            forwardedBy: "Accounts Department",
        },
        {
            id: "MLENC2505005",
            employeeId: "10578",
            employeeName: "Moumita Das",
            requestPart: "Part-2 (Post-Delivery)",
            appliedOn: "14-May-2025 02:55 PM",
            status: "Pending",
            forwardedBy: "Production Floor",
        },
        {
            id: "MLENC2505006",
            employeeId: "10634",
            employeeName: "Rumana Akter",
            requestPart: "Part-1 (Pre-Delivery)",
            appliedOn: "14-May-2025 03:00 PM",
            status: "Pending",
            forwardedBy: "IT Department",
        },
        {
            id: "MLENC2505007",
            employeeId: "10712",
            employeeName: "Jannatul Ferdous",
            requestPart: "Part-1 (Pre-Delivery)",
            appliedOn: "14-May-2025 03:05 PM",
            status: "Pending",
            forwardedBy: "HR Department",
        },
        {
            id: "MLENC2505008",
            employeeId: "10845",
            employeeName: "Shamima Sultana",
            requestPart: "Part-2 (Post-Delivery)",
            appliedOn: "14-May-2025 03:10 PM",
            status: "Pending",
            forwardedBy: "Dyeing Floor",
        },
        {
            id: "MLENC2505009",
            employeeId: "10923",
            employeeName: "Tania Rahman",
            requestPart: "Part-1 (Pre-Delivery)",
            appliedOn: "14-May-2025 03:15 PM",
            status: "Pending",
            forwardedBy: "Quality Department",
        },
        {
            id: "MLENC2505010",
            employeeId: "11056",
            employeeName: "Sadia Islam",
            requestPart: "Part-2 (Post-Delivery)",
            appliedOn: "14-May-2025 03:20 PM",
            status: "Pending",
            forwardedBy: "Administration",
        },
    ];

/* ==========================================================================
 * DATA FUNCTION
 * ========================================================================== */

const fetchMaternityLeaveEncashmentRequests = async (
    pageNumber: number,
    pageSize: number,
): Promise<MaternityLeaveEncashmentResponse> => {
    await new Promise((resolve) =>
        setTimeout(resolve, 500),
    );

    const startIndex =
        (pageNumber - 1) * pageSize;

    const endIndex =
        startIndex + pageSize;

    return {
        data:
            MOCK_MATERNITY_LEAVE_ENCASHMENT_REQUESTS.slice(
                startIndex,
                endIndex,
            ),
        totalCount:
            MOCK_MATERNITY_LEAVE_ENCASHMENT_REQUESTS.length,
    };
};

/* ==========================================================================
 * PAGE
 * ========================================================================== */

const MaternityLeaveEncashmentList: React.FC = () => {
    const navigate = useNavigate();

    const [data, setData] = useState<
        MaternityLeaveEncashmentRequest[]
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
        useState<MaternityLeaveEncashmentRequest | null>(
            null,
        );

    /* ==========================================================================
     * FETCH
     * ========================================================================== */

    const loadMaternityLeaveEncashmentRequests =
        useCallback(async () => {
            try {
                setLoading(true);

                const response =
                    await fetchMaternityLeaveEncashmentRequests(
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
                    "Failed to load maternity leave encashment requests:",
                    error,
                );

                setData([]);
                setTotalCount(0);
            } finally {
                setLoading(false);
            }
        }, [pageNumber, pageSize]);

    useEffect(() => {
        loadMaternityLeaveEncashmentRequests();
    }, [
        loadMaternityLeaveEncashmentRequests,
    ]);

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
            "Forward Maternity Leave Encashment:",
            selectedRequest,
        );

        /*
         * Real API example:
         *
         * await api.post(
         *     `/maternity-leave-encashment/${selectedRequest.id}/forward`
         * );
         */
    };

    const handleReject = () => {
        if (!selectedRequest) return;

        console.log(
            "Reject Maternity Leave Encashment:",
            selectedRequest,
        );

        /*
         * Real API example:
         *
         * await api.post(
         *     `/maternity-leave-encashment/${selectedRequest.id}/reject`
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
        request: MaternityLeaveEncashmentRequest,
    ) => {
        setSelectedRequest(request);

        navigate(
            `/payroll-and-workforce-movement/attendance-cell/maternity-leave-encashment-requests/${request.id}`,
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
        ColumnDef<MaternityLeaveEncashmentRequest>[]
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
                accessorKey: "employeeName",
                header: "Employee",
                cell: ({ row }) => (
                    <div>
                        <div className="font-semibold text-slate-800">
                            {row.original.employeeName}
                        </div>

                        <div className="text-xs text-slate-500">
                            ID: {row.original.employeeId}
                        </div>
                    </div>
                ),
            },

            {
                accessorKey: "requestPart",
                header: "Request Part",
                cell: ({ getValue }) => (
                    <span className="font-medium text-slate-700">
                        {getValue<string>()}
                    </span>
                ),
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
                            MaternityLeaveEncashmentRequest["status"]
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
                                Maternity Leave Encashment Requests
                            </h1>

                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                            Showing maternity leave
                            encashment requests
                            forwarded to Attendance
                            Cell.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={
                            loadMaternityLeaveEncashmentRequests
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
                        Maternity Leave Encashment Request List
                    </p>

                    <p className="text-xs text-blue-600">
                        Select a maternity leave
                        encashment request from
                        the table to view details
                        and perform an action.
                    </p>

                </div>

            </div>

            {/* ==================================================================
                TABLE + ACTION PANEL
            ================================================================== */}

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">

                {/* TABLE */}

                <div className="min-w-0">

                    <ReportTable<MaternityLeaveEncashmentRequest>
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
                            View the request details
                            to take appropriate
                            action.
                        </p>

                    </div>

                    <div className="space-y-2 p-4">

                        {/* Forward */}

                        <button
                            type="button"
                            disabled={
                                !selectedRequest
                            }
                            onClick={
                                handleForward
                            }
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
                            onClick={
                                handleReject
                            }
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
                                        Employee ID
                                    </span>

                                    <span className="font-semibold text-slate-700">
                                        {
                                            selectedRequest.employeeId
                                        }
                                    </span>

                                </div>

                                <div className="flex justify-between gap-3">

                                    <span className="text-slate-500">
                                        Request Part
                                    </span>

                                    <span className="text-right font-semibold text-slate-700">
                                        {
                                            selectedRequest.requestPart
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
                                Maternity leave
                                encashment request
                                will be forwarded
                                to HR Manager for
                                further processing.
                            </li>

                            <li>
                                <strong className="text-slate-700">
                                    Reject:
                                </strong>{" "}
                                Maternity leave
                                encashment request
                                will be rejected and
                                employee will be
                                informed.
                            </li>

                            <li>
                                <strong className="text-slate-700">
                                    Request More
                                    Information:
                                </strong>{" "}
                                Additional
                                information will be
                                requested from
                                employee.
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

export default MaternityLeaveEncashmentList;