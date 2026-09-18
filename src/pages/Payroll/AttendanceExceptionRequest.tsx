import React from "react";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CircleUserRound,
    FileUser,
    Info,
    WalletCards,
} from "lucide-react";
import { useNavigate } from "react-router-dom";


const AttendanceExceptionRequests: React.FC = () => {

        const navigate = useNavigate();

        const onNormalRequests = () => {
            navigate("/payroll-and-workforce-movement/attendance-cell/exception-request/normal");
        }

        const onPayrollAdjustmentRequests = () => {
            navigate("/payroll-and-workforce-movement/attendance-cell/exception-request/payroll-adjustment");
        }
        
        const onBack = () => {
            navigate("/payroll-and-workforce-movement/attendance-cell");
        }
        return (
            <div className="min-h-screen bg-white text-[#111b4b]">
                {/* ================= HEADER ================= */}
                <header className="bg-[#092b87] text-white">
                    <div className="flex min-h-[78px] items-center justify-between px-6">
                        {/* Logo + Company */}
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center">
                                <span className="text-[52px] font-bold leading-none">S</span>
                            </div>

                            <div className="border-r border-white/30 pr-5">
                                <div className="text-[17px] font-bold tracking-tight">
                                    SYNEXIS
                                </div>
                                <div className="text-[9px] font-medium">
                                    Creating Enterprise Synergy
                                </div>
                            </div>

                            <div className="pl-1">
                                <h1 className="text-[16px] font-bold uppercase">
                                    PAYROLL &amp; WORKFORCE MOVEMENT SECTION – ATTENDANCE CELL
                                </h1>

                                <div className="mt-1 text-[11px] text-white/80">
                                    Dashboard
                                    <span className="mx-2">&gt;</span>
                                    Attendance Cell
                                    <span className="mx-2">&gt;</span>
                                    Attendance Exception Requests
                                </div>
                            </div>
                        </div>

                        {/* Date + User */}
                        <div className="flex items-center gap-5">
                            <div className="flex items-center gap-3 rounded-md bg-white px-4 py-2.5 text-[#17275f] shadow-sm">
                                <CalendarDays size={18} strokeWidth={2} />

                                <span className="text-[11px] font-semibold">
                                    15 May 2025 | Thursday
                                </span>
                            </div>

                            <div className="flex items-center gap-2 border-l border-white/30 pl-5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                                    <CircleUserRound
                                        size={25}
                                        className="text-[#19398e]"
                                    />
                                </div>

                                <div>
                                    <div className="text-[11px] font-semibold">
                                        Nusrat Jahan
                                    </div>
                                    <div className="text-[10px] text-white/75">
                                        Section Incharge
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ================= PAGE CONTENT ================= */}
                <main className="px-8 py-5">
                    {/* Back Button */}
                    <button
                        type="button"
                        onClick={onBack}
                        className="mb-5 flex h-9 items-center gap-2 rounded-md border border-[#b9ccff] bg-white px-4 text-[12px] font-semibold text-[#1450e6] transition hover:bg-[#f4f7ff]"
                    >
                        <ArrowLeft size={16} />
                        Back to Attendance Cell Dashboard
                    </button>

                    {/* Main Card */}
                    <section className="overflow-hidden rounded-lg border border-[#dce4f4] bg-white shadow-[0_1px_4px_rgba(20,50,120,0.03)]">
                        {/* Card Heading */}
                        <div className="border-b border-[#e5eaf4] bg-[#f9fbff] px-5 py-5">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1252df] text-white">
                                    <Info size={13} strokeWidth={3} />
                                </div>

                                <div>
                                    <h2 className="text-[16px] font-bold text-[#0649db]">
                                        Attendance Exception Requests
                                    </h2>

                                    <p className="mt-4 text-[12px] font-medium text-[#17204b]">
                                        Please select the type of request you want to raise or
                                        manage.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Request Options */}
                        <div className="px-12 py-7">
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                {/* ================= NORMAL EXCEPTION ================= */}
                                <div className="rounded-lg border border-[#cbd9ff] bg-white p-6">
                                    <div className="flex gap-5">
                                        {/* Icon */}
                                        <div className="flex h-[90px] w-[90px] shrink-0 items-center justify-center rounded-full bg-[#e9efff]">
                                            <div className="relative">
                                                <FileUser
                                                    size={43}
                                                    strokeWidth={2.2}
                                                    className="text-[#0751e5]"
                                                />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="pt-1">
                                            <h3 className="text-[16px] font-bold uppercase text-[#084bdd]">
                                                Normal Exception Requests
                                            </h3>

                                            <p className="mt-4 max-w-[410px] text-[12px] font-medium leading-[1.65] text-[#17204b]">
                                                Raise or manage exceptions related to missing punch,
                                                shift correction, attendance correction, leave
                                                correction, OT correction and other regular issues.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Button */}
                                    <button
                                        type="button"
                                        onClick={onNormalRequests}
                                        className="mt-8 flex h-[45px] w-full items-center justify-center rounded-md bg-[#084ee8] px-5 text-[13px] font-bold text-white transition hover:bg-[#063fc0]"
                                    >
                                        <span>Go to Normal Exception Requests</span>

                                        <ArrowRight
                                            size={25}
                                            strokeWidth={1.8}
                                            className="ml-auto"
                                        />
                                    </button>
                                </div>

                                {/* ================= PAYROLL ADJUSTMENT ================= */}
                                <div className="rounded-lg border border-[#ffdcc0] bg-[#fffdfb] p-6">
                                    <div className="flex gap-5">
                                        {/* Icon */}
                                        <div className="flex h-[90px] w-[90px] shrink-0 items-center justify-center rounded-full bg-[#fff0e4]">
                                            <div className="relative">
                                                <WalletCards
                                                    size={43}
                                                    strokeWidth={2.2}
                                                    className="text-[#ff7000]"
                                                />

                                                <span className="absolute -bottom-1 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#ff7000] text-white">
                                                    <span className="text-[13px] font-bold">$</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="pt-1">
                                            <h3 className="text-[16px] font-bold uppercase leading-6 text-[#f76a00]">
                                                Payroll Adjustment Requests
                                                <br />
                                                (Post-Lock)
                                            </h3>

                                            <p className="mt-3 max-w-[410px] text-[12px] font-medium leading-[1.65] text-[#17204b]">
                                                Raise or manage post-lock attendance corrections and
                                                other adjustments that have financial impact and
                                                require Head Office IT approval for payroll.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Button */}
                                    <button
                                        type="button"
                                        onClick={onPayrollAdjustmentRequests}
                                        className="mt-8 flex h-[45px] w-full items-center justify-center rounded-md bg-[#ff7200] px-5 text-[13px] font-bold text-white transition hover:bg-[#e86300]"
                                    >
                                        <span>Go to Payroll Adjustment Requests</span>

                                        <ArrowRight
                                            size={25}
                                            strokeWidth={1.8}
                                            className="ml-auto"
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* ================= NOTE ================= */}
                            <div className="mt-8 flex items-center gap-3 rounded-md border border-[#dce5f7] bg-[#f9fbff] px-5 py-4">
                                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1252df] text-white">
                                    <Info size={13} strokeWidth={3} />
                                </div>

                                <p className="text-[12px] font-medium text-[#17306d]">
                                    <span className="font-bold">Note:</span>{" "}
                                    Post-lock adjustments will be forwarded to Head Office IT for
                                    approval.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        );
    };

export default AttendanceExceptionRequests;
