import { useCallback, useEffect, useState } from "react";
import type { ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
    Calendar,
    CalendarDays,
    ChevronDown,
    ChevronRight,
    Clock,
    Info,
    LogIn,
    LogOut,
    Network,
    Search,
    UserCheck,
    UserRound,
    UserX,
    Users,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/client";
// TODO: adjust this path to where CommonInputField lives in your project
import CommonInputField from "../../components/CommonInputFields"
import type { Option } from "../../components/CommonInputFields";

/* ----------------------------- Types ----------------------------- */

interface Filters {
    shift: string;
    date: string; // yyyy-mm-dd
    department: string;
}

export interface AttendanceSnapshot {
    present: number;
    absent: number;
    missingInPunch: number;
    missingOutPunch: number;
    otApprovedMinutes: number; // total approved OT in minutes
    attendanceCellPending: number;
    movementCellPending: number;
}

/* ----------------------------- Config ----------------------------- */

// Flip to false once your endpoints are ready.
const USE_MOCK = true;

// TODO: replace with your real endpoint
const SNAPSHOT_URL = "/attendance/workforce-snapshot";

// TODO: load these from your API if they are dynamic
const SHIFT_OPTIONS: Option[] = [
    { value: "current", label: "Current Shift" },
    { value: "morning", label: "Morning Shift" },
    { value: "general", label: "General Shift" },
    { value: "night", label: "Night Shift" },
];

const DEPARTMENT_OPTIONS: Option[] = [
    { value: "all", label: "All Departments" },
    { value: "spinning", label: "Spinning" },
    { value: "weaving", label: "Weaving" },
    { value: "dyeing", label: "Dyeing" },
    { value: "quality", label: "Quality" },
    { value: "maintenance", label: "Maintenance" },
];

const MOCK_SNAPSHOT: AttendanceSnapshot = {
    present: 1248,
    absent: 112,
    missingInPunch: 37,
    missingOutPunch: 29,
    otApprovedMinutes: 84 * 60 + 30,
    attendanceCellPending: 12,
    movementCellPending: 7,
};

/* ----------------------------- Helpers ----------------------------- */

const todayIso = () => {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
};

const getDefaultFilters = (): Filters => ({
    shift: "current",
    date: todayIso(),
    department: "all",
});

const fmtNumber = (n: number) => n.toLocaleString("en-US");

const fmtHoursMins = (totalMinutes: number) => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}:${String(m).padStart(2, "0")}`;
};

const formatHeaderDate = (d: Date): string => {
    const month = d.toLocaleDateString("en-GB", { month: "long" });
    const weekday = d.toLocaleDateString("en-GB", { weekday: "long" });
    return `${d.getDate()} ${month} ${d.getFullYear()} | ${weekday}`;
};

/* ----------------------------- Small components ----------------------------- */

interface StatCardProps {
    label: string;
    value: string;
    sub?: string;
    Icon: ComponentType<{ className?: string; strokeWidth?: number }>;
    circle: string; // icon circle bg + icon color
    labelColor: string;
    valueColor: string;
}

function StatCard({ label, value, sub, Icon, circle, labelColor, valueColor }: StatCardProps) {
    return (
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-full ${circle}`}>
                <Icon className="h-7 w-7" strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
                <div className={`text-[11px] font-bold uppercase tracking-wide ${labelColor}`}>{label}</div>
                <div className={`text-3xl font-bold leading-tight ${valueColor}`}>{value}</div>
                {sub && <div className="mt-0.5 text-[11px] text-slate-500">{sub}</div>}
            </div>
        </div>
    );
}

interface CellCardProps {
    title: string;
    description: string;
    pending: number;
    Icon: ComponentType<{ className?: string; strokeWidth?: number }>;
    iconBg: string;
    cardBg: string;
    badgeBg: string;
    onOpen: () => void;
}

function CellCard({ title, description, pending, Icon, iconBg, cardBg, badgeBg, onOpen }: CellCardProps) {
    return (
        <div className={`flex items-center gap-5 rounded-xl border border-slate-200 p-6 ${cardBg}`}>
            <span className={`grid h-20 w-20 shrink-0 place-items-center rounded-full text-white ${iconBg}`}>
                <Icon className="h-9 w-9" strokeWidth={1.7} />
            </span>

            <div className="hidden h-24 w-px bg-slate-300 sm:block" />

            <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold uppercase tracking-wide text-[#0b1f6b]">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{description}</p>
                <div className="mt-3 border-t border-slate-300/70 pt-3 text-sm text-slate-600">
                    Pending Items
                    <span
                        className={`ml-3 inline-grid h-7 min-w-7 place-items-center rounded-full px-2 text-sm font-bold text-white ${badgeBg}`}
                    >
                        {pending}
                    </span>
                </div>
            </div>

            <button
                type="button"
                onClick={onOpen}
                aria-label={`Open ${title}`}
                className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-[#0b1f8f] shadow-md transition hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
                <ChevronRight className="h-6 w-6" strokeWidth={2.4} />
            </button>
        </div>
    );
}

/* ----------------------------- Page ----------------------------- */

export default function AttendanceWorkforceDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        control,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<Filters>({ defaultValues: getDefaultFilters() });

    // The snapshot heading reflects the filters that were last applied via "View"
    const [appliedFilters, setAppliedFilters] = useState<Filters>(getDefaultFilters);

    const [snapshot, setSnapshot] = useState<AttendanceSnapshot | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async (f: Filters) => {
        setLoading(true);
        setError(null);
        try {
            if (USE_MOCK) {
                await new Promise((r) => setTimeout(r, 300));
                setSnapshot(MOCK_SNAPSHOT);
            } else {
                const res = await api.get<AttendanceSnapshot>(SNAPSHOT_URL, {
                    params: {
                        shift: f.shift,
                        date: f.date,
                        department: f.department === "all" ? undefined : f.department,
                    },
                });
                setSnapshot(res.data);
            }
            setAppliedFilters(f);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load attendance data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load(getValues());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onView = (values: Filters) => load(values);

    const shiftLabel =
        SHIFT_OPTIONS.find((s) => s.value === appliedFilters.shift)?.label ?? "Current Shift";

    const stats: StatCardProps[] = snapshot
        ? [
              {
                  label: "Present",
                  value: fmtNumber(snapshot.present),
                  Icon: UserCheck,
                  circle: "bg-emerald-100 text-emerald-600",
                  labelColor: "text-emerald-700",
                  valueColor: "text-emerald-700",
              },
              {
                  label: "Absent",
                  value: fmtNumber(snapshot.absent),
                  Icon: UserX,
                  circle: "bg-red-100 text-red-500",
                  labelColor: "text-red-600",
                  valueColor: "text-red-600",
              },
              {
                  label: "Missing In Punch",
                  value: fmtNumber(snapshot.missingInPunch),
                  Icon: LogIn,
                  circle: "bg-orange-100 text-orange-500",
                  labelColor: "text-orange-600",
                  valueColor: "text-orange-500",
              },
              {
                  label: "Missing Out Punch",
                  value: fmtNumber(snapshot.missingOutPunch),
                  Icon: LogOut,
                  circle: "bg-violet-100 text-violet-600",
                  labelColor: "text-violet-700",
                  valueColor: "text-violet-700",
              },
              {
                  label: "OT (Approved)",
                  value: fmtHoursMins(snapshot.otApprovedMinutes),
                  sub: "Hrs : Mins",
                  Icon: Clock,
                  circle: "bg-blue-100 text-blue-700",
                  labelColor: "text-blue-800",
                  valueColor: "text-[#0b1f6b]",
              },
          ]
        : [];

    return (
        <div className="min-h-screen bg-white text-slate-800">
            {/* Top bar */}
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
                            className="flex items-center gap-2.5 rounded-md text-left text-[13px] font-semibold leading-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                        >
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white">
                                <UserRound className="h-5 w-5 fill-[#0b1a7c] text-[#0b1a7c]" aria-hidden />
                            </span>
                            <span className="max-w-[170px]">
                                {user?.userName ?? "Attendance & Workforce Movement Section"}
                            </span>
                            <ChevronDown className="h-4 w-4 shrink-0" strokeWidth={2.2} aria-hidden />
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
                {/* Title */}
                <div className="mb-6 text-center">
                    <h1 className="text-xl font-bold uppercase tracking-wide text-[#0b1f6b] sm:text-2xl">
                        Attendance &amp; Workforce Movement Section
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Overview of Attendance Statistics and Workflow Activities
                    </p>
                </div>

                {/* Filters */}
                <form
                    aria-label="Filters"
                    onSubmit={handleSubmit(onView)}
                    className="mb-5 flex flex-wrap items-end gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                >
                    <CommonInputField<Filters>
                        className="min-w-[200px] flex-1"
                        label="View Shift"
                        name="shift"
                        type="dropdown"
                        options={SHIFT_OPTIONS}
                        isPlaceholderVisible={false}
                        register={register}
                        control={control}
                        errors={errors}
                    />

                    <CommonInputField<Filters>
                        className="min-w-[200px] flex-1"
                        label="Date"
                        name="date"
                        type="date"
                        rules={{ required: "Date is required" }}
                        register={register}
                        control={control}
                        errors={errors}
                    />

                    <CommonInputField<Filters>
                        className="min-w-[200px] flex-1"
                        label="Department"
                        name="department"
                        type="dropdown"
                        options={DEPARTMENT_OPTIONS}
                        isPlaceholderVisible={false}
                        register={register}
                        control={control}
                        errors={errors}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex h-[38px] items-center justify-center gap-2 rounded-lg bg-[#0b1f8f] px-8 text-sm font-semibold text-white shadow hover:bg-[#09196f] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Search className="h-4 w-4" aria-hidden />
                        {loading ? "Loading…" : "View"}
                    </button>
                </form>

                {error && (
                    <div
                        role="alert"
                        className="mb-5 flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700"
                    >
                        <span>{error}</span>
                        <button onClick={() => load(getValues())} className="font-semibold underline">
                            Retry
                        </button>
                    </div>
                )}

                {/* Snapshot */}
                <section
                    aria-label="Attendance snapshot"
                    className="mb-6 rounded-xl border border-slate-200 bg-slate-50/70 p-5"
                >
                    <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-[#0b1f6b]">
                        Attendance Snapshot – {shiftLabel}
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {loading && !snapshot
                            ? Array.from({ length: 5 }).map((_, i) => (
                                  <div
                                      key={i}
                                      className="h-[104px] animate-pulse rounded-xl border border-slate-200 bg-white"
                                  />
                              ))
                            : stats.map((s) => <StatCard key={s.label} {...s} />)}
                    </div>
                </section>

                {/* Cells */}
                <section aria-label="Workflow cells" className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <CellCard
                        title="Attendance Cell"
                        description="Review and take action on requests forwarded by Attendance Cell for approval or forwarding."
                        pending={snapshot?.attendanceCellPending ?? 0}
                        Icon={CalendarDays}
                        iconBg="bg-[#0b1f8f]"
                        cardBg="bg-gradient-to-r from-blue-50 to-sky-50"
                        badgeBg="bg-blue-600"
                        // TODO: replace with your real route
                        onOpen={() => navigate("/attendance-and-workforce-movement/attendance-cell")}
                    />
                    <CellCard
                        title="Employee Movement Cell"
                        description="View requests and activities processed by Employee Movement Cell."
                        pending={snapshot?.movementCellPending ?? 0}
                        Icon={Users}
                        iconBg="bg-teal-600"
                        cardBg="bg-gradient-to-r from-emerald-50 to-teal-50"
                        badgeBg="bg-teal-600"
                        // TODO: replace with your real route
                        onOpen={() => navigate("/attendance-and-workforce-movement/employee-movement")}
                    />
                </section>

                {/* Info */}
                <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    <Info className="h-8 w-8 shrink-0 text-blue-700" strokeWidth={1.6} aria-hidden />
                    <p>
                        Attendance statistics are updated in real-time based on the current shift data.
                        <br />
                        Use the filters above to view different shifts and departments.
                    </p>
                </div>
            </main>
        </div>
    );
}