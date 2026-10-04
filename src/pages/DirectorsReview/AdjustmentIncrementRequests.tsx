import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

/* ----------------------------- Types ----------------------------- */

export interface IncrementRequest {
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

export interface DecisionPayloadItem {
  requestId: string;
  approved: boolean;
  remarks: string;
}

export interface DecisionPayload {
  requests: DecisionPayloadItem[];
  approvedBy: string | undefined;
}

type DecisionStatus = "approved" | "rejected";

interface Decision {
  status: DecisionStatus;
  remarks: string;
}

interface Props {
  approvedBy?: string;
  newStatus?: string;
  headers?: Record<string, string>;
  onBack?: () => void;
}

/* ---------------------------- Helpers ---------------------------- */

const fmtDate = (iso?: string): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const day = String(d.getDate()).padStart(2, "0");
  const mon = d.toLocaleString("en-GB", { month: "short" });
  return `${day}-${mon}-${d.getFullYear()}`;
};

const fmtMoney = (n?: number): string =>
  Number(n ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const HEADERS = [
  "SL No.",
  "Employee ID",
  "Employee Name",
  "Department / Section",
  "Date of Joining",
  "Probation Period",
  "Probation End Date",
  "Current Status (From)",
  "New Status (To)",
  "Current Basic Salary (BDT)",
  "Adjusted Basic Salary (BDT)",
  "Increment Amount (BDT)",
  "Effective From",
  "Forwarded On",
  "Action",
];

const th =
  "border border-slate-200 bg-slate-50 px-2 py-2.5 text-center text-xs font-bold text-[#0b1f6b]";
const td = "border border-slate-200 px-2 py-3 text-center text-xs";

/* ---------------------------- Component --------------------------- */

export default function AdjustmentIncrementRequests({
  newStatus = "Standard Worker",
}: Props) {

  const {user} = useAuth();
  const approvedBy = user?.userName;
  const [rows, setRows] = useState<IncrementRequest[]>([]);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [notice, setNotice] = useState<string>("");
  const [rejecting, setRejecting] = useState<IncrementRequest | null>(null);
  const [remarks, setRemarks] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("learners/eligible-adjustments/pending-approvals");
    
        const data: IncrementRequest[] | { requests: IncrementRequest[] } = res.data;
        if (!cancelled) setRows(Array.isArray(data) ? data : data.requests ?? []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = useMemo(() => {
    const list = Object.values(decisions);
    return {
      approved: list.filter((d) => d.status === "approved").length,
      rejected: list.filter((d) => d.status === "rejected").length,
      pending: rows.length - list.length,
    };
  }, [decisions, rows.length]);

  const approve = (row: IncrementRequest) =>
    setDecisions((p) => ({ ...p, [row.requestId]: { status: "approved", remarks: "" } }));

  const openReject = (row: IncrementRequest) => {
    setRejecting(row);
    setRemarks(decisions[row.requestId]?.remarks ?? "");
  };

  const confirmReject = () => {
    if (!rejecting) return;
    setDecisions((p) => ({
      ...p,
      [rejecting.requestId]: { status: "rejected", remarks: remarks.trim() },
    }));
    setRejecting(null);
    setRemarks("");
  };

  const undo = (row: IncrementRequest) =>
    setDecisions((p) => {
      const next = { ...p };
      delete next[row.requestId];
      return next;
    });

  const forward = async () => {
    const requests: DecisionPayloadItem[] = rows
      .filter((r) => decisions[r.requestId])
      .map((r) => ({
        requestId: r.requestId,
        approved: decisions[r.requestId].status === "approved",
        remarks: decisions[r.requestId].remarks,
      }));
    if (requests.length === 0) return;

    const payload: DecisionPayload = { requests, approvedBy };

    try {
      setSubmitting(true);
      setError("");
      setNotice("");
       await api.post("learners/eligible-adjustments/approve", payload);

      const done = new Set(requests.map((r) => r.requestId));
      setRows((p) => p.filter((r) => !done.has(r.requestId)));
      setDecisions({});
      setNotice(`${requests.length} request(s) processed successfully.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const now = new Date();
  const dateLabel = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const weekday = now.toLocaleDateString("en-GB", { weekday: "long" });
  const decidedCount = counts.approved + counts.rejected;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Top bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 bg-[#0b1f6b] px-7 py-4 text-white">
        <div>
          <h1 className="text-xl font-bold">DIRECTOR – ADJUSTMENT INCREMENT REQUESTS</h1>
          <p className="mt-1 text-sm opacity-90">
            Review &amp; Approve Requests Forwarded by Production Floor
          </p>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <span>
            {dateLabel} | {weekday}
          </span>
          <span className="border-l border-white/30 pl-5 font-semibold">Director</span>
        </div>
      </header>

      <main className="px-7 pb-10 pt-5">
        <button
          type="button"
          onClick={()=> navigate('/director-dashboard')}
          className="rounded-md border border-[#0b1f6b] bg-white px-5 py-2 text-sm font-semibold text-[#0b1f6b] hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          ← Back
        </button>

        <h2 className="text-center text-2xl font-bold text-orange-500">
          ADJUSTMENT INCREMENT REQUESTS
        </h2>
        <p className="mt-1.5 text-center font-semibold text-slate-500">
          Total Requests: {rows.length}
        </p>
        <p className="mb-4 mt-1 text-center text-sm text-slate-500">
          <b className="text-green-600">{counts.approved}</b> approved ·{" "}
          <b className="text-red-600">{counts.rejected}</b> rejected ·{" "}
          <b>{counts.pending}</b> pending
        </p>

        {error && (
          <div role="alert" className="mb-3 rounded-md bg-red-50 px-4 py-2.5 text-sm text-red-800">
            {error}
          </div>
        )}
        {notice && (
          <div role="status" className="mb-3 rounded-md bg-green-50 px-4 py-2.5 text-sm text-green-800">
            {notice}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-md border border-slate-200">
          <table className="w-full min-w-[1280px] border-collapse">
            <thead>
              <tr>
                {HEADERS.map((h) => (
                  <th key={h} className={th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={HEADERS.length} className="p-8 text-center text-sm text-slate-500">
                    Loading requests…
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={HEADERS.length} className="p-8 text-center text-sm text-slate-500">
                    No adjustment increment requests to review.
                  </td>
                </tr>
              )}
              {rows.map((r, i) => {
                const d = decisions[r.requestId];
                const rowBg =
                  d?.status === "approved"
                    ? "bg-green-50/60"
                    : d?.status === "rejected"
                      ? "bg-red-50/60"
                      : "";
                return (
                  <tr key={r.requestId} className={rowBg}>
                    <td className={td}>{i + 1}</td>
                    <td className={td}>{r.employeeCode}</td>
                    <td className={td}>{r.employeeName}</td>
                    <td className={td}>{r.departmentName}</td>
                    <td className={td}>{fmtDate(r.dateOfJoining)}</td>
                    <td className={td}>{r.probationPeriod} Months</td>
                    <td className={td}>{fmtDate(r.probationCompletedOn)}</td>
                    <td className={td}>{r.designation}</td>
                    <td className={td}>{newStatus}</td>
                    <td className={td}>{fmtMoney(r.currentBasicSalary)}</td>
                    <td className={td}>{fmtMoney(r.adjustedBasicSalary)}</td>
                    <td className={td}>{fmtMoney(r.incrementAmount)}</td>
                    <td className={td}>{fmtDate(r.effectiveFrom)}</td>
                    <td className={td}>{fmtDate(r.forwardedOn)}</td>
                    <td className={td}>
                      <div className="flex items-center justify-center gap-1.5">
                        {!d ? (
                          <>
                            <button
                              type="button"
                              onClick={() => approve(r)}
                              className="rounded border border-green-600 bg-white px-2.5 py-1 text-[11px] font-semibold text-green-600 hover:bg-green-50"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => openReject(r)}
                              className="rounded border border-red-600 bg-white px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <>
                            <span
                              title={d.remarks}
                              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                                d.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {d.status === "approved" ? "Approved" : "Rejected"}
                            </span>
                            <button
                              type="button"
                              onClick={() => undo(r)}
                              className="rounded border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:bg-slate-50"
                            >
                              Undo
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-7 text-center">
          <button
            type="button"
            onClick={forward}
            disabled={submitting || decidedCount === 0}
            className="rounded-md bg-[#0b1f6b] px-10 py-3 text-[15px] font-semibold text-white hover:bg-[#08174f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Forwarding…" : "Forward Decisions to Employee Movement Cell"}
          </button>
          <p className="mt-2.5 text-sm text-slate-500">
            Only requests you approved or rejected will be sent.
            {counts.pending > 0 &&
              ` ${counts.pending} pending request(s) will stay in this list.`}
          </p>
        </div>
      </main>

      {/* Reject dialog */}
      {rejecting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() => setRejecting(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-lg bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-[#0b1f6b]">Reject request</h3>
            <p className="mb-3.5 text-sm text-slate-500">
              {rejecting.employeeName} ({rejecting.employeeCode})
            </p>
            <label htmlFor="reject-remarks" className="mb-1.5 block text-sm font-semibold">
              Remarks
            </label>
            <textarea
              id="reject-remarks"
              rows={4}
              autoFocus
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Reason for rejection"
              className="w-full resize-y rounded-md border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="mt-3.5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejecting(null)}
                className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmReject}
                className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Reject request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
