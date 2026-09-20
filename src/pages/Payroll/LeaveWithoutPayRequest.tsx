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
    Send,
    XCircle,
    Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import CommonInputField from "../../components/CommonInputFields";
// Adjust this import path according to your project structure.

export type LeaveWithoutPayRequest = {
    requestId: string;
    appliedOn: string;

    employeeId: string;
    employeeName: string;
    department: string;

    leaveWithoutPayType: string;
    leaveFrom: string;
    leaveTo: string;
    totalDays: number;

    reason: string;
    contactDuringLeave: string;

    submittedBy: string;
    submittedOn: string;

    status: "Pending" | "Approved" | "Rejected";

    forwardedBy: string;
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

/* -------------------------------------------------------------------------- */
/* MOCK DATA                                                                  */
/* -------------------------------------------------------------------------- */

export const mockRequests: LeaveWithoutPayRequest[] = [
    {
        requestId: "LWPR2505003",
        appliedOn: "14-May-2025 10:30 AM",

        employeeId: "10145",
        employeeName: "Md. Rashedul Islam",
        department: "Weaving",

        leaveWithoutPayType: "Full Day(s)",
        leaveFrom: "20-May-2025",
        leaveTo: "27-May-2025",
        totalDays: 8,

        reason: "Going to village for family matter.",
        contactDuringLeave: "01712-345678",

        submittedBy: "Production Floor",
        submittedOn: "14-May-2025 09:40 AM",

        status: "Pending",

        forwardedBy: "Production Floor",
    },

    {
        requestId: "LWPR2505004",
        appliedOn: "14-May-2025 11:15 AM",

        employeeId: "10234",
        employeeName: "Abdul Karim",
        department: "Spinning",

        leaveWithoutPayType: "Full Day(s)",
        leaveFrom: "18-May-2025",
        leaveTo: "20-May-2025",
        totalDays: 3,

        reason: "Personal emergency at home.",
        contactDuringLeave: "01811-223344",

        submittedBy: "Spinning Floor",
        submittedOn: "14-May-2025 10:20 AM",

        status: "Pending",

        forwardedBy: "Spinning Floor",
    },

    {
        requestId: "LWPR2505005",
        appliedOn: "13-May-2025 03:10 PM",

        employeeId: "10267",
        employeeName: "Rina Parvin",
        department: "Finishing",

        leaveWithoutPayType: "Full Day(s)",
        leaveFrom: "21-May-2025",
        leaveTo: "23-May-2025",
        totalDays: 3,

        reason: "Family medical emergency.",
        contactDuringLeave: "01922-334455",

        submittedBy: "Finishing Floor",
        submittedOn: "13-May-2025 02:35 PM",

        status: "Pending",

        forwardedBy: "Finishing Floor",
    },

    {
        requestId: "LWPR2505006",
        appliedOn: "13-May-2025 04:20 PM",

        employeeId: "10312",
        employeeName: "Shahana Akter",
        department: "Quality",

        leaveWithoutPayType: "Half Day",
        leaveFrom: "19-May-2025",
        leaveTo: "19-May-2025",
        totalDays: 0.5,

        reason: "Personal work.",
        contactDuringLeave: "01611-556677",

        submittedBy: "Quality Floor",
        submittedOn: "13-May-2025 03:50 PM",

        status: "Pending",

        forwardedBy: "Quality Floor",
    },

    {
        requestId: "LWPR2505007",
        appliedOn: "12-May-2025 09:25 AM",

        employeeId: "103245",
        employeeName: "Jamal Uddin",
        department: "Washing",

        leaveWithoutPayType: "Full Day(s)",
        leaveFrom: "22-May-2025",
        leaveTo: "25-May-2025",
        totalDays: 4,

        reason: "Traveling outside Dhaka.",
        contactDuringLeave: "01755-778899",

        submittedBy: "Washing Floor",
        submittedOn: "12-May-2025 09:00 AM",

        status: "Pending",

        forwardedBy: "Washing Floor",
    },

    {
        requestId: "LWPR2505008",
        appliedOn: "12-May-2025 11:10 AM",

        employeeId: "103678",
        employeeName: "Pushpa Rani",
        department: "Cutting",

        leaveWithoutPayType: "Full Day(s)",
        leaveFrom: "24-May-2025",
        leaveTo: "28-May-2025",
        totalDays: 5,

        reason: "Family function.",
        contactDuringLeave: "01844-889900",

        submittedBy: "Cutting Floor",
        submittedOn: "12-May-2025 10:45 AM",

        status: "Pending",

        forwardedBy: "Cutting Floor",
    },

    {
        requestId: "LWPR2505009",
        appliedOn: "11-May-2025 01:30 PM",

        employeeId: "102913",
        employeeName: "Shofiqul Islam",
        department: "Dyeing",

        leaveWithoutPayType: "Full Day(s)",
        leaveFrom: "26-May-2025",
        leaveTo: "29-May-2025",
        totalDays: 4,

        reason: "Urgent personal matter.",
        contactDuringLeave: "01799-112233",

        submittedBy: "Dyeing Floor",
        submittedOn: "11-May-2025 01:10 PM",

        status: "Approved",

        forwardedBy: "Dyeing Floor",
    },
];

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

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
            status: "Pending",
            leaveFrom: "",
            leaveTo: "",
        },
    });

    /* ------------------------------------------------------------------------ */
    /* STATE                                                                    */
    /* ------------------------------------------------------------------------ */

    const [selectedIds, setSelectedIds] = useState<string[]>(
        []
    );

    const [currentPage, setCurrentPage] = useState(1);

    const [pageSize, setPageSize] = useState(10);

    const [remarks, setRemarks] = useState("");

    const [, setSearched] = useState(false);

    /* ------------------------------------------------------------------------ */
    /* FILTER VALUES                                                            */
    /* ------------------------------------------------------------------------ */

    const filters = watch();

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
        { label: "Full Day(s)", value: "Full Day(s)" },
        { label: "Half Day", value: "Half Day" },
    ];

    const statusOptions = [
        { label: "Pending", value: "Pending" },
        { label: "All", value: "" },
        { label: "Approved", value: "Approved" },
        { label: "Rejected", value: "Rejected" },
    ];

    /* ------------------------------------------------------------------------ */
    /* FILTER DATA                                                              */
    /* ------------------------------------------------------------------------ */

    const filteredRequests = useMemo(() => {
        return mockRequests.filter((request) => {
            const requestIdMatch =
                !filters.requestId ||
                request.requestId
                    .toLowerCase()
                    .includes(filters.requestId.toLowerCase());

            const employeeMatch =
                !filters.employeeIdName ||
                request.employeeId
                    .toLowerCase()
                    .includes(
                        filters.employeeIdName.toLowerCase()
                    ) ||
                request.employeeName
                    .toLowerCase()
                    .includes(
                        filters.employeeIdName.toLowerCase()
                    );

            const departmentMatch =
                !filters.department ||
                request.department === filters.department;

            const leaveTypeMatch =
                !filters.leaveWithoutPayType ||
                request.leaveWithoutPayType ===
                filters.leaveWithoutPayType;

            const statusMatch =
                !filters.status ||
                request.status === filters.status;

            return (
                requestIdMatch &&
                employeeMatch &&
                departmentMatch &&
                leaveTypeMatch &&
                statusMatch
            );
        });
    }, [filters]);

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
        visibleIds.every((id) =>
            selectedIds.includes(id)
        );

    const handleSelectAll = () => {
        if (allVisibleSelected) {
            setSelectedIds((prev) =>
                prev.filter(
                    (id) => !visibleIds.includes(id)
                )
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
                return prev.filter(
                    (id) => id !== requestId
                );
            }

            return [...prev, requestId];
        });
    };

    /* ------------------------------------------------------------------------ */
    /* SELECTED REQUESTS                                                        */
    /* ------------------------------------------------------------------------ */

    const selectedRequests = useMemo(() => {
        return mockRequests.filter((request) =>
            selectedIds.includes(request.requestId)
        );
    }, [selectedIds]);

    const totalSelected = selectedRequests.length;

    const totalEmployees = new Set(
        selectedRequests.map(
            (request) => request.employeeId
        )
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
        setSearched(true);
    };

    const handleClear = () => {
        reset({
            requestId: "",
            employeeIdName: "",
            department: "",
            leaveWithoutPayType: "",
            status: "Pending",
            leaveFrom: "",
            leaveTo: "",
        });

        setSelectedIds([]);
        setCurrentPage(1);
        setRemarks("");
        setSearched(false);
    };

    /* ------------------------------------------------------------------------ */
    /* VIEW DETAILS                                                             */
    /* ------------------------------------------------------------------------ */

    const handleViewRequest = (
        requestId: string
    ) => {
        navigate(
            `/payroll-and-workforce-movement/attendance-cell/leave-without-pay-request/${requestId}`
        );
    };

    /* ------------------------------------------------------------------------ */
    /* FORWARD / APPROVE                                                        */
    /* ------------------------------------------------------------------------ */

    const handleForwardSelected = () => {
        if (selectedIds.length === 0) {
            alert(
                "Please select at least one request."
            );
            return;
        }

        console.log(
            "Forward Leave Without Pay Requests",
            {
                requestIds: selectedIds,
                remarks,
            }
        );

        alert(
            `${selectedIds.length} request(s) forwarded successfully.`
        );
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
    /* RENDER                                                                   */
    /* ------------------------------------------------------------------------ */

    return (
        <div className="min-h-screen bg-white px-4 py-4 text-[#17245B]">
            {/* ================================================================== */}
            {/* PAGE HEADER                                                        */}
            {/* ================================================================== */}

            <header className="h-[59px] bg-[#082b87] px-5 text-white">
                <div className="flex h-full items-center justify-between">
                    <div className="flex h-full items-center">
                        {/* Logo */}

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
                                Normal Exception Requests
                            </div>
                        </div>
                    </div>

                    {/* Header Right */}

                    <div className="flex items-center gap-4">
                        <div className="flex h-[32px] items-center gap-2 rounded bg-white px-3 text-[10px] font-semibold text-[#17275c]">
                            <CalendarDays size={14} />

                            15 May 2025 | Thursday
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
                        onClick={handleForwardSelected}
                        disabled={selectedIds.length === 0}
                        className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Send size={15} />
                        Forward Selected
                    </button>
                </div>
            </div>

            {/* ================================================================== */}
            {/* SUMMARY CARDS                                                      */}
            {/* ================================================================== */}

            <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-4">
                <SummaryCard
                    icon={
                        <FileText
                            size={20}
                            className="text-blue-600"
                        />
                    }
                    title="TOTAL REQUESTS"
                    value={mockRequests.length}
                    iconBg="bg-blue-50"
                />

                <SummaryCard
                    icon={
                        <Clock3
                            size={20}
                            className="text-orange-500"
                        />
                    }
                    title="PENDING WITH ME"
                    value={
                        mockRequests.filter(
                            (r) => r.status === "Pending"
                        ).length
                    }
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
                    value={
                        mockRequests.filter(
                            (r) => r.status === "Approved"
                        ).length
                    }
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
                    value={
                        mockRequests.filter(
                            (r) => r.status === "Rejected"
                        ).length
                    }
                    iconBg="bg-red-50"
                />
            </div>

            {/* ================================================================== */}
            {/* SEARCH & FILTER                                                    */}
            {/* ================================================================== */}

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
                        label="LWOP Type"
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

            {/* ================================================================== */}
            {/* REQUEST TABLE                                                       */}
            {/* ================================================================== */}

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
                                {/* IMPORTANT: FAR LEFT CHECKBOX */}
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
                                    Applied On
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
                                    LWOP Type
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
                                    Submitted By
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
                                        No leave without pay requests
                                        found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedRequests.map(
                                    (request) => {
                                        const checked =
                                            selectedIds.includes(
                                                request.requestId
                                            );

                                        return (
                                            <tr
                                                key={request.requestId}
                                                className={`border-b border-gray-100 hover:bg-blue-50/40 ${checked
                                                        ? "bg-blue-50"
                                                        : ""
                                                    }`}
                                            >
                                                {/* FAR LEFT CHECKBOX */}
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
                                                    {request.appliedOn}
                                                </td>

                                                <td className="px-3 py-3">
                                                    {request.employeeId}
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-3 font-medium">
                                                    {request.employeeName}
                                                </td>

                                                <td className="px-3 py-3">
                                                    {request.department}
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-3">
                                                    {request.leaveWithoutPayType}
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-3">
                                                    {request.leaveFrom}
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-3">
                                                    {request.leaveTo}
                                                </td>

                                                <td className="px-3 py-3 font-semibold">
                                                    {request.totalDays}
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-3">
                                                    {request.submittedBy}
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
                                    }
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ---------------------------------------------------------------- */}
                {/* TABLE FOOTER                                                     */}
                {/* ---------------------------------------------------------------- */}

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

            {/* ================================================================== */}
            {/* SELECTED REQUEST SUMMARY + REMARKS                                 */}
            {/* ================================================================== */}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* Selected Summary */}
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
                                    ? "Pending Review"
                                    : "-"
                            }
                        />
                    </div>
                </div>

                {/* Remarks */}
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
                            placeholder="Enter remarks before forwarding..."
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

            {/* ================================================================== */}
            {/* BOTTOM ACTIONS                                                      */}
            {/* ================================================================== */}

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
                    onClick={handleForwardSelected}
                    disabled={selectedIds.length === 0}
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Forward Selected
                    <Send size={15} />
                </button>
            </div>

            {/* ================================================================== */}
            {/* IMPORTANT INFORMATION                                               */}
            {/* ================================================================== */}

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
    status: LeaveWithoutPayRequest["status"];
}> = ({ status }) => {
    const className =
        status === "Pending"
            ? "border-orange-200 bg-orange-50 text-orange-700"
            : status === "Approved"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700";

    return (
        <span
            className={`inline-flex rounded border px-2 py-1 text-[10px] font-bold ${className}`}
        >
            {status}
        </span>
    );
};

export default LeaveWithoutPayRequestList;