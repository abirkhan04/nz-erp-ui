import React from "react";
import { useAuth } from "../../context/AuthContext";

/* ---------- Types ---------- */

type Tone = "blue" | "teal" | "purple";

interface MovementOption {
    id: string;
    title: string;
    description: string;
    tone: Tone;
    href: string;
    icon: React.ReactNode;
}



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
/* ---------- Tone styles (full class names so Tailwind can detect them) ---------- */

const toneStyles: Record<
    Tone,
    { circle: string; title: string; button: string; ring: string }
> = {
    blue: {
        circle: "bg-blue-100/70",
        title: "text-blue-700",
        button: "bg-blue-700 hover:bg-blue-800",
        ring: "focus-visible:ring-blue-600",
    },
    teal: {
        circle: "bg-emerald-100/70",
        title: "text-teal-700",
        button: "bg-teal-700 hover:bg-teal-800",
        ring: "focus-visible:ring-teal-600",
    },
    purple: {
        circle: "bg-violet-100/70",
        title: "text-violet-800",
        button: "bg-violet-800 hover:bg-violet-900",
        ring: "focus-visible:ring-violet-600",
    },
};

/* ---------- Icons ---------- */

const svgBase = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
};

const PromotionIcon = () => (
    <svg viewBox="0 0 48 48" className="h-12 w-12 text-blue-700" {...svgBase} aria-hidden>
        <rect x="5" y="36" width="9" height="7" />
        <rect x="17" y="30" width="9" height="13" />
        <rect x="29" y="22" width="9" height="21" />
        <path d="M30 12l6-5 1 6M36 7l-9 11" />
        <circle cx="16" cy="9" r="2.5" />
        <path d="M14 16l5 2 3 6M19 18l-6 5 3 7" />
    </svg>
);

const ConfirmationIcon = () => (
    <svg viewBox="0 0 48 48" className="h-12 w-12 text-teal-700" {...svgBase} aria-hidden>
        <rect x="9" y="8" width="26" height="33" rx="3" />
        <rect x="16" y="5" width="12" height="6" rx="2" />
        <circle cx="22" cy="21" r="4" />
        <path d="M14 33c1-4 4-6 8-6s7 2 8 6" />
        <circle cx="36" cy="36" r="7" className="fill-white" />
        <path d="M32.5 36l2.5 2.5 4.5-5" />
    </svg>
);

const TransferIcon = () => (
    <svg viewBox="0 0 48 48" className="h-12 w-12 text-violet-700" {...svgBase} aria-hidden>
        <path d="M8 22a8 8 0 0 1 16 0" />
        <path d="M6 22h20M10 28h12" />
        <path d="M28 12h10l-3-3M38 12l-3 3" />
        <circle cx="35" cy="24" r="3" />
        <path d="M8 38h28l-3-3M36 38l-3 3" transform="translate(0 -2)" />
    </svg>
);

const CalendarIcon = () => (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...svgBase} aria-hidden>
        <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
        <path d="M3 9.5h18M8 3v3.5M16 3v3.5" />
        <path d="M8 13.5h.01M12 13.5h.01M16 13.5h.01M8 17h.01M12 17h.01" strokeWidth={2.2} />
    </svg>
);


const ChevronRight = () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5" {...svgBase} strokeWidth={2.4} aria-hidden>
        <path d="M9 6l6 6-6 6" />
    </svg>
);

const InfoIcon = () => (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-blue-600" {...svgBase} strokeWidth={2} aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 11v6M12 7.5h.01" strokeWidth={2.6} />
    </svg>
);

/* ---------- Data ---------- */

const options: MovementOption[] = [
    {
        id: "promotion",
        title: "PROMOTION & INCREMENT",
        description: "Manage promotion requests and performance / adjustment increments.",
        tone: "blue",
        href: "/employee-movement/promotion-increment",
        icon: <PromotionIcon />,
    },
    {
        id: "confirmation",
        title: "CONFIRMATION",
        description: "Review and process probation confirmation requests.",
        tone: "teal",
        href: "/employee-movement/confirmation",
        icon: <ConfirmationIcon />,
    },
    {
        id: "transfer",
        title: "TRANSFER & SHIFT",
        description:
            "Manage employee transfers between departments/sections and shift changes.",
        tone: "purple",
        href: "/employee-movement/transfer-shift",
        icon: <TransferIcon />,
    },
];

/* ---------- Components ---------- */

const Header: React.FC = () => {

    const formatHeaderDate = (d: Date): string => {
        const month = d.toLocaleDateString("en-GB", { month: "long" });
        const weekday = d.toLocaleDateString("en-GB", { weekday: "long" });
        return `${d.getDate()} ${month} ${d.getFullYear()} | ${weekday}`;
    };
    const {user} = useAuth();

    return (
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
                    <span>{formatHeaderDate(new Date())}</span>
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
                    <span>{user?.userName}</span>
                    <ChevronIcon />
                </button>
            </div>
        </header>
    );
};

const OptionCard: React.FC<{ option: MovementOption }> = ({ option }) => {
    const t = toneStyles[option.tone];
    return (
        <article className="flex flex-col items-center rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-8 pb-8 pt-9 text-center shadow-[0_2px_10px_rgba(15,23,42,0.06)]">
            <div
                className={`flex h-28 w-28 items-center justify-center rounded-full ${t.circle}`}
            >
                {option.icon}
            </div>

            <h2 className={`mt-8 text-lg font-bold tracking-wide ${t.title}`}>
                {option.title}
            </h2>

            <div className="my-5 h-px w-40 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

            <p className="min-h-[3rem] max-w-[17rem] text-sm leading-6 text-slate-700">
                {option.description}
            </p>

            <a
                href={option.href}
                aria-label={`Open ${option.title.toLowerCase()}`}
                className={`mt-6 inline-flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${t.button} ${t.ring}`}
            >
                <ChevronRight />
            </a>
        </article>
    );
};

const EmployeeMovementCell: React.FC = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
            <Header />

            <main className="mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-wide text-[#0a1a5c]">
                        EMPLOYEE MOVEMENT CELL
                    </h1>
                    <p className="mt-3 text-base text-slate-600">
                        Manage employee career progression and movements efficiently.
                    </p>
                </div>

                <section className="mt-8 rounded-xl border border-slate-200 p-4 sm:p-7">
                    <div className="grid gap-6 md:grid-cols-3">
                        {options.map((o) => (
                            <OptionCard key={o.id} option={o} />
                        ))}
                    </div>
                </section>

                <div
                    role="note"
                    className="mt-7 flex items-center gap-5 rounded-lg bg-blue-50/70 px-6 py-4 text-sm leading-6 text-slate-700"
                >
                    <InfoIcon />
                    <p>
                        Use the above options to manage employee movement activities.
                        <br />
                        All actions and requests are processed as per company policy.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default EmployeeMovementCell;