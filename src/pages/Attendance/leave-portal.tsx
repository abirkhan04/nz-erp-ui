import React from "react";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    CircleUserRound,
    LogOut,
    Settings,
    ShieldCheck,
    FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCurrentShift } from "./utls/getCurrentShifts";

const LeavePortal: React.FC = () => {
    const leaveTypes = [
        "Casual Leave",
        "Earned Leave",
        "Medical Leave",
        "Maternity Leave",
        "Special Leave",
    ];

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const { currentShift } = useCurrentShift();

    const now = new Date();

    const date = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const day = now.toLocaleDateString("en-US", {
        weekday: "long",
    });

    return (
        <div className="flex min-h-screen flex-col bg-white text-[#07153f]">
            {/* Header */}
            <header className="bg-[#020f3d] text-white">
                <div className="flex h-[78px] items-center px-8">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="text-5xl font-bold italic text-cyan-400">
                            S
                        </div>

                        <div className="leading-none">
                            <div className="text-[27px] font-bold tracking-wide">
                                SYNEXIS
                            </div>
                            <div className="mt-1 text-[10px] font-semibold text-cyan-400">
                                Creating Enterprise Synergy
                            </div>
                        </div>
                    </div>

                    <div className="mx-8 h-10 w-px bg-cyan-400/50" />

                    {/* Portal title */}
                    <div className="flex-1 text-center">
                        <h1 className="text-[24px] font-bold tracking-wide">
                            LEAVE PORTAL
                        </h1>
                        <p className="mt-1 text-sm font-semibold text-cyan-400">
                            Forward Leave &amp; Leave Encashment to Attendance Cell
                        </p>
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-3">
                        <CircleUserRound
                            size={43}
                            strokeWidth={1.5}
                            className="text-white"
                        />

                        <div className="leading-tight">
                            <p className="text-sm font-bold">{user.userName}</p>
                            <p className="text-[11px] text-cyan-400">
                                Weaving Section - {currentShift?.shiftName.split("-")[0]} Shift
                            </p>
                        </div>

                        <div className="mx-4 h-10 w-px bg-cyan-400/50" />

                        <button className="flex flex-col items-center gap-1 text-cyan-400 hover:text-white">
                            <LogOut size={24} strokeWidth={1.7} />
                            <span className="text-[11px] text-white">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 px-10 py-4">
                {/* Top row */}
                <div className="flex items-center justify-between">
                    <button className="flex items-center gap-3 text-sm font-semibold text-[#0645d8] hover:underline" onClick={() => navigate("/production-floor-portal")}>
                        <ArrowLeft size={22} strokeWidth={1.5} />
                        Back to Dashboard
                    </button>

                    <div className="flex items-center gap-3 rounded-md border border-[#d9dfed] px-5 py-2 text-sm font-semibold">
                        <CalendarDays size={19} />
                        <span>{date}</span>
                        <span className="text-gray-400">|</span>
                        <span>{day}</span>
                    </div>
                </div>

                {/* Title */}
                <div className="mt-2 text-center">
                    <h2 className="text-[22px] font-bold">Leave Portal</h2>
                    <p className="mt-1 text-sm font-medium text-gray-500">
                        Please select an option to continue
                    </p>
                </div>

                {/* Cards */}
                <div className="mx-auto mt-5 grid max-w-[935px] grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Forward Leave */}
                    <div className="flex min-h-[382px] flex-col rounded-lg border border-[#aee5d7] bg-gradient-to-br from-[#fbfffe] to-[#f4faf9] px-12 py-5">
                        {/* Icon */}
                        <div className="mx-auto flex h-[76px] w-[100px] items-center justify-center rounded-full bg-[#c9f4e9]">
                            <CalendarDays
                                size={42}
                                strokeWidth={2.2}
                                className="text-[#008b68]"
                            />
                        </div>

                        <h3 className="mt-3 text-center text-[20px] font-bold text-[#008b68]">
                            FORWARD LEAVE
                        </h3>

                        <div className="mx-auto mt-2 h-px w-[305px] bg-[#008b68]" />

                        <p className="mt-3 text-center text-sm leading-5 text-[#536078]">
                            Forward all types of leave requests
                            <br />
                            to Attendance Cell
                        </p>

                        <div className="mt-3 space-y-1">
                            {leaveTypes.map((leave) => (
                                <div
                                    key={leave}
                                    className="flex items-center gap-2 text-[13px] font-semibold"
                                >
                                    <CheckCircle2
                                        size={17}
                                        fill="#008b68"
                                        className="text-white"
                                    />
                                    <span>{leave}</span>
                                </div>
                            ))}
                        </div>

                        <button className="mt-auto flex h-[34px] items-center justify-center gap-4 rounded-md bg-[#008b68] text-sm font-bold text-white transition hover:bg-[#00755a]"
                         onClick={()=> navigate("/forward-leave-request")}>
                            Go to Leave Forwarding
                            <ArrowRight size={22} />
                        </button>
                    </div>

                    {/* Leave Encashment */}
                    <div className="flex min-h-[382px] flex-col rounded-lg border border-[#b9d0ff] bg-gradient-to-br from-[#fbfcff] to-[#f3f6fd] px-12 py-5">
                        {/* Icon */}
                        <div className="mx-auto flex h-[76px] w-[100px] items-center justify-center rounded-full bg-[#d4e2ff]">
                            <FileText
                                size={43}
                                strokeWidth={2}
                                className="text-[#0752d8]"
                            />
                        </div>

                        <h3 className="mt-3 text-center text-[20px] font-bold text-[#0752d8]">
                            LEAVE ENCASHMENT
                        </h3>

                        <div className="mx-auto mt-2 h-px w-[305px] bg-[#6d9dff]" />

                        <p className="mt-3 text-center text-sm leading-5 text-[#536078]">
                            Forward Earned Leave encashment
                            <br />
                            requests to Attendance Cell
                        </p>

                        <button className="mt-auto flex h-[34px] items-center justify-center gap-4 rounded-md bg-[#0752d8] text-sm font-bold text-white transition hover:bg-[#0646b9]">
                            Go to Leave Encashment
                            <ArrowRight size={22} />
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto bg-[#020f3d] px-10 py-3 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <FooterItem
                            icon={<ShieldCheck size={28} />}
                            title="ACCURATE"
                            subtitle="Ensure accurate data"
                        />

                        <div className="h-7 w-px bg-cyan-400/40" />

                        <FooterItem
                            icon={<ShieldCheck size={28} />}
                            title="RELIABLE"
                            subtitle="Ensure reliability"
                        />

                        <div className="h-7 w-px bg-cyan-400/40" />

                        <FooterItem
                            icon={<Settings size={28} />}
                            title="INTEGRATED"
                            subtitle="Ensure integration"
                        />
                    </div>

                    <div className="text-sm">
                        <span className="mr-2 text-gray-300">Powered by</span>
                        <span className="text-lg font-bold">SYNEXIS ERP</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

interface FooterItemProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
}

const FooterItem: React.FC<FooterItemProps> = ({
    icon,
    title,
    subtitle,
}) => {
    return (
        <div className="flex items-center gap-3">
            <div className="text-cyan-400">{icon}</div>
            <div className="leading-tight">
                <div className="text-[11px] font-bold">{title}</div>
                <div className="text-[11px] text-gray-300">{subtitle}</div>
            </div>
        </div>
    );
};

export default LeavePortal;