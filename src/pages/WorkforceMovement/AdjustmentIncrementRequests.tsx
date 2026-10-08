import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/client";
import { useNavigate } from "react-router-dom";
import {
    Calendar,
    ChevronDown,
    Network,
    UserRound,
} from "lucide-react";

/* ----------------------------- Types ----------------------------- */

export interface AdjustmentRequest {
    requestId: string;
    employeeId: string;
    employeeCode: string;
    employeeName: string;
    departmentName: string;
    designation: string;
    probationPeriod: number;
    dateOfJoining: string;
    probationCompletedOn: string;
    currentGrossSalary: number;
    standardGrossSalary: number;
    adjustmentAmount: number;
    currentBasicSalary: number;
    adjustedBasicSalary: number;
    incrementAmount: number;
    effectiveFrom: string;
    status: string;
    forwardedBy: string;
    forwardedOn: string;
}

export interface ForwardPayloadItem {
    requestId: string;
    forwardedBy: string | undefined;
    remarks: string;
}

/* ----------------------------- Helpers ----------------------------- */

const fmtMoney = (n: number) =>
    n.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).replace(/ /g, "-");

/* ----------------------------- Component ----------------------------- */

export default function AdjustmentIncrementReview() {

    const getUrl = "/learners/eligible-adjustments?status=Approved";
    const postUrl = "/learners/eligible-adjustments/movement-cell";

    const { user } = useAuth()

    const [rows, setRows] = useState<AdjustmentRequest[]>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    // Per-row remarks: { [requestId]: "text" } (optional for every row)
    const [remarksMap, setRemarksMap] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    /* ---- GET ---- */
    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(getUrl);
            const data: AdjustmentRequest[] = res.data;
            setRows(data);
            setSelected(new Set());
            setRemarksMap({});
        } catch (e) {
            setError(e instanceof Error ? e.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }, [getUrl]);

    useEffect(() => {
        load();
    }, [load]);

    /* ---- Selection ---- */
    const allSelected = rows.length > 0 && selected.size === rows.length;
    const someSelected = selected.size > 0 && !allSelected;

    const headerCheckbox = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (headerCheckbox.current) headerCheckbox.current.indeterminate = someSelected;
    }, [someSelected]);

    const toggleAll = () =>
        setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.requestId)));

    const toggleOne = (id: string) =>
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

    const setRemark = (id: string, value: string) =>
        setRemarksMap((prev) => ({ ...prev, [id]: value }));

    /* ---- POST ---- */
    const handleForward = async () => {
        if (selected.size === 0) return;
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        const payload: ForwardPayloadItem[] = rows
            .filter((r) => selected.has(r.requestId))
            .map((r) => ({
                requestId: r.requestId,
                forwardedBy: user?.userName,
                remarks: (remarksMap[r.requestId] ?? "").trim(),
            }));

        try {
            await api.post(postUrl, payload);

            // Remove forwarded rows from the list
            setRows((prev) => prev.filter((r) => !selected.has(r.requestId)));
            setSuccess(`${payload.length} request(s) forwarded successfully.`);
            setSelected(new Set());
            setRemarksMap({});
        } catch (e) {
            setError(e instanceof Error ? e.message : "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    const formatHeaderDate = (d: Date): string => {
        const month = d.toLocaleDateString("en-GB", { month: "long" });
        const weekday = d.toLocaleDateString("en-GB", { weekday: "long" });
        return `${d.getDate()} ${month} ${d.getFullYear()} | ${weekday}`;
    };

    /* ----------------------------- UI ----------------------------- */
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-white px-4 py-6 text-slate-800 sm:px-8">
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
            {/* Back */}
            <button
                type="button"
                onClick={() => navigate("/attendance-and-workforce-movement/employee-movement")}
                className="mb-4 inline-flex items-center gap-2 rounded-md border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
                <span aria-hidden>←</span> Back
            </button>

            {/* Title */}
            <header className="mb-6 text-center">
                <h1 className="text-xl font-bold tracking-wide text-[#0b1f6b] sm:text-2xl">
                    REVIEW – ADJUSTMENT INCREMENT REQUESTS
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Requests approved by Director and forwarded to Employee Movement Cell.
                </p>
            </header>

            {/* Info banner */}
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
                <span
                    aria-hidden
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 text-xs font-bold text-blue-600"
                >
                    i
                </span>
                <p>
                    Below are the Adjustment Increment requests approved by Director.
                    <br />
                    Select the requests to forward to Attendance &amp; Workforce Movement Section.
                    You can add an optional remark for each selected request.
                </p>
            </div>

            {/* Counters */}
            <div className="mb-3 flex flex-wrap items-center gap-3">
                <div className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold">
                    Total Requests: <span className="ml-1 text-xl text-blue-700">{rows.length}</span>
                </div>
                <div className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold">
                    Selected: <span className="ml-1 text-xl text-emerald-600">{selected.size}</span>
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <div role="alert" className="mb-3 flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                    <span>{error}</span>
                    <button onClick={load} className="font-semibold underline">Retry</button>
                </div>
            )}
            {success && (
                <div role="status" className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                    {success}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full text-center text-sm">
                    <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
                        <tr>
                            <th className="w-12 px-3 py-3">
                                <input
                                    ref={headerCheckbox}
                                    type="checkbox"
                                    aria-label="Select all requests"
                                    checked={allSelected}
                                    onChange={toggleAll}
                                    disabled={rows.length === 0 || submitting}
                                    className="h-4 w-4 cursor-pointer accent-blue-700"
                                />
                            </th>
                            <th className="px-3 py-3">SL No.</th>
                            <th className="px-3 py-3">Employee ID</th>
                            <th className="px-3 py-3">Employee Name</th>
                            <th className="px-3 py-3">Department / Section</th>
                            <th className="px-3 py-3">Learner Gross<br />(BDT)</th>
                            <th className="px-3 py-3">Standard Worker Gross<br />(BDT)</th>
                            <th className="px-3 py-3">Adjustment Amount<br />(BDT)</th>
                            <th className="px-3 py-3">Increment Amount<br />(BDT)</th>
                            <th className="px-3 py-3">Effective From</th>
                            <th className="px-3 py-3">Status</th>
                            <th className="min-w-[200px] px-3 py-3">Remarks<br />(Optional)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={12} className="py-10 text-slate-500">Loading requests…</td>
                            </tr>
                        )}

                        {!loading && rows.length === 0 && (
                            <tr>
                                <td colSpan={12} className="py-10 text-slate-500">
                                    No approved requests are waiting to be forwarded.
                                </td>
                            </tr>
                        )}

                        {rows.map((r, i) => {
                            const isChecked = selected.has(r.requestId);
                            return (
                                <tr
                                    key={r.requestId}
                                    onClick={() => !submitting && toggleOne(r.requestId)}
                                    className={`cursor-pointer border-t border-slate-200 transition-colors ${isChecked ? "bg-blue-50" : "hover:bg-slate-50"
                                        }`}
                                >
                                    <td className="px-3 py-4" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            aria-label={`Select ${r.employeeName}`}
                                            checked={isChecked}
                                            onChange={() => toggleOne(r.requestId)}
                                            disabled={submitting}
                                            className="h-4 w-4 cursor-pointer accent-blue-700"
                                        />
                                    </td>
                                    <td className="px-3 py-4">{i + 1}</td>
                                    <td className="px-3 py-4">{r.employeeCode}</td>
                                    <td className="px-3 py-4">{r.employeeName}</td>
                                    <td className="px-3 py-4">{r.departmentName}</td>
                                    <td className="px-3 py-4">{fmtMoney(r.currentGrossSalary)}</td>
                                    <td className="px-3 py-4">{fmtMoney(r.standardGrossSalary)}</td>
                                    <td className="px-3 py-4">{fmtMoney(r.adjustmentAmount)}</td>
                                    <td className="px-3 py-4">{fmtMoney(r.incrementAmount)}</td>
                                    <td className="px-3 py-4 whitespace-nowrap">{fmtDate(r.effectiveFrom)}</td>
                                    <td className="px-3 py-4">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="block w-full rounded border border-emerald-300 bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase leading-tight text-emerald-700">
                                                Approved by Director
                                            </span>
                                            <span className="block w-full rounded border border-emerald-300 bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase leading-tight text-emerald-700">
                                                Reviewed by Movement Cell
                                            </span>
                                        </div>
                                    </td>
                                    {/* Per-row optional remarks (editable only when the row is selected) */}
                                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="text"
                                            aria-label={`Remarks for ${r.employeeName}`}
                                            value={remarksMap[r.requestId] ?? ""}
                                            onChange={(e) => setRemark(r.requestId, e.target.value)}
                                            disabled={!isChecked || submitting}
                                            placeholder={isChecked ? "Add remarks (optional)" : "Select row to add"}
                                            className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Forward */}
            <div className="mt-6 flex justify-center">
                <button
                    type="button"
                    onClick={handleForward}
                    disabled={selected.size === 0 || submitting}
                    className="inline-flex items-center gap-2 rounded-md bg-[#0b1f8f] px-8 py-3 text-sm font-semibold text-white shadow hover:bg-[#09196f] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {submitting
                        ? "Forwarding…"
                        : `Forward ${selected.size > 0 ? `(${selected.size}) ` : ""}to HR Branch Manager`}
                </button>
            </div>
        </div>
    );
}