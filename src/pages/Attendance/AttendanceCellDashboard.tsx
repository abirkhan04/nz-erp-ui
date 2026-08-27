import React from "react";
import {
    CalendarDays,
    CircleAlert,
    Clock3,
    FileCheck2,
    Info,
    LogOut,
    Users,
    UserX,
    WalletCards,
    Baby,
    ArrowRight,
    Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LeaveRequest {
    id: number;
    requestNo: string;
    employeeId: string;
    employeeName: string;
    department: string;
    leaveType: string;
    fromDate: string;
    toDate: string;
    days: number;
    leaveAvailable: number;
    requestedDays: number;
    balanceAfter: number;
    reason: string;
    status: "Pending" | "Approved" | "Rejected";
}

const leaveRequests: LeaveRequest[] = [
    {
        id: 1,
        requestNo: "LVR250515001",
        employeeId: "10045",
        employeeName: "Jahid Hossain",
        department: "Weaving",
        leaveType: "Casual Leave",
        fromDate: "18-May-2025",
        toDate: "19-May-2025",
        days: 2,
        leaveAvailable: 10,
        requestedDays: 2,
        balanceAfter: 8,
        reason: "Personal Work",
        status: "Pending",
    },
    {
        id: 2,
        requestNo: "LVR250515002",
        employeeId: "10087",
        employeeName: "Ripon Miah",
        department: "Spinning",
        leaveType: "Sick Leave",
        fromDate: "17-May-2025",
        toDate: "18-May-2025",
        days: 2,
        leaveAvailable: 6.5,
        requestedDays: 2,
        balanceAfter: 4.5,
        reason: "Fever",
        status: "Pending",
    },
    {
        id: 3,
        requestNo: "LVR250515003",
        employeeId: "10123",
        employeeName: "Sagar Ali",
        department: "Dyeing",
        leaveType: "Earned Leave",
        fromDate: "20-May-2025",
        toDate: "22-May-2025",
        days: 3,
        leaveAvailable: 12,
        requestedDays: 3,
        balanceAfter: 9,
        reason: "Family Event",
        status: "Pending",
    },
    {
        id: 4,
        requestNo: "LVR250515004",
        employeeId: "10145",
        employeeName: "Nazmul Akter",
        department: "Finishing",
        leaveType: "Maternity Leave",
        fromDate: "25-May-2025",
        toDate: "30-Jun-2025",
        days: 37,
        leaveAvailable: 64,
        requestedDays: 37,
        balanceAfter: 27,
        reason: "Pre & Post Delivery",
        status: "Pending",
    },
    {
        id: 5,
        requestNo: "LVR250515005",
        employeeId: "10166",
        employeeName: "Monir Hossain",
        department: "Maintenance",
        leaveType: "Special Leave",
        fromDate: "21-May-2025",
        toDate: "21-May-2025",
        days: 1,
        leaveAvailable: 3,
        requestedDays: 1,
        balanceAfter: 2,
        reason: "Personal Urgent Work",
        status: "Pending",
    },
];

const SummaryItem = ({
    icon: Icon,
    label,
    value,
    color,
    border = true,
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    color: string;
    border?: boolean;
}) => {
    return (
        <div
            className={`flex flex-1 items-center gap-3 px-5 py-2 ${border ? "border-r border-[#e5eaf3]" : ""
                }`}
        >
            <Icon size={29} strokeWidth={2} className={color} />

            <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#24365f]">
                    {label}
                </p>

                <p className={`mt-1 text-[24px] font-bold leading-none ${color}`}>
                    {value}
                </p>
            </div>
        </div>
    );
};

const DashboardCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    iconBg,
    iconColor,
    buttonColor,
    url
}: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    buttonColor: string;
    url: string;
}) => {

    const navigate = useNavigate();
    return (
        <div className="flex min-h-[142px] flex-1 flex-col rounded-md border border-[#dfe5ef] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-start gap-4">
                <div
                    className={`flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full ${iconBg}`}
                >
                    <Icon size={30} strokeWidth={2} className={iconColor} />
                </div>

                <div className="min-w-0">
                    <p className="text-[12px] font-bold uppercase leading-[18px] text-[#17336d]">
                        {title}
                    </p>

                    <p className={`mt-2 text-[23px] font-bold leading-none ${iconColor}`}>
                        {value}
                    </p>

                    <p className="mt-1 text-[9px] font-medium text-[#24365f]">
                        {subtitle}
                    </p>
                </div>
            </div>

            <button
                type="button"
                className={`mt-auto flex h-[26px] w-full items-center justify-between rounded px-3 text-[10px] font-semibold text-white ${buttonColor}`}
                onClick={()=> navigate(url)}>
                <span>View List</span>
                <ArrowRight size={16} />
            </button>
        </div>
    );
};

const AttendanceCellDashboard: React.FC = () => {
    const handleForward = (request: LeaveRequest) => {
        console.log("Forward leave request:", request);
    };

    const currentDate = new Date();

    const formattedDate = currentDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const currentDay = currentDate.toLocaleDateString("en-GB", {
        weekday: "long",
    });

    return (
        <div className="min-h-screen bg-[#f8faff] p-2 font-sans text-[#14295a]">
            {/* ============================================================
          HEADER
      ============================================================ */}
            <header className="flex min-h-[62px] items-center justify-between bg-[#0648c7] px-5 text-white">
                {/* Logo */}
                <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[30px] font-bold italic text-[#1654c7]">
                        S
                    </div>

                    <div className="border-r border-white/30 pr-5">
                        <h1 className="text-[20px] font-bold leading-none tracking-wide">
                            SYNEXIS
                        </h1>

                        <p className="mt-1 text-[8px] font-medium">
                            Creating Enterprise Synergy
                        </p>
                    </div>

                    <div>
                        <h2 className="text-[17px] font-bold tracking-wide">
                            ATTENDANCE CELL DASHBOARD
                        </h2>

                        <p className="mt-1 text-[10px] font-medium text-white/90">
                            HR Branch &nbsp;&gt;&nbsp; Payroll & Workforce Movement
                            &nbsp;&gt;&nbsp; Attendance Cell
                        </p>
                    </div>
                </div>

                {/* Right header */}
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2 rounded bg-white px-3 py-2 text-[10px] font-bold text-[#1b315d]">
                        <CalendarDays size={16} className="text-[#1251ca]" />
                        <span>{formattedDate} | {currentDay}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                            <Users size={19} className="text-[#1454c8]" />
                        </div>

                        <div className="text-right">
                            <p className="text-[10px] font-bold">Nusrat Jahan</p>
                            <p className="text-[9px] text-white/80">Attendance Officer</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="space-y-3 p-3">
                {/* ============================================================
            SHIFT SECTION
        ============================================================ */}
                <section className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                    {/* Current Shift */}
                    <div className="rounded-md border border-[#dfe5ef] bg-white p-3">
                        <div className="flex items-center justify-between border-b border-[#edf0f6] pb-2">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[12px] font-bold text-[#18366f]">
                                    1.
                                </span>

                                <span className="text-[11px] font-bold uppercase text-[#18366f]">
                                    Current Shift (Incoming)
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="rounded bg-[#159447] px-2 py-1 text-[9px] font-bold text-white">
                                    SHIFT A
                                </span>

                                <span className="text-[9px] font-bold text-[#26365c]">
                                    06:00 AM - 02:00 PM
                                </span>
                            </div>
                        </div>

                        <div className="mt-3 flex">
                            <SummaryItem
                                icon={Users}
                                label="Present"
                                value="1,256"
                                color="text-[#079b4c]"
                            />

                            <SummaryItem
                                icon={UserX}
                                label="Absent"
                                value="87"
                                color="text-[#ef3039]"
                            />

                            <SummaryItem
                                icon={Clock3}
                                label="Punch Missing"
                                value="46"
                                color="text-[#f28b00]"
                                border={false}
                            />
                        </div>

                        <div className="mt-3 flex items-center gap-2 rounded border border-[#dce7f7] bg-[#f5f9ff] px-2 py-1.5 text-[9px]">
                            <Info size={14} className="fill-[#1158d5] text-white" />

                            <span className="font-semibold text-[#253968]">
                                Last Punch Time:
                            </span>

                            <span className="font-bold text-[#159447]">06:48 AM</span>
                        </div>
                    </div>

                    {/* Previous Shift */}
                    <div className="rounded-md border border-[#dfe5ef] bg-white p-3">
                        <div className="flex items-center justify-between border-b border-[#edf0f6] pb-2">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[12px] font-bold text-[#18366f]">
                                    2.
                                </span>

                                <span className="text-[11px] font-bold uppercase text-[#18366f]">
                                    Previous Shift (Outgoing)
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="rounded bg-[#0754d5] px-2 py-1 text-[9px] font-bold text-white">
                                    SHIFT C
                                </span>

                                <span className="text-[9px] font-bold text-[#26365c]">
                                    10:00 PM - 06:00 AM
                                </span>
                            </div>
                        </div>

                        <div className="mt-3 flex">
                            <SummaryItem
                                icon={LogOut}
                                label="Out Punch Done"
                                value="1,184"
                                color="text-[#1259d5]"
                            />

                            <SummaryItem
                                icon={Clock3}
                                label="Missing Out Punch"
                                value="32"
                                color="text-[#ef3039]"
                                border={false}
                            />
                        </div>

                        <div className="mt-3 flex items-center gap-2 rounded border border-[#dce7f7] bg-[#f5f9ff] px-2 py-1.5 text-[9px] text-[#1251c6]">
                            <Info size={14} className="fill-[#1158d5] text-white" />

                            <span className="font-semibold">
                                Outgoing shift Out Punch entry must be completed before handover.
                            </span>
                        </div>
                    </div>
                </section>

                {/* ============================================================
            REQUEST CARDS
        ============================================================ */}
                <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <DashboardCard
                        title="Leave Requests Received"
                        value="18"
                        subtitle="Pending Verification"
                        icon={CalendarDays}
                        iconBg="bg-[#e7f0ff]"
                        iconColor="text-[#0757d6]"
                        buttonColor="bg-[#0757d6]"
                        url=""
                    />

                    <DashboardCard
                        title="Earned Leave Encashment Requests"
                        value="06"
                        subtitle="Pending Verification"
                        icon={WalletCards}
                        iconBg="bg-[#e6f8ee]"
                        iconColor="text-[#07994b]"
                        buttonColor="bg-[#07994b]"
                        url="/attendance-cell-earned-leave-encashment"
                    />

                    <DashboardCard
                        title="Maternity Leave Encashment Requests"
                        value="04"
                        subtitle="Pending Verification"
                        icon={Baby}
                        iconBg="bg-[#f0e6ff]"
                        iconColor="text-[#721bd0]"
                        buttonColor="bg-[#721bd0]"
                        url="/attendance-cell-maternity-leave-encashment"
                    />

                    <DashboardCard
                        title="Exception Requests (From Time Office)"
                        value="11"
                        subtitle="Pending Verification"
                        icon={CircleAlert}
                        iconBg="bg-[#fff0dc]"
                        iconColor="text-[#fa8500]"
                        buttonColor="bg-[#fa8500]"
                        url = "/attendance-cell-exception-request"
                    />
                </section>

                {/* ============================================================
            LEAVE REQUEST TABLE
        ============================================================ */}
                <section className="overflow-hidden rounded-md border border-[#dfe5ef] bg-white">
                    {/* Table Header */}
                    <div className="flex items-center justify-between border-b border-[#e4e9f1] px-3 py-2">
                        <div className="flex items-center gap-2">
                            <FileCheck2 size={15} className="text-[#0757d6]" />

                            <h3 className="text-[11px] font-bold uppercase text-[#17336d]">
                                Leave Requests Received From Production Floor
                            </h3>
                        </div>

                        <span className="text-[9px] font-bold text-[#233665]">
                            Total Requests: 18
                        </span>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1200px] border-collapse">
                            <thead>
                                <tr className="bg-[#f4f7fc]">
                                    {[
                                        "#",
                                        "Req. No.",
                                        "Emp ID",
                                        "Employee Name",
                                        "Department",
                                        "Leave Type",
                                        "From Date",
                                        "To Date",
                                        "Days",
                                        "Leave Available",
                                        "Requested Days",
                                        "Balance After Request",
                                        "Reason",
                                        "Status",
                                        "Action",
                                    ].map((heading) => (
                                        <th
                                            key={heading}
                                            className="border border-[#dce4f0] px-2 py-2 text-center text-[8px] font-bold text-[#20345f]"
                                        >
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {leaveRequests.map((request, index) => {
                                    const hasSufficientBalance =
                                        request.leaveAvailable >= request.requestedDays;

                                    return (
                                        <tr
                                            key={request.id}
                                            className="transition-colors hover:bg-[#f8fbff]"
                                        >
                                            <td className="border border-[#e1e7f0] px-2 py-2 text-center text-[8px]">
                                                {index + 1}
                                            </td>

                                            <td className="border border-[#e1e7f0] px-2 py-2 text-center text-[8px] font-semibold">
                                                {request.requestNo}
                                            </td>

                                            <td className="border border-[#e1e7f0] px-2 py-2 text-center text-[8px]">
                                                {request.employeeId}
                                            </td>

                                            <td className="border border-[#e1e7f0] px-2 py-2 text-[8px] font-semibold">
                                                {request.employeeName}
                                            </td>

                                            <td className="border border-[#e1e7f0] px-2 py-2 text-center text-[8px]">
                                                {request.department}
                                            </td>

                                            <td className="border border-[#e1e7f0] px-2 py-2 text-center text-[8px]">
                                                {request.leaveType}
                                            </td>

                                            <td className="border border-[#e1e7f0] px-2 py-2 text-center text-[8px]">
                                                {request.fromDate}
                                            </td>

                                            <td className="border border-[#e1e7f0] px-2 py-2 text-center text-[8px]">
                                                {request.toDate}
                                            </td>

                                            <td className="border border-[#e1e7f0] px-2 py-2 text-center text-[8px]">
                                                {request.days.toFixed(1)}
                                            </td>

                                            <td className="border border-[#e1e7f0] px-2 py-2 text-center text-[8px] font-bold text-[#07994b]">
                                                {request.leaveAvailable.toFixed(1)}
                                            </td>

                                            <td className="border border-[#e1e7f0] px-2 py-2 text-center text-[8px]">
                                                {request.requestedDays.toFixed(1)}
                                            </td>

                                            <td
                                                className={`border border-[#e1e7f0] px-2 py-2 text-center text-[8px] font-bold ${request.balanceAfter <= 2
                                                        ? "text-[#f28b00]"
                                                        : "text-[#07994b]"
                                                    }`}
                                            >
                                                {request.balanceAfter.toFixed(1)}
                                            </td>

                                            <td className="border border-[#e1e7f0] px-2 py-2 text-center text-[8px]">
                                                {request.reason}
                                            </td>

                                            <td className="border border-[#e1e7f0] px-2 py-2 text-center">
                                                <span className="rounded bg-[#fff1df] px-2 py-1 text-[8px] font-semibold text-[#f28b00]">
                                                    {request.status}
                                                </span>
                                            </td>

                                            <td className="border border-[#e1e7f0] px-2 py-2 text-center">
                                                <button
                                                    type="button"
                                                    disabled={!hasSufficientBalance}
                                                    onClick={() => handleForward(request)}
                                                    className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[8px] font-bold text-white transition ${hasSufficientBalance
                                                            ? "bg-[#0757d6] hover:bg-[#0648b5]"
                                                            : "cursor-not-allowed bg-gray-300"
                                                        }`}
                                                >
                                                    <Send size={10} />
                                                    Forward
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* ============================================================
              TABLE FOOTER
          ============================================================ */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#dfe5ef] bg-[#f8fbff] px-3 py-2">
                        <div className="flex items-center gap-2 text-[8px] font-semibold text-[#0757d6]">
                            <Info size={13} className="fill-[#0757d6] text-white" />

                            <span>
                                Note: Only requests with sufficient leave balance can be
                                forwarded.
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-[8px] font-semibold">
                            <span className="flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-[#07994b]" />
                                Sufficient Balance
                            </span>

                            <span className="flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-[#f28b00]" />
                                Low Balance
                            </span>

                            <span className="flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-[#ef3039]" />
                                Insufficient Balance (Not Forwardable)
                            </span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AttendanceCellDashboard;
