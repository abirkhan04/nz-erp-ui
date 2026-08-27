import React from "react";
import {
  ArrowRight,
  CalendarDays,
  ClipboardClock,
  IdCard,
  Info,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PayrollAndWorkformMovement: React.FC = () => {
  const navigate = useNavigate();

  const currentDate = new Date();

  const formattedDate = currentDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const currentDay = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
  });

  return (
    <div className="min-h-screen bg-white text-[#10245c]">
      {/* Header */}
      <header className="flex h-[74px] items-center justify-between bg-gradient-to-r from-[#063bb8] to-[#07379d] px-8 text-white">
        <div className="flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center border-r border-white/30 pr-5">
            <span className="text-4xl font-bold">S</span>
          </div>

          <div>
            <h1 className="text-[20px] font-bold leading-tight">
              SYNEXIS
            </h1>
            <p className="text-[9px] tracking-wide">
              Creating Enterprise Synergy
            </p>
          </div>

          <div className="h-10 w-px bg-white/30" />

          <div>
            <h2 className="text-[18px] font-bold">
              PAYROLL &amp; WORKFORCE MOVEMENT SECTION
            </h2>
            <p className="text-[12px]">
              HR Branch &gt; Payroll &amp; Workforce Movement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {/* Current date */}
          <div className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#10245c] shadow-sm">
            <CalendarDays size={17} />
            <span>
              {formattedDate} | {currentDay}
            </span>
          </div>

          {/* User */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0b4bc4]">
              <UsersRound size={21} />
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold">Nusrat Jahan</p>
              <p className="text-[11px]">Section Incharge</p>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb / Welcome section */}
      <main className="px-12 py-6">
        <div className="rounded-lg border border-[#e3eafa] bg-[#f5f8ff] px-5 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e4edff]">
              <UsersRound size={27} className="text-[#0751d4]" />
            </div>

            <div>
              <h2 className="text-[20px] font-bold text-[#10245c]">
                Welcome to Payroll &amp; Workforce Movement Section
              </h2>
              <p className="mt-1 text-[13px] font-medium text-[#14265e]">
                Please select a module below to view and process the respective
                reports and requests.
              </p>
            </div>
          </div>
        </div>

        {/* Module cards */}
        <div className="mx-auto mt-7 grid max-w-[760px] grid-cols-2 gap-10">
          {/* Attendance Cell */}
          <div className="flex min-h-[280px] flex-col items-center rounded-lg border border-[#cbdcff] bg-[#f8faff] px-8 py-6 shadow-sm transition hover:shadow-md">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e6efff]">
              <ClipboardClock
                size={43}
                strokeWidth={2.5}
                className="text-[#0951d7]"
              />
            </div>

            <h3 className="mt-5 text-[20px] font-bold text-[#064ad0]">
              Attendance Cell
            </h3>

            <p className="mt-2 text-center text-[12px] leading-5 text-[#17265c]">
              View and process all attendance related reports,
              <br />
              requests and exceptions forwarded by Attendance Cell.
            </p>

            <button
              type="button"
              onClick={() => navigate("/payroll-and-workforce-movement/attendance-cell")}
              className="mt-auto flex w-[208px] items-center justify-center gap-3 rounded-md bg-[#084bd3] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#063fb5]"
            >
              Go to Attendance Cell
              <ArrowRight size={19} />
            </button>
          </div>

          {/* Employee Movement Cell */}
          <div className="flex min-h-[280px] flex-col items-center rounded-lg border border-[#cfe9dc] bg-[#f7fcf9] px-8 py-6 shadow-sm transition hover:shadow-md">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e7f6ed]">
              <IdCard
                size={43}
                strokeWidth={2.5}
                className="text-[#008b3e]"
              />
            </div>

            <h3 className="mt-5 text-[20px] font-bold text-[#008b3e]">
              Employee Movement Cell
            </h3>

            <p className="mt-2 text-center text-[12px] leading-5 text-[#173d2a]">
              View and process all employee movement related reports,
              <br />
              requests and actions forwarded by Employee Movement Cell.
            </p>

            <button
              type="button"
              onClick={() => navigate("/employee-movement-cell")}
              className="mt-auto flex w-[260px] items-center justify-center gap-3 rounded-md bg-[#079442] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#057b37]"
            >
              Go to Employee Movement Cell
              <ArrowRight size={19} />
            </button>
          </div>
        </div>

        {/* Information message */}
        <div className="mt-11 flex items-center gap-3 rounded-lg border border-[#e1e9f9] bg-[#f6f9ff] px-5 py-3 text-[12px] font-medium text-[#1246bd]">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0a50d1] text-white">
            <Info size={13} />
          </div>

          <span>
            Please ensure all pending items in the respective modules are
            reviewed and forwarded to the next level in a timely manner.
          </span>
        </div>
      </main>
    </div>
  );
};

export default PayrollAndWorkformMovement;
