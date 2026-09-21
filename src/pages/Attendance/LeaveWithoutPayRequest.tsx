import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface LeaveWithoutPayRequest {
    requestId: string;
    employeeId: string;
    employeeName: string;
    department: string;
    leaveFrom: string;
    leaveTo: string;
    totalDays: number;
    lwpReason: string;
    leaveBalance: number;
    lwpDaysRequested: number;
    remarks: string;
    forwardedBy: string;
    forwardedDate: string;
    status: "Pending" | "Forwarded" | "Approved" | "Rejected";
}

const mockRequests: LeaveWithoutPayRequest[] = [
    {
        requestId: "LWP250515001",
        employeeId: "10045",
        employeeName: "Rokon Uddin",
        department: "Weaving",
        leaveFrom: "18-May-2025",
        leaveTo: "20-May-2025",
        totalDays: 3,
        lwpReason: "Personal Work",
        leaveBalance: 0,
        lwpDaysRequested: 3,
        remarks: "No leave balance available",
        forwardedBy: "Prod. Manager",
        forwardedDate: "15-May-2025 08:20 AM",
        status: "Pending",
    },
    {
        requestId: "LWP250515002",
        employeeId: "10087",
        employeeName: "Ripon Miah",
        department: "Spinning",
        leaveFrom: "22-May-2025",
        leaveTo: "25-May-2025",
        totalDays: 4,
        lwpReason: "Family Function",
        leaveBalance: 0,
        lwpDaysRequested: 4,
        remarks: "All leave exhausted",
        forwardedBy: "Prod. Manager",
        forwardedDate: "15-May-2025 08:35 AM",
        status: "Pending",
    },
    {
        requestId: "LWP250515003",
        employeeId: "10123",
        employeeName: "Sabina Akter",
        department: "Dyeing",
        leaveFrom: "16-May-2025",
        leaveTo: "18-May-2025",
        totalDays: 3,
        lwpReason: "Personal Reason",
        leaveBalance: 0,
        lwpDaysRequested: 3,
        remarks: "No available leave",
        forwardedBy: "Prod. Manager",
        forwardedDate: "15-May-2025 09:05 AM",
        status: "Pending",
    },
    {
        requestId: "LWP250515004",
        employeeId: "10145",
        employeeName: "Nazma Akter",
        department: "Finishing",
        leaveFrom: "26-May-2025",
        leaveTo: "30-May-2025",
        totalDays: 5,
        lwpReason: "Medical Treatment",
        leaveBalance: 0,
        lwpDaysRequested: 5,
        remarks: "Leave balance nil",
        forwardedBy: "Prod. Manager",
        forwardedDate: "15-May-2025 09:15 AM",
        status: "Pending",
    },
    {
        requestId: "LWP250515005",
        employeeId: "10166",
        employeeName: "Monir Hossain",
        department: "Maintenance",
        leaveFrom: "21-May-2025",
        leaveTo: "21-May-2025",
        totalDays: 1,
        lwpReason: "Urgent Personal Work",
        leaveBalance: 0,
        lwpDaysRequested: 1,
        remarks: "No leave balance",
        forwardedBy: "Prod. Manager",
        forwardedDate: "15-May-2025 09:40 AM",
        status: "Pending",
    },
    {
        requestId: "LWP250515006",
        employeeId: "10178",
        employeeName: "Jannatul Ferdous",
        department: "Quality",
        leaveFrom: "19-May-2025",
        leaveTo: "20-May-2025",
        totalDays: 2,
        lwpReason: "Personal Work",
        leaveBalance: 0,
        lwpDaysRequested: 2,
        remarks: "No leave balance",
        forwardedBy: "Prod. Manager",
        forwardedDate: "15-May-2025 10:00 AM",
        status: "Pending",
    },
    {
        requestId: "LWP250515007",
        employeeId: "10201",
        employeeName: "Shahidul Islam",
        department: "Knitting",
        leaveFrom: "23-May-2025",
        leaveTo: "24-May-2025",
        totalDays: 2,
        lwpReason: "Family Emergency",
        leaveBalance: 0,
        lwpDaysRequested: 2,
        remarks: "Leave exhausted",
        forwardedBy: "Prod. Manager",
        forwardedDate: "15-May-2025 10:20 AM",
        status: "Pending",
    },
    {
        requestId: "LWP250515008",
        employeeId: "10219",
        employeeName: "Morshed Alam",
        department: "Cutting",
        leaveFrom: "27-May-2025",
        leaveTo: "29-May-2025",
        totalDays: 3,
        lwpReason: "Personal Reason",
        leaveBalance: 0,
        lwpDaysRequested: 3,
        remarks: "No available leave",
        forwardedBy: "Prod. Manager",
        forwardedDate: "15-May-2025 10:45 AM",
        status: "Pending",
    },
    {
        requestId: "LWP250515009",
        employeeId: "10244",
        employeeName: "Nasrin Sultana",
        department: "Printing",
        leaveFrom: "30-May-2025",
        leaveTo: "31-May-2025",
        totalDays: 2,
        lwpReason: "Personal Work",
        leaveBalance: 0,
        lwpDaysRequested: 2,
        remarks: "No leave balance",
        forwardedBy: "Prod. Manager",
        forwardedDate: "15-May-2025 11:00 AM",
        status: "Pending",
    },
];

const LeaveWithoutPayRequest: React.FC = () => {
    const navigate = useNavigate();

    const [requests, setRequests] =
        useState<LeaveWithoutPayRequest[]>(mockRequests);

    const [fromDate, setFromDate] = useState("2025-05-01");
    const [toDate, setToDate] = useState("2025-05-31");

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [forwardingAll, setForwardingAll] = useState(false);

    /* ============================================================
       FILTER
    ============================================================ */

    const filteredRequests = useMemo(() => {
        return requests.filter((request) => {
            if (!fromDate && !toDate) {
                return true;
            }

            const parseDate = (value: string) => {
                const [day, monthText, year] = value.split("-");

                const months: Record<string, number> = {
                    Jan: 0,
                    Feb: 1,
                    Mar: 2,
                    Apr: 3,
                    May: 4,
                    Jun: 5,
                    Jul: 6,
                    Aug: 7,
                    Sep: 8,
                    Oct: 9,
                    Nov: 10,
                    Dec: 11,
                };

                return new Date(
                    Number(year),
                    months[monthText],
                    Number(day)
                );
            };

            const requestFrom = parseDate(request.leaveFrom);
            const requestTo = parseDate(request.leaveTo);

            const filterFrom = fromDate
                ? new Date(`${fromDate}T00:00:00`)
                : null;

            const filterTo = toDate
                ? new Date(`${toDate}T23:59:59`)
                : null;

            if (filterFrom && requestTo < filterFrom) {
                return false;
            }

            if (filterTo && requestFrom > filterTo) {
                return false;
            }

            return true;
        });
    }, [requests, fromDate, toDate]);

    /* ============================================================
       PAGINATION
    ============================================================ */

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

    const startEntry =
        filteredRequests.length === 0
            ? 0
            : (safeCurrentPage - 1) * pageSize + 1;

    const endEntry = Math.min(
        safeCurrentPage * pageSize,
        filteredRequests.length
    );

    /* ============================================================
       FILTER HANDLERS
    ============================================================ */

    const handleApply = () => {
        setCurrentPage(1);
    };

    const handleReset = () => {
        setFromDate("");
        setToDate("");
        setCurrentPage(1);
    };

    /* ============================================================
       FORWARD
    ============================================================ */

    const handleForwardSelected = async () => {
        const selectedRequests = requests.filter(
            (request) =>
                selectedIds.includes(request.requestId) &&
                request.status === "Pending"
        );

        if (selectedRequests.length === 0) {
            alert("Please select at least one pending request.");
            return;
        }

        try {
            setForwardingAll(true);

            console.log(
                "Forward selected LWP requests:",
                selectedRequests.map((request) => ({
                    requestId: request.requestId,
                    employeeId: request.employeeId,
                    status: "FORWARDED",
                }))
            );

            await new Promise((resolve) => setTimeout(resolve, 500));

            const selectedRequestIds = selectedRequests.map(
                (request) => request.requestId
            );

            setRequests((previous) =>
                previous.map((item) =>
                    selectedRequestIds.includes(item.requestId)
                        ? {
                            ...item,
                            status: "Forwarded",
                        }
                        : item
                )
            );

            setSelectedIds([]);

            alert(
                `${selectedRequests.length} Leave Without Pay request(s) forwarded successfully.`
            );
        } catch (error) {
            console.error(error);
            alert("Unable to forward selected requests.");
        } finally {
            setForwardingAll(false);
        }
    };

    const handleForwardAll = async () => {
        const pendingRequests = requests.filter(
            (request) => request.status === "Pending"
        );

        if (pendingRequests.length === 0) {
            alert("There are no pending requests to forward.");
            return;
        }

        try {
            setForwardingAll(true);

            console.log(
                "Forward all LWP requests:",
                pendingRequests.map((request) => ({
                    requestId: request.requestId,
                    employeeId: request.employeeId,
                    status: "FORWARDED",
                }))
            );

            await new Promise((resolve) => setTimeout(resolve, 500));

            setRequests((previous) =>
                previous.map((item) =>
                    item.status === "Pending"
                        ? {
                            ...item,
                            status: "Forwarded",
                        }
                        : item
                )
            );

            setSelectedIds([]);

            alert(
                `${pendingRequests.length} Leave Without Pay request(s) forwarded successfully.`
            );
        } catch (error) {
            console.error(error);
            alert("Unable to forward all requests.");
        } finally {
            setForwardingAll(false);
        }
    };

    const handleSelectAll = () => {
        const pendingIds = paginatedRequests
            .filter((request) => request.status === "Pending")
            .map((request) => request.requestId);

        const allSelected = pendingIds.every((id) =>
            selectedIds.includes(id)
        );

        if (allSelected) {
            setSelectedIds((previous) =>
                previous.filter((id) => !pendingIds.includes(id))
            );
        } else {
            setSelectedIds((previous) => [
                ...new Set([...previous, ...pendingIds]),
            ]);
        }
    };

    const handleSelectRow = (requestId: string) => {
        setSelectedIds((previous) =>
            previous.includes(requestId)
                ? previous.filter((id) => id !== requestId)
                : [...previous, requestId]
        );
    };

    /* ============================================================
       REQUEST CARD
    ============================================================ */

    const RequestCard = ({
        title,
        count,
        subtitle,
        icon,
        iconBg,
        iconColor,
        buttonColor,
        onClick,
    }: {
        title: string;
        count: number | string;
        subtitle: string;
        icon: React.ReactNode;
        iconBg: string;
        iconColor: string;
        buttonColor: string;
        onClick?: () => void;
    }) => {
        return (
            <div
                className="
                    rounded-lg
                    border
                    border-gray-100
                    bg-white
                    p-4
                    shadow-sm
                "
            >
                <div className="flex items-start gap-4">
                    <div
                        className={`
                            flex
                            h-14
                            w-14
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            ${iconBg}
                            ${iconColor}
                        `}
                    >
                        <span className="text-3xl">
                            {icon}
                        </span>
                    </div>

                    <div className="min-w-0 flex-1">
                        <div
                            className={`
                                min-h-[40px]
                                text-xs
                                font-bold
                                uppercase
                                leading-5
                                ${iconColor}
                            `}
                        >
                            {title}
                        </div>

                        <div
                            className={`
                                mt-1
                                text-2xl
                                font-bold
                                ${iconColor}
                            `}
                        >
                            {count}
                        </div>

                        <div className="text-[10px] text-gray-600">
                            {subtitle}
                        </div>

                        <button
                            type="button"
                            onClick={onClick}
                            className={`
                                mt-2
                                flex
                                w-full
                                items-center
                                justify-between
                                rounded-md
                                px-3
                                py-1.5
                                text-[10px]
                                font-semibold
                                text-white
                                ${buttonColor}
                            `}
                        >
                            <span>View List</span>
                            <span className="text-base">
                                →
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    /* ============================================================
       RENDER
    ============================================================ */

    return (
        <div className="min-h-screen bg-white text-gray-800">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <header className="bg-[#06247a] text-white">
                <div className="flex min-h-[76px] items-center justify-between px-6">

                    {/* LEFT */}
                    <div className="flex items-center gap-5">

                        <div className="flex items-center gap-3">
                            <div className="text-5xl font-bold">
                                S
                            </div>

                            <div>
                                <div className="text-xl font-bold tracking-wide">
                                    SYNEXIS
                                </div>

                                <div className="text-[9px] text-blue-200">
                                    Creating Enterprise Synergy
                                </div>
                            </div>
                        </div>

                        <div className="h-10 w-px bg-blue-300" />

                        <div>
                            <div className="text-lg font-bold">
                                ATTENDANCE CELL –
                                LEAVE WITHOUT PAY REQUESTS
                            </div>

                            <div className="mt-1 text-xs text-blue-100">
                                HR Branch &nbsp;&gt;&nbsp;
                                Payroll & Workforce Movement
                                &nbsp;&gt;&nbsp;
                                Attendance Cell
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-5">

                        <div
                            className="
                                hidden
                                rounded-md
                                bg-white
                                px-5
                                py-3
                                text-xs
                                font-semibold
                                text-gray-700
                                lg:block
                            "
                        >
                            📅 &nbsp; 15 May 2025 | Thursday
                        </div>

                        <div className="flex items-center gap-2">
                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-white
                                    text-xl
                                    text-[#06247a]
                                "
                            >
                                ●
                            </div>

                            <div className="hidden md:block">
                                <div className="text-xs font-semibold">
                                    Nusrat Jahan
                                </div>

                                <div className="text-[10px] text-blue-200">
                                    Attendance Officer
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="p-4">

                {/* =================================================
                    SHIFT CARDS
                ================================================= */}

                <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">

                    {/* CURRENT SHIFT */}

                    <div
                        className="
                            rounded-lg
                            border
                            border-blue-100
                            bg-white
                            p-4
                            shadow-sm
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                border-b
                                pb-3
                            "
                        >
                            <div>
                                <span className="text-sm font-bold text-blue-700">
                                    1. CURRENT SHIFT
                                </span>

                                <span className="ml-2 text-[10px] font-bold text-gray-600">
                                    (INCOMING)
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span
                                    className="
                                        rounded
                                        bg-green-600
                                        px-3
                                        py-1
                                        text-[10px]
                                        font-bold
                                        text-white
                                    "
                                >
                                    SHIFT A
                                </span>

                                <span className="text-xs font-semibold text-blue-700">
                                    06:00 AM - 02:00 PM
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 divide-x py-5">

                            <div className="text-center">
                                <div className="text-3xl text-green-600">
                                    👥
                                </div>

                                <div className="mt-1 text-[10px] font-bold text-gray-600">
                                    PRESENT
                                </div>

                                <div className="text-2xl font-bold text-green-600">
                                    1,256
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="text-3xl text-red-600">
                                    👤
                                </div>

                                <div className="mt-1 text-[10px] font-bold text-gray-600">
                                    ABSENT
                                </div>

                                <div className="text-2xl font-bold text-red-600">
                                    87
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="text-3xl text-orange-500">
                                    ◷
                                </div>

                                <div className="mt-1 text-[10px] font-bold text-gray-600">
                                    PUNCH MISSING
                                </div>

                                <div className="text-2xl font-bold text-orange-500">
                                    46
                                </div>
                            </div>
                        </div>

                        <div
                            className="
                                rounded-md
                                border
                                border-blue-100
                                bg-blue-50
                                px-3
                                py-2
                                text-[10px]
                                text-blue-700
                            "
                        >
                            <span className="font-bold">
                                ● &nbsp; Last Punch Time:
                            </span>

                            <span className="ml-2 font-bold text-green-600">
                                06:48 AM
                            </span>
                        </div>
                    </div>

                    {/* PREVIOUS SHIFT */}

                    <div
                        className="
                            rounded-lg
                            border
                            border-blue-100
                            bg-white
                            p-4
                            shadow-sm
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                border-b
                                pb-3
                            "
                        >
                            <div>
                                <span className="text-sm font-bold text-blue-700">
                                    2. PREVIOUS SHIFT
                                </span>

                                <span className="ml-2 text-[10px] font-bold text-gray-600">
                                    (OUTGOING)
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span
                                    className="
                                        rounded
                                        bg-blue-600
                                        px-3
                                        py-1
                                        text-[10px]
                                        font-bold
                                        text-white
                                    "
                                >
                                    SHIFT C
                                </span>

                                <span className="text-xs font-semibold text-blue-700">
                                    10:00 PM - 06:00 AM
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 divide-x py-5">

                            <div className="text-center">
                                <div className="text-3xl text-blue-600">
                                    ⇥
                                </div>

                                <div className="mt-1 text-[10px] font-bold text-gray-600">
                                    OUT PUNCH DONE
                                </div>

                                <div className="text-2xl font-bold text-blue-600">
                                    1,184
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="text-3xl text-red-500">
                                    ◷
                                </div>

                                <div className="mt-1 text-[10px] font-bold text-gray-600">
                                    MISSING OUT PUNCH
                                </div>

                                <div className="text-2xl font-bold text-red-500">
                                    32
                                </div>
                            </div>
                        </div>

                        <div
                            className="
                                rounded-md
                                border
                                border-blue-100
                                bg-blue-50
                                px-3
                                py-2
                                text-[10px]
                                font-semibold
                                text-blue-700
                            "
                        >
                            ● &nbsp; Outgoing shift Out Punch entry
                            must be completed before handover.
                        </div>
                    </div>
                </section>

                {/* =================================================
                    REQUEST CARDS
                ================================================= */}

                <section className="mt-4">

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">

                        <RequestCard
                            title="Leave Requests Received"
                            count={18}
                            subtitle="Pending Verification"
                            icon="▣"
                            iconBg="bg-blue-50"
                            iconColor="text-blue-700"
                            buttonColor="bg-blue-600 hover:bg-blue-700"
                        />

                        <RequestCard
                            title="Earned Leave Encashment Requests"
                            count="06"
                            subtitle="Pending Verification"
                            icon="▣"
                            iconBg="bg-green-50"
                            iconColor="text-green-700"
                            buttonColor="bg-green-600 hover:bg-green-700"
                        />

                        <RequestCard
                            title="Maternity Leave Encashment Requests"
                            count="04"
                            subtitle="Pending Verification"
                            icon="♀"
                            iconBg="bg-purple-50"
                            iconColor="text-purple-700"
                            buttonColor="bg-purple-600 hover:bg-purple-700"
                        />

                        <RequestCard
                            title="Exception Requests (From Time Office)"
                            count="11"
                            subtitle="Pending Verification"
                            icon="⚠"
                            iconBg="bg-orange-50"
                            iconColor="text-orange-600"
                            buttonColor="bg-orange-500 hover:bg-orange-600"
                        />

                        <RequestCard
                            title="Leave Without Pay Requests"
                            count="09"
                            subtitle="Pending Verification"
                            icon="◎"
                            iconBg="bg-cyan-50"
                            iconColor="text-cyan-600"
                            buttonColor="bg-cyan-600 hover:bg-cyan-700"
                            onClick={() => {
                                // Already on this page.
                                navigate(
                                    "/attendance-cell/leave-without-pay-request"
                                );
                            }}
                        />
                    </div>
                </section>

                {/* =================================================
                    TABLE SECTION
                ================================================= */}

                <section
                    className="
                        mt-4
                        rounded-lg
                        border
                        border-gray-100
                        bg-white
                        shadow-sm
                    "
                >

                    {/* TABLE HEADER */}

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            border-b
                            px-6
                            py-4
                        "
                    >
                        <div>
                            <h2 className="text-sm font-bold uppercase text-blue-900">
                                Leave Without Pay Requests Received
                                From Production Floor
                            </h2>
                        </div>

                        <div className="text-xs font-semibold text-gray-600">
                            Total Requests:{" "}
                            <span className="text-green-600">
                                {filteredRequests.length}
                            </span>
                        </div>
                    </div>

                    {/* FILTERS */}

                    <div className="flex flex-wrap items-end gap-4 px-6 py-4">

                        {/* FROM DATE */}

                        <div className="w-[200px]">
                            <label className="mb-1 block text-[10px] font-semibold text-blue-900">
                                From Date
                            </label>

                            <input
                                type="date"
                                value={fromDate}
                                onChange={(event) => {
                                    setFromDate(event.target.value);
                                    setCurrentPage(1);
                                }}
                                className="
                                    h-9
                                    w-full
                                    rounded-md
                                    border
                                    border-gray-300
                                    px-3
                                    text-xs
                                    text-gray-700
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-1
                                    focus:ring-blue-500
                                "
                            />
                        </div>

                        {/* TO DATE */}

                        <div className="w-[200px]">
                            <label className="mb-1 block text-[10px] font-semibold text-blue-900">
                                To Date
                            </label>

                            <input
                                type="date"
                                value={toDate}
                                onChange={(event) => {
                                    setToDate(event.target.value);
                                    setCurrentPage(1);
                                }}
                                className="
                                    h-9
                                    w-full
                                    rounded-md
                                    border
                                    border-gray-300
                                    px-3
                                    text-xs
                                    text-gray-700
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-1
                                    focus:ring-blue-500
                                "
                            />
                        </div>

                        {/* APPLY */}

                        <button
                            type="button"
                            onClick={handleApply}
                            className="
                                h-9
                                rounded-md
                                bg-blue-600
                                px-5
                                text-xs
                                font-semibold
                                text-white
                                hover:bg-blue-700
                            "
                        >
                            ✈ Apply
                        </button>

                        {/* RESET */}

                        <button
                            type="button"
                            onClick={handleReset}
                            className="
                                h-9
                                rounded-md
                                border
                                border-blue-300
                                bg-white
                                px-5
                                text-xs
                                font-semibold
                                text-blue-600
                                hover:bg-blue-50
                            "
                        >
                            ↻ Reset
                        </button>
                    </div>

                    {/* =================================================
                        TABLE
                    ================================================= */}

                    <div className="overflow-x-auto px-4">

                        <table className="min-w-[1450px] w-full border-collapse">

                            <thead>
                                <tr className="bg-gray-50">

                                    <th className="px-3 py-3 text-left text-[9px] font-bold text-gray-600">
                                        #
                                    </th>

                                    <th className="px-3 py-3 text-left text-[9px] font-bold text-gray-600">
                                        Req. No.
                                    </th>

                                    <th className="px-3 py-3 text-left text-[9px] font-bold text-gray-600">
                                        Emp ID
                                    </th>

                                    <th className="px-3 py-3 text-left text-[9px] font-bold text-gray-600">
                                        Employee Name
                                    </th>

                                    <th className="px-3 py-3 text-left text-[9px] font-bold text-gray-600">
                                        Department
                                    </th>

                                    <th className="px-3 py-3 text-left text-[9px] font-bold text-gray-600">
                                        Leave From
                                    </th>

                                    <th className="px-3 py-3 text-left text-[9px] font-bold text-gray-600">
                                        Leave To
                                    </th>

                                    <th className="px-3 py-3 text-center text-[9px] font-bold text-gray-600">
                                        Total Days
                                    </th>

                                    <th className="px-3 py-3 text-left text-[9px] font-bold text-gray-600">
                                        LWP Reason
                                    </th>

                                    <th className="px-3 py-3 text-center text-[9px] font-bold text-gray-600">
                                        Leave Balance
                                        <br />
                                        (EL + CL + SL)
                                    </th>

                                    <th className="px-3 py-3 text-center text-[9px] font-bold text-gray-600">
                                        LWP Days
                                        <br />
                                        Requested
                                    </th>

                                    <th className="px-3 py-3 text-left text-[9px] font-bold text-gray-600">
                                        Remarks
                                    </th>

                                    <th className="px-3 py-3 text-left text-[9px] font-bold text-gray-600">
                                        Forwarded By
                                        <br />
                                        (Production)
                                    </th>

                                    <th className="px-3 py-3 text-center text-[9px] font-bold text-gray-600">
                                        Forwarded Date
                                        <br />
                                        & Time
                                    </th>

                                    <th className="px-3 py-3 text-center text-[9px] font-bold text-gray-600">
                                        Status
                                    </th>

                                    <th className="px-3 py-3 text-center text-[9px] font-bold text-gray-600">
                                        <input
                                            type="checkbox"
                                            checked={
                                                paginatedRequests.filter(
                                                    (request) => request.status === "Pending"
                                                ).length > 0 &&
                                                paginatedRequests
                                                    .filter((request) => request.status === "Pending")
                                                    .every((request) =>
                                                        selectedIds.includes(request.requestId)
                                                    )
                                            }
                                            onChange={handleSelectAll}
                                            className="h-3.5 w-3.5"
                                        />
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {paginatedRequests.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={16}
                                            className="
                                                py-10
                                                text-center
                                                text-xs
                                                text-gray-500
                                            "
                                        >
                                            No Leave Without Pay
                                            requests found.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedRequests.map(
                                        (request, index) => (
                                            <tr
                                                key={
                                                    request.requestId
                                                }
                                                className="hover:bg-blue-50"
                                            >

                                                <td className="px-3 py-3 text-center text-[9px]">
                                                    {(safeCurrentPage -
                                                        1) *
                                                        pageSize +
                                                        index +
                                                        1}
                                                </td>

                                                <td className="px-3 py-3 text-[9px] font-semibold text-blue-700">
                                                    {
                                                        request.requestId
                                                    }
                                                </td>

                                                <td className="px-3 py-3 text-[9px]">
                                                    {
                                                        request.employeeId
                                                    }
                                                </td>

                                                <td className="px-3 py-3 text-[9px] font-semibold">
                                                    {
                                                        request.employeeName
                                                    }
                                                </td>

                                                <td className="px-3 py-3 text-[9px]">
                                                    {
                                                        request.department
                                                    }
                                                </td>

                                                <td className="px-3 py-3 text-[9px]">
                                                    {
                                                        request.leaveFrom
                                                    }
                                                </td>

                                                <td className="px-3 py-3 text-[9px]">
                                                    {
                                                        request.leaveTo
                                                    }
                                                </td>

                                                <td className="px-3 py-3 text-center text-[9px]">
                                                    {
                                                        request.totalDays
                                                    }
                                                    .0
                                                </td>

                                                <td className="px-3 py-3 text-[9px]">
                                                    {
                                                        request.lwpReason
                                                    }
                                                </td>

                                                <td className="px-3 py-3 text-center text-[9px] font-bold text-red-500">
                                                    {request.leaveBalance.toFixed(
                                                        1
                                                    )}
                                                </td>

                                                <td className="px-3 py-3 text-center text-[9px]">
                                                    {
                                                        request.lwpDaysRequested
                                                    }
                                                    .0
                                                </td>

                                                <td className="px-3 py-3 text-[9px]">
                                                    {
                                                        request.remarks
                                                    }
                                                </td>

                                                <td className="px-3 py-3 text-[9px]">
                                                    {
                                                        request.forwardedBy
                                                    }
                                                </td>

                                                <td className="px-3 py-3 text-center text-[9px]">
                                                    {request.forwardedDate
                                                        .split(" ")
                                                        .map(
                                                            (
                                                                value,
                                                                i
                                                            ) => (
                                                                <React.Fragment
                                                                    key={
                                                                        i
                                                                    }
                                                                >
                                                                    {i >
                                                                        0 && (
                                                                            <br />
                                                                        )}
                                                                    {
                                                                        value
                                                                    }
                                                                </React.Fragment>
                                                            )
                                                        )}
                                                </td>

                                                <td className="px-3 py-3 text-center">
                                                    <span
                                                        className={`
                                                            inline-flex
                                                            rounded-md
                                                            px-2
                                                            py-1
                                                            text-[9px]
                                                            font-semibold
                                                            ${request.status ===
                                                                "Pending"
                                                                ? "bg-orange-100 text-orange-600"
                                                                : request.status ===
                                                                    "Forwarded"
                                                                    ? "bg-blue-100 text-blue-600"
                                                                    : request.status ===
                                                                        "Approved"
                                                                        ? "bg-green-100 text-green-600"
                                                                        : "bg-red-100 text-red-600"
                                                            }
                                                        `}
                                                    >
                                                        {
                                                            request.status
                                                        }
                                                    </span>
                                                </td>

                                                <td className="px-3 py-3 text-center">
                                                    {request.status === "Pending" ? (
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedIds.includes(request.requestId)}
                                                            onChange={() =>
                                                                handleSelectRow(request.requestId)
                                                            }
                                                            className="h-3.5 w-3.5"
                                                        />
                                                    ) : (
                                                        <span className="text-[9px] text-gray-400">
                                                            —
                                                        </span>
                                                    )}

                                                </td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* =================================================
                        TABLE FOOTER / PAGINATION
                    ================================================= */}

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            border-t
                            px-6
                            py-3
                        "
                    >

                        <div className="text-[10px] text-gray-600">
                            Showing{" "}
                            <span className="font-semibold">
                                {startEntry}
                            </span>{" "}
                            to{" "}
                            <span className="font-semibold">
                                {endEntry}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold">
                                {filteredRequests.length}
                            </span>{" "}
                            entries
                        </div>

                        <div className="flex items-center gap-1">

                            {/* PREVIOUS */}

                            <button
                                type="button"
                                disabled={safeCurrentPage === 1}
                                onClick={() =>
                                    setCurrentPage(
                                        (page) =>
                                            Math.max(
                                                1,
                                                page - 1
                                            )
                                    )
                                }
                                className="
                                    flex
                                    h-7
                                    w-7
                                    items-center
                                    justify-center
                                    rounded
                                    text-xs
                                    text-blue-600
                                    hover:bg-blue-50
                                    disabled:cursor-not-allowed
                                    disabled:text-gray-300
                                "
                            >
                                ‹
                            </button>

                            {/* PAGE NUMBERS */}

                            {Array.from(
                                { length: totalPages },
                                (_, index) => index + 1
                            ).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage(page)
                                    }
                                    className={`
                                        flex
                                        h-7
                                        min-w-7
                                        items-center
                                        justify-center
                                        rounded
                                        px-2
                                        text-[10px]
                                        font-semibold
                                        ${page ===
                                            safeCurrentPage
                                            ? "bg-blue-600 text-white"
                                            : "text-blue-600 hover:bg-blue-50"
                                        }
                                    `}
                                >
                                    {page}
                                </button>
                            ))}

                            {/* NEXT */}

                            <button
                                type="button"
                                disabled={
                                    safeCurrentPage ===
                                    totalPages
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        (page) =>
                                            Math.min(
                                                totalPages,
                                                page + 1
                                            )
                                    )
                                }
                                className="
                                    flex
                                    h-7
                                    w-7
                                    items-center
                                    justify-center
                                    rounded
                                    text-xs
                                    text-blue-600
                                    hover:bg-blue-50
                                    disabled:cursor-not-allowed
                                    disabled:text-gray-300
                                "
                            >
                                ›
                            </button>
                        </div>
                    </div>
                </section>
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={handleForwardSelected}
                        disabled={selectedIds.length === 0 || forwardingAll}
                        className="
                        rounded-md
                        bg-blue-600
                        px-4
                        py-2
                        text-[10px]
                        font-semibold
                        text-white
                        hover:bg-blue-700
                        disabled:cursor-not-allowed
                        disabled:opacity-50"
                    >
                        {forwardingAll ? "Forwarding..." : "✈ Forward Selected"}
                    </button>

                    <button
                        type="button"
                        onClick={handleForwardAll}
                        disabled={
                            forwardingAll ||
                            !requests.some((request) => request.status === "Pending")
                        }
                        className="
                        rounded-md
                        bg-green-600
                        px-4
                        py-2
                        text-[10px]
                        font-semibold
                        text-white
                        hover:bg-green-700
                        disabled:cursor-not-allowed
                        disabled:opacity-50"
                    >
                        ✈ Forward All
                    </button>

                    <div className="ml-2 text-xs font-semibold text-gray-600">
                        Total Requests:{" "}
                        <span className="text-green-600">
                            {filteredRequests.length}
                        </span>
                    </div>
                </div>

                {/* =================================================
                    BACK BUTTON
                ================================================= */}

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="
                        mt-4
                        rounded-md
                        border
                        border-blue-200
                        bg-white
                        px-4
                        py-2
                        text-[10px]
                        font-semibold
                        text-blue-700
                        hover:bg-blue-50
                    "
                >
                    ← &nbsp; Back to Section Dashboard
                </button>
            </main>

        </div>
    );
};

export default LeaveWithoutPayRequest;
