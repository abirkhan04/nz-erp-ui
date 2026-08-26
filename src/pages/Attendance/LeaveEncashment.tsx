import React from "react";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CircleUserRound,
    LogOut,
    Settings,
    HandCoins,
    Heart,
    ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCurrentShift } from "./utls/getCurrentShifts";

const LeaveEncashment: React.FC = () => {

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
            {/* Main */}
            <main className="flex-1 px-10 py-4">
                {/* Top row */}
                <div className="flex items-center justify-between">
                    <button
                        className="flex items-center gap-3 text-sm font-semibold text-[#0645d8] hover:underline"
                        onClick={() => navigate("/leave-portal")}
                    >
                        <ArrowLeft size={22} strokeWidth={1.5} />
                        Back to Leave Portal
                    </button>

                    <div className="flex items-center gap-3 rounded-md border border-[#d9dfed] px-5 py-2 text-sm font-semibold">
                        <CalendarDays size={19} />
                        <span>{date}</span>
                        <span className="text-gray-400">|</span>
                        <span>{day}</span>
                    </div>
                </div>

                {/* Title */}
                <div className="mt-8 text-center">
                    <h2 className="text-[18px] font-bold text-[#07153f]">
                        SELECT LEAVE ENCASHMENT TYPE
                    </h2>

                    <div className="mx-auto mt-2 h-[2px] w-[38px] bg-[#0752d8]" />

                    <p className="mt-3 text-sm font-medium text-[#536078]">
                        Please select the type of leave encashment request you want to
                        forward.
                    </p>
                </div>

                {/* Encashment Types */}
                <div className="mx-auto mt-7 grid max-w-[725px] grid-cols-1 gap-9 md:grid-cols-2">
                    {/* Earned Leave Encashment */}
                    <div className="flex min-h-[335px] flex-col rounded-lg border border-[#dce5f2] bg-gradient-to-br from-[#ffffff] to-[#f8fbff] px-10 py-6">
                        {/* Icon */}
                        <div className="mx-auto flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[#dff5ed]">
                            <HandCoins
                                size={51}
                                strokeWidth={1.8}
                                className="text-[#008b68]"
                            />
                        </div>

                        <h3 className="mt-4 text-center text-[18px] font-bold text-[#008b68]">
                            EARNED LEAVE ENCASHMENT
                        </h3>

                        <div className="mx-auto mt-3 h-px w-[150px] bg-[#66c9b0]" />

                        <p className="mt-4 text-center text-sm leading-6 text-[#536078]">
                            Encashment of earned (unutilized)
                            <br />
                            leave balance as per policy.
                        </p>

                        <button
                            className="mt-auto flex h-[41px] items-center justify-center gap-3 rounded-md bg-[#008b68] text-sm font-bold text-white transition hover:bg-[#00755a]"
                            onClick={() => navigate("/earned-leave-encashment")}
                        >
                            Proceed
                            <ArrowRight size={22} />
                        </button>
                    </div>

                    {/* Maternity Leave Encashment */}
                    <div className="flex min-h-[335px] flex-col rounded-lg border border-[#dce5f2] bg-gradient-to-br from-[#ffffff] to-[#f8fbff] px-10 py-6">
                        {/* Icon */}
                        <div className="mx-auto flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[#dce8ff]">
                            <Heart
                                size={51}
                                strokeWidth={1.8}
                                className="text-[#0752d8]"
                            />
                        </div>

                        <h3 className="mt-4 text-center text-[18px] font-bold text-[#0752d8]">
                            MATERNITY LEAVE ENCASHMENT
                        </h3>

                        <div className="mx-auto mt-3 h-px w-[150px] bg-[#7ca5ff]" />

                        <p className="mt-4 text-center text-sm leading-6 text-[#536078]">
                            Encashment of maternity leave
                            <br />
                            (Pre-delivery &amp; Post-delivery) in two installments.
                        </p>

                        <button
                            className="mt-auto flex h-[41px] items-center justify-center gap-3 rounded-md bg-[#0752d8] text-sm font-bold text-white transition hover:bg-[#0646b9]"
                            onClick={() => navigate("/maternity-leave-encashment")}
                        >
                            Proceed
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

export default LeaveEncashment;
