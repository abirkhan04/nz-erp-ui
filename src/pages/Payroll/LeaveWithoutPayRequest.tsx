import React, { useMemo, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Eye,
    FileText,
    Info,
    Search,
    XCircle,
    Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import CommonInputField from "../../components/CommonInputFields";
import { API_ROUTES } from "../../api/routes";
import { useGet } from "../../hooks/useGet";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";

export type LeaveWithoutPayRequest = {
    requestId: string;
    employeeId: string;
    employeeCode: string;
    employeeName: string;
    leaveType: string;
    fromDate: string;
    toDate: string;
    totalDays: number;
    reason: string;
    status: string;
    createdBy: string;
    createdDate: string;
    approvedBy: string | null;
    approvedDate: string | null;
    forwardedBy: string | null;
    forwardedDate: string | null;
    availableLeaves: {
        leaveTypeId: string;
        leaveTypeName: string;
        openingBalance: number;
        earnedLeave: number;
        availedLeave: number;
        adjustedLeave: number;
        encashedLeave: number;
        closingBalance: number;
    }[];
    leaveTypeId: string;
    departmentName: string;
};

type FilterForm = {
    requestId: string;
    employeeIdName: string;
    department: string;
    leaveWithoutPayType: string;
    status: string;
    leaveFrom: string;
    leaveTo: string;
};

const LeaveWithoutPayRequestList: React.FC = () => {
    const navigate = useNavigate();

    const {
        register,
        control,
        watch,
        reset,
    } = useForm<FilterForm>({
        defaultValues: {
            requestId: "",
            employeeIdName: "",
            department: "",
            leaveWithoutPayType: "",
            status: "FORWARDED",
            leaveFrom: "",
            leaveTo: "",
        },
    });

    /* ------------------------------------------------------------------------ */
    /* STATE                                                                    */
    /* ------------------------------------------------------------------------ */

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [remarks, setRemarks] = useState("");
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

    /* ------------------------------------------------------------------------ */
    /* FILTER VALUES                                                            */
    /* ------------------------------------------------------------------------ */

    const filters = watch();

    const fromDate = watch("leaveFrom");
    const toDate = watch("leaveTo");

    /* ------------------------------------------------------------------------ */
    /* GET REQUESTS                                                             */
    /* ------------------------------------------------------------------------ */

    const {
        data: { data: leaveWithoutPayRequest = [] } = {},
        refetch: refetchLWPRequests,
    } = useGet({
        key: [
            "leaveWithoutPayRequests",
            fromDate,
            toDate,
        ],
        url: `${API_ROUTES.LEAVE}?leaveType=LWP&fromDate=${fromDate}&toDate=${toDate}&status=FORWARDED`,
    });

    /* ------------------------------------------------------------------------ */
    /* FILTER OPTIONS                                                           */
    /* ------------------------------------------------------------------------ */

    const departmentOptions = [
        { label: "All", value: "" },
        { label: "Weaving", value: "Weaving" },
        { label: "Spinning", value: "Spinning" },
        { label: "Finishing", value: "Finishing" },
        { label: "Maintenance", value: "Maintenance" },
        { label: "Quality", value: "Quality" },
        { label: "Washing", value: "Washing" },
        { label: "Cutting", value: "Cutting" },
        { label: "Dyeing", value: "Dyeing" },
    ];

    const leaveTypeOptions = [
        { label: "All", value: "" },
        { label: "Casual Leave", value: "Casual Leave" },
        { label: "Sick Leave", value: "Sick Leave" },
        { label: "Earned Leave", value: "Earned Leave" },
        { label: "Leave Without Pay", value: "Leave Without Pay" },
    ];

    const statusOptions = [
        { label: "Forwarded", value: "FORWARDED" },
        { label: "All", value: "" },
        { label: "Approved", value: "APPROVED" },
        { label: "Rejected", value: "REJECTED" },
    ];

    /* ------------------------------------------------------------------------ */
    /* FILTER DATA                                                              */
    /* ------------------------------------------------------------------------ */

    const filteredRequests = useMemo(() => {
        return (leaveWithoutPayRequest as LeaveWithoutPayRequest[]).filter(
            (request) => {
                const requestIdMatch =
                    !filters.requestId ||
                    request.requestId
                        .toLowerCase()
                        .includes(filters.requestId.toLowerCase());

                const employeeMatch =
                    !filters.employeeIdName ||
                    request.employeeId
                        .toLowerCase()
                        .includes(filters.employeeIdName.toLowerCase()) ||
                    request.employeeName
                        .toLowerCase()
                        .includes(filters.employeeIdName.toLowerCase()) ||
                    request.employeeCode
                        .toLowerCase()
                        .includes(filters.employeeIdName.toLowerCase());

                const departmentMatch =
                    !filters.department ||
                    request.departmentName === filters.department;

                const leaveTypeMatch =
                    !filters.leaveWithoutPayType ||
                    request.leaveType === filters.leaveWithoutPayType;

                const statusMatch =
                    !filters.status ||
                    request.status === filters.status;

                const fromDateMatch =
                    !filters.leaveFrom ||
                    request.fromDate >= filters.leaveFrom;

                const toDateMatch =
                    !filters.leaveTo ||
                    request.toDate <= filters.leaveTo;

                return (
                    requestIdMatch &&
                    employeeMatch &&
                    departmentMatch &&
                    leaveTypeMatch &&
                    statusMatch &&
                    fromDateMatch &&
                    toDateMatch
                );
            }
        );
    }, [leaveWithoutPayRequest, filters]);

    /* ------------------------------------------------------------------------ */
    /* PAGINATION                                                               */
    /* ------------------------------------------------------------------------ */

    const totalPages = Math.max(
        1,
        Math.ceil(filteredRequests.length / pageSize)
    );

    const safeCurrentPage = Math.min(
        currentPage,
        totalPages
    );

    const paginatedRequests = filteredRequests.slice(
        (safeCurrentPage - 1) * pageSize,
        safeCurrentPage * pageSize
    );

    /* ------------------------------------------------------------------------ */
    /* SELECTION                                                                */
    /* ------------------------------------------------------------------------ */

    const visibleIds = paginatedRequests.map(
        (request) => request.requestId
    );

    const allVisibleSelected =
        visibleIds.length > 0 &&
        visibleIds.every((id) => selectedIds.includes(id));

    const handleSelectAll = () => {
        if (allVisibleSelected) {
            setSelectedIds((prev) =>
                prev.filter((id) => !visibleIds.includes(id))
            );
        } else {
            setSelectedIds((prev) => [
                ...new Set([...prev, ...visibleIds]),
            ]);
        }
    };

    const handleSelectOne = (requestId: string) => {
        setSelectedIds((prev) => {
            if (prev.includes(requestId)) {
                return prev.filter((id) => id !== requestId);
            }

            return [...prev, requestId];
        });
    };

    /* ------------------------------------------------------------------------ */
    /* SELECTED REQUESTS                                                        */
    /* ------------------------------------------------------------------------ */

    const selectedRequests = useMemo(() => {
        return (leaveWithoutPayRequest as LeaveWithoutPayRequest[]).filter(
            (request) => selectedIds.includes(request.requestId)
        );
    }, [leaveWithoutPayRequest, selectedIds]);

    const totalSelected = selectedRequests.length;

    const totalEmployees = new Set(
        selectedRequests.map((request) => request.employeeId)
    ).size;

    const totalDays = selectedRequests.reduce(
        (sum, request) => sum + request.totalDays,
        0
    );

    /* ------------------------------------------------------------------------ */
    /* SEARCH                                                                   */
    /* ------------------------------------------------------------------------ */

    const handleSearch = () => {
        setCurrentPage(1);
        setSelectedIds([]);
    };

    const handleClear = async () => {
        reset({
            requestId: "",
            employeeIdName: "",
            department: "",
            leaveWithoutPayType: "",
            status: "FORWARDED",
            leaveFrom: "",
            leaveTo: "",
        });

        setSelectedIds([]);
        setCurrentPage(1);
        setRemarks("");

        await refetchLWPRequests();
    };

    /* ------------------------------------------------------------------------ */
    /* VIEW DETAILS                                                             */
    /* ------------------------------------------------------------------------ */

    const handleViewRequest = (requestId: string) => {
        navigate(
            `/payroll-and-workforce-movement/attendance-cell/leave-without-pay-request/${requestId}`
        );
    };

    /* ------------------------------------------------------------------------ */
    /* APPROVE / REJECT                                                         */
    /* ------------------------------------------------------------------------ */

    const {user} = useAuth();

    const handleApproval = async (
        approvalStatus: "APPROVED" | "REJECTED"
    ) => {
        if (selectedIds.length === 0) {
            alert("Please select at least one request.");
            return;
        }

        if (approvalStatus === "APPROVED") {
            setIsApproving(true);
        } else {
            setIsRejecting(true);
        }


        try {
            const payload = selectedRequests.map((request) => ({
                requestId: request.requestId,
                leaveType: request.leaveType,
                fromDate: request.fromDate,
                toDate: request.toDate,
                reason: request.reason,
                forwardedBy: request.forwardedBy ?? "",
                forwardedDate: format(new Date(), "yyyy-MM-dd"),
                approvedBy: user?.userName ?? "",
                approvStatus: approvalStatus,
            }));

            await api.put(API_ROUTES.LEAVE,
                payload),

            setSelectedIds([]);
            setRemarks("");

            await refetchLWPRequests();
        } catch (error) {
            console.error(
                "Leave Without Pay approval/rejection failed:",
                error
            );

            alert(
                `Failed to ${
                    approvalStatus === "APPROVED"
                        ? "approve"
                        : "reject"
                } selected request(s).`
            );
        } finally {
            setIsApproving(false);
            setIsRejecting(false);
        }
    };

    /* ------------------------------------------------------------------------ */
    /* PAGE SIZE                                                                 */
    /* ------------------------------------------------------------------------ */

    const handlePageSizeChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setPageSize(Number(event.target.value));
        setCurrentPage(1);
    };

    /* ------------------------------------------------------------------------ */
    /* SUMMARY COUNTS                                                           */
    /* ------------------------------------------------------------------------ */

    const totalRequests = leaveWithoutPayRequest.length;

    const pendingCount = leaveWithoutPayRequest.filter(
        (request: LeaveWithoutPayRequest) =>
            request.status === "FORWARDED"
    ).length;

    const approvedCount = leaveWithoutPayRequest.filter(
        (request: LeaveWithoutPayRequest) =>
            request.status === "APPROVED"
    ).length;

    const rejectedCount = leaveWithoutPayRequest.filter(
        (request: LeaveWithoutPayRequest) =>
            request.status === "REJECTED"
    ).length;

    /* ------------------------------------------------------------------------ */
    /* RENDER                                                                   */
    /* ------------------------------------------------------------------------ */

    return (
        <div className="min-h-screen bg-white px-4 py-4 text-[#17245B]">

            {/* PAGE HEADER */}
            <header className="h-[59px] bg-[#082b87] px-5 text-white">
                <div className="flex h-full items-center justify-between">

                    <div className="flex h-full items-center">

                        <div className="flex items-center gap-2 pr-5">
                            <div className="flex h-[38px] w-[38px] items-center justify-center rounded bg-white">
                                <span className="text-[32px] font-bold leading-none text-[#173e98]">
                                    S
                                </span>
                            </div>

                            <div>
                                <div className="text-[18px] font-bold leading-none">
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
                                PAYROLL &amp; WORKFORCE MOVEMENT SECTION –
                                ATTENDANCE CELL
                            </div>

                            <div className="mt-1 text-[10px]">
                                Dashboard
                                <span className="mx-2">&gt;</span>
                                Leave Without Pay Requests
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">

                        <div className="flex h-[32px] items-center gap-2 rounded bg-white px-3 text-[10px] font-semibold text-[#17275c]">
                            <CalendarDays size={14} />
                            30 September 2026
                        </div>

                        <div className="flex items-center gap-2 border-l border-white/30 pl-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                                <Users
                                    size={18}
                                    className="text-[#173e98]"
                                />
                            </div>

                            <div className="text-[8px] leading-[1.35]">
                                <div className="font-bold">
                                    Nusrat Jahan
                                </div>
                                <div>Section Incharge</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* TITLE */}
            <div className="mb-5 flex items-start justify-between">

                <div>
                    <h1 className="text-xl font-bold text-[#07185C]">
                        LEAVE WITHOUT PAY REQUESTS
                    </h1>

                    <p className="mt-1 text-sm text-gray-600">
                        View and manage leave without pay requests
                        forwarded by the Attendance Cell.
                    </p>
                </div>

                <div className="flex gap-2">

                    <button
                        type="button"
                        onClick={handleClear}
                        className="flex items-center gap-2 rounded-md border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                    >
                        <Clock3 size={15} />
                        Refresh
                    </button>

                    <button
                        type="button"
                        onClick={() => handleApproval("APPROVED")}
                        disabled={
                            selectedIds.length === 0 ||
                            isApproving ||
                            isRejecting
                        }
                        className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <CheckCircle2 size={15} />
                        {isApproving
                            ? "Approving..."
                            : "Approve Selected"}
                    </button>

                    <button
                        type="button"
                        onClick={() => handleApproval("REJECTED")}
                        disabled={
                            selectedIds.length === 0 ||
                            isApproving ||
                            isRejecting
                        }
                        className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <XCircle size={15} />
                        {isRejecting
                            ? "Rejecting..."
                            : "Reject Selected"}
                    </button>
                </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-4">

                <SummaryCard
                    icon={
                        <FileText
                            size={20}
                            className="text-blue-600"
                        />
                    }
                    title="TOTAL REQUESTS"
                    value={totalRequests}
                    iconBg="bg-blue-50"
                />

                <SummaryCard
                    icon={
                        <Clock3
                            size={20}
                            className="text-orange-500"
                        />
                    }
                    title="FORWARDED"
                    value={pendingCount}
                    iconBg="bg-orange-50"
                />

                <SummaryCard
                    icon={
                        <CheckCircle2
                            size={20}
                            className="text-green-600"
                        />
                    }
                    title="APPROVED"
                    value={approvedCount}
                    iconBg="bg-green-50"
                />

                <SummaryCard
                    icon={
                        <XCircle
                            size={20}
                            className="text-red-500"
                        />
                    }
                    title="REJECTED"
                    value={rejectedCount}
                    iconBg="bg-red-50"
                />
            </div>

            {/* SEARCH & FILTER */}
            <div className="mb-5 rounded-lg border border-blue-100 bg-white p-4">

                <div className="mb-3">
                    <h2 className="text-sm font-bold text-[#17245B]">
                        Search & Filter
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">

                    <CommonInputField
                        label="Request ID"
                        name="requestId"
                        register={register}
                        errors={{}}
                        placeholder="Enter Request ID"
                    />

                    <CommonInputField
                        label="Employee ID / Name"
                        name="employeeIdName"
                        register={register}
                        errors={{}}
                        placeholder="Search by ID or Name"
                    />

                    <CommonInputField
                        label="Department"
                        name="department"
                        register={register}
                        control={control}
                        errors={{}}
                        type="dropdown"
                        options={departmentOptions}
                        isPlaceholderVisible={false}
                    />

                    <CommonInputField
                        label="Leave Type"
                        name="leaveWithoutPayType"
                        register={register}
                        control={control}
                        errors={{}}
                        type="dropdown"
                        options={leaveTypeOptions}
                        isPlaceholderVisible={false}
                    />

                    <CommonInputField
                        label="Status"
                        name="status"
                        register={register}
                        control={control}
                        errors={{}}
                        type="dropdown"
                        options={statusOptions}
                        isPlaceholderVisible={false}
                    />

                    <CommonInputField
                        label="Leave From"
                        name="leaveFrom"
                        register={register}
                        control={control}
                        errors={{}}
                        type="date"
                    />

                    <CommonInputField
                        label="Leave To"
                        name="leaveTo"
                        register={register}
                        control={control}
                        errors={{}}
                        type="date"
                    />
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        <Search size={15} />
                        Search
                    </button>
                </div>
            </div>

            {/* REQUEST TABLE */}
            <div className="mb-5 rounded-lg border border-blue-100 bg-white">

                <div className="flex items-center justify-between border-b border-blue-100 px-4 py-4">

                    <h2 className="text-sm font-bold text-[#17245B]">
                        Leave Without Pay Requests List
                    </h2>

                    <span className="text-xs text-gray-500">
                        {filteredRequests.length} record(s) found
                    </span>
                </div>

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[1250px] border-collapse text-xs">

                        <thead>
                            <tr className="bg-[#F7F9FC] text-left">

                                <th className="w-10 border-b border-gray-200 px-3 py-3">
                                    <input
                                        type="checkbox"
                                        checked={allVisibleSelected}
                                        onChange={handleSelectAll}
                                        className="h-4 w-4 cursor-pointer accent-blue-600"
                                    />
                                </th>

                                <th className="border-b border-gray-200 px-3 py-3 font-bold">
                                    Request ID
                                </th>

                                <th className="border-b border-gray-200 px-3 py-3 font-bold">
                                    Created Date
                                </th>

                                <th className="border-b border-gray-200 px-3 py-3 font-bold">
                                    Employee ID
                                </th>

                                <th className="border-b border-gray-200 px-3 py-3 font-bold">
                                    Employee Name
                                </th>

                                <th className="border-b border-gray-200 px-3 py-3 font-bold">
                                    Department
                                </th>

                                <th className="border-b border-gray-200 px-3 py-3 font-bold">
                                    Leave Type
                                </th>

                                <th className="border-b border-gray-200 px-3 py-3 font-bold">
                                    Leave From
                                </th>

                                <th className="border-b border-gray-200 px-3 py-3 font-bold">
                                    Leave To
                                </th>

                                <th className="border-b border-gray-200 px-3 py-3 font-bold">
                                    Total Days
                                </th>

                                <th className="border-b border-gray-200 px-3 py-3 font-bold">
                                    Created By
                                </th>

                                <th className="border-b border-gray-200 px-3 py-3 font-bold">
                                    Status
                                </th>

                                <th className="border-b border-gray-200 px-3 py-3 text-center font-bold">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {paginatedRequests.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={13}
                                        className="px-4 py-10 text-center text-gray-500"
                                    >
                                        No leave without pay requests found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedRequests.map((request) => {

                                    const checked =
                                        selectedIds.includes(
                                            request.requestId
                                        );

                                    return (
                                        <tr
                                            key={request.requestId}
                                            className={`border-b border-gray-100 hover:bg-blue-50/40 ${
                                                checked
                                                    ? "bg-blue-50"
                                                    : ""
                                            }`}
                                        >

                                            <td className="px-3 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() =>
                                                        handleSelectOne(
                                                            request.requestId
                                                        )
                                                    }
                                                    className="h-4 w-4 cursor-pointer accent-blue-600"
                                                />
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-3 font-semibold text-blue-700">
                                                {request.requestId}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-3">
                                                {new Date(
                                                    request.createdDate
                                                ).toLocaleDateString()}
                                            </td>

                                            <td className="px-3 py-3">
                                                {request.employeeCode}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-3 font-medium">
                                                {request.employeeName}
                                            </td>

                                            <td className="px-3 py-3">
                                                {request.departmentName}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-3">
                                                {request.leaveType}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-3">
                                                {request.fromDate}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-3">
                                                {request.toDate}
                                            </td>

                                            <td className="px-3 py-3 font-semibold">
                                                {request.totalDays}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-3">
                                                {request.createdBy}
                                            </td>

                                            <td className="px-3 py-3">
                                                <StatusBadge
                                                    status={request.status}
                                                />
                                            </td>

                                            <td className="px-3 py-3 text-center">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleViewRequest(
                                                            request.requestId
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1 rounded border border-blue-200 px-3 py-1.5 font-semibold text-blue-700 hover:bg-blue-50"
                                                >
                                                    <Eye size={13} />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* TABLE FOOTER */}
                <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">

                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>Show</span>

                        <select
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            className="rounded border border-gray-300 px-2 py-1 outline-none focus:border-blue-500"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>

                        <span>entries per page</span>
                    </div>

                    <div className="flex items-center gap-1">

                        <button
                            type="button"
                            disabled={safeCurrentPage === 1}
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.max(1, prev - 1)
                                )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft size={15} />
                        </button>

                        <span className="flex h-8 min-w-8 items-center justify-center rounded bg-blue-600 px-2 text-xs font-semibold text-white">
                            {safeCurrentPage}
                        </span>

                        <button
                            type="button"
                            disabled={
                                safeCurrentPage >= totalPages
                            }
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(
                                        totalPages,
                                        prev + 1
                                    )
                                )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            </div>

            {/* SELECTED REQUEST SUMMARY + REMARKS */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                <div className="rounded-lg border border-blue-100 bg-white">

                    <div className="border-b border-blue-100 px-4 py-3">
                        <h2 className="text-sm font-bold">
                            Selected Requests Summary
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 px-4 py-4 text-xs">

                        <SummaryValue
                            label="Total Selected"
                            value={totalSelected}
                        />

                        <SummaryValue
                            label="Total Employees"
                            value={totalEmployees}
                        />

                        <SummaryValue
                            label="Total LWOP Days"
                            value={
                                totalDays > 0
                                    ? totalDays
                                    : "-"
                            }
                        />

                        <SummaryValue
                            label="Selected Status"
                            value={
                                totalSelected > 0
                                    ? "FORWARDED"
                                    : "-"
                            }
                        />
                    </div>
                </div>

                {/* REMARKS */}
                <div className="rounded-lg border border-blue-100 bg-white">

                    <div className="border-b border-blue-100 px-4 py-3">
                        <h2 className="text-sm font-bold">
                            Remarks (Optional)
                        </h2>
                    </div>

                    <div className="px-4 py-4">

                        <textarea
                            value={remarks}
                            onChange={(e) =>
                                setRemarks(
                                    e.target.value.slice(0, 250)
                                )
                            }
                            maxLength={250}
                            rows={3}
                            placeholder="Enter remarks..."
                            className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />

                        <div className="mt-1 flex justify-between text-[11px] text-gray-500">
                            <span>
                                Maximum 250 characters allowed
                            </span>

                            <span>
                                {remarks.length}/250
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM ACTIONS */}
            <div className="mt-4 flex justify-end gap-2">

                <button
                    type="button"
                    onClick={() => {
                        setSelectedIds([]);
                        setRemarks("");
                    }}
                    className="rounded-md border border-blue-200 bg-white px-6 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                >
                    Clear
                </button>

                <button
                    type="button"
                    onClick={() => handleApproval("REJECTED")}
                    disabled={
                        selectedIds.length === 0 ||
                        isApproving ||
                        isRejecting
                    }
                    className="flex items-center gap-2 rounded-md bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <XCircle size={15} />
                    Reject Selected
                </button>

                <button
                    type="button"
                    onClick={() => handleApproval("APPROVED")}
                    disabled={
                        selectedIds.length === 0 ||
                        isApproving ||
                        isRejecting
                    }
                    className="flex items-center gap-2 rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <CheckCircle2 size={15} />
                    Approve Selected
                </button>
            </div>

            {/* INFORMATION */}
            <div className="mt-4 rounded-md border border-blue-100 bg-blue-50/40 p-3">

                <div className="flex gap-2">

                    <Info
                        size={16}
                        className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <div>

                        <p className="text-xs font-bold text-blue-800">
                            Note
                        </p>

                        <p className="mt-1 text-xs text-gray-600">
                            Approved Leave Without Pay requests will
                            be reflected in attendance and payroll.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/* SUMMARY CARD                                                               */
/* -------------------------------------------------------------------------- */

type SummaryCardProps = {
    icon: React.ReactNode;
    title: string;
    value: number;
    iconBg: string;
};

const SummaryCard: React.FC<SummaryCardProps> = ({
    icon,
    title,
    value,
    iconBg,
}) => {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-blue-100 bg-white px-4 py-4">

            <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}
            >
                {icon}
            </div>

            <div>
                <p className="text-[11px] font-bold text-gray-500">
                    {title}
                </p>

                <p className="mt-1 text-xl font-bold text-[#17245B]">
                    {value}
                </p>
            </div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/* SUMMARY VALUE                                                              */
/* -------------------------------------------------------------------------- */

const SummaryValue: React.FC<{
    label: string;
    value: string | number;
}> = ({ label, value }) => {
    return (
        <div className="flex justify-between border-b border-gray-100 pb-2 pr-6">

            <span className="font-medium text-gray-600">
                {label}
            </span>

            <span className="font-bold text-[#17245B]">
                {value}
            </span>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/* STATUS BADGE                                                               */
/* -------------------------------------------------------------------------- */

const StatusBadge: React.FC<{
    status: string;
}> = ({ status }) => {

    const className =
        status === "FORWARDED"
            ? "border-orange-200 bg-orange-50 text-orange-700"
            : status === "APPROVED"
                ? "border-green-200 bg-green-50 text-green-700"
                : status === "REJECTED"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-gray-200 bg-gray-50 text-gray-700";

    return (
        <span
            className={`inline-flex rounded border px-2 py-1 text-[10px] font-bold ${className}`}
        >
            {status}
        </span>
    );
};

export default LeaveWithoutPayRequestList;
