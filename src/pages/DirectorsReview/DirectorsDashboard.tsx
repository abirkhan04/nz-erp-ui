import React from "react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type RequestType = "performance" | "adjustment" | "promotion";

export interface DirectorDashboardProps {
  /** Number of requests per type */
  counts?: Record<RequestType, number>;
  /** Date shown in the header (defaults to today) */
  date?: Date;
  /** Logged-in user's role label */
  role?: string;
  /** Called when a "View Requests" button is clicked */
  onViewRequests?: (type: RequestType) => void;
}

interface IconProps {
  className?: string;
}

/*
 * Tailwind can only see complete class names, so every colour variant is
 * written out in full below (no string-built classes like `text-${color}`).
 */
interface RequestCardConfig {
  type: RequestType;
  title: string;
  textClass: string;
  btnClass: string;
  softBgClass: string;
  Icon: React.FC<IconProps>;
}

interface FlowStep {
  label: string;
  caption: string;
  textClass: string;
  softBgClass: string;
  Icon: React.FC<IconProps>;
}

/* -------------------------------------------------------------------------- */
/*  Icons (inline SVG, colour comes from `currentColor` via text-* classes)   */
/* -------------------------------------------------------------------------- */

const Svg: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const TrendIcon: React.FC<IconProps> = ({ className = "h-9 w-9" }) => (
  <Svg className={className}>
    <path d="M4 20v-5M9 20v-8M14 20v-6M19 20V8" strokeWidth={3} />
    <path d="M4 10l5-4 4 3 6-6" />
    <path d="M15 3h4v4" />
  </Svg>
);

const CalculatorIcon: React.FC<IconProps> = ({ className = "h-9 w-9" }) => (
  <Svg className={className}>
    <rect x="5" y="2.5" width="14" height="19" rx="2.5" />
    <rect x="8" y="5.5" width="8" height="3.5" rx="0.5" fill="currentColor" />
    <path d="M8.5 13h.01M12 13h.01M15.5 13h.01M8.5 16.5h.01M12 16.5h.01M15.5 16.5h.01" strokeWidth={2.6} />
  </Svg>
);

const PromotionIcon: React.FC<IconProps> = ({ className = "h-9 w-9" }) => (
  <Svg className={className}>
    <circle cx="10" cy="7" r="3.5" fill="currentColor" />
    <path d="M3 21v-2a5 5 0 0 1 5-5h4" fill="currentColor" />
    <path
      d="M18 12.5l1.6 3.2 3.4.5-2.5 2.4.6 3.4-3.1-1.6-3.1 1.6.6-3.4-2.5-2.4 3.4-.5z"
      fill="currentColor"
      strokeWidth={1.2}
    />
  </Svg>
);

const FactoryIcon: React.FC<IconProps> = ({ className = "h-7 w-7" }) => (
  <Svg className={className}>
    <path d="M3 21V9l6 4V9l6 4V4h4v17z" fill="currentColor" />
    <path d="M7 17h.01M11 17h.01M15 17h.01" stroke="#fff" strokeWidth={2.4} />
  </Svg>
);

const DirectorIcon: React.FC<IconProps> = ({ className = "h-7 w-7" }) => (
  <Svg className={className}>
    <circle cx="12" cy="7" r="4" fill="currentColor" />
    <path d="M4 21a8 8 0 0 1 16 0z" fill="currentColor" />
    <path d="M10.5 16l1.5 2 1.5-2" stroke="#fff" strokeWidth={1.8} />
  </Svg>
);

const TeamIcon: React.FC<IconProps> = ({ className = "h-8 w-8" }) => (
  <Svg className={className}>
    <circle cx="12" cy="7" r="3.2" fill="currentColor" />
    <circle cx="4.8" cy="10" r="2.4" fill="currentColor" />
    <circle cx="19.2" cy="10" r="2.4" fill="currentColor" />
    <path d="M6.5 20v-2.5a5.5 5.5 0 0 1 11 0V20z" fill="currentColor" />
    <path d="M1.5 18v-1.5a3.5 3.5 0 0 1 4-3.4M22.5 18v-1.5a3.5 3.5 0 0 0-4-3.4" />
  </Svg>
);

const PersonIcon: React.FC<IconProps> = ({ className = "h-7 w-7" }) => (
  <Svg className={className}>
    <circle cx="12" cy="7" r="4" fill="currentColor" />
    <path d="M4 21a8 8 0 0 1 16 0z" fill="currentColor" />
  </Svg>
);

const CeoIcon: React.FC<IconProps> = ({ className = "h-7 w-7" }) => (
  <Svg className={className}>
    <circle cx="11" cy="7" r="4" fill="currentColor" />
    <path d="M3 21a8 8 0 0 1 12-6.9" fill="currentColor" />
    <circle cx="18" cy="18" r="4.5" fill="currentColor" stroke="#fff" strokeWidth={1.4} />
    <path d="M16 18l1.5 1.5 2.5-3" stroke="#fff" strokeWidth={1.6} />
  </Svg>
);

const CalendarIcon: React.FC = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4.5" width="18" height="16.5" rx="2" />
    <path d="M3 9.5h18M8 2.5v4M16 2.5v4M7.5 13.5h.01M12 13.5h.01M16.5 13.5h.01M7.5 17h.01M12 17h.01" />
  </svg>
);

const ChevronIcon: React.FC = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const AvatarIcon: React.FC = () => (
  <svg className="h-[22px] w-[22px] text-[#0b1a7c]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="8" r="4.2" />
    <path d="M3.5 21a8.5 8.5 0 0 1 17 0z" />
  </svg>
);

const ArrowIcon: React.FC = () => (
  <svg className="h-3.5 w-6" viewBox="0 0 26 14" fill="none" stroke="#1e1b8f" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 7h23M18 1.5L24 7l-6 5.5" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/*  Static config                                                             */
/* -------------------------------------------------------------------------- */

const CARDS: RequestCardConfig[] = [
  {
    type: "performance",
    title: "PERFORMANCE INCREMENT",
    textClass: "text-[#178a30]",
    btnClass: "bg-[#178a30] focus-visible:ring-[#178a30]/40",
    softBgClass: "bg-[#e8f5ec]",
    Icon: TrendIcon,
  },
  {
    type: "adjustment",
    title: "ADJUSTMENT INCREMENT",
    textClass: "text-[#f97316]",
    btnClass: "bg-[#f97316] focus-visible:ring-[#f97316]/40",
    softBgClass: "bg-[#fdeee0]",
    Icon: CalculatorIcon,
  },
  {
    type: "promotion",
    title: "PROMOTION + INCREMENT",
    textClass: "text-[#4a12c9]",
    btnClass: "bg-[#4a12c9] focus-visible:ring-[#4a12c9]/40",
    softBgClass: "bg-[#efe9fb]",
    Icon: PromotionIcon,
  },
];

const FLOW: FlowStep[] = [
  { label: "1. PRODUCTION FLOOR", caption: "Request Submitted", textClass: "text-[#4a12c9]", softBgClass: "bg-[#efe9fb]", Icon: FactoryIcon },
  { label: "2. DIRECTOR", caption: "Review & Approve", textClass: "text-[#f97316]", softBgClass: "bg-[#fdeee0]", Icon: DirectorIcon },
  { label: "3. EMPLOYEE MOVEMENT CELL", caption: "Review & Forward", textClass: "text-[#178a30]", softBgClass: "bg-[#e8f5ec]", Icon: TeamIcon },
  { label: "4. HR BRANCH MANAGER", caption: "Review & Forward", textClass: "text-[#2563eb]", softBgClass: "bg-[#e6eefc]", Icon: PersonIcon },
  { label: "5. CEO", caption: "Final Approval", textClass: "text-[#4a12c9]", softBgClass: "bg-[#efe9fb]", Icon: CeoIcon },
];

const DEFAULT_COUNTS: Record<RequestType, number> = {
  performance: 7,
  adjustment: 42,
  promotion: 3,
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const formatHeaderDate = (d: Date): string => {
  const month = d.toLocaleDateString("en-GB", { month: "long" });
  const weekday = d.toLocaleDateString("en-GB", { weekday: "long" });
  return `${d.getDate()} ${month} ${d.getFullYear()} | ${weekday}`;
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

const DirectorDashboard: React.FC<DirectorDashboardProps> = ({
  counts = DEFAULT_COUNTS,
  date = new Date(),
  role = "Director",
  onViewRequests,
}) => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-700 antialiased">
      {/* Header */}
      <header className="flex min-h-[62px] flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-[#0b1a7c] to-[#0d1f96] px-4 py-3 text-white sm:px-7">
        <div>
          <h1 className="text-xl font-extrabold leading-tight tracking-wide">DIRECTOR DASHBOARD</h1>
          <p className="mt-0.5 text-[12.5px] font-medium opacity-90">
            Review &amp; Approve Requests from Production Floor
          </p>
        </div>

        <div className="flex items-center gap-[18px]">
          <div className="flex items-center gap-2 text-[12.5px] font-semibold">
            <CalendarIcon />
            <span>{formatHeaderDate(date)}</span>
          </div>
          <div className="h-8 w-px bg-white/30" />
          <button
            type="button"
            aria-label="Account menu"
            className="flex items-center gap-2.5 text-[12.5px] font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-white">
              <AvatarIcon />
            </span>
            <span>{role}</span>
            <ChevronIcon />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1000px] px-3.5 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-9">
        <h2 className="text-center text-[15px] font-extrabold tracking-wide text-[#131a7a]">
          REQUESTS RECEIVED FROM PRODUCTION FLOOR
        </h2>
        <p className="mb-[30px] mt-2 text-center text-[12.5px] text-gray-600">
          Click on any request type to review details and take action.
        </p>

        {/* Request cards */}
        <section aria-label="Request types" className="grid grid-cols-1 gap-[22px] lg:grid-cols-3">
          {CARDS.map(({ type, title, textClass, btnClass, softBgClass, Icon }) => (
            <article
              key={type}
              className="flex flex-col items-center rounded-[10px] border border-[#e8eaf0] bg-white px-7 pb-[30px] pt-[34px] text-center shadow-[0_1px_4px_rgba(20,30,90,0.06)]"
            >
              <div className={`grid h-[72px] w-[72px] place-items-center rounded-full ${softBgClass} ${textClass}`}>
                <Icon />
              </div>
              <h3 className={`mt-[22px] text-sm font-extrabold ${textClass}`}>{title}</h3>
              <p className={`mt-4 text-[42px] font-extrabold leading-none ${textClass}`}>{counts[type]}</p>
              <p className="mt-3.5 text-[12.5px] text-gray-700">Requests Received</p>
              <button
                type="button"
                onClick={() => onViewRequests?.(type)}
                className={`mt-[22px] w-[165px] rounded-[5px] py-2.5 text-[13.5px] font-bold text-white transition hover:brightness-110 active:translate-y-px focus:outline-none focus-visible:ring-4 motion-reduce:transition-none ${btnClass}`}
              >
                View Requests
              </button>
            </article>
          ))}
        </section>

        {/* Forwarding flow */}
        <section
          aria-label="Forwarding flow"
          className="mt-[26px] rounded-[10px] border border-[#e8eaf0] bg-white px-[22px] pb-7 pt-[22px] shadow-[0_1px_4px_rgba(20,30,90,0.05)]"
        >
          <h3 className="mb-[18px] text-[13px] font-extrabold tracking-wide text-[#131a7a]">FORWARDING FLOW</h3>

          <div className="flex flex-col items-center gap-2.5 px-2 lg:flex-row lg:items-start lg:justify-between lg:gap-1.5">
            {FLOW.map(({ label, caption, textClass, softBgClass, Icon }, i) => (
              <React.Fragment key={label}>
                <div className="flex w-full min-w-0 flex-col items-center text-center lg:w-auto lg:flex-1">
                  <div className={`grid h-[58px] w-[58px] place-items-center rounded-full ${softBgClass} ${textClass}`}>
                    <Icon />
                  </div>
                  <p className={`mt-3 text-[10.5px] font-extrabold leading-tight ${textClass}`}>{label}</p>
                  <p className="mt-1.5 text-[11.5px] text-gray-700">{caption}</p>
                </div>
                {i < FLOW.length - 1 && (
                  <div aria-hidden="true" className="grid shrink-0 rotate-90 place-items-center lg:h-[58px] lg:rotate-0">
                    <ArrowIcon />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DirectorDashboard;
