import React from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  FileWarning,
  HandCoins,
  Info,
  LogOut,
  UsersRound,
  UserRoundCheck,
  UserRoundX,
  WalletCards,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PayrollAttendanceCell: React.FC = () => {
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

  const requestCards = [
    {
      title: "LEAVE REQUESTS",
      count: "18",
      subtitle: "Pending Verification",
      icon: CalendarDays,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      border: "border-blue-100",
      button: "bg-blue-600 hover:bg-blue-700",
      url: "leave-requests"
    },
    {
      title: "EARNED LEAVE\nENCASHMENT REQUESTS",
      count: "06",
      subtitle: "Pending Verification",
      icon: WalletCards,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      border: "border-green-100",
      button: "bg-green-600 hover:bg-green-700",
      url: "earned-leave-encashment-request"
    },
    {
      title: "MATERNITY LEAVE\nENCASHMENT REQUESTS",
      count: "04",
      subtitle: "Pending Verification",
      icon: UserRoundCheck,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      border: "border-purple-100",
      button: "bg-purple-600 hover:bg-purple-700",
      url: "maternity-leave-encashment-request"
    },
    {
      title: "EXCEPTION REQUESTS\n(FROM TIME OFFICE)",
      count: "11",
      subtitle: "Pending Verification",
      icon: AlertTriangle,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      border: "border-orange-100",
      button: "bg-orange-500 hover:bg-orange-600",
      url: "exception-request"
    },
    {
      title: "LEAVE WITHOUT\nPAY REQUESTS",
      count: "09",
      subtitle: "Pending Verification",
      icon: HandCoins,
      iconBg: "bg-cyan-50",
      iconColor: "text-cyan-600",
      border: "border-cyan-100",
      button: "bg-cyan-600 hover:bg-cyan-700",
      url: "leave-without-pay-request"
    },
  ];

  const quickLinks = [
    {
      title: "Attendance Reports",
      icon: Clock3,
      url: "/attendance-reports",
    },
    {
      title: "Daily Attendance Summary",
      icon: UsersRound,
      url: "/daily-attendance-summary",
    },
    {
      title: "Shift Summary Report",
      icon: Clock3,
      url: "/shift-summary-report",
    },
    {
      title: "Exception Summary Report",
      icon: AlertTriangle,
      url: "/exception-summary-report",
    },
    {
      title: "Punch Missing Report",
      icon: FileWarning,
      url: "/punch-missing-report",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#10245c]">
      {/* Header */}
      <header className="flex h-[66px] items-center justify-between bg-gradient-to-r from-[#063bb8] to-[#07379d] px-7 text-white">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="text-[42px] font-bold leading-none">S</span>

            <div>
              <h1 className="text-[20px] font-bold leading-none">
                SYNEXIS
              </h1>
              <p className="mt-1 text-[8px]">
                Creating Enterprise Synergy
              </p>
            </div>
          </div>

          <div className="h-10 w-px bg-white/30" />

          {/* Section title */}
          <div>
            <h2 className="text-[16px] font-bold leading-tight">
              PAYROLL &amp; WORKFORCE MOVEMENT SECTION – ATTENDANCE CELL
            </h2>

            <p className="mt-1 text-[12px]">
              Dashboard&nbsp; &gt;&nbsp; Attendance&nbsp; &gt;&nbsp; Section
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-[11px] font-semibold text-[#10245c]">
            <CalendarDays size={15} />
            <span>
              {formattedDate} | {currentDay}
            </span>
          </div>

          <div className="flex items-center gap-2 border-l border-white/30 pl-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0a48c7]">
              <UsersRound size={20} />
            </div>

            <div>
              <p className="text-[11px] font-semibold">Nusrat Jahan</p>
              <p className="text-[9px]">Section Incharge</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-7 py-3">
        {/* Welcome */}
        <section className="rounded-md border border-[#e1e8f7] bg-[#f6f9ff] px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e4edff]">
              <Info size={16} className="text-[#0751d4]" />
            </div>

            <div>
              <h2 className="text-[14px] font-bold text-[#073fae]">
                Welcome to Attendance Cell
              </h2>

              <p className="mt-0.5 text-[10px] text-[#14265e]">
                View overall attendance summary and manage requests forwarded
                by Attendance Cell.
              </p>
            </div>
          </div>
        </section>

        {/* Shift summary */}
        <section className="mt-3 grid grid-cols-2 gap-4">
          {/* Current Shift */}
          <div className="rounded-md border border-[#e1e8f7] bg-white">
            <div className="flex h-[32px] items-center justify-between border-b border-[#edf0f6] px-3">
              <h3 className="text-[11px] font-bold text-[#073fae]">
                1.&nbsp; CURRENT SHIFT
                <span className="ml-1 text-[9px] font-semibold">
                  (INCOMING)
                </span>
              </h3>

              <div className="flex items-center gap-3">
                <span className="rounded bg-green-600 px-2 py-0.5 text-[8px] font-bold text-white">
                  SHIFT A
                </span>

                <span className="text-[9px] font-semibold text-[#182d70]">
                  06:00 AM - 02:00 PM
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 px-2 py-3">
              {/* Present */}
              <div className="flex items-center justify-center gap-3 border-r border-[#edf0f6]">
                <UserRoundCheck
                  size={28}
                  className="text-green-600"
                />

                <div>
                  <p className="text-[8px] font-bold text-[#1b2b65]">
                    PRESENT
                  </p>
                  <p className="mt-1 text-[21px] font-bold text-green-600">
                    1,256
                  </p>
                </div>
              </div>

              {/* Absent */}
              <div className="flex items-center justify-center gap-3 border-r border-[#edf0f6]">
                <UserRoundX
                  size={28}
                  className="text-red-600"
                />

                <div>
                  <p className="text-[8px] font-bold text-[#1b2b65]">
                    ABSENT
                  </p>
                  <p className="mt-1 text-[21px] font-bold text-red-600">
                    87
                  </p>
                </div>
              </div>

              {/* Punch Missing */}
              <div className="flex items-center justify-center gap-3">
                <Clock3
                  size={29}
                  className="text-orange-500"
                />

                <div>
                  <p className="text-[8px] font-bold text-[#1b2b65]">
                    PUNCH MISSING
                  </p>
                  <p className="mt-1 text-[21px] font-bold text-orange-500">
                    46
                  </p>
                </div>
              </div>
            </div>

            <div className="mx-2 mb-2 flex items-center gap-2 rounded border border-[#edf0f6] bg-[#f8faff] px-2 py-1.5 text-[8px]">
              <Info size={12} className="text-[#0751d4]" />

              <span className="font-bold text-[#17265e]">
                Last Punch Time:
              </span>

              <span className="font-bold text-green-600">
                06:48 AM
              </span>
            </div>
          </div>

          {/* Previous Shift */}
          <div className="rounded-md border border-[#e1e8f7] bg-white">
            <div className="flex h-[32px] items-center justify-between border-b border-[#edf0f6] px-3">
              <h3 className="text-[11px] font-bold text-[#073fae]">
                2.&nbsp; PREVIOUS SHIFT
                <span className="ml-1 text-[9px] font-semibold">
                  (OUTGOING)
                </span>
              </h3>

              <div className="flex items-center gap-3">
                <span className="rounded bg-blue-600 px-2 py-0.5 text-[8px] font-bold text-white">
                  SHIFT C
                </span>

                <span className="text-[9px] font-semibold text-[#182d70]">
                  10:00 PM - 06:00 AM
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 px-2 py-3">
              <div className="flex items-center justify-center gap-3 border-r border-[#edf0f6]">
                <LogOut size={29} className="text-blue-600" />

                <div>
                  <p className="text-[8px] font-bold text-[#1b2b65]">
                    OUT PUNCH DONE
                  </p>

                  <p className="mt-1 text-[21px] font-bold text-blue-600">
                    1,184
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <FileWarning
                  size={29}
                  className="text-red-600"
                />

                <div>
                  <p className="text-[8px] font-bold text-[#1b2b65]">
                    MISSING OUT PUNCH
                  </p>

                  <p className="mt-1 text-[21px] font-bold text-red-600">
                    32
                  </p>
                </div>
              </div>
            </div>

            <div className="mx-2 mb-2 flex items-center gap-2 rounded border border-[#edf0f6] bg-[#f8faff] px-2 py-1.5 text-[8px] text-[#1246bd]">
              <Info size={12} />

              <span className="font-semibold">
                Outgoing shift Out Punch entry must be completed before
                handover.
              </span>
            </div>
          </div>
        </section>

        {/* Requests */}
        <section className="mt-4">
          <h3 className="mb-2 px-1 text-[11px] font-bold text-[#17265e]">
            REQUESTS &amp; ACTIONS RECEIVED FROM ATTENDANCE CELL
          </h3>

          <div className="grid grid-cols-5 gap-2">
            {requestCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className={`min-h-[120px] rounded-md border ${card.border} bg-white px-2.5 py-2.5`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${card.iconBg}`}
                    >
                      <Icon
                        size={25}
                        className={card.iconColor}
                      />
                    </div>

                    <p
                      className={`whitespace-pre-line text-[8px] font-bold leading-3 ${card.iconColor}`}
                    >
                      {card.title}
                    </p>
                  </div>

                  <div className="ml-[54px]">
                    <p
                      className={`mt-1 text-[21px] font-bold ${card.iconColor}`}
                    >
                      {card.count}
                    </p>

                    <p className="text-[8px] text-[#18265c]">
                      {card.subtitle}
                    </p>
                  </div>

                  <button
                    type="button"
                    className={`mt-2 flex h-[21px] w-full items-center justify-center gap-2 rounded text-[8px] font-semibold text-white ${card.button}`}
                    onClick={()=>navigate(card.url)}
                  >
                    View Details
                    <ArrowRight size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Important */}
        <section className="mt-4 flex items-center gap-3 rounded-md border border-[#e2e9f7] bg-[#f7faff] px-3 py-2 text-[9px]">
          <div className="flex items-center gap-2">
            <Info
              size={13}
              className="text-[#0751d4]"
            />

            <span className="font-bold text-[#0751d4]">
              IMPORTANT
            </span>
          </div>

          <span className="text-[#173170]">
            Please review all pending requests and take necessary action in a
            timely manner. Verified items will be forwarded to the next level
            for approval.
          </span>
        </section>

        {/* Quick Links */}
        <section className="mt-4">
          <h3 className="mb-2 px-1 text-[11px] font-bold text-[#17265e]">
            QUICK LINKS
          </h3>

          <div className="grid grid-cols-5 gap-3">
            {quickLinks.map((link) => {
              const Icon = link.icon;

              return (
                <button
                  key={link.title}
                  type="button"
                  onClick={() => navigate(link.url)}
                  className="flex h-9 items-center justify-between rounded-md border border-[#dce4f5] bg-white px-3 text-left transition hover:border-[#8eabeb] hover:bg-[#f7faff]"
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      size={17}
                      className={
                        link.title === "Exception Summary Report"
                          ? "text-orange-500"
                          : link.title === "Punch Missing Report"
                            ? "text-red-500"
                            : "text-[#0751d4]"
                      }
                    />

                    <span className="text-[8px] font-semibold text-[#14265e]">
                      {link.title}
                    </span>
                  </div>

                  <ArrowRight
                    size={15}
                    className="text-[#0b43b6]"
                  />
                </button>
              );
            })}
          </div>
        </section>

        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate("/payroll-and-workforce-movement")}
          className="mt-3 flex items-center gap-2 rounded border border-[#7d9fe8] px-3 py-1.5 text-[9px] font-semibold text-[#0751d4] transition hover:bg-[#f2f6ff]"
        >
          <ArrowLeft size={13} />
          Back to Section Dashboard
        </button>
      </main>
    </div>
  );
};

export default PayrollAttendanceCell;
