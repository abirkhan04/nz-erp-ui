import React from "react";
import {
    ArrowRight,
    BarChart3,
    CalendarDays,
    ClipboardPenLine,

    Info,
    ArrowLeft,
    UserRound,

    UserRoundCog,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import RequestForwardingFlow from "./shared/RequestForwardingFlow";

const EmployeeIncrementAndPromotion: React.FC = () => {
    const navigate = useNavigate();

    const today = new Date();

    const formattedDate = today.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const dayName = today.toLocaleDateString("en-US", {
        weekday: "long",
    });

    const requestTypes = [
        {
            title: "PERFORMANCE INCREMENT",
            description: (
                <>
                    Request increment based on employee
                    <br />
                    performance over and above 5% annual
                    <br />
                    increment.
                </>
            ),
            buttonText: "Create Performance Increment Request",
            icon: BarChart3,
            cardClass:
                "border-[#bfe8d1] bg-gradient-to-br from-[#f8fffa] to-[#eefaf3]",
            iconClass:
                "bg-white text-[#009b4d] border-[#d8f0e1]",
            titleClass: "text-[#008f43]",
            buttonClass:
                "bg-[#009b4d] hover:bg-[#00843f]",
            path: "/employee-increment/performance",
        },
        {
            title: "ADJUSTMENT INCREMENT",
            description: (
                <>
                    Request salary adjustment (e.g. learner to
                    <br />
                    standard rate or any other adjustment).
                </>
            ),
            buttonText: "Create Adjustment Increment Request",
            icon: ClipboardPenLine,
            cardClass:
                "border-[#ffd7b3] bg-gradient-to-br from-[#fffaf5] to-[#fff4e9]",
            iconClass:
                "bg-white text-[#ff6b00] border-[#ffe0c2]",
            titleClass: "text-[#f56500]",
            buttonClass:
                "bg-[#ff6900] hover:bg-[#ed5f00]",
            path: "/employee-increment/adjustment",
        },
        {
            title: "PROMOTION + INCREMENT",
            description: (
                <>
                    Request promotion with designation change
                    <br />
                    and increment.
                </>
            ),
            buttonText: "Create Promotion + Increment Request",
            icon: UserRoundCog,
            cardClass:
                "border-[#dccbff] bg-gradient-to-br from-[#fcfaff] to-[#f7f1ff]",
            iconClass:
                "bg-white text-[#5714d8] border-[#e5d9ff]",
            titleClass: "text-[#5914d9]",
            buttonClass:
                "bg-[#5b16d8] hover:bg-[#4d10bd]",
            path: "/employee-increment/promotion",
        },
    ];



    return (
        <div className="min-h-screen bg-white text-[#101b4b]">

            {/* ================================================================ */}
            {/* TOP BAR                                                          */}
            {/* ================================================================ */}

            <header className="h-[60px] bg-[#00194f] px-7 text-white">

                <div className="flex h-full items-center justify-between">

                    {/* Left */}
                    <div className="flex h-full items-center">

                        {/* Logo */}
                        <div className="flex items-center gap-3 pr-6">

                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white">
                                <span className="text-[28px] font-extrabold text-[#00194f]">
                                    S
                                </span>
                            </div>

                            <div>
                                <div className="text-[21px] font-extrabold leading-none tracking-wide">
                                    SYNEXIS
                                </div>

                                <div className="mt-[2px] text-[8px] text-[#00c8ef]">
                                    Creating Enterprise Synergy
                                </div>
                            </div>

                        </div>

                        <div className="h-[40px] w-px bg-[#52709e]" />

                        {/* Page title */}
                        <div className="pl-5">

                            <h1 className="text-[15px] font-bold tracking-wide">
                                PRODUCTION FLOOR – EMPLOYEE INCREMENT / PROMOTION REQUEST
                            </h1>

                            <div className="mt-[2px] text-[9px] text-white/90">
                                Dashboard
                                <span className="mx-2 text-[#7d91b8]">
                                    &gt;
                                </span>
                                Production Floor
                                <span className="mx-2 text-[#7d91b8]">
                                    &gt;
                                </span>
                                Employee Increment / Promotion Request
                            </div>

                        </div>

                    </div>

                    {/* Right */}
                    <div className="flex h-full items-center gap-5">

                        {/* Date */}
                        <div className="flex items-center gap-3 rounded-md bg-white px-4 py-2 text-[11px] font-semibold text-[#17244e]">

                            <CalendarDays
                                size={16}
                                className="text-[#16244e]"
                            />

                            <span>
                                {formattedDate}
                            </span>

                            <span className="text-gray-300">
                                |
                            </span>

                            <span>
                                {dayName}
                            </span>

                        </div>

                        <div className="h-[38px] w-px bg-[#52709e]" />

                        {/* User */}
                        <div className="flex items-center gap-2">

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#00194f]">
                                <UserRound size={20} />
                            </div>

                            <div className="leading-tight">

                                <div className="text-[10px] font-semibold">
                                    Production Incharge
                                </div>

                                <div className="mt-1 text-[9px] text-white">
                                    Spinning Department
                                    <span className="ml-1">
                                        ⌄
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </header>

            <div>
                <button
                    type="button"
                    className="flex items-center gap-2 text-sm font-semibold text-[#1554d1]"
                    onClick={() =>
                        navigate("/production-floor-portal")
                    }
                >
                    <ArrowLeft size={20} />

                    Back to Production Floor Portal
                </button>
            </div>

            {/* ================================================================ */}
            {/* MAIN                                                              */}
            {/* ================================================================ */}

            <main className="px-7 pb-6 pt-4">

                {/* Page heading */}
                <section>

                    <h2 className="text-[17px] font-bold text-[#06168b]">
                        EMPLOYEE INCREMENT / PROMOTION REQUEST
                    </h2>

                    <p className="mt-1 text-[11px] text-[#19245b]">
                        Create and forward employee increment or promotion
                        requests for approval as per company policy.
                    </p>

                    <p className="mt-2 text-[11px] font-bold text-[#174bd4]">
                        Please choose the type of request you want to create.
                    </p>

                </section>

                {/* ============================================================ */}
                {/* REQUEST TYPE CARDS                                           */}
                {/* ============================================================ */}

                <section className="mt-5 grid grid-cols-1 gap-8 md:grid-cols-3">

                    {requestTypes.map((item) => {

                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className={`flex min-h-[257px] flex-col rounded-lg border px-5 py-4 ${item.cardClass}`}
                            >

                                {/* Icon */}
                                <div className="flex justify-center">

                                    <div
                                        className={`flex h-[76px] w-[76px] items-center justify-center rounded-full border-2 ${item.iconClass}`}
                                    >
                                        <Icon
                                            size={43}
                                            strokeWidth={2.3}
                                        />
                                    </div>

                                </div>

                                {/* Title */}
                                <h3
                                    className={`mt-3 text-center text-[15px] font-extrabold ${item.titleClass}`}
                                >
                                    {item.title}
                                </h3>

                                {/* Description */}
                                <p className="mt-2 text-center text-[11px] font-medium leading-5 text-[#19245b]">
                                    {item.description}
                                </p>

                                {/* Button */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(item.path)
                                    }
                                    className={`mt-auto flex h-[35px] items-center justify-center gap-3 rounded-md px-4 text-[11px] font-bold text-white transition ${item.buttonClass}`}
                                >
                                    {item.buttonText}

                                    <ArrowRight
                                        size={17}
                                        strokeWidth={2}
                                    />
                                </button>

                            </div>
                        );
                    })}

                </section>

                {/* ============================================================ */}
                {/* REQUEST FORWARDING FLOW                                      */}
                {/* ============================================================ */}

                <section className="mt-7 rounded-lg border border-[#e0e5ef] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">

                    <div className="flex items-start">

                        {/* Flow title */}
                        <div className="w-[205px] shrink-0">

                            <h3 className="text-[12px] font-extrabold text-[#071990]">
                                REQUEST FORWARDING FLOW
                            </h3>

                            <p className="mt-3 text-[11px] font-medium leading-5 text-[#19245b]">
                                All requests will follow the
                                <br />
                                approval workflow below.
                            </p>

                        </div>

                        {/* Workflow */}
                       <RequestForwardingFlow />

                    </div>

                </section>

                {/* ============================================================ */}
                {/* BOTTOM INFORMATION                                            */}
                {/* ============================================================ */}

                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-medium text-[#174bd4]">

                    <Info
                        size={15}
                        fill="currentColor"
                        className="text-[#174bd4]"
                    />

                    <span>
                        Only after CEO final approval, the request will be
                        implemented in the system.
                    </span>

                </div>

            </main>
        </div>
    );
};

export default EmployeeIncrementAndPromotion;
