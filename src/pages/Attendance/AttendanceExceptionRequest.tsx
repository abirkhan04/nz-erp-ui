import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  FileText,
  Info,
  UserRound,
  WalletCards,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AttendanceExceptionRequest: React.FC = () => {
  const navigate = useNavigate();

  const currentDate = new Date();

  const formattedDate = currentDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const currentDay = currentDate.toLocaleDateString("en-GB", {
    weekday: "long",
  });

  const handleNormalException = () => {
    // console.log("Go to Normal Exception Requests");
     navigate("/attendance-cell/exception-request/normal-exception-requests");
  };

  const handlePayrollAdjustment = () => {
    //console.log("Go to Payroll Adjustment Requests");
     navigate("/attendance-cell/exception-request/payroll-adjustment-requests");
  };

  const handleBack = () => {
    navigate("/attendance-cell");
  };

  return (
    <div className="min-h-screen bg-white text-[#172554]">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="bg-[#073da8] text-white">
        <div className="flex min-h-[78px] items-center justify-between px-5">
          {/* LEFT */}

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center text-[48px] font-bold leading-none">
                S
              </div>

              <div className="ml-1">
                <div className="text-[23px] font-bold leading-none">
                  SYNEXIS
                </div>

                <div className="mt-1 text-[7px]">
                  Creating Enterprise Synergy
                </div>
              </div>
            </div>

            <div className="h-10 w-px bg-white/30" />

            <div>
              <h1 className="text-[16px] font-bold tracking-wide">
                PAYROLL & WORKFORCE MOVEMENT SECTION – ATTENDANCE
                CELL
              </h1>

              <div className="mt-1 text-[11px]">
                Dashboard&nbsp; &gt;&nbsp; Attendance Cell
                &nbsp;&gt;&nbsp; Attendance Exception Requests
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-[11px] font-semibold text-[#172554]">
              <CalendarDays size={16} />

              <span>
                {formattedDate} | {currentDay}
              </span>
            </div>

            <div className="h-10 w-px bg-white/30" />

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0a45b8]">
                <UserRound size={20} />
              </div>

              <div className="text-[10px]">
                <div className="font-semibold">Nusrat Jahan</div>

                <div className="text-white/80">
                  Section Incharge
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="px-8 py-5">
        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={handleBack}
          className="mb-5 flex items-center gap-2 rounded-md border border-[#a9c4ff] bg-white px-4 py-2.5 text-[12px] font-semibold text-[#0645bd] transition hover:bg-blue-50"
        >
          <ArrowLeft size={17} />
          Back to Attendance Cell Dashboard
        </button>

        {/* ===================================================
            MAIN CARD
        =================================================== */}

        <section className="overflow-hidden rounded-md border border-[#dce5f5] bg-white shadow-sm">
          {/* CARD HEADER */}

          <div className="border-b border-[#dce5f5] bg-gradient-to-r from-[#f7faff] to-white px-5 py-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0b4dcc] text-white">
                <Info size={15} />
              </div>

              <div>
                <h2 className="text-[16px] font-bold text-[#0645bd]">
                  Attendance Exception Requests
                </h2>

                <p className="mt-3 text-[13px] text-[#172554]">
                  Please select the type of request you want to
                  raise or manage.
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              REQUEST OPTIONS
          ================================================= */}

          <div className="px-16 py-7">
            <div className="grid grid-cols-2 items-stretch gap-9">
              {/* =================================================
                  NORMAL EXCEPTION
              ================================================= */}

              <div className="flex h-full flex-col rounded-lg border border-[#b9d0ff] bg-gradient-to-br from-white to-[#f8faff] p-6">
                {/* CONTENT */}

                <div className="flex flex-1 gap-5">
                  <div className="flex h-[90px] w-[90px] shrink-0 items-center justify-center rounded-full bg-[#e5edff]">
                    <FileText
                      size={43}
                      strokeWidth={2}
                      className="text-[#0a4fe4]"
                    />
                  </div>

                  <div className="pt-1">
                    <h3 className="text-[16px] font-bold leading-6 text-[#0645bd]">
                      NORMAL EXCEPTION REQUESTS
                    </h3>

                    <p className="mt-4 text-[13px] leading-6 text-[#172554]">
                      Raise or manage exceptions related to
                      missing punch, shift correction, attendance
                      correction, leave correction, OT correction
                      and other regular issues.
                    </p>
                  </div>
                </div>

                {/* BUTTON */}

                <button
                  type="button"
                  onClick={handleNormalException}
                  className="mt-8 flex w-full items-center justify-between rounded-md bg-[#0849e8] px-6 py-3 text-[13px] font-bold text-white transition hover:bg-[#063dcc]"
                
                >
                  <span>
                    Go to Normal Exception Requests
                  </span>

                  <ArrowRight size={23} />
                </button>
              </div>

              {/* =================================================
                  PAYROLL ADJUSTMENT
              ================================================= */}

              <div className="flex h-full flex-col rounded-lg border border-[#ffd9bc] bg-gradient-to-br from-white to-[#fffaf6] p-6">
                {/* CONTENT */}

                <div className="flex flex-1 gap-5">
                  <div className="flex h-[90px] w-[90px] shrink-0 items-center justify-center rounded-full bg-[#fff0e2]">
                    <WalletCards
                      size={43}
                      strokeWidth={2}
                      className="text-[#ff7200]"
                    />
                  </div>

                  <div className="pt-1">
                    <h3 className="text-[16px] font-bold leading-6 text-[#f97316]">
                      PAYROLL ADJUSTMENT REQUESTS
                      <br />
                      (POST-LOCK)
                    </h3>

                    <p className="mt-4 text-[13px] leading-6 text-[#172554]">
                      Raise or manage post-lock attendance
                      corrections and other adjustments that have
                      financial impact and require Head Office IT
                      approval for payroll.
                    </p>
                  </div>
                </div>

                {/* BUTTON */}

                <button
                  type="button"
                  onClick={handlePayrollAdjustment}
                  className="mt-8 flex w-full items-center justify-between rounded-md bg-[#ff7800] px-6 py-3 text-[13px] font-bold text-white transition hover:bg-[#ed6900]"
                >
                  <span>
                    Go to Payroll Adjustment Requests
                  </span>

                  <ArrowRight size={23} />
                </button>
              </div>
            </div>
          </div>

          {/* =================================================
              NOTE
          ================================================= */}

          <div className="mx-14 mb-6 flex items-center gap-3 rounded-md border border-[#e0e8f6] bg-[#f8faff] px-5 py-4">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0b4dcc] text-white">
              <Info size={14} />
            </div>

            <p className="text-[12px]">
              <span className="font-bold">Note:</span>{" "}
              Post-lock adjustments will be forwarded to{" "}
              <span className="font-semibold text-[#0645bd]">
                Head Office IT
              </span>{" "}
              for approval.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AttendanceExceptionRequest;