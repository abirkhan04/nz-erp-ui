import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Check,
    ChevronDown,
    Clock3,
    Info,
    Monitor,
    Plus,
    RefreshCw,
    Send,
    ShieldAlert,
    Trash2,
    UserRound,
    Users,
    XCircle,
    Eye,
    LogIn,
    LogOut,
    ArrowLeft
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

interface OTRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    otHours: number;
    requestedBy: string;
    status: "Pending" | "Approved" | "Rejected";
}

interface ExceptionItem {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    exceptionType: string;
    time: string;
    reason: string;
}

interface ExceptionForm {
    employeeId: string;
    employeeName: string;
    department: string;
    exceptionType: string;
    time: string;
    reason: string;
}

/* =========================================================
   MOCK DATA
========================================================= */

const initialOTRequests: OTRequest[] = [
    {
        id: "1",
        employeeId: "N2T25050123",
        employeeName: "Abdul Karim",
        department: "Weaving",
        otHours: 2,
        requestedBy: "Prod. Manager",
        status: "Pending",
    },
    {
        id: "2",
        employeeId: "N2T25050124",
        employeeName: "Rahim Uddin",
        department: "Weaving",
        otHours: 4,
        requestedBy: "Prod. Manager",
        status: "Pending",
    },
    {
        id: "3",
        employeeId: "N2T25050125",
        employeeName: "Jalal Ahmed",
        department: "Spinning",
        otHours: 2,
        requestedBy: "Prod. Manager",
        status: "Pending",
    },
    {
        id: "4",
        employeeId: "N2T25050126",
        employeeName: "Monir Hossain",
        department: "Spinning",
        otHours: 4,
        requestedBy: "Prod. Manager",
        status: "Pending",
    },
    {
        id: "5",
        employeeId: "N2T25050127",
        employeeName: "Rashed Ali",
        department: "Weaving",
        otHours: 2,
        requestedBy: "Prod. Manager",
        status: "Pending",
    },
    {
        id: "6",
        employeeId: "N2T25050128",
        employeeName: "Shakil Ahmed",
        department: "Dyeing",
        otHours: 3,
        requestedBy: "Prod. Manager",
        status: "Pending",
    },
    {
        id: "7",
        employeeId: "N2T25050129",
        employeeName: "Farzana Begum",
        department: "Finishing",
        otHours: 2,
        requestedBy: "Prod. Manager",
        status: "Pending",
    },
    {
        id: "8",
        employeeId: "N2T25050130",
        employeeName: "Mahbub Alam",
        department: "Weaving",
        otHours: 3,
        requestedBy: "Prod. Manager",
        status: "Pending",
    },
    {
        id: "9",
        employeeId: "N2T25050131",
        employeeName: "Imran Hossain",
        department: "Spinning",
        otHours: 2,
        requestedBy: "Prod. Manager",
        status: "Pending",
    },
    {
        id: "10",
        employeeId: "N2T25050132",
        employeeName: "Saddam Hossain",
        department: "Weaving",
        otHours: 3,
        requestedBy: "Prod. Manager",
        status: "Pending",
    },
    {
        id: "11",
        employeeId: "N2T25050133",
        employeeName: "Shafiq Ahmed",
        department: "Dyeing",
        otHours: 2,
        requestedBy: "Prod. Manager",
        status: "Pending",
    },
    {
        id: "12",
        employeeId: "N2T25050134",
        employeeName: "Asif Iqbal",
        department: "Finishing",
        otHours: 4,
        requestedBy: "Prod. Manager",
        status: "Pending",
    },
];

const initialExceptions: ExceptionItem[] = [
    {
        id: "1",
        employeeId: "N2T25050135",
        employeeName: "Nazmul Islam",
        department: "Weaving",
        exceptionType: "Machine Failure",
        time: "05:50 AM",
        reason: "Motor Breakdown",
    },
    {
        id: "2",
        employeeId: "N2T25050136",
        employeeName: "Habibur Rahman",
        department: "Spinning",
        exceptionType: "Power Failure",
        time: "06:00 AM",
        reason: "Power Issue",
    },
    {
        id: "3",
        employeeId: "N2T25050137",
        employeeName: "Sharmin Akter",
        department: "Finishing",
        exceptionType: "Official Duty",
        time: "06:20 AM",
        reason: "Official Work",
    },
    {
        id: "4",
        employeeId: "N2T25050138",
        employeeName: "Ibrahim Khalil",
        department: "Dyeing",
        exceptionType: "Medical Emergency",
        time: "05:45 AM",
        reason: "Hospital Visit",
    },
];

/* =========================================================
   COMPONENT
========================================================= */

const TimeOfficeDashboard: React.FC = () => {
    const navigate = useNavigate();

    /* =========================================================
       OT REQUEST STATE
    ========================================================= */

    const [otRequests, setOTRequests] =
        useState<OTRequest[]>(initialOTRequests);

    const [selectedOTIds, setSelectedOTIds] =
        useState<string[]>([]);

    /* =========================================================
       EXCEPTION STATE
    ========================================================= */

    const [exceptions, setExceptions] =
        useState<ExceptionItem[]>(initialExceptions);

    const [exceptionForm, setExceptionForm] =
        useState<ExceptionForm>({
            employeeId: "",
            employeeName: "",
            department: "",
            exceptionType: "",
            time: "",
            reason: "",
        });

    /* =========================================================
       HEADER
    ========================================================= */

    const selectedDate = "15-May-2025";

    /* =========================================================
       SELECTED OT REQUESTS
    ========================================================= */

    const allSelected =
        otRequests.length > 0 &&
        selectedOTIds.length === otRequests.length;

    const selectedCount = selectedOTIds.length;

    /* =========================================================
       OT SELECTION
    ========================================================= */

    const toggleOTSelection = (id: string) => {
        setSelectedOTIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id],
        );
    };

    /* =========================================================
       APPROVE SELECTED
    ========================================================= */

    const handleApproveSelected = () => {
        if (selectedOTIds.length === 0) {
            return;
        }

        setOTRequests((prev) =>
            prev.map((request) =>
                selectedOTIds.includes(request.id)
                    ? {
                        ...request,
                        status: "Approved",
                    }
                    : request,
            ),
        );

        setSelectedOTIds([]);
    };

    /* =========================================================
       APPROVE ALL
    ========================================================= */

    const handleApproveAll = () => {
        if (allSelected) {
            setSelectedOTIds([]);
        } else {
            setSelectedOTIds(
                otRequests.map((request) => request.id),
            );
        }
    };

    /* =========================================================
       PENDING COUNT
    ========================================================= */

    const pendingCount = useMemo(
        () =>
            otRequests.filter(
                (item) => item.status === "Pending",
            ).length,
        [otRequests],
    );

    /* =========================================================
       ADD EXCEPTION
    ========================================================= */

    const handleExceptionChange = (
        field: keyof ExceptionForm,
        value: string,
    ) => {
        setExceptionForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAddException = () => {
        if (
            !exceptionForm.employeeId ||
            !exceptionForm.exceptionType ||
            !exceptionForm.time ||
            !exceptionForm.reason
        ) {
            return;
        }

        const newException: ExceptionItem = {
            id: String(Date.now()),
            employeeId: exceptionForm.employeeId,
            employeeName:
                exceptionForm.employeeName || "-",
            department:
                exceptionForm.department || "-",
            exceptionType:
                exceptionForm.exceptionType,
            time: exceptionForm.time,
            reason: exceptionForm.reason,
        };

        setExceptions((prev) => [
            ...prev,
            newException,
        ]);

        setExceptionForm({
            employeeId: "",
            employeeName: "",
            department: "",
            exceptionType: "",
            time: "",
            reason: "",
        });
    };

    /* =========================================================
       DELETE EXCEPTION
    ========================================================= */

    const handleDeleteException = (id: string) => {
        setExceptions((prev) =>
            prev.filter((item) => item.id !== id),
        );
    };

    /* =========================================================
       REFRESH
    ========================================================= */

    const handleRefresh = () => {
        console.log("Refreshing Time Office data...");
    };

    /* =========================================================
       VIEW HARD COPY
    ========================================================= */

    const handleViewHardCopy = () => {
        console.log("View hard copy");
    };

    /* =========================================================
       FORWARD EXCEPTIONS
    ========================================================= */

    const handleForwardExceptions = () => {
        if (exceptions.length === 0) {
            return;
        }

        console.log(
            "Forward Exceptions:",
            exceptions,
        );
    };

    return (
        <div className="min-h-screen bg-white text-[#101b4b]">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <header className="h-[64px] bg-[#020b3d] px-6 text-white">

                <div className="flex h-full items-center">

                    {/* LOGO */}

                    <div className="flex items-center gap-3 pr-5">

                        <div className="relative flex h-10 w-10 items-center justify-center">

                            <div className="absolute h-8 w-8 rotate-[-25deg] rounded-full border-[6px] border-cyan-400 border-r-transparent border-b-transparent" />

                            <div className="absolute h-8 w-8 rotate-[25deg] rounded-full border-[6px] border-blue-500 border-l-transparent border-t-transparent" />

                        </div>

                        <div>

                            <div className="text-[20px] font-extrabold leading-none tracking-wide">
                                SYNEXIS
                            </div>

                            <div className="mt-1 text-[7px] text-cyan-300">
                                Creating Enterprise Synergy
                            </div>

                        </div>

                    </div>

                    <div className="h-9 w-px bg-white/30" />

                    {/* TITLE */}

                    <div className="pl-5">

                        <div className="text-[16px] font-bold">
                            TIME OFFICE DASHBOARD
                        </div>

                        <div className="mt-1 text-[9px] text-white/80">
                            Real-time Attendance Monitoring & OT Control Center
                        </div>

                    </div>

                    <div className="ml-auto flex items-center gap-5">

                        {/* DATE */}

                        <div>

                            <div className="flex h-[39px] min-w-[165px] items-center justify-between rounded-md bg-white px-3 text-[#17204d]">

                                <CalendarIcon />

                                <div className="ml-2 flex-1">

                                    <div className="text-[7px] font-bold">
                                        Date
                                    </div>

                                    <div className="text-[9px] font-extrabold">
                                        {selectedDate}
                                    </div>

                                </div>

                                <ChevronDown size={13} />

                            </div>

                        </div>

                        {/* USER */}

                        <div className="flex items-center gap-2">

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500">
                                <UserRound size={20} />
                            </div>

                            <div>

                                <div className="text-[9px] font-bold">
                                    Time Officer
                                </div>

                                <div className="mt-1 text-[8px] text-white/80">
                                    TO-01 (Md. Rahman)
                                </div>

                            </div>

                            <ChevronDown size={13} />

                        </div>

                    </div>

                </div>

            </header>

                                <button
                        type="button"
                        className="flex items-center gap-2 text-sm font-semibold text-[#1554d1]"
                        onClick={() =>
                            navigate("/attendance-dashboard")
                        }
                    >
                        <ArrowLeft size={20} />

                        Back to Attendance Dashboard
                    </button>

            {/* =====================================================
                MAIN
            ===================================================== */}

            <main className="px-5 pb-5 pt-3">

                {/* =================================================
                    INFORMATION BAR
                ================================================= */}

                <section className="flex items-center justify-between gap-3">

                    <div className="flex min-h-[38px] flex-1 items-center gap-2 rounded-md border border-[#e5eaf3] bg-[#fbfcff] px-3">

                        <Info
                            size={16}
                            className="text-blue-600"
                        />

                        <span className="text-[9px] font-medium text-[#1b2860]">
                            Time Office is responsible to ensure all In Punch & Out Punch are done properly and OT requests are approved after verifying hard copy.
                        </span>

                    </div>

                    {/* HANDOVER */}

                    <div className="flex min-h-[38px] w-[175px] items-center gap-2 rounded-md border border-[#e5eaf3] bg-[#fbfcff] px-3">

                        <RefreshCw
                            size={17}
                            className="text-green-500"
                        />

                        <div>

                            <div className="text-[8px] font-bold text-[#1c2860]">
                                Shift Handover Time
                            </div>

                            <div className="text-[12px] font-extrabold text-green-600">
                                05:50 AM
                            </div>

                            <div className="text-[7px] text-gray-500">
                                (From Previous Officer)
                            </div>

                        </div>

                    </div>

                </section>

                {/* =================================================
                    SHIFT CARDS
                ================================================= */}

                <section className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-2">

                    {/* CURRENT SHIFT */}

                    <div className="rounded-md border border-[#e2e7f0] bg-white p-3">

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-2">

                                <span className="text-[11px] font-extrabold text-green-700">
                                    1. CURRENT SHIFT
                                </span>

                                <span className="text-[9px] font-semibold text-green-600">
                                    (Incoming)
                                </span>

                            </div>

                            <div className="flex items-center gap-3">

                                <span className="rounded bg-green-600 px-3 py-1 text-[8px] font-bold text-white">
                                    SHIFT A
                                </span>

                                <span className="text-[8px] font-bold text-[#24305d]">
                                    06:00 AM - 02:00 PM
                                </span>

                            </div>

                        </div>

                        <div className="mt-3 grid grid-cols-3">

                            {/* IN PUNCH */}

                            <ShiftMetric
                                icon={
                                    <LogIn size={24} />
                                }
                                iconClass="text-green-600"
                                label="IN PUNCH DONE"
                                value="95"
                                valueClass="text-green-600"
                                footer={
                                    <>
                                        Last Punch
                                        <br />
                                        <strong>
                                            06:16 AM
                                        </strong>
                                    </>
                                }
                            />

                            {/* HEAD COUNT */}

                            <div className="border-l border-r border-[#e6eaf2] px-5">

                                <div className="flex items-center gap-3">

                                    <Users
                                        size={25}
                                        className="text-blue-600"
                                    />

                                    <span className="text-[8px] font-extrabold text-[#1c2b63]">
                                        HEAD COUNT
                                    </span>

                                </div>

                                <input
                                    type="number"
                                    defaultValue={100}
                                    className="mt-2 h-[27px] w-full rounded border border-[#d8dfeb] px-2 text-center text-[12px] font-bold text-blue-600 outline-none"
                                />

                                <button
                                    type="button"
                                    className="mt-1 h-[24px] w-full rounded bg-blue-600 text-[8px] font-bold text-white hover:bg-blue-700"
                                >
                                    Enter Head Count
                                </button>

                                <div className="mt-1 text-center text-[7px] text-gray-500">
                                    (From All Sections)
                                </div>

                            </div>

                            {/* MISSING */}

                            <ShiftMetric
                                icon={
                                    <UserRoundXIcon />
                                }
                                iconClass="text-red-600"
                                label="MISSING IN PUNCH"
                                value="5"
                                valueClass="text-red-600"
                                footer={
                                    <>
                                        (After Head Count)
                                    </>
                                }
                            />

                        </div>

                        <div className="mt-3 rounded border border-green-100 bg-green-50 px-3 py-2 text-[8px] text-green-700">

                            <Clock3
                                size={13}
                                className="mr-1 inline"
                            />

                            Grace Period : 06:00 AM to 06:30 AM

                            <span className="mx-2 text-green-300">
                                |
                            </span>

                            After 06:30 AM will be considered Late Arrival

                        </div>

                    </div>

                    {/* PREVIOUS SHIFT */}

                    <div className="rounded-md border border-[#e2e7f0] bg-white p-3">

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-2">

                                <span className="text-[11px] font-extrabold text-blue-700">
                                    2. PREVIOUS SHIFT
                                </span>

                                <span className="text-[9px] font-semibold text-blue-600">
                                    (Outgoing)
                                </span>

                            </div>

                            <div className="flex items-center gap-3">

                                <span className="rounded bg-blue-600 px-3 py-1 text-[8px] font-bold text-white">
                                    SHIFT C
                                </span>

                                <span className="text-[8px] font-bold text-[#24305d]">
                                    10:00 PM - 06:00 AM
                                </span>

                            </div>

                        </div>

                        <div className="mt-3 grid grid-cols-3">

                            <ShiftMetric
                                icon={
                                    <LogIn size={24} />
                                }
                                iconClass="text-green-600"
                                label="IN PUNCH (Prev Shift)"
                                value="108"
                                valueClass="text-green-600"
                                footer={
                                    <>
                                        Completed
                                    </>
                                }
                            />

                            <ShiftMetric
                                icon={
                                    <LogOut size={24} />
                                }
                                iconClass="text-blue-600"
                                label="OUT PUNCH DONE"
                                value="106"
                                valueClass="text-blue-600"
                                footer={
                                    <>
                                        Last Punch
                                        <br />
                                        <strong>
                                            06:12 AM
                                        </strong>
                                    </>
                                }
                            />

                            <ShiftMetric
                                icon={
                                    <UserRoundXIcon />
                                }
                                iconClass="text-red-600"
                                label="MISSING OUT PUNCH"
                                value="2"
                                valueClass="text-red-600"
                                footer={
                                    <>
                                        From 108
                                    </>
                                }
                            />

                        </div>

                        <div className="mt-3 rounded border border-blue-100 bg-blue-50 px-3 py-2 text-[8px] text-blue-700">

                            <Info
                                size={13}
                                className="mr-1 inline"
                            />

                            Outgoing Time Officer ensures all Out Punch before handover.

                        </div>

                    </div>

                </section>

                {/* =================================================
                    OT + EXCEPTIONS
                ================================================= */}

                <section className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-2">

                    {/* =================================================
                        PENDING OT
                    ================================================= */}

                    <div className="rounded-md border border-[#e2e7f0] bg-white">

                        <div className="flex items-center justify-between border-b border-[#e6eaf1] px-3 py-2">

                            <div className="flex items-center gap-2">

                                <Clock3
                                    size={16}
                                    className="text-orange-500"
                                />

                                <h2 className="text-[10px] font-extrabold text-orange-600">
                                    3. PENDING OT REQUESTS
                                </h2>

                            </div>

                            <span className="rounded bg-orange-50 px-2 py-1 text-[8px] font-bold text-orange-600">
                                {pendingCount} Requests
                            </span>

                        </div>

                        <div className="overflow-x-auto">

                            <table className="w-full border-collapse text-[7px]">

                                <thead>

                                    <tr className="bg-[#fafbfe] text-[#1a275b]">

                                        <th className="px-2 py-2 text-left">
                                            #
                                        </th>

                                        <th className="px-2 py-2 text-left">
                                            ID
                                        </th>

                                        <th className="px-2 py-2 text-left">
                                            Name
                                        </th>

                                        <th className="px-2 py-2 text-left">
                                            Department
                                        </th>

                                        <th className="px-2 py-2 text-center">
                                            OT Hours
                                        </th>

                                        <th className="px-2 py-2 text-left">
                                            Requested By
                                        </th>

                                        <th className="px-2 py-2 text-center">
                                            Status
                                        </th>

                                        <th className="px-2 py-2 text-center">
                                            Approve
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {otRequests.map(
                                        (request, index) => (
                                            <tr
                                                key={request.id}
                                                className="border-t border-[#edf0f5]"
                                            >

                                                <td className="px-2 py-[4px]">
                                                    {index + 1}
                                                </td>

                                                <td className="px-2 py-[4px] font-semibold text-blue-600">
                                                    {request.employeeId}
                                                </td>

                                                <td className="px-2 py-[4px]">
                                                    {request.employeeName}
                                                </td>

                                                <td className="px-2 py-[4px]">
                                                    {request.department}
                                                </td>

                                                <td className="px-2 py-[4px] text-center font-semibold">
                                                    {request.otHours.toFixed(2)}
                                                </td>

                                                <td className="px-2 py-[4px]">
                                                    {request.requestedBy}
                                                </td>

                                                <td className="px-2 py-[4px] text-center">

                                                    <span
                                                        className={`rounded px-2 py-[3px] text-[7px] font-bold ${request.status ===
                                                            "Pending"
                                                            ? "bg-orange-50 text-orange-600"
                                                            : request.status ===
                                                                "Approved"
                                                                ? "bg-green-50 text-green-600"
                                                                : "bg-red-50 text-red-600"
                                                            }`}
                                                    >
                                                        {request.status}
                                                    </span>

                                                </td>

                                                <td className="px-2 py-[4px] text-center">

                                                    <input
                                                        type="checkbox"
                                                        checked={selectedOTIds.includes(
                                                            request.id,
                                                        )}
                                                        disabled={
                                                            request.status !==
                                                            "Pending"
                                                        }
                                                        onChange={() =>
                                                            toggleOTSelection(
                                                                request.id,
                                                            )
                                                        }
                                                        className="h-3 w-3 cursor-pointer accent-green-600 disabled:cursor-not-allowed"
                                                    />

                                                </td>

                                            </tr>
                                        ),
                                    )}

                                </tbody>

                            </table>

                        </div>

                        {/* OT ACTIONS */}

                        <div className="flex items-center gap-3 border-t border-[#e6eaf1] px-3 py-2">

                            <button
                                type="button"
                                onClick={handleViewHardCopy}
                                className="flex h-[29px] items-center gap-2 rounded border border-blue-300 px-4 text-[8px] font-bold text-blue-600 hover:bg-blue-50"
                            >
                                <Eye size={12} />
                                View Hard Copy
                            </button>

                            <button
                                type="button"
                                disabled={
                                    selectedCount === 0
                                }
                                onClick={
                                    handleApproveSelected
                                }
                                className="flex h-[29px] flex-1 items-center justify-center gap-2 rounded border border-green-300 text-[8px] font-bold text-green-600 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Check size={13} />
                                Approve Selected
                            </button>

                            <button
                                type="button"
                                disabled={
                                    pendingCount === 0
                                }
                                onClick={handleApproveAll}
                                className="flex h-[29px] flex-1 items-center justify-center gap-2 rounded bg-green-600 text-[8px] font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Check size={13} />
                                {allSelected
                                    ? "Unselect All"
                                    : "Approve All"}
                            </button>

                        </div>

                    </div>

                    {/* =================================================
                        EXCEPTIONS
                    ================================================= */}

                    <div className="rounded-md border border-[#e2e7f0] bg-white">

                        <div className="flex items-center justify-between border-b border-[#e6eaf1] px-3 py-2">

                            <div className="flex items-center gap-2">

                                <ShieldAlert
                                    size={16}
                                    className="text-red-500"
                                />

                                <h2 className="text-[10px] font-extrabold text-red-600">
                                    EXCEPTIONS
                                </h2>

                                <span className="text-[8px] text-gray-500">
                                    (Beyond Human Control)
                                </span>

                            </div>

                            <button
                                type="button"
                                className="flex items-center gap-1 rounded border border-blue-300 px-3 py-1 text-[8px] font-bold text-blue-600 hover:bg-blue-50"
                            >
                                <Plus size={11} />
                                Add Exception
                            </button>

                        </div>

                        {/* ADD EXCEPTION FORM */}

                        <div className="px-3 pt-2">

                            <div className="mb-2 text-[8px] font-extrabold text-blue-600">
                                ADD NEW EXCEPTION
                            </div>

                            <div className="grid grid-cols-3 gap-2">

                                <SmallInput
                                    label="Employee ID"
                                    placeholder="Enter ID or Name"
                                    value={
                                        exceptionForm.employeeId
                                    }
                                    onChange={(value) =>
                                        handleExceptionChange(
                                            "employeeId",
                                            value,
                                        )
                                    }
                                    icon
                                />

                                <SmallInput
                                    label="Employee Name"
                                    placeholder=""
                                    value={
                                        exceptionForm.employeeName
                                    }
                                    onChange={(value) =>
                                        handleExceptionChange(
                                            "employeeName",
                                            value,
                                        )
                                    }
                                />

                                <SmallInput
                                    label="Department"
                                    placeholder=""
                                    value={
                                        exceptionForm.department
                                    }
                                    onChange={(value) =>
                                        handleExceptionChange(
                                            "department",
                                            value,
                                        )
                                    }
                                />

                                <div>

                                    <label className="mb-1 block text-[7px] font-bold text-[#26305d]">
                                        Exception Type
                                    </label>

                                    <select
                                        value={
                                            exceptionForm.exceptionType
                                        }
                                        onChange={(e) =>
                                            handleExceptionChange(
                                                "exceptionType",
                                                e.target.value,
                                            )
                                        }
                                        className="h-[25px] w-full rounded border border-[#d9dfeb] px-2 text-[8px] outline-none"
                                    >

                                        <option value="">
                                            Select Exception Type
                                        </option>

                                        <option>
                                            Machine Failure
                                        </option>

                                        <option>
                                            Power Failure
                                        </option>

                                        <option>
                                            Official Duty
                                        </option>

                                        <option>
                                            Medical Emergency
                                        </option>

                                        <option>
                                            Other
                                        </option>

                                    </select>

                                </div>

                                <SmallInput
                                    label="Time"
                                    placeholder="--:-- ----"
                                    value={
                                        exceptionForm.time
                                    }
                                    onChange={(value) =>
                                        handleExceptionChange(
                                            "time",
                                            value,
                                        )
                                    }
                                    type="time"
                                />

                                <SmallInput
                                    label="Reason"
                                    placeholder="Enter Reason"
                                    value={
                                        exceptionForm.reason
                                    }
                                    onChange={(value) =>
                                        handleExceptionChange(
                                            "reason",
                                            value,
                                        )
                                    }
                                />

                            </div>

                            <button
                                type="button"
                                onClick={
                                    handleAddException
                                }
                                className="mt-2 ml-auto flex h-[28px] items-center gap-2 rounded bg-blue-600 px-5 text-[8px] font-bold text-white hover:bg-blue-700"
                            >
                                <Plus size={12} />
                                Add to List
                            </button>

                        </div>

                        {/* EXCEPTION LIST */}

                        <div className="mt-2 border-t border-[#edf0f5] px-3 pt-2">

                            <div className="mb-2 text-[8px] font-extrabold text-blue-600">
                                EXCEPTION LIST
                            </div>

                            <div className="overflow-x-auto">

                                <table className="w-full text-[7px]">

                                    <thead>

                                        <tr className="bg-[#fafbfe]">

                                            <th className="px-2 py-2 text-left">
                                                #
                                            </th>

                                            <th className="px-2 py-2 text-left">
                                                ID
                                            </th>

                                            <th className="px-2 py-2 text-left">
                                                Name
                                            </th>

                                            <th className="px-2 py-2 text-left">
                                                Department
                                            </th>

                                            <th className="px-2 py-2 text-left">
                                                Exception Type
                                            </th>

                                            <th className="px-2 py-2 text-left">
                                                Time
                                            </th>

                                            <th className="px-2 py-2 text-left">
                                                Reason
                                            </th>

                                            <th className="px-2 py-2 text-center">
                                                Action
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {exceptions.map(
                                            (
                                                exception,
                                                index,
                                            ) => (

                                                <tr
                                                    key={
                                                        exception.id
                                                    }
                                                    className="border-t border-[#edf0f5]"
                                                >

                                                    <td className="px-2 py-[4px]">
                                                        {index + 1}
                                                    </td>

                                                    <td className="px-2 py-[4px] font-semibold text-blue-600">
                                                        {
                                                            exception.employeeId
                                                        }
                                                    </td>

                                                    <td className="px-2 py-[4px]">
                                                        {
                                                            exception.employeeName
                                                        }
                                                    </td>

                                                    <td className="px-2 py-[4px]">
                                                        {
                                                            exception.department
                                                        }
                                                    </td>

                                                    <td className="px-2 py-[4px]">
                                                        {
                                                            exception.exceptionType
                                                        }
                                                    </td>

                                                    <td className="px-2 py-[4px]">
                                                        {
                                                            exception.time
                                                        }
                                                    </td>

                                                    <td className="px-2 py-[4px]">
                                                        {
                                                            exception.reason
                                                        }
                                                    </td>

                                                    <td className="px-2 py-[4px] text-center">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteException(
                                                                    exception.id,
                                                                )
                                                            }
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2
                                                                size={
                                                                    12
                                                                }
                                                            />
                                                        </button>

                                                    </td>

                                                </tr>

                                            ),
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                        {/* FORWARD */}

                        <div className="p-3">

                            <button
                                type="button"
                                disabled={
                                    exceptions.length === 0
                                }
                                onClick={
                                    handleForwardExceptions
                                }
                                className="flex h-[29px] w-full items-center justify-center gap-2 rounded border border-red-300 text-[8px] font-bold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Send size={12} />
                                Forward Exceptions to Attendance Cell
                            </button>

                        </div>

                    </div>

                </section>

                {/* =================================================
                    FOOTER INFORMATION
                ================================================= */}

                <section className="mt-3 rounded-md border border-[#e2e7f0] bg-white p-3">

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

                        {/* HANDOVER INFORMATION */}

                        <div className="flex items-start gap-3">

                            <Users
                                size={20}
                                className="mt-1 text-purple-600"
                            />

                            <div className="flex-1">

                                <h3 className="text-[9px] font-extrabold text-purple-600">
                                    SHIFT HANDOVER INFORMATION
                                </h3>

                                <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-2 text-[8px]">

                                    <InfoRow
                                        label="Outgoing Officer"
                                        value="Md. Sohel"
                                    />

                                    <InfoRow
                                        label="Handover Time"
                                        value="05:50 AM"
                                    />

                                    <InfoRow
                                        label="Incoming Officer"
                                        value="Md. Rahman"
                                    />

                                    <InfoRow
                                        label="Handover Status"
                                        value="Completed"
                                        valueClass="text-green-600"
                                    />

                                </div>

                            </div>

                        </div>

                        {/* SYSTEM STATUS */}

                        <div className="flex items-start gap-3 border-l border-[#edf0f5] pl-5">

                            <Monitor
                                size={22}
                                className="mt-1 text-blue-600"
                            />

                            <div>

                                <h3 className="text-[9px] font-extrabold text-blue-600">
                                    SYSTEM STATUS
                                </h3>

                                <div className="mt-2 space-y-2 text-[8px]">

                                    <InfoRow
                                        label="In Punch Gate"
                                        value="ONLINE"
                                        valueClass="text-green-600"
                                    />

                                    <InfoRow
                                        label="Out Punch Gate"
                                        value="ONLINE"
                                        valueClass="text-green-600"
                                    />

                                </div>

                            </div>

                        </div>

                        {/* IMPORTANT NOTE */}

                        <div className="flex items-start gap-3 border-l border-[#edf0f5] pl-5">

                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                                <Info size={15} />
                            </div>

                            <div className="flex-1">

                                <h3 className="text-[9px] font-extrabold text-blue-600">
                                    IMPORTANT NOTE
                                </h3>

                                <p className="mt-2 text-[8px] leading-4 text-[#26305d]">
                                    Please verify hard copy with digital OT list before approving OT requests.
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={handleRefresh}
                                className="flex h-[36px] shrink-0 items-center gap-2 rounded border border-blue-300 px-4 text-[8px] font-bold text-blue-600 hover:bg-blue-50"
                            >
                                <RefreshCw size={13} />
                                Refresh All Data
                            </button>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
};

/* =========================================================
   SHIFT METRIC
========================================================= */

interface ShiftMetricProps {
    icon: React.ReactNode;
    iconClass: string;
    label: string;
    value: string;
    valueClass: string;
    footer: React.ReactNode;
}

const ShiftMetric: React.FC<ShiftMetricProps> = ({
    icon,
    iconClass,
    label,
    value,
    valueClass,
    footer,
}) => {
    return (
        <div className="px-5">

            <div className="flex items-center gap-3">

                <div className={iconClass}>
                    {icon}
                </div>

                <span
                    className={`text-[8px] font-extrabold ${iconClass}`}
                >
                    {label}
                </span>

            </div>

            <div
                className={`mt-3 text-center text-[18px] font-extrabold ${valueClass}`}
            >
                {value}
            </div>

            <div className="mt-2 text-center text-[7px] text-[#27325d]">
                {footer}
            </div>

        </div>
    );
};

/* =========================================================
   SMALL INPUT
========================================================= */

interface SmallInputProps {
    label: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    icon?: boolean;
}

const SmallInput: React.FC<SmallInputProps> = ({
    label,
    placeholder,
    value,
    onChange,
    type = "text",
    icon = false,
}) => {
    return (
        <div>

            <label className="mb-1 block text-[7px] font-bold text-[#26305d]">
                {label}
            </label>

            <div className="relative">

                <input
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                    className="h-[25px] w-full rounded border border-[#d9dfeb] px-2 text-[8px] outline-none focus:border-blue-400"
                />

                {icon && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                        <Eye size={10} />
                    </span>
                )}

            </div>

        </div>
    );
};

/* =========================================================
   INFO ROW
========================================================= */

interface InfoRowProps {
    label: string;
    value: string;
    valueClass?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({
    label,
    value,
    valueClass = "text-[#172253]",
}) => {
    return (
        <div className="flex gap-2">

            <span className="text-gray-500">
                {label}:
            </span>

            <strong className={valueClass}>
                {value}
            </strong>

        </div>
    );
};

/* =========================================================
   ICON HELPERS
========================================================= */

const CalendarIcon: React.FC = () => (
    <div className="text-[#17204d]">
        <Clock3 size={16} />
    </div>
);

const UserRoundXIcon: React.FC = () => (
    <div className="relative">
        <UserRound
            size={24}
            className="text-red-600"
        />

        <XCircle
            size={10}
            className="absolute -bottom-1 -right-1 fill-white"
        />
    </div>
);

export default TimeOfficeDashboard;