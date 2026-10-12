import React from "react";
import {
  BarChart3,
  SlidersHorizontal,
  UserRoundCheck,
  CalendarClock,
  Baby,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CircleUser,
  ChevronDown,
  LogOut,
  Info,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

/* ----------------------------- Types & data ----------------------------- */

export interface RequestType {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  uri?: string;
  /** Full Tailwind class strings (kept literal so Tailwind can detect them) */
  theme: {
    card: string; // border
    iconWrap: string; // solid circle behind icon
    title: string; // title color
    link: string; // "View Requests" color
  };
}

const BASE_URI = "/hr-branch-manager/attendance-and-workforce-movement";

export const REQUEST_TYPES: RequestType[] = [
  {
    id: "performance-increment",
    title: "PERFORMANCE INCREMENT",
    description:
      "Requests for performance increment based on appraisal and performance evaluation.",
    icon: BarChart3,
    uri: `${BASE_URI}/performance`,
    theme: {
      card: "border-blue-300",
      iconWrap: "bg-blue-700",
      title: "text-blue-700",
      link: "text-blue-700",
    },
  },
  {
    id: "adjustment-increment",
    title: "ADJUSTMENT INCREMENT",
    description:
      "Requests for adjustment increment due to grade change, cost of living, or other adjustments.",
    icon: SlidersHorizontal,
    uri: `${BASE_URI}/adjustment`,
    theme: {
      card: "border-emerald-300",
      iconWrap: "bg-emerald-700",
      title: "text-emerald-700",
      link: "text-emerald-700",
    },
  },
  {
    id: "promotion-increment",
    title: "PROMOTION & INCREMENT",
    description:
      "Requests for promotion along with increment based on eligibility and approval.",
    icon: UserRoundCheck,
    uri: `${BASE_URI}/promotion`,
    theme: {
      card: "border-purple-300",
      iconWrap: "bg-purple-700",
      title: "text-purple-700",
      link: "text-purple-700",
    },
  },
  {
    id: "earned-leave-encashment",
    title: "EARNED LEAVE ENCASHMENT",
    description:
      "Requests for encashment of earned leave as per policy and eligibility.",
    icon: CalendarClock,
    uri: `${BASE_URI}/earned-leave-encashment`,
    theme: {
      card: "border-teal-300",
      iconWrap: "bg-teal-600",
      title: "text-teal-700",
      link: "text-teal-700",
    },
  },
  {
    id: "maternity-leave-encashment",
    title: "MATERNITY LEAVE ENCASHMENT",
    description:
      "Requests for encashment of maternity leave as per policy and eligibility.",
    icon: Baby,
    uri: `${BASE_URI}/maternity-leave-encashment`,
    theme: {
      card: "border-orange-300",
      iconWrap: "bg-orange-500",
      title: "text-orange-500",
      link: "text-orange-500",
    },
  },
];

/* ------------------------------ Sub-components ------------------------------ */

const Logo: React.FC = () => (
  <div className="flex items-center gap-3">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-2xl font-black text-white shadow-lg">
      S
    </div>
    <div className="leading-tight">
      <div className="text-2xl font-extrabold tracking-wide text-white">SYNEXIS</div>
      <div className="text-xs font-medium text-cyan-300">Creating Enterprise Synergy</div>
    </div>
  </div>
);

interface HeaderProps {
  date: string;
  userName: string | undefined;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ date, userName, onLogout }) => (
  <header className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-[#050d3a] via-[#0a1a5c] to-[#050d3a] px-6 py-3 text-white">
    <Logo />

    <div className="text-center">
      <h1 className="text-xl font-bold tracking-wide">HR BRANCH MANAGER DASHBOARD</h1>
      <p className="text-sm font-medium text-cyan-300">Attendance &amp; Workforce Movement Section</p>
    </div>

    <div className="flex items-center gap-5">
      <div className="flex items-center gap-2 border-r border-white/20 pr-5">
        <CalendarDays className="h-6 w-6" aria-hidden />
        <span className="text-sm font-semibold">{date}</span>
      </div>

      <button type="button" className="flex items-center gap-2 border-r border-white/20 pr-5">
        <CircleUser className="h-9 w-9" aria-hidden />
        <span className="text-left leading-tight">
          <span className="block text-sm font-semibold">{userName}</span>
        </span>
        <ChevronDown className="h-4 w-4" aria-hidden />
      </button>

      <button
        type="button"
        onClick={onLogout}
        className="flex flex-col items-center gap-0.5 text-xs font-medium hover:text-cyan-300"
      >
        <LogOut className="h-5 w-5" aria-hidden />
        Logout
      </button>
    </div>
  </header>
);

const RequestCard: React.FC<{ request: RequestType }> = ({ request }) => {
  const { icon: Icon, theme } = request;
  const navigate = useNavigate();

  const handleView = () => {
    if (request.uri) navigate(request.uri);
  };

  return (
    <div
      className={`flex h-full w-full gap-5 rounded-xl border bg-white p-6 shadow-sm ${theme.card}`}
    >
      <div
        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-white ${theme.iconWrap}`}
      >
        <Icon className="h-8 w-8" aria-hidden />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className={`border-b border-slate-200 pb-3 text-sm font-bold ${theme.title}`}>
          {request.title}
        </h3>

        <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">{request.description}</p>

        <button
          type="button"
          onClick={handleView}
          className={`mt-5 flex w-full items-center justify-between border-t border-slate-200 pt-4 text-sm font-semibold hover:opacity-80 ${theme.link}`}
        >
          View Requests
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
};

/* -------------------------------- Main page -------------------------------- */

const AttendanceWorkforceMovementSection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userName = user?.userName;
  const date = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    weekday: "long",
  });

  const onLogout = () => {
    // Handle logout logic here, e.g., clear auth tokens and redirect to login page
    console.log("Logout clicked");
  };

  const onBack = () => navigate("/hr-branch-manager"); // main dashboard route

  const topRow = REQUEST_TYPES.slice(0, 3);
  const bottomRow = REQUEST_TYPES.slice(3);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header date={date} userName={userName} onLogout={onLogout} />

      <main className="mx-auto max-w-6xl px-6 py-6">
        <div className="relative">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-md border border-blue-300 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 lg:absolute lg:left-0 lg:top-0"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to Main Dashboard
          </button>

          <div className="mx-auto mt-4 max-w-xl text-center lg:mt-0">
            <h2 className="text-2xl font-bold text-[#0a1a5c]">
              Attendance &amp; Workforce Movement Section
            </h2>
            <p className="mt-2 text-slate-600">
              Review the requests forwarded by Attendance &amp; Workforce Movement Section and forward to
              CEO for final approval.
            </p>
          </div>
        </div>

        {/* Row 1: 3 cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {topRow.map((r) => (
            <RequestCard key={r.id} request={r} />
          ))}
        </div>

        {/* Row 2: remaining cards, centered */}
        {bottomRow.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-5">
            {bottomRow.map((r) => (
              <div key={r.id} className="w-full md:w-[calc(50%-0.625rem)] lg:w-[calc((100%-2.5rem)/3*1.2)]">
                <RequestCard request={r} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-5 py-3 text-sm text-slate-800">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
            <Info className="h-4 w-4" aria-hidden />
          </span>
          <span>
            Click on any request type above to view the forwarded requests in detail. Review the requests
            carefully and forward to CEO for final approval.
          </span>
        </div>
      </main>
    </div>
  );
};

export default AttendanceWorkforceMovementSection;
