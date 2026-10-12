import React from "react";
import {
  Users,
  UsersRound,
  FileText,
  ShieldCheck,
  Leaf,
  CalendarDays,
  CircleUser,
  ChevronDown,
  LogOut,
  Eye,
  ArrowRight,
  Info,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

/* ----------------------------- Types & data ----------------------------- */

export interface Section {
  id: string;
  title: string;
  pending: number;
  icon: LucideIcon;
  /** Full Tailwind class strings (kept literal so Tailwind can detect them) */
  uri?: string;
  theme: {
    card: string; // border + background
    iconWrap: string; // circle behind icon
    icon: string; // icon color
    title: string; // title color
    badge: string; // pending badge
    button: string; // view button
  };
}

export const SECTIONS: Section[] = [
  {
    id: "recruitment",
    title: "RECRUITMENT SECTION",
    pending: 4,
    icon: Users,
    theme: {
      card: "border-blue-500 bg-blue-50/40",
      iconWrap: "bg-blue-100",
      icon: "text-blue-600",
      title: "text-blue-600",
      badge: "bg-blue-600",
      button: "border-blue-500 text-blue-700 hover:bg-blue-50",
    },
  },
  {
    id: "attendance",
    title: "ATTENDANCE & WORKFORCE MOVEMENT SECTION",
    pending: 8,
    icon: UsersRound,
    uri: "/hr-branch-manager/attendance-and-workforce-movement",
    theme: {
      card: "border-emerald-600 bg-emerald-50/40",
      iconWrap: "bg-emerald-100",
      icon: "text-emerald-700",
      title: "text-emerald-700",
      badge: "bg-emerald-700",
      button: "border-emerald-600 text-emerald-800 hover:bg-emerald-50",
    },
  },
  {
    id: "settlement",
    title: "SETTLEMENT SECTION",
    pending: 3,
    icon: FileText,
    theme: {
      card: "border-orange-400 bg-orange-50/40",
      iconWrap: "bg-orange-100",
      icon: "text-orange-500",
      title: "text-orange-500",
      badge: "bg-orange-500",
      button: "border-orange-400 text-orange-600 hover:bg-orange-50",
    },
  },
  {
    id: "compliance",
    title: "COMPLIANCE SECTION",
    pending: 2,
    icon: ShieldCheck,
    theme: {
      card: "border-purple-500 bg-purple-50/40",
      iconWrap: "bg-purple-100",
      icon: "text-purple-700",
      title: "text-purple-700",
      badge: "bg-purple-700",
      button: "border-purple-500 text-purple-700 hover:bg-purple-50",
    },
  },
  {
    id: "sustainability",
    title: "SUSTAINABILITY SECTION",
    pending: 1,
    icon: Leaf,
    theme: {
      card: "border-amber-800 bg-amber-50/40",
      iconWrap: "bg-amber-100",
      icon: "text-amber-900",
      title: "text-amber-900",
      badge: "bg-amber-900",
      button: "border-amber-800 text-amber-900 hover:bg-amber-50",
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
      <p className="text-sm font-medium text-cyan-300">Overview of all sections under HR Branch</p>
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
          {/* <span className="block text-xs font-medium text-cyan-300">{userRole}</span> */}
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

interface SectionCardProps {
  section: Section;
  onView?: (id: string) => void;
}

const SectionCard: React.FC<SectionCardProps> = ({ section }) => {
  const { icon: Icon, theme } = section;

  const navigate = useNavigate();
  const handleView = () => {
    if (section.uri) navigate(section.uri);
  };


  return (
    <div
      className={`flex w-full flex-col items-center rounded-xl border px-5 py-6 shadow-sm ${theme.card}`}
    >
      <div className={`flex h-[72px] w-[72px] items-center justify-center rounded-full ${theme.iconWrap}`}>
        <Icon className={`h-9 w-9 ${theme.icon}`} aria-hidden />
      </div>

      <h3
        className={`mt-4 flex min-h-[44px] items-center border-b border-slate-300 px-2 pb-3 text-center text-sm font-bold ${theme.title}`}
      >
        {section.title}
      </h3>

      <div className="mt-3 flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-800">Pending:</span>
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-white ${theme.badge}`}
        >
          {section.pending}
        </span>
      </div>

      <button
        type="button"
        onClick={handleView}
        className={`mt-4 flex w-full items-center justify-between rounded-md border bg-white px-4 py-2 text-sm font-semibold transition-colors ${theme.button}`}
      >
        <span className="flex flex-1 items-center justify-center gap-2">
          <Eye className="h-4 w-4" aria-hidden />
          View Section
        </span>
        <ArrowRight className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
};

/* -------------------------------- Main page -------------------------------- */


const HRBranchManagerDashboard: React.FC = () => {

  const onViewSection = (sectionId: string) => {
    // Handle section view logic here, e.g., navigate to the section's page
    console.log(`View section: ${sectionId}`);
  }  
    
  const onLogout = () => {
    // Handle logout logic here, e.g., clear auth tokens and redirect to login page
    console.log("Logout clicked");
  };
  const {user} = useAuth();
  const userName = user?.userName;
  const date = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    weekday: "long",
  });  
  const sections = SECTIONS; // Use the default SECTIONS if not provided
  const topRow = sections.slice(0, 4);
  const bottomRow = sections.slice(4);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header date={date} userName={userName}  onLogout={onLogout} />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#0a1a5c]">Welcome to HR Branch Manager Dashboard</h2>
          <p className="mt-2 text-slate-600">
            Please select a section below to review and take action on pending requests.
          </p>
        </div>

        {/* Row 1: 4 cards (attendance card is wider, as in the design) */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-[1fr_1.15fr_1fr_1fr]">
          {topRow.map((s) => (
            <SectionCard key={s.id} section={s} onView={onViewSection} />
          ))}
        </div>

        {/* Row 2: remaining cards, centered */}
        {bottomRow.length > 0 && (
          <div className="mt-5 flex justify-center gap-5">
            {bottomRow.map((s) => (
              <div key={s.id} className="w-full sm:w-72">
                <SectionCard section={s} onView={onViewSection} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-5 py-3 text-sm text-slate-800">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
            <Info className="h-4 w-4" aria-hidden />
          </span>
          Click on any section to view pending requests, review details and forward to CEO for approval (if
          required).
        </div>
      </main>
    </div>
  );
};

export default HRBranchManagerDashboard;