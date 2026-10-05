import React from "react";
import {
  Award,
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Eye,
  Info,
  Network,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

/* ---------- Types ---------- */

type Tone = "blue" | "teal" | "purple";

interface SummaryCardData {
  id: string;
  title: string;
  pending: number;
  tone: Tone;
  href: string;
  icon: React.ReactNode;
}

interface RequestRow {
  id: number;
  type: string;
  total: number;
  approvedBy: string;
  approvalDate: string;
  receivedOn: string;
  href: string;
}

/* ---------- Tone styles (full class names so Tailwind can detect them) ---------- */

const toneStyles: Record<
  Tone,
  { card: string; circle: string; title: string; count: string; ring: string; arrow: string }
> = {
  blue: {
    card: "border-blue-100 bg-blue-50/70",
    circle: "bg-blue-100",
    title: "text-blue-700",
    count: "text-blue-700",
    ring: "focus-visible:ring-blue-600",
    arrow: "text-blue-700",
  },
  teal: {
    card: "border-emerald-100 bg-emerald-50/70",
    circle: "bg-emerald-100",
    title: "text-teal-700",
    count: "text-teal-700",
    ring: "focus-visible:ring-teal-600",
    arrow: "text-teal-700",
  },
  purple: {
    card: "border-violet-100 bg-violet-50/70",
    circle: "bg-violet-100",
    title: "text-violet-700",
    count: "text-violet-700",
    ring: "focus-visible:ring-violet-600",
    arrow: "text-violet-700",
  },
};

/* ---------- Data (replace with API data) ---------- */

const summaryCards: SummaryCardData[] = [
  {
    id: "performance",
    title: "PERFORMANCE INCREMENT",
    pending: 5,
    tone: "blue",
    href: "/employee-movement/promotion-increment/performance",
    icon: <TrendingUp className="h-10 w-10 text-blue-700" strokeWidth={1.6} aria-hidden />,
  },
  {
    id: "adjustment",
    title: "ADJUSTMENT INCREMENT",
    pending: 12,
    tone: "teal",
    href: "/employee-movement/promotion-increment/adjustment",
    icon: <ClipboardList className="h-10 w-10 text-teal-700" strokeWidth={1.6} aria-hidden />,
  },
  {
    id: "promotion",
    title: "PROMOTION & INCREMENT",
    pending: 3,
    tone: "purple",
    href: "/employee-movement/promotion-increment/promotion",
    icon: <Award className="h-10 w-10 text-violet-700" strokeWidth={1.6} aria-hidden />,
  },
];

const requests: RequestRow[] = [
  {
    id: 1,
    type: "Performance Increment",
    total: 5,
    approvedBy: "Director",
    approvalDate: "15-May-2025",
    receivedOn: "15-May-2025 09:15 AM",
    href: "/employee-movement/promotion-increment/performance",
  },
  {
    id: 2,
    type: "Adjustment Increment",
    total: 12,
    approvedBy: "Director",
    approvalDate: "15-May-2025",
    receivedOn: "15-May-2025 09:16 AM",
    href: "/employee-movement/promotion-increment/adjustment",
  },
  {
    id: 3,
    type: "Promotion & Increment",
    total: 3,
    approvedBy: "Director",
    approvalDate: "15-May-2025",
    receivedOn: "15-May-2025 09:18 AM",
    href: "/employee-movement/promotion-increment/promotion",
  },
];

const columns = [
  { label: "SL No.", align: "text-center", width: "w-20" },
  { label: "Request Type", align: "text-left", width: "" },
  { label: "Total Requests", align: "text-center", width: "" },
  { label: "Approved By", align: "text-center", width: "" },
  { label: "Approval Date", align: "text-center", width: "" },
  { label: "Received On", align: "text-center", width: "" },
  { label: "", align: "text-center", width: "w-20" },
];

/* ---------- Helpers ---------- */

const formatHeaderDate = (d: Date): string => {
  const month = d.toLocaleDateString("en-GB", { month: "long" });
  const weekday = d.toLocaleDateString("en-GB", { weekday: "long" });
  return `${d.getDate()} ${month} ${d.getFullYear()} | ${weekday}`;
};

/* ---------- Components ---------- */

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-[#07124a] via-[#0a1a5c] to-[#0b2270] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(147,197,253,.5) 1px, transparent 0)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse at 50% 0%, black 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, black 0%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto flex min-h-[76px] max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-teal-300 to-blue-600">
              <Network className="h-6 w-6 text-white" aria-hidden />
            </span>
          <div className="leading-tight">
            <div className="text-2xl font-bold tracking-wide">SYNEXIS</div>
            <div className="text-xs font-medium text-sky-200">Creating Enterprise Synergy</div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden items-center gap-2.5 text-sm font-semibold sm:flex">
            <Calendar className="h-6 w-6" strokeWidth={1.7} aria-hidden />
            <span>{formatHeaderDate(new Date())}</span>
          </div>
          <div className="hidden h-9 w-px bg-white/30 sm:block" />
          <button
            type="button"
            aria-haspopup="menu"
            className="flex items-center gap-2.5 rounded-md text-[13px] font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white">
              <UserRound className="h-5 w-5 fill-[#0b1a7c] text-[#0b1a7c]" aria-hidden />
            </span>
            <span>{user?.userName ?? "Employee Movement Cell"}</span>
            <ChevronDown className="h-4 w-4" strokeWidth={2.2} aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
};

const InfoBanner: React.FC<{ children: React.ReactNode; compact?: boolean }> = ({
  children,
  compact = false,
}) => (
  <div
    role="note"
    className={`flex items-center gap-5 rounded-lg border border-blue-100 bg-blue-50/70 px-6 text-sm leading-6 text-[#0a1a5c] ${
      compact ? "py-3.5" : "py-4"
    }`}
  >
    <Info className="h-7 w-7 shrink-0 text-blue-600" strokeWidth={2} aria-hidden />
    <p>{children}</p>
  </div>
);

const SummaryCard: React.FC<{ data: SummaryCardData }> = ({ data }) => {
  const t = toneStyles[data.tone];
  return (
    <article
      className={`flex items-center gap-5 rounded-xl border p-5 ${t.card}`}
    >
      <div
        className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full ${t.circle}`}
      >
        {data.icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className={`text-[15px] font-bold leading-snug ${t.title}`}>{data.title}</h3>
        <div className="my-2 h-px bg-slate-300/60" />
        <p className="flex items-baseline gap-3 text-sm text-slate-500">
          Pending Requests
          <span className={`text-3xl font-bold leading-none ${t.count}`}>{data.pending}</span>
        </p>
      </div>

      <a
        href={data.href}
        aria-label={`Open ${data.title.toLowerCase()}`}
        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-md transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${t.arrow} ${t.ring}`}
      >
        <ChevronRight className="h-5 w-5" strokeWidth={2.4} aria-hidden />
      </a>
    </article>
  );
};

const RequestsTable: React.FC<{ rows: RequestRow[] }> = ({ rows }) => (
  <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
    <h2 className="px-6 py-4 text-sm font-bold tracking-wide text-[#0a1a5c]">
      RECENTLY RECEIVED REQUESTS
    </h2>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-sm text-slate-800">
        <thead>
          <tr className="border-y border-slate-200 bg-blue-50/60 text-[13px] font-semibold text-[#0a1a5c]">
            {columns.map((c, i) => (
              <th
                key={i}
                scope="col"
                className={`px-4 py-3.5 ${c.align} ${c.width} ${
                  i > 0 ? "border-l border-slate-200" : ""
                }`}
              >
                {c.label || <span className="sr-only">View</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50/70">
              <td className="px-4 py-4 text-center">{r.id}</td>
              <td className="border-l border-slate-200 px-4 py-4">{r.type}</td>
              <td className="border-l border-slate-200 px-4 py-4 text-center">{r.total}</td>
              <td className="border-l border-slate-200 px-4 py-4 text-center">{r.approvedBy}</td>
              <td className="border-l border-slate-200 px-4 py-4 text-center">{r.approvalDate}</td>
              <td className="border-l border-slate-200 px-4 py-4 text-center">{r.receivedOn}</td>
              <td className="border-l border-slate-200 px-4 py-4 text-center">
                <a
                  href={r.href}
                  aria-label={`View ${r.type} requests`}
                  className="inline-flex rounded-md p-1 text-blue-600 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <Eye className="h-5 w-5" strokeWidth={1.7} aria-hidden />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

const PromotionIncrementRequests: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <Header />

      <main className="mx-auto max-w-7xl space-y-6 px-4 pb-10 pt-6 sm:px-8">
        {/* Title row: back button left, title centred */}
        <div className="relative flex flex-col items-start gap-4 md:block md:min-h-[64px]">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-md border border-blue-500 bg-white px-5 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:absolute md:left-0 md:top-0"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.2} aria-hidden />
            Back
          </button>
          <div className="w-full text-center">
            <h1 className="text-2xl font-bold tracking-wide text-[#0a1a5c]">
              EMPLOYEE MOVEMENT CELL
            </h1>
            <p className="mt-2 text-base text-slate-500">Promotion &amp; Increment Requests</p>
          </div>
        </div>

        <InfoBanner>
          The following requests have been approved by Director and are forwarded to Employee
          Movement Cell.
          <br className="hidden md:block" /> Please review the details and forward to Attendance
          &amp; Workforce Movement Section for approval.
        </InfoBanner>

        <div className="grid gap-5 lg:grid-cols-3">
          {summaryCards.map((c) => (
            <SummaryCard key={c.id} data={c} />
          ))}
        </div>

        <RequestsTable rows={requests} />

        <InfoBanner compact>
          Only requests approved by Director are displayed. After review, forward to Attendance
          &amp; Workforce Movement Section.
        </InfoBanner>
      </main>
    </div>
  );
};

export default PromotionIncrementRequests;
