import React from "react";
import {
    CalendarCheck2,
    Building2,
    ChevronDown,
    Clock3,
    FileBarChart2,
    Info,
    Users,
    UserCheck,
    UserRound,
    UserRoundCheck,
    UserRoundX,
    UserX,
    WalletCards,
    ArrowRight,
    Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AttendanceStat {
    label: string;
    value: string;
    percentage?: string;
    subtitle?: string;
    icon: React.ReactNode;
    iconClass: string;
    valueClass: string;
}

interface ModuleCard {
    number: string;
    title: string;
    description: string;
    buttonText: string;
    icon: React.ReactNode;
    containerClass: string;
    iconContainerClass: string;
    iconClass: string;
    buttonClass: string;
    url: string;
}

const AttendanceDashboard: React.FC = () => {
    /* =========================================================
       DATE
    ========================================================= */

    const selectedDate = "15-May-2025";

    /* =========================================================
       ORGANIZATION STATISTICS
    ========================================================= */

    const organizationStats: AttendanceStat[] = [
        {
            label: "Total Employees",
            value: "5,342",
            subtitle: "All Companies",
            icon: <Users size={30} />,
            iconClass: "bg-blue-100 text-blue-600",
            valueClass: "text-[#13205c]",
        },
        {
            label: "Present",
            value: "4,126",
            percentage: "77.15%",
            icon: <UserCheck size={30} />,
            iconClass: "bg-green-100 text-green-600",
            valueClass: "text-green-600",
        },
        {
            label: "Absent",
            value: "612",
            percentage: "11.45%",
            icon: <UserRoundX size={30} />,
            iconClass: "bg-red-100 text-red-600",
            valueClass: "text-red-600",
        },
        {
            label: "On Leave",
            value: "402",
            percentage: "7.53%",
            icon: <UserRoundCheck size={30} />,
            iconClass: "bg-orange-100 text-orange-600",
            valueClass: "text-orange-500",
        },
        {
            label: "OT Running",
            value: "178",
            percentage: "3.33%",
            icon: <Clock3 size={30} />,
            iconClass: "bg-purple-100 text-purple-600",
            valueClass: "text-purple-600",
        },
        {
            label: "Missed Punch",
            value: "24",
            percentage: "0.45%",
            icon: <UserX size={30} />,
            iconClass: "bg-teal-100 text-teal-600",
            valueClass: "text-teal-600",
        },
    ];

    /* =========================================================
       SHIFT STATISTICS
    ========================================================= */

    const previousShiftStats = [
        {
            label: "Present",
            value: "1,185",
            percentage: "79.25%",
            icon: <UserCheck size={25} />,
            className: "text-green-600",
            iconClass: "bg-green-100 text-green-600",
        },
        {
            label: "Absent",
            value: "181",
            percentage: "12.10%",
            icon: <UserRoundX size={25} />,
            className: "text-red-600",
            iconClass: "bg-red-100 text-red-600",
        },
        {
            label: "On Leave",
            value: "103",
            percentage: "6.89%",
            icon: <UserRoundCheck size={25} />,
            className: "text-orange-500",
            iconClass: "bg-orange-100 text-orange-500",
        },
        {
            label: "Missed Punch",
            value: "26",
            percentage: "1.74%",
            icon: <UserX size={25} />,
            className: "text-teal-600",
            iconClass: "bg-teal-100 text-teal-600",
        },
    ];

    /* =========================================================
       MODULE CARDS
    ========================================================= */

    const moduleCards: ModuleCard[] = [
        {
            number: "1.",
            title: "Time Office",
            description:
                "Monitor real-time attendance, manage exceptions and approve overtime.",
            buttonText: "Go to Time Office",
            icon: <Clock3 size={38} />,
            containerClass:
                "border-blue-100 bg-gradient-to-b from-blue-50/60 to-white border-b-blue-600",
            iconContainerClass: "bg-blue-100",
            iconClass: "text-blue-600",
            buttonClass:
                "border-blue-400 text-blue-600 hover:bg-blue-50",
            url: "/time-office-dashboard"
        },
        {
            number: "2.",
            title: "Attendance Cell",
            description:
                "Manage daily attendance, leaves, shifts, weekly holidays and attendance verification.",
            buttonText: "Go to Attendance Cell",
            icon: <Users size={38} />,
            containerClass:
                "border-green-100 bg-gradient-to-b from-green-50/60 to-white border-b-green-600",
            iconContainerClass: "bg-green-100",
            iconClass: "text-green-600",
            buttonClass:
                "border-green-400 text-green-600 hover:bg-green-50",
                url: "/attendance-cell"
        },
        {
            number: "3.",
            title: "Payroll Processing",
            description:
                "Process payroll, review salary, send to IT and manage approvals.",
            buttonText: "Go to Payroll Processing",
            icon: <WalletCards size={38} />,
            containerClass:
                "border-orange-100 bg-gradient-to-b from-orange-50/60 to-white border-b-orange-500",
            iconContainerClass: "bg-orange-100",
            iconClass: "text-orange-500",
            buttonClass:
                "border-orange-400 text-orange-500 hover:bg-orange-50",
                url: "/payroll-processing"
        },
        {
            number: "4.",
            title: "Attendance Reports",
            description:
                "View and print detailed attendance related reports.",
            buttonText: "Go to Reports",
            icon: <FileBarChart2 size={38} />,
            containerClass:
                "border-purple-100 bg-gradient-to-b from-purple-50/60 to-white border-b-purple-600",
            iconContainerClass: "bg-purple-100",
            iconClass: "text-purple-600",
            buttonClass:
                "border-purple-400 text-purple-600 hover:bg-purple-50",
            url: "/attendance-report"
        },
    ];

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-[#10184c]">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <header className="h-[86px] bg-[#06104d] text-white">

                <div className="flex h-full items-center">

                    {/* LOGO */}

                    <div className="flex h-full w-[190px] shrink-0 items-center justify-center border-r border-white/10">

                        <div className="flex items-center gap-3">

                            <div className="relative flex h-12 w-12 items-center justify-center">

                                <div className="absolute h-8 w-8 rotate-[-25deg] rounded-full border-[7px] border-cyan-400 border-r-transparent border-b-transparent" />

                                <div className="absolute h-8 w-8 rotate-[25deg] rounded-full border-[7px] border-blue-500 border-l-transparent border-t-transparent" />

                            </div>

                            <div>
                                <div className="text-[20px] font-extrabold tracking-wide">
                                    SYNEXIS
                                </div>

                                <div className="text-[8px] text-cyan-300">
                                    Creating Enterprise Synergy
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* TITLE */}

                    <div className="flex h-full flex-1 items-center px-5">

                        <div>

                            <div className="text-[15px] font-bold">
                                PAYROLL & WORKFORCE MOVEMENT
                            </div>

                            <div className="mt-1 text-[12px] text-white/80">
                                Attendance Dashboard
                            </div>

                        </div>

                    </div>

                    {/* COMPANY */}

                    <div className="mr-4 hidden lg:block">

                        <div className="mb-1 text-[8px] font-semibold text-white">
                            Select Company
                        </div>

                        <button
                            type="button"
                            className="flex h-[38px] min-w-[195px] items-center justify-between gap-3 rounded-md bg-white px-3 text-[10px] font-semibold text-[#16204d]"
                        >

                            <span className="flex items-center gap-2">
                                <Building2 size={16} />
                                All Companies (Group View)
                            </span>

                            <ChevronDown size={14} />

                        </button>

                    </div>

                    {/* DATE */}

                    <button
                        type="button"
                        className="mr-4 flex h-[38px] items-center gap-3 rounded-md border border-white/30 px-3 text-[10px] font-semibold"
                    >

                        <CalendarCheck2 size={16} />

                        <span>
                            {selectedDate}
                        </span>

                        <span className="text-white/40">
                            -
                        </span>

                        <span>
                            {selectedDate}
                        </span>

                        <ChevronDown size={14} />

                    </button>

                    {/* NOTIFICATION */}

                    <div className="mr-5 flex flex-col items-center">

                        <div className="relative">

                            <Bell size={18} />

                            <span className="absolute -right-2 -top-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-bold">
                                8
                            </span>

                        </div>

                        <span className="mt-1 text-[8px]">
                            Notifications
                        </span>

                    </div>

                    {/* USER */}

                    <div className="mr-5 flex items-center gap-2">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#536078]">
                            <UserRound size={21} />
                        </div>

                        <div className="hidden xl:block">

                            <div className="text-[9px] font-semibold">
                                IT Executive
                            </div>

                            <div className="mt-1 flex items-center gap-1 text-[8px] text-white/80">
                                IT Department
                                <ChevronDown size={10} />
                            </div>

                        </div>

                    </div>

                </div>

            </header>

            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <main className="px-7 pb-6 pt-5">

                {/* PAGE TITLE */}

                <section className="mb-5 flex items-center gap-4">

                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                        <CalendarCheck2 size={37} />
                    </div>

                    <div>

                        <h1 className="text-[22px] font-extrabold text-[#071253]">
                            ATTENDANCE DASHBOARD
                        </h1>

                        <p className="mt-1 text-[11px] font-medium text-[#18235a]">
                            Overview of attendance status across the organization.
                        </p>

                    </div>

                </section>

                {/* =====================================================
                    ORGANIZATION STATISTICS
                ===================================================== */}

                <section className="rounded-lg border border-[#e3e8f2] bg-white px-4 py-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">

                    <div className="grid grid-cols-2 gap-y-6 md:grid-cols-3 xl:grid-cols-6">

                        {organizationStats.map((stat) => (

                            <div
                                key={stat.label}
                                className="flex items-center gap-3 border-r border-[#e5e9f1] px-4 last:border-r-0"
                            >

                                <div
                                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${stat.iconClass}`}
                                >
                                    {stat.icon}
                                </div>

                                <div>

                                    <div className="text-[10px] font-semibold text-[#1d2857]">
                                        {stat.label}
                                    </div>

                                    <div
                                        className={`mt-1 text-[20px] font-extrabold ${stat.valueClass}`}
                                    >
                                        {stat.value}
                                    </div>

                                    {stat.percentage ? (
                                        <div
                                            className={`mt-1 text-[9px] font-semibold ${stat.valueClass}`}
                                        >
                                            {stat.percentage}
                                        </div>
                                    ) : (
                                        <div className="mt-1 text-[8px] text-[#59647e]">
                                            {stat.subtitle}
                                        </div>
                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                    <div className="mt-5 text-center text-[9px] text-gray-500">
                        * Figures are for the selected date range
                    </div>

                </section>

                {/* =====================================================
                    SHIFT STATISTICS
                ===================================================== */}

                <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">

                    {/* PREVIOUS SHIFT */}

                    <ShiftStatisticsCard
                        title="PREVIOUS SHIFT"
                        shiftName="Previous Shift"
                        stats={previousShiftStats}
                        badgeClass="bg-purple-50 text-purple-600"
                        borderClass="border-purple-100"
                    />

                </section>

                {/* =====================================================
                    MODULE CARDS
                ===================================================== */}

                <section className="mt-4 rounded-lg border border-[#e4e9f2] p-5">

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

                        {moduleCards.map((card) => (

                            <div
                                key={card.title}
                                className={`flex min-h-[275px] flex-col items-center rounded-lg border border-b-[3px] p-5 ${card.containerClass}`}
                            >

                                {/* ICON */}

                                <div
                                    className={`flex h-20 w-20 items-center justify-center rounded-full ${card.iconContainerClass}`}
                                >

                                    <div className={card.iconClass}>
                                        {card.icon}
                                    </div>

                                </div>

                                {/* TITLE */}

                                <h2
                                    className={`mt-4 text-[16px] font-extrabold ${card.iconClass}`}
                                >
                                    {card.number} {card.title}
                                </h2>

                                {/* DESCRIPTION */}

                                <p className="mt-3 max-w-[220px] text-center text-[10px] font-medium leading-5 text-[#172252]">
                                    {card.description}
                                </p>

                                {/* BUTTON */}

                                <button
                                    type="button"
                                    className={`mt-auto flex h-[35px] w-full max-w-[190px] items-center justify-center gap-3 rounded-md border text-[10px] font-bold transition ${card.buttonClass}`}
                                  onClick={()=> navigate(card.url)}>

                                    {card.buttonText}

                                    <ArrowRight size={15} />

                                </button>

                            </div>

                        ))}

                    </div>

                </section>

                {/* =====================================================
                    INFORMATION
                ===================================================== */}

                <section className="mt-3 flex items-center gap-3 rounded-lg bg-[#f2f6ff] px-5 py-3">

                    <Info
                        size={18}
                        className="shrink-0 text-blue-600"
                    />

                    <div>

                        <div className="text-[10px] font-bold text-blue-700">
                            Information
                        </div>

                        <div className="mt-1 text-[9px] text-[#23305f]">
                            Use the company filter and date range to view attendance summary for a specific company or period.
                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
};

/* =============================================================
   SHIFT STATISTICS COMPONENT
============================================================= */

interface ShiftStatisticsCardProps {
    title: string;
    shiftName: string;
    stats: {
        label: string;
        value: string;
        percentage: string;
        icon: React.ReactNode;
        className: string;
        iconClass: string;
    }[];
    badgeClass: string;
    borderClass: string;
}

const ShiftStatisticsCard: React.FC<ShiftStatisticsCardProps> = ({
    title,
    shiftName,
    stats,
    badgeClass,
    borderClass,
}) => {
    return (
        <div
            className={`rounded-lg border ${borderClass} bg-white p-4`}
        >

            <div className="mb-4 flex items-center justify-between">

                <div className="flex items-center gap-2">

                    <div
                        className={`rounded-md px-3 py-1.5 text-[10px] font-extrabold ${badgeClass}`}
                    >
                        {title}
                    </div>

                    <span className="text-[10px] font-semibold text-gray-500">
                        {shiftName}
                    </span>

                </div>

                <Clock3
                    size={17}
                    className="text-gray-400"
                />

            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

                {stats.map((stat) => (

                    <div
                        key={stat.label}
                        className="flex items-center gap-2 rounded-md bg-[#fafbfe] px-3 py-2"
                    >

                        <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${stat.iconClass}`}
                        >
                            {stat.icon}
                        </div>

                        <div>

                            <div className="text-[8px] font-semibold text-gray-500">
                                {stat.label}
                            </div>

                            <div
                                className={`text-[16px] font-extrabold ${stat.className}`}
                            >
                                {stat.value}
                            </div>

                            <div
                                className={`text-[8px] font-semibold ${stat.className}`}
                            >
                                {stat.percentage}
                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default AttendanceDashboard;