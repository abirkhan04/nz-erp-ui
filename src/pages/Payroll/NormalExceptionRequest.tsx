import React, { useMemo, useState } from "react";
import {
    ArrowRight,
    CalendarDays,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    CircleCheck,
    CircleX,
    Clock3,
    Download,
    Eye,
    FileSpreadsheet,
    FileText,
    Info,
    RefreshCw,
    Search,
    Send,
    Users,
    X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ExceptionRequest {
    requestId: string;
    attendanceDate: string;
    employeeId: string;
    employeeName: string;
    department: string;
    exceptionType: string;
    shift: string;
    submittedBy: string;
    submittedOn: string;
    status: "Pending" | "Forwarded" | "Rejected";
}

interface NormalExceptionRequestsProps {
    onBack?: () => void;

    /**
     * Called when selected requests are forwarded.
     * You can connect this directly to your API/usePost.
     */
    onForwardSelected?: (requests: ExceptionRequest[], remarks: string) => void;

    /**
     * Called when all pending requests are forwarded.
     */
    onForwardAll?: (requests: ExceptionRequest[], remarks: string) => void;

    /**
     * Called when user clicks View.
     */
    onViewRequest?: (request: ExceptionRequest) => void;
}

const initialRequests: ExceptionRequest[] = [
    {
        requestId: "NE-2025-0515-0001",
        attendanceDate: "14 May 2025",
        employeeId: "102345",
        employeeName: "Abdul Karim",
        department: "Sewing",
        exceptionType: "Missing Punch (Out)",
        shift: "A (06:00 AM - 02:00 PM)",
        submittedBy: "Attendance Cell",
        submittedOn: "15 May 2025 09:20 AM",
        status: "Pending",
    },
    {
        requestId: "NE-2025-0515-0002",
        attendanceDate: "14 May 2025",
        employeeId: "102678",
        employeeName: "Rina Parvin",
        department: "Finishing",
        exceptionType: "Late In Punch",
        shift: "B (02:00 PM - 10:00 PM)",
        submittedBy: "Attendance Cell",
        submittedOn: "15 May 2025 09:35 AM",
        status: "Pending",
    },
    {
        requestId: "NE-2025-0515-0003",
        attendanceDate: "13 May 2025",
        employeeId: "102910",
        employeeName: "Md. Salim",
        department: "Maintenance",
        exceptionType: "Shift Correction",
        shift: "A (06:00 AM - 02:00 PM)",
        submittedBy: "Attendance Cell",
        submittedOn: "15 May 2025 10:05 AM",
        status: "Pending",
    },
    {
        requestId: "NE-2025-0515-0004",
        attendanceDate: "12 May 2025",
        employeeId: "103112",
        employeeName: "Shahana Akter",
        department: "Quality",
        exceptionType: "OT Correction",
        shift: "C (10:00 PM - 06:00 AM)",
        submittedBy: "Attendance Cell",
        submittedOn: "15 May 2025 10:15 AM",
        status: "Pending",
    },
    {
        requestId: "NE-2025-0515-0005",
        attendanceDate: "14 May 2025",
        employeeId: "103245",
        employeeName: "Jamal Uddin",
        department: "Washing",
        exceptionType: "Missing Punch (In)",
        shift: "A (06:00 AM - 02:00 PM)",
        submittedBy: "Attendance Cell",
        submittedOn: "15 May 2025 10:22 AM",
        status: "Pending",
    },
    {
        requestId: "NE-2025-0515-0006",
        attendanceDate: "13 May 2025",
        employeeId: "103678",
        employeeName: "Pushpa Rani",
        department: "Cutting",
        exceptionType: "Early Out Punch",
        shift: "B (02:00 PM - 10:00 PM)",
        submittedBy: "Attendance Cell",
        submittedOn: "15 May 2025 10:30 AM",
        status: "Pending",
    },
];

const NormalExceptionRequests: React.FC<
    NormalExceptionRequestsProps
> = ({
    onForwardSelected,
    onForwardAll,
}) => {
        const navigate = useNavigate();
        const onViewRequest = (request: ExceptionRequest) => {
            navigate(`${request.requestId}`)
        }
        // ============================================================
        // DATA
        // ============================================================

        const [requests] = useState<ExceptionRequest[]>(initialRequests);

        // ============================================================
        // SELECTION STATE
        // IMPORTANT: requestId is the source of truth.
        // ============================================================

        const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>(
            []
        );

        // ============================================================
        // FILTER STATE
        // ============================================================

        const [requestIdFilter, setRequestIdFilter] = useState("");
        const [employeeFilter, setEmployeeFilter] = useState("");
        const [departmentFilter, setDepartmentFilter] = useState("All");
        const [exceptionTypeFilter, setExceptionTypeFilter] = useState("All");
        const [statusFilter, setStatusFilter] = useState("Pending");
        const [attendanceDateFrom, setAttendanceDateFrom] = useState("");
        const [attendanceDateTo, setAttendanceDateTo] = useState("");

        // ============================================================
        // OTHER STATE
        // ============================================================

        const [remarks, setRemarks] = useState("");
        const [pageSize, setPageSize] = useState(10);
        const [currentPage, setCurrentPage] = useState(1);

        // ============================================================
        // FILTERED REQUESTS
        // ============================================================

        const filteredRequests = useMemo(() => {
            return requests.filter((request) => {
                const matchesRequestId =
                    !requestIdFilter ||
                    request.requestId
                        .toLowerCase()
                        .includes(requestIdFilter.toLowerCase());

                const matchesEmployee =
                    !employeeFilter ||
                    request.employeeId
                        .toLowerCase()
                        .includes(employeeFilter.toLowerCase()) ||
                    request.employeeName
                        .toLowerCase()
                        .includes(employeeFilter.toLowerCase());

                const matchesDepartment =
                    departmentFilter === "All" ||
                    request.department === departmentFilter;

                const matchesExceptionType =
                    exceptionTypeFilter === "All" ||
                    request.exceptionType === exceptionTypeFilter;

                const matchesStatus =
                    statusFilter === "All" ||
                    request.status === statusFilter;

                return (
                    matchesRequestId &&
                    matchesEmployee &&
                    matchesDepartment &&
                    matchesExceptionType &&
                    matchesStatus
                );
            });
        }, [
            requests,
            requestIdFilter,
            employeeFilter,
            departmentFilter,
            exceptionTypeFilter,
            statusFilter,
        ]);

        // ============================================================
        // PAGINATION
        // ============================================================

        const totalPages = Math.max(
            1,
            Math.ceil(filteredRequests.length / pageSize)
        );

        const paginatedRequests = useMemo(() => {
            const startIndex = (currentPage - 1) * pageSize;

            return filteredRequests.slice(startIndex, startIndex + pageSize);
        }, [filteredRequests, currentPage, pageSize]);

        // ============================================================
        // SELECTION HELPERS
        // ============================================================

        const pendingRequests = useMemo(
            () => filteredRequests.filter((request) => request.status === "Pending"),
            [filteredRequests]
        );

        const allVisibleSelected =
            paginatedRequests.length > 0 &&
            paginatedRequests.every((request) =>
                selectedRequestIds.includes(request.requestId)
            );

        const someVisibleSelected =
            paginatedRequests.some((request) =>
                selectedRequestIds.includes(request.requestId)
            ) && !allVisibleSelected;

        const selectedRequests = useMemo(() => {
            return requests.filter((request) =>
                selectedRequestIds.includes(request.requestId)
            );
        }, [requests, selectedRequestIds]);

        // ============================================================
        // INDIVIDUAL CHECKBOX
        // ============================================================

        const handleToggleRequest = (requestId: string) => {
            setSelectedRequestIds((previous) => {
                if (previous.includes(requestId)) {
                    return previous.filter((id) => id !== requestId);
                }

                return [...previous, requestId];
            });
        };

        // ============================================================
        // SELECT ALL VISIBLE
        // ============================================================

        const handleSelectAll = () => {
            const visibleIds = paginatedRequests
                .filter((request) => request.status === "Pending")
                .map((request) => request.requestId);

            if (allVisibleSelected) {
                setSelectedRequestIds((previous) =>
                    previous.filter((id) => !visibleIds.includes(id))
                );

                return;
            }

            setSelectedRequestIds((previous) => {
                const ids = new Set(previous);

                visibleIds.forEach((id) => ids.add(id));

                return Array.from(ids);
            });
        };

        // ============================================================
        // CLEAR SELECTION
        // ============================================================

        const handleClearSelection = () => {
            setSelectedRequestIds([]);
            setRemarks("");
        };

        // ============================================================
        // REFRESH
        // ============================================================

        const handleRefresh = () => {
            setSelectedRequestIds([]);
            setCurrentPage(1);

            // Replace with API refetch when using useGet.
            console.log("Refresh normal exception requests");
        };

        // ============================================================
        // FORWARD SELECTED
        // ============================================================

        const handleForwardSelected = () => {
            if (selectedRequests.length === 0) {
                return;
            }

            onForwardSelected?.(selectedRequests, remarks);

            console.log("Forward selected requests:", {
                requests: selectedRequests,
                remarks,
            });
        };

        // ============================================================
        // FORWARD ALL
        // ============================================================

        const handleForwardAll = () => {
            if (pendingRequests.length === 0) {
                return;
            }

            onForwardAll?.(pendingRequests, remarks);

            console.log("Forward all pending requests:", {
                requests: pendingRequests,
                remarks,
            });
        };

        // ============================================================
        // SELECTED SUMMARY
        // ============================================================

        const selectedEmployeeCount = new Set(
            selectedRequests.map((request) => request.employeeId)
        ).size;

        const attendanceDates = selectedRequests
            .map((request) => new Date(request.attendanceDate))
            .filter((date) => !Number.isNaN(date.getTime()))
            .sort((a, b) => a.getTime() - b.getTime());

        const earliestAttendanceDate =
            attendanceDates.length > 0
                ? attendanceDates[0].toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })
                : "-";

        const latestAttendanceDate =
            attendanceDates.length > 0
                ? attendanceDates[attendanceDates.length - 1].toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }
                )
                : "-";

        // ============================================================
        // RESET FILTER
        // ============================================================

        const handleSearch = () => {
            setCurrentPage(1);
        };

        // ============================================================
        // UI
        // ============================================================

        return (
            <div className="min-h-screen bg-white text-[#101b4b]">
                {/* ========================================================
          HEADER
      ======================================================== */}

                <header className="h-[59px] bg-[#082b87] px-5 text-white">
                    <div className="flex h-full items-center justify-between">
                        {/* LEFT */}
                        <div className="flex h-full items-center">
                            <div className="flex items-center gap-2 pr-5">
                                <span className="text-[43px] font-bold leading-none text-[#12a8e8]">
                                    S
                                </span>

                                <div>
                                    <div className="text-[17px] font-bold leading-none">
                                        SYNEXIS
                                    </div>

                                    <div className="mt-1 text-[7px]">
                                        Creating Enterprise Synergy
                                    </div>
                                </div>
                            </div>

                            <div className="h-[38px] w-px bg-white/30" />

                            <div className="pl-5">
                                <div className="text-[13px] font-bold">
                                    PAYROLL &amp; WORKFORCE MOVEMENT SECTION – ATTENDANCE CELL
                                </div>

                                <div className="mt-1 text-[10px]">
                                    Dashboard
                                    <span className="mx-2">&gt;</span>
                                    Normal Exception Requests
                                </div>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-4">
                            <div className="flex h-[32px] items-center gap-2 rounded bg-white px-3 text-[10px] font-semibold text-[#17275c]">
                                <CalendarDays size={15} />
                                15 May 2025 | Thursday
                            </div>

                            <div className="flex items-center gap-2 border-l border-white/30 pl-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                                    <Users
                                        size={19}
                                        className="text-[#183e9b]"
                                    />
                                </div>

                                <div className="text-[8px] leading-[1.35]">
                                    <div className="font-bold">Nusrat Jahan</div>
                                    <div>Attendance &amp; Workforce</div>
                                    <div>Movement Section</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ========================================================
          PAGE
      ======================================================== */}

                <main className="px-6 pb-6 pt-4">
                    {/* PAGE TITLE + ACTIONS */}

                    <div className="mb-4 flex items-start justify-between">
                        <div>
                            <h1 className="text-[15px] font-bold uppercase text-[#071d61]">
                                NORMAL EXCEPTION REQUESTS
                            </h1>

                            <p className="mt-1 text-[10px] font-medium text-[#27325b]">
                                View and manage normal attendance exceptions forwarded by
                                Attendance Cell.
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleRefresh}
                                className="flex h-[28px] items-center gap-1.5 rounded border border-[#c9d6f4] bg-white px-4 text-[9px] font-semibold text-[#1352d9] hover:bg-[#f5f8ff]"
                            >
                                <RefreshCw size={12} />
                                Refresh
                            </button>

                            <button
                                type="button"
                                onClick={handleForwardAll}
                                disabled={pendingRequests.length === 0}
                                className="flex h-[28px] items-center gap-1.5 rounded bg-[#084ee8] px-4 text-[9px] font-semibold text-white hover:bg-[#063fc1] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Send size={12} />
                                Forward All to Factory IT
                            </button>
                        </div>
                    </div>

                    {/* ======================================================
            SUMMARY CARDS
        ====================================================== */}

                    <div className="mb-3 grid grid-cols-4 gap-3">
                        <SummaryCard
                            icon={<FileText size={17} />}
                            title="TOTAL REQUESTS"
                            value={32}
                            iconClass="bg-[#e8efff] text-[#1454e7]"
                            borderClass="border-[#dce5ff]"
                        />

                        <SummaryCard
                            icon={<Clock3 size={17} />}
                            title="PENDING WITH ME"
                            value={18}
                            iconClass="bg-[#fff0df] text-[#ff7800]"
                            borderClass="border-[#ffe2c9]"
                            valueClass="text-[#6b2600]"
                        />

                        <SummaryCard
                            icon={<CircleCheck size={17} />}
                            title="FORWARDED TO IT"
                            value={13}
                            iconClass="bg-[#e8f8ef] text-[#14935e]"
                            borderClass="border-[#dcefe5]"
                            valueClass="text-[#164a37]"
                        />

                        <SummaryCard
                            icon={<CircleX size={17} />}
                            title="REJECTED"
                            value={1}
                            iconClass="bg-[#f0eff9] text-[#615f91]"
                            borderClass="border-[#e5e3f1]"
                        />
                    </div>

                    {/* ======================================================
            MAIN GRID
        ====================================================== */}

                    <div className="grid grid-cols-[minmax(0,1fr)_188px] gap-5">
                        {/* LEFT CONTENT */}

                        <div className="min-w-0">
                            {/* ==================================================
                SEARCH / FILTER
            ================================================== */}

                            <section className="rounded border border-[#dfe6f4] bg-white p-3">
                                <h2 className="mb-3 text-[10px] font-bold text-[#112b70]">
                                    Search &amp; Filter
                                </h2>

                                <div className="grid grid-cols-7 gap-2">
                                    <FilterField label="Request ID">
                                        <input
                                            value={requestIdFilter}
                                            onChange={(e) =>
                                                setRequestIdFilter(e.target.value)
                                            }
                                            placeholder="Enter Request ID"
                                            className="filter-input"
                                        />
                                    </FilterField>

                                    <FilterField label="Employee ID / Name">
                                        <div className="relative">
                                            <input
                                                value={employeeFilter}
                                                onChange={(e) =>
                                                    setEmployeeFilter(e.target.value)
                                                }
                                                placeholder="Search by ID or Name"
                                                className="filter-input pr-7"
                                            />

                                            <Search
                                                size={13}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#263c77]"
                                            />
                                        </div>
                                    </FilterField>

                                    <FilterField label="Department">
                                        <SelectField
                                            value={departmentFilter}
                                            onChange={setDepartmentFilter}
                                            options={[
                                                "All",
                                                "Sewing",
                                                "Finishing",
                                                "Maintenance",
                                                "Quality",
                                                "Washing",
                                                "Cutting",
                                            ]}
                                        />
                                    </FilterField>

                                    <FilterField label="Exception Type">
                                        <SelectField
                                            value={exceptionTypeFilter}
                                            onChange={setExceptionTypeFilter}
                                            options={[
                                                "All",
                                                "Missing Punch (Out)",
                                                "Missing Punch (In)",
                                                "Late In Punch",
                                                "Early Out Punch",
                                                "Shift Correction",
                                                "OT Correction",
                                            ]}
                                        />
                                    </FilterField>

                                    <FilterField label="Status">
                                        <SelectField
                                            value={statusFilter}
                                            onChange={setStatusFilter}
                                            options={[
                                                "All",
                                                "Pending",
                                                "Forwarded",
                                                "Rejected",
                                            ]}
                                        />
                                    </FilterField>

                                    <FilterField label="Attendance Date From">
                                        <DateInput
                                            value={attendanceDateFrom}
                                            onChange={setAttendanceDateFrom}
                                        />
                                    </FilterField>

                                    <FilterField label="Attendance Date To">
                                        <DateInput
                                            value={attendanceDateTo}
                                            onChange={setAttendanceDateTo}
                                        />
                                    </FilterField>
                                </div>

                                <div className="mt-2 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleSearch}
                                        className="flex h-[25px] items-center gap-1.5 rounded bg-[#0752e6] px-4 text-[9px] font-bold text-white"
                                    >
                                        <Search size={11} />
                                        Search
                                    </button>
                                </div>
                            </section>

                            {/* ==================================================
                REQUEST TABLE
            ================================================== */}

                            <section className="mt-3 overflow-hidden rounded border border-[#dfe6f4] bg-white">
                                <div className="flex h-[37px] items-center justify-between border-b border-[#e2e8f3] px-3">
                                    <h2 className="text-[10px] font-bold text-[#112b70]">
                                        Exception Requests List (Normal)
                                    </h2>

                                    <div className="flex items-center gap-2 text-[8px] text-[#526084]">
                                        {filteredRequests.length} record(s) found

                                        <button
                                            type="button"
                                            disabled={currentPage === 1}
                                            onClick={() =>
                                                setCurrentPage((page) => Math.max(1, page - 1))
                                            }
                                            className="flex h-6 w-6 items-center justify-center rounded border border-[#d8e0ef] disabled:opacity-40"
                                        >
                                            <ChevronLeft size={12} />
                                        </button>

                                        <span className="flex h-6 w-6 items-center justify-center rounded bg-[#0950df] text-white">
                                            {currentPage}
                                        </span>

                                        <button
                                            type="button"
                                            disabled={currentPage >= totalPages}
                                            onClick={() =>
                                                setCurrentPage((page) =>
                                                    Math.min(totalPages, page + 1)
                                                )
                                            }
                                            className="flex h-6 w-6 items-center justify-center rounded border border-[#d8e0ef] disabled:opacity-40"
                                        >
                                            <ChevronRight size={12} />
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-[#f7f9fd] text-left">
                                                {/* IMPORTANT:
                          FAR LEFT CHECKBOX
                      */}
                                                <th className="w-[36px] px-3 py-2">
                                                    <Checkbox
                                                        checked={allVisibleSelected}
                                                        indeterminate={someVisibleSelected}
                                                        onChange={handleSelectAll}
                                                    />
                                                </th>

                                                <TableHeader>Request ID</TableHeader>
                                                <TableHeader>Attendance Date</TableHeader>
                                                <TableHeader>Employee ID</TableHeader>
                                                <TableHeader>Employee Name</TableHeader>
                                                <TableHeader>Department</TableHeader>
                                                <TableHeader>Exception Type</TableHeader>
                                                <TableHeader>Shift</TableHeader>
                                                <TableHeader>Submitted By</TableHeader>
                                                <TableHeader>Submitted On</TableHeader>
                                                <TableHeader>Status</TableHeader>
                                                <TableHeader>Action</TableHeader>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {paginatedRequests.map((request) => {
                                                const checked = selectedRequestIds.includes(
                                                    request.requestId
                                                );

                                                const isPending = request.status === "Pending";

                                                return (
                                                    <tr
                                                        key={request.requestId}
                                                        className={`border-t border-[#edf0f6] text-[8px] ${checked ? "bg-[#f4f7ff]" : "bg-white"
                                                            }`}
                                                    >
                                                        {/* =================================================
                              FAR LEFT ROW CHECKBOX
                          ================================================= */}

                                                        <td className="px-3 py-2">
                                                            <Checkbox
                                                                checked={checked}
                                                                disabled={!isPending}
                                                                onChange={() =>
                                                                    handleToggleRequest(request.requestId)
                                                                }
                                                            />
                                                        </td>

                                                        <TableCell bold>
                                                            {request.requestId}
                                                        </TableCell>

                                                        <TableCell>
                                                            {request.attendanceDate}
                                                        </TableCell>

                                                        <TableCell>
                                                            {request.employeeId}
                                                        </TableCell>

                                                        <TableCell bold>
                                                            {request.employeeName}
                                                        </TableCell>

                                                        <TableCell>
                                                            {request.department}
                                                        </TableCell>

                                                        <TableCell>
                                                            {request.exceptionType}
                                                        </TableCell>

                                                        <TableCell>
                                                            {request.shift}
                                                        </TableCell>

                                                        <TableCell>
                                                            {request.submittedBy}
                                                        </TableCell>

                                                        <TableCell>
                                                            {request.submittedOn}
                                                        </TableCell>

                                                        <td className="whitespace-nowrap px-2 py-2">
                                                            <StatusBadge status={request.status} />
                                                        </td>

                                                        <td className="px-2 py-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => onViewRequest?.(request)}
                                                                className="rounded border border-[#cbd8f2] px-3 py-1 text-[8px] font-semibold text-[#1350d3] hover:bg-[#f2f6ff]"
                                                            >
                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}

                                            {paginatedRequests.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan={12}
                                                        className="py-10 text-center text-[10px] text-[#68728d]"
                                                    >
                                                        No exception requests found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* TABLE FOOTER */}

                                <div className="flex h-[40px] items-center gap-2 border-t border-[#e4e9f2] px-3 text-[8px]">
                                    <span className="font-semibold">Show</span>

                                    <select
                                        value={pageSize}
                                        onChange={(e) => {
                                            setPageSize(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                        className="h-[24px] rounded border border-[#d6deed] bg-white px-2 text-[8px] outline-none"
                                    >
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                    </select>

                                    <span className="font-semibold">entries per page</span>
                                </div>
                            </section>

                            {/* ==================================================
                SELECTED REQUEST SUMMARY + REMARKS
            ================================================== */}

                            <div className="mt-3 grid grid-cols-2 gap-3">
                                {/* SELECTED SUMMARY */}

                                <section className="rounded border border-[#dfe6f4] bg-white">
                                    <div className="border-b border-[#e5eaf3] px-3 py-2">
                                        <h2 className="text-[10px] font-bold text-[#112b70]">
                                            Selected Requests Summary
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-4 px-3 py-4 text-[8px]">
                                        <SummaryValue
                                            label="Total Selected"
                                            value={selectedRequests.length}
                                        />

                                        <SummaryValue
                                            label="Earliest Attendance Date"
                                            value={earliestAttendanceDate}
                                        />

                                        <SummaryValue
                                            label="Total Employees"
                                            value={selectedEmployeeCount}
                                        />

                                        <SummaryValue
                                            label="Latest Attendance Date"
                                            value={latestAttendanceDate}
                                        />
                                    </div>
                                </section>

                                {/* REMARKS */}

                                <section className="rounded border border-[#dfe6f4] bg-white">
                                    <div className="px-3 pt-3">
                                        <h2 className="text-[10px] font-bold text-[#112b70]">
                                            Remarks (Optional)
                                        </h2>

                                        <textarea
                                            value={remarks}
                                            onChange={(e) =>
                                                setRemarks(e.target.value.slice(0, 250))
                                            }
                                            placeholder="Enter remarks before forwarding..."
                                            className="mt-2 h-[50px] w-full resize-none rounded border border-[#dce3ef] p-2 text-[8px] outline-none placeholder:text-[#8d98b1] focus:border-[#3e6fe5]"
                                        />

                                        <div className="flex justify-between py-1 text-[7px] text-[#8290ae]">
                                            <span>Maximum 250 characters allowed</span>
                                            <span>{remarks.length}/250</span>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* ==================================================
                BOTTOM ACTIONS
            ================================================== */}

                            <div className="mt-3 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={handleClearSelection}
                                    className="flex h-[27px] items-center gap-1.5 rounded border border-[#cbd7ed] bg-white px-6 text-[9px] font-semibold text-[#173d9d] hover:bg-[#f6f8fc]"
                                >
                                    Clear
                                </button>

                                <button
                                    type="button"
                                    disabled={selectedRequests.length === 0}
                                    onClick={handleForwardSelected}
                                    className="flex h-[27px] items-center gap-1.5 rounded bg-[#0750e7] px-5 text-[9px] font-bold text-white hover:bg-[#063fc1] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Forward Selected to Factory IT
                                    <Send size={11} />
                                </button>
                            </div>
                        </div>

                        {/* ======================================================
              RIGHT SIDEBAR
          ====================================================== */}

                        <aside>
                            {/* WORKFLOW */}

                            <section className="rounded border border-[#dfe6f4] bg-white p-3">
                                <h2 className="mb-4 text-[10px] font-bold uppercase text-[#112b70]">
                                    Workflow
                                </h2>

                                <WorkflowStep
                                    number="1."
                                    title="Attendance Cell"
                                    subtitle="Submitted"
                                    color="bg-[#7027d8]"
                                    completed
                                />

                                <WorkflowConnector />

                                <WorkflowStep
                                    number="2."
                                    title="Attendance & Workforce"
                                    subtitle="Movement Section"
                                    secondSubtitle="Review & Forward"
                                    color="bg-[#ff7500]"
                                    active
                                />

                                <WorkflowConnector />

                                <WorkflowStep
                                    number="3."
                                    title="Factory IT"
                                    subtitle="Review & Approve"
                                    color="bg-[#0751df]"
                                />

                                <WorkflowConnector />

                                <WorkflowStep
                                    number="4."
                                    title="Completed"
                                    subtitle="Applied"
                                    color="bg-[#35a56d]"
                                />
                            </section>

                            {/* QUICK ACTIONS */}

                            <section className="mt-4 rounded border border-[#dfe6f4] bg-white p-3">
                                <h2 className="mb-3 text-[10px] font-bold uppercase text-[#112b70]">
                                    Quick Actions
                                </h2>

                                <QuickAction
                                    icon={<Send size={12} />}
                                    text="Forward Selected to Factory IT"
                                    onClick={handleForwardSelected}
                                    disabled={selectedRequests.length === 0}
                                />

                                <QuickAction
                                    icon={<Eye size={12} />}
                                    text="View Request Details"
                                    onClick={() => {
                                        if (selectedRequests[0]) {
                                            onViewRequest?.(selectedRequests[0]);
                                        }
                                    }}
                                    disabled={selectedRequests.length === 0}
                                />

                                <QuickAction
                                    icon={<FileSpreadsheet size={12} />}
                                    text="Export to Excel"
                                    onClick={() => {
                                        console.log("Export to Excel");
                                    }}
                                />

                                <QuickAction
                                    icon={<Download size={12} />}
                                    text="Print List"
                                    onClick={() => window.print()}
                                />
                            </section>

                            {/* NOTE */}

                            <section className="mt-4 rounded border border-[#dfe6f4] bg-white p-3">
                                <div className="flex gap-2">
                                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0951df] text-white">
                                        <Info size={10} />
                                    </div>

                                    <div>
                                        <h2 className="text-[10px] font-bold uppercase text-[#112b70]">
                                            Note
                                        </h2>

                                        <p className="mt-3 text-[8px] leading-[1.6] text-[#28355d]">
                                            Normal exceptions are forwarded
                                            <br />
                                            to Factory IT for correction.
                                            <br />
                                            No payroll impact.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </aside>
                    </div>
                </main>
            </div>
        );
    };

/* ================================================================
   SUMMARY CARD
================================================================ */

interface SummaryCardProps {
    icon: React.ReactNode;
    title: string;
    value: number;
    iconClass: string;
    borderClass: string;
    valueClass?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
    icon,
    title,
    value,
    iconClass,
    borderClass,
    valueClass = "text-[#101a43]",
}) => {
    return (
        <div
            className={`flex h-[58px] items-center gap-4 rounded border bg-white px-4 ${borderClass}`}
        >
            <div
                className={`flex h-9 w-9 items-center justify-center rounded-full ${iconClass}`}
            >
                {icon}
            </div>

            <div>
                <div className="text-[8px] font-bold">{title}</div>

                <div className={`mt-1 text-[18px] font-bold ${valueClass}`}>
                    {value}
                </div>
            </div>
        </div>
    );
};

/* ================================================================
   FILTER FIELD
================================================================ */

interface FilterFieldProps {
    label: string;
    children: React.ReactNode;
}

const FilterField: React.FC<FilterFieldProps> = ({
    label,
    children,
}) => {
    return (
        <div>
            <label className="mb-1 block text-[8px] font-semibold text-[#27325b]">
                {label}
            </label>

            {children}
        </div>
    );
};

/* ================================================================
   SELECT
================================================================ */

interface SelectFieldProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
}

const SelectField: React.FC<SelectFieldProps> = ({
    value,
    onChange,
    options,
}) => {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="filter-input appearance-none pr-6"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <ChevronDown
                size={11}
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#183b82]"
            />
        </div>
    );
};

/* ================================================================
   DATE INPUT
================================================================ */

interface DateInputProps {
    value: string;
    onChange: (value: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({
    value,
    onChange,
}) => {
    return (
        <div className="relative">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="dd/mm/yyyy"
                className="filter-input pr-7"
            />

            <CalendarDays
                size={12}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#203a78]"
            />
        </div>
    );
};

/* ================================================================
   CHECKBOX
================================================================ */

interface CheckboxProps {
    checked: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
    checked,
    indeterminate = false,
    disabled = false,
    onChange,
}) => {
    return (
        <button
            type="button"
            role="checkbox"
            aria-checked={indeterminate ? "mixed" : checked}
            disabled={disabled}
            onClick={onChange}
            className={`flex h-[13px] w-[13px] items-center justify-center rounded-[2px] border transition ${checked || indeterminate
                    ? "border-[#0752df] bg-[#0752df] text-white"
                    : "border-[#b9c4d8] bg-white"
                } ${disabled
                    ? "cursor-not-allowed opacity-40"
                    : "cursor-pointer"
                }`}
        >
            {indeterminate ? (
                <span className="h-[2px] w-[7px] rounded bg-white" />
            ) : checked ? (
                <Check size={9} strokeWidth={3} />
            ) : null}
        </button>
    );
};

/* ================================================================
   TABLE HEADER
================================================================ */

const TableHeader: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <th className="whitespace-nowrap px-2 py-2 text-[7px] font-bold text-[#17275c]">
            {children}
        </th>
    );
};

/* ================================================================
   TABLE CELL
================================================================ */

const TableCell: React.FC<{
    children: React.ReactNode;
    bold?: boolean;
}> = ({ children, bold = false }) => {
    return (
        <td
            className={`whitespace-nowrap px-2 py-2 ${bold ? "font-semibold" : "font-medium"
                } text-[#1d2b55]`}
        >
            {children}
        </td>
    );
};

/* ================================================================
   STATUS
================================================================ */

const StatusBadge: React.FC<{
    status: ExceptionRequest["status"];
}> = ({ status }) => {
    const classes = {
        Pending: "bg-[#fff1df] text-[#e96b00]",
        Forwarded: "bg-[#e7f7ee] text-[#168152]",
        Rejected: "bg-[#f5e8eb] text-[#a7394d]",
    };

    return (
        <span
            className={`rounded px-2 py-1 text-[7px] font-bold ${classes[status]}`}
        >
            {status}
        </span>
    );
};

/* ================================================================
   SELECTED SUMMARY VALUE
================================================================ */

const SummaryValue: React.FC<{
    label: string;
    value: string | number;
}> = ({ label, value }) => {
    return (
        <div className="flex justify-between border-r border-[#e5eaf3] pr-5 last:border-0">
            <span className="font-semibold text-[#23315c]">{label}</span>

            <span className="font-bold text-[#142456]">{value}</span>
        </div>
    );
};

/* ================================================================
   WORKFLOW
================================================================ */

interface WorkflowStepProps {
    number: string;
    title: string;
    subtitle: string;
    secondSubtitle?: string;
    color: string;
    completed?: boolean;
    active?: boolean;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({
    number,
    title,
    subtitle,
    secondSubtitle,
    color,
    completed,
    active,
}) => {
    return (
        <div className="flex items-start gap-2">
            <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${color}`}
            >
                {completed ? (
                    <Check size={12} strokeWidth={3} />
                ) : active ? (
                    <Users size={12} />
                ) : (
                    <span className="text-[10px]">{number.replace(".", "")}</span>
                )}
            </div>

            <div className="pt-0.5 text-[8px] leading-[1.45]">
                <div className="font-bold text-[#182554]">
                    {number} {title}
                </div>

                <div className="font-medium text-[#26335c]">{subtitle}</div>

                {secondSubtitle && (
                    <div className="font-medium text-[#26335c]">
                        {secondSubtitle}
                    </div>
                )}
            </div>

            <div className="ml-auto pt-2">
                {completed ? (
                    <CircleCheck
                        size={12}
                        className="text-[#39a76d]"
                        fill="#39a76d"
                        color="white"
                    />
                ) : active ? (
                    <div className="h-3 w-3 rounded-full bg-[#0751df]" />
                ) : (
                    <div className="h-3 w-3 rounded-full border-2 border-[#c3cad7]" />
                )}
            </div>
        </div>
    );
};

const WorkflowConnector = () => {
    return (
        <div className="ml-[11px] h-4 border-l border-dashed border-[#c5ccda]" />
    );
};

/* ================================================================
   QUICK ACTION
================================================================ */

interface QuickActionProps {
    icon: React.ReactNode;
    text: string;
    onClick?: () => void;
    disabled?: boolean;
}

const QuickAction: React.FC<QuickActionProps> = ({
    icon,
    text,
    onClick,
    disabled = false,
}) => {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className="mb-1.5 flex h-[28px] w-full items-center gap-2 rounded border border-[#dbe3f2] px-2 text-left text-[8px] font-semibold text-[#173d94] hover:bg-[#f5f8ff] disabled:cursor-not-allowed disabled:opacity-40"
        >
            {icon}
            {text}
        </button>
    );
};

export default NormalExceptionRequests;
