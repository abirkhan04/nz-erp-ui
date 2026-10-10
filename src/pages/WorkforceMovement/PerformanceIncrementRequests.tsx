import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    Info,
    Loader2,
    RefreshCw,
    Send,
} from "lucide-react";
import { api } from "../../api/client";

// Status value the backend expects when the Employee Movement Cell forwards
// the requests to the Attendance & Workforce Movement Section.
const FORWARD_STATUS = "ForwardedToHR";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
interface IncrementApproval {
    id: string;
    payIncHistId: string;
    approvedBy: string;
    approvalDate: string;
    toStatus: string;
    createdOn: string;
    createdBy: string;
    updatedOn: string;
    updatedBy: string;
    isActive: boolean;
}

interface IncrementHistory {
    id: string;
    employeeId: string;
    employeeCode: string;
    employeeName: string;
    departmentName: string;
    sectionName: string;
    effectiveDate: string;
    oldGrossSalary: number;
    newGrossSalary: number;
    incrementAmount: number;
    incrementPercent: number;
    incrementType: string;
    previousFivePercentIncrementDate: string | null;
    previousFivePercentIncrementAmount: number | null;
    lastPerformanceIncrementDate: string | null;
    lastPerformanceIncrementPercent: number | null;
    proposedPerformanceIncrementPercent: number | null;
    proposedPerformanceIncrementAmount: number | null;
    submittedOn: string;
    status: string;
    requests: IncrementApproval[];
}

interface IncrementHistoryResponse {
    items: IncrementHistory[];
    message: string;
}

interface UpdateIncrementRequest {
    payIncrementHistoryId: string;
    effectiveDate: string;
    oldGrossSalary: number;
    newGrossSalary: number;
    incrementAmount: number;
    incrementPercent: number;
    incrementType: string;
    status: string;
}

interface Feedback {
    type: "success" | "error";
    text: string;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const EMPTY = "—";

const formatDate = (value?: string | null): string => {
    if (!value) return EMPTY;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return EMPTY;
    return d
        .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        .replace(/ /g, "-");
};

const formatPercent = (value?: number | null): string =>
    value == null ? EMPTY : `${value.toFixed(2)}%`;

const formatAmount = (value?: number | null): string =>
    value == null
        ? EMPTY
        : value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

const formatDeptSection = (item: IncrementHistory): string => {
    const parts = [item.departmentName, item.sectionName].filter(Boolean);
    return parts.length ? parts.join(" / ") : EMPTY;
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function PerformanceIncrementReview() {
    const [items, setItems] = useState<IncrementHistory[]>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<Feedback | null>(null);

    const selectAllRef = useRef<HTMLInputElement>(null);

    /* ------------------------------ GET ------------------------------ */
    const fetchItems = useCallback(async () => {
        setLoading(true);
        setLoadError(null);
        try {
            const res = await api.get("/payroll/increment-histories?status=ForwardedToMovementSection");
            const data: IncrementHistoryResponse = res.data;
            setItems(data.items ?? []);
            setSelected(new Set());
        } catch (err) {
            if ((err as Error).name === "AbortError") return;
            setLoadError(
                err instanceof Error ? err.message : "Could not load increment requests."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchItems();
        return () => controller.abort();
    }, [fetchItems]);

    /* --------------------------- Selection --------------------------- */
    const allSelected = items.length > 0 && selected.size === items.length;
    const someSelected = selected.size > 0 && !allSelected;

    useEffect(() => {
        if (selectAllRef.current) selectAllRef.current.indeterminate = someSelected;
    }, [someSelected]);

    const toggleAll = () =>
        setSelected(allSelected ? new Set() : new Set(items.map((i) => i.id)));

    const toggleOne = (id: string) =>
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    /* ------------------------------ PUT ------------------------------ */
    const payload = useMemo<{ requests: UpdateIncrementRequest[] }>(
        () => ({
            requests: items
                .filter((i) => selected.has(i.id))
                .map((i) => ({
                    payIncrementHistoryId: i.id,
                    effectiveDate: i.effectiveDate,
                    oldGrossSalary: i.oldGrossSalary,
                    newGrossSalary: i.newGrossSalary,
                    incrementAmount: i.incrementAmount,
                    incrementPercent: i.incrementPercent,
                    incrementType: i.incrementType,
                    status: FORWARD_STATUS,
                })),
        }),
        [items, selected]
    );

    const handleForward = async () => {
        if (payload.requests.length === 0 || submitting) return;
        setSubmitting(true);
        setFeedback(null);
        try {
            await api.put("/payroll/increment-histories", payload);
            setFeedback({
                type: "success",
                text: `${payload.requests.length} request${payload.requests.length > 1 ? "s" : ""
                    } forwarded to Attendance & Workforce Movement Section.`,
            });
            await fetchItems();
        } catch (err) {
            console.log(err);
        } finally {
            setSubmitting(false);
        }
    };

    /* ----------------------------- Styles ---------------------------- */
    const th =
        "border-b border-r border-slate-200 bg-slate-50 px-3 py-3 text-center text-xs font-semibold text-slate-700 last:border-r-0";
    const td =
        "border-b border-r border-slate-200 px-3 py-4 text-center text-xs text-slate-700 last:border-r-0";

    /* ------------------------------ View ----------------------------- */
    return (
        <div className="min-h-screen bg-white px-6 py-6 text-slate-800">
            {/* Back + title */}
            <div className="relative mb-6 flex items-start">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="inline-flex items-center gap-2 rounded-md border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back
                </button>

                <div className="absolute inset-x-0 top-0 mx-auto w-fit text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-[#0b2a6b]">
                        REVIEW – PERFORMANCE INCREMENT REQUESTS
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Requests approved by Director and forwarded to Employee Movement
                        Cell.
                    </p>
                </div>
            </div>

            {/* Spacer so the absolutely-positioned title doesn't overlap content */}
            <div className="h-10" />

            {/* Info banner */}
            <div className="mb-6 flex items-center gap-4 rounded-lg border border-slate-200 bg-[#f4f8fd] px-5 py-4">
                <Info className="h-7 w-7 shrink-0 text-blue-600" aria-hidden="true" />
                <div className="text-sm leading-6 text-slate-700">
                    <p>Below are the Performance Increment requests approved by Director.</p>
                    <p>Please review the details and forward to Attendance &amp; Workforce Movement Section.</p>
                </div>
            </div>

            {/* Totals */}
            <div className="mb-4 flex items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium">
                    Total Requests:
                    <span className="text-xl font-bold text-blue-700">{items.length}</span>
                </div>
                {selected.size > 0 && (
                    <span className="text-sm text-slate-500">
                        {selected.size} selected
                    </span>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[1200px] border-collapse">
                    <thead>
                        <tr>
                            <th rowSpan={2} className={`${th} w-12`}>
                                <input
                                    ref={selectAllRef}
                                    type="checkbox"
                                    aria-label="Select all requests"
                                    checked={allSelected}
                                    onChange={toggleAll}
                                    disabled={items.length === 0 || submitting}
                                    className="h-4 w-4 cursor-pointer accent-blue-700"
                                />
                            </th>
                            <th rowSpan={2} className={th}>SL No.</th>
                            <th rowSpan={2} className={th}>Employee ID</th>
                            <th rowSpan={2} className={th}>Employee Name</th>
                            <th rowSpan={2} className={th}>Department / Section</th>
                            <th colSpan={2} className={th}>Last Performance Increment</th>
                            <th colSpan={2} className={th}>
                                Previous Increment
                                <br />
                                (5% Basic)
                            </th>
                            <th colSpan={2} className={th}>Proposed Performance Increment</th>
                            <th rowSpan={2} className={th}>
                                Director Approval
                                <br />
                                Date
                            </th>
                            <th rowSpan={2} className={th}>
                                EmployeeMovement Cell Review Date
                                <br />
                                Date
                            </th>
                            <th rowSpan={2} className={th}>Status</th>
                        </tr>
                        <tr>
                            <th className={th}>Date</th>
                            <th className={th}>Percent</th>
                            <th className={th}>Date</th>
                            <th className={th}>Amount (BDT)</th>
                            <th className={th}>Percent</th>
                            <th className={th}>Amount (BDT)</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={13} className="py-16 text-center text-sm text-slate-500">
                                    <Loader2
                                        className="mx-auto mb-2 h-6 w-6 animate-spin text-blue-600"
                                        aria-hidden="true"
                                    />
                                    Loading increment requests…
                                </td>
                            </tr>
                        )}

                        {!loading && loadError && (
                            <tr>
                                <td colSpan={13} className="py-16 text-center">
                                    <AlertCircle
                                        className="mx-auto mb-2 h-6 w-6 text-red-600"
                                        aria-hidden="true"
                                    />
                                    <p className="mb-3 text-sm text-red-700">{loadError}</p>
                                    <button
                                        type="button"
                                        onClick={() => fetchItems()}
                                        className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        <RefreshCw className="h-4 w-4" aria-hidden="true" />
                                        Try again
                                    </button>
                                </td>
                            </tr>
                        )}

                        {!loading && !loadError && items.length === 0 && (
                            <tr>
                                <td colSpan={13} className="py-16 text-center text-sm text-slate-500">
                                    No requests are waiting for review.
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            !loadError &&
                            items.map((item, index) => {
                                const isChecked = selected.has(item.id);
                                const directorApprovalDate = item.requests?.find((i) => i.toStatus === "Approved")?.approvalDate;
                                const movementCellApprovalDate = item.requests?.find((i) => i.toStatus === "ForwardedToMovementSection")?.approvalDate;
                                return (
                                    <tr
                                        key={item.id}
                                        className={isChecked ? "bg-blue-50/60" : "hover:bg-slate-50"}
                                    >
                                        <td className={td}>
                                            <input
                                                type="checkbox"
                                                aria-label={`Select ${item.employeeName}`}
                                                checked={isChecked}
                                                onChange={() => toggleOne(item.id)}
                                                disabled={submitting}
                                                className="h-4 w-4 cursor-pointer accent-blue-700"
                                            />
                                        </td>
                                        <td className={td}>{index + 1}</td>
                                        <td className={td}>{item.employeeCode}</td>
                                        <td className={td}>{item.employeeName}</td>
                                        <td className={td}>{formatDeptSection(item)}</td>
                                        <td className={td}>{formatDate(item.lastPerformanceIncrementDate)}</td>
                                        <td className={td}>{formatPercent(item.lastPerformanceIncrementPercent)}</td>
                                        <td className={td}>{formatDate(item.previousFivePercentIncrementDate)}</td>
                                        <td className={td}>{formatAmount(item.previousFivePercentIncrementAmount)}</td>
                                        <td className={td}>
                                            {formatPercent(
                                                item.proposedPerformanceIncrementPercent ?? item.incrementPercent
                                            )}
                                        </td>
                                        <td className={td}>
                                            {formatAmount(
                                                item.proposedPerformanceIncrementAmount ?? item.incrementAmount
                                            )}
                                        </td>
                                        <td className={td}>{formatDate(directorApprovalDate)}</td>
                                         <td className={td}>{formatDate(movementCellApprovalDate)}</td>
                                        <td className={td}>
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="block w-full rounded border border-emerald-300 bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase leading-tight text-emerald-700">
                                                    Approved by Director
                                                </span>
                                                <span className="block w-full rounded border border-emerald-300 bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase leading-tight text-emerald-700">
                                                    Reviewed by Movement Cell
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>

            {/* Feedback */}
            {feedback && (
                <div
                    role="status"
                    className={`mx-auto mt-6 flex max-w-2xl items-start gap-2 rounded-md border px-4 py-3 text-sm ${feedback.type === "success"
                        ? "border-green-200 bg-green-50 text-green-800"
                        : "border-red-200 bg-red-50 text-red-800"
                        }`}
                >
                    {feedback.type === "success" ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    ) : (
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    )}
                    <span>{feedback.text}</span>
                </div>
            )}

            {/* Forward action */}
            <div className="mt-8 flex flex-col items-center gap-2">
                <button
                    type="button"
                    onClick={handleForward}
                    disabled={selected.size === 0 || submitting}
                    className="inline-flex items-center gap-2 rounded-md bg-[#0b3a99] px-10 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#092f7d] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                        <Send className="h-4 w-4" aria-hidden="true" />
                    )}
                    {submitting
                        ? "Forwarding…"
                        : `Forward to HR Brannch Manager${selected.size > 0 ? ` (${selected.size})` : ""
                        }`}
                </button>
                {selected.size === 0 && !loading && items.length > 0 && (
                    <p className="text-xs text-slate-500">
                        Select at least one request to forward.
                    </p>
                )}
            </div>
        </div>
    );
}