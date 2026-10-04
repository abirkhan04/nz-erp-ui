import { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client";

/* ----------------------------- Config ----------------------------- */

// TODO: replace with your real endpoints
const GET_URL = "payroll/promotion-increment-requests";
const PUT_URL = "payroll/promotion-increment-requests/forwarded-to-movement-section";

/* ----------------------------- Types ----------------------------- */

export interface PromotionIncrementRequest {
  requestId: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  department: string | null;
  section: string | null;
  currentDesignation: string | null;
  proposedDesignation: string | null;
  currentGrade: string | null;
  currentGradeCode: string | null;
  proposedGrade: string | null;
  proposedGradeCode: string | null;
  lastIncrementDate: string | null;
  lastIncrementAmount: number | null;
  currentGrossSalary: number;
  incrementPercent: number;
  incrementAmount: number;
  newGrossSalary: number;
  effectiveFrom: string;
  reason: string | null;
  directorApprovalDate: string | null;
  movementCellReviewDate: string | null;
  status: string;
}

interface ListResponse {
  items: PromotionIncrementRequest[];
  totalCount: number;
  message?: string;
}

export interface DecisionPayloadItem {
  requestId: string;
  approved: boolean;
  remarks: string;
}

export interface DecisionPayload {
  requests: DecisionPayloadItem[];
}

type DecisionStatus = "approved" | "rejected";

interface Decision {
  status: DecisionStatus;
  remarks: string;
}

/* ---------------------------- Helpers ---------------------------- */

const dash = (v?: string | null): string => (v && v.trim() ? v : "-");

const fmtDate = (iso?: string | null): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const day = String(d.getDate()).padStart(2, "0");
  const mon = d.toLocaleString("en-GB", { month: "short" });
  return `${day}-${mon}-${d.getFullYear()}`;
};

const fmtMoney = (n?: number | null): string =>
  Number(n ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const fmtPercent = (n?: number | null): string => `${Number(n ?? 0).toFixed(2)}%`;

const deptSection = (r: PromotionIncrementRequest): string => {
  const parts = [r.department, r.section].filter(Boolean) as string[];
  return parts.length ? parts.join(" / ") : "-";
};

const th =
  "border border-slate-200 bg-slate-50 px-2 py-3 text-center text-xs font-bold text-[#0b1f6b]";
const td = "border border-slate-200 px-2 py-3 text-center text-xs";

/* ---------------------------- Component --------------------------- */

export default function PromotionIncrementRequests() {
  const navigate = useNavigate();

  const [rows, setRows] = useState<PromotionIncrementRequest[]>([]);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [notice, setNotice] = useState<string>("");
  const [reviewing, setReviewing] = useState<{
    row: PromotionIncrementRequest;
    status: DecisionStatus;
  } | null>(null);
  const [remarks, setRemarks] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get<ListResponse>(`${GET_URL}?status=PENDING_DIRECTOR_APPROVAL`);
        if (!cancelled) setRows(res.data.items ?? []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const list = Object.values(decisions);
    const approved = list.filter((d) => d.status === "approved").length;
    const rejected = list.filter((d) => d.status === "rejected").length;
    return { approved, rejected, decided: approved + rejected, pending: rows.length - list.length };
  }, [decisions, rows.length]);

  const openDecision = (row: PromotionIncrementRequest, status: DecisionStatus) => {
    setReviewing({ row, status });
    setRemarks(decisions[row.requestId]?.remarks ?? "");
  };

  const confirmDecision = () => {
    if (!reviewing) return;
    // Uncomment to make rejection remarks mandatory:
    // if (reviewing.status === "rejected" && !remarks.trim()) return;
    setDecisions((p) => ({
      ...p,
      [reviewing.row.requestId]: { status: reviewing.status, remarks: remarks.trim() },
    }));
    setReviewing(null);
    setRemarks("");
  };

  const closeDialog = () => {
    setReviewing(null);
    setRemarks("");
  };

  const undo = (row: PromotionIncrementRequest) =>
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

    const payload: DecisionPayload = { requests };

    try {
      setSubmitting(true);
      setError("");
      setNotice("");
      await api.put(PUT_URL, payload);

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

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Top bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 bg-[#0b1f6b] px-7 py-4 text-white">
        <div>
          <h1 className="text-xl font-bold">DIRECTOR – PROMOTION + INCREMENT REQUESTS</h1>
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
          onClick={() => navigate("/director-dashboard")}
          className="rounded-md border border-[#0b1f6b] bg-white px-5 py-2 text-sm font-semibold text-[#0b1f6b] hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          ← Back
        </button>

        <h2 className="text-center text-xl font-bold text-[#2a1fa8]">
          PROMOTION + INCREMENT REQUESTS
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
          <table className="w-full min-w-[1180px] border-collapse">
            <thead>
              <tr>
                <th rowSpan={2} className={th}>SL No.</th>
                <th rowSpan={2} className={th}>Employee ID</th>
                <th rowSpan={2} className={th}>Employee Name</th>
                <th rowSpan={2} className={th}>Department / Section</th>
                <th rowSpan={2} className={th}>Current Designation</th>
                <th rowSpan={2} className={th}>Current Grade</th>
                <th rowSpan={2} className={th}>Proposed Designation</th>
                <th rowSpan={2} className={th}>Proposed Grade</th>
                <th colSpan={2} className={th}>Proposed Increment</th>
                <th rowSpan={2} className={th}>Effective From</th>
                <th rowSpan={2} className={th}>Action</th>
              </tr>
              <tr>
                <th className={th}>Percent</th>
                <th className={th}>Amount (BDT)</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={12} className="p-8 text-center text-sm text-slate-500">
                    Loading requests…
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={12} className="p-8 text-center text-sm text-slate-500">
                    No promotion + increment requests to review.
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
                  <Fragment key={r.requestId}>
                    <tr className={rowBg}>
                      <td className={td}>{i + 1}</td>
                      <td className={td}>{r.employeeCode}</td>
                      <td className={td}>{r.employeeName}</td>
                      <td className={td}>{deptSection(r)}</td>
                      <td className={td}>{dash(r.currentDesignation)}</td>
                      <td className={td}>{dash(r.currentGradeCode ?? r.currentGrade)}</td>
                      <td className={td}>{dash(r.proposedDesignation)}</td>
                      <td className={td}>{dash(r.proposedGradeCode ?? r.proposedGrade)}</td>
                      <td className={td}>{fmtPercent(r.incrementPercent)}</td>
                      <td className={td}>{fmtMoney(r.incrementAmount)}</td>
                      <td className={td}>{fmtDate(r.effectiveFrom)}</td>
                      <td className={td}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            aria-pressed={d?.status === "approved"}
                            onClick={() =>
                              d?.status === "approved" ? undo(r) : openDecision(r, "approved")
                            }
                            className={`rounded border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                              d?.status === "approved"
                                ? "border-green-600 bg-green-600 text-white"
                                : "border-green-600 bg-white text-green-700 hover:bg-green-50"
                            }`}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            aria-pressed={d?.status === "rejected"}
                            onClick={() =>
                              d?.status === "rejected" ? undo(r) : openDecision(r, "rejected")
                            }
                            className={`rounded border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                              d?.status === "rejected"
                                ? "border-red-600 bg-red-600 text-white"
                                : "border-red-500 bg-white text-red-600 hover:bg-red-50"
                            }`}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className={`${rowBg || "bg-slate-50/70"}`}>
                      <td colSpan={12} className="border border-slate-200 px-3 py-2 text-left text-xs">
                        <p className="font-bold text-[#2a1fa8]">Justification / Remarks:</p>
                        <p className="mt-0.5 text-slate-700">{dash(r.reason)}</p>
                        {d?.remarks && (
                          <p className="mt-1.5 text-slate-700">
                            <span
                              className={`font-bold ${
                                d.status === "approved" ? "text-green-700" : "text-red-700"
                              }`}
                            >
                              Director's remarks:
                            </span>{" "}
                            {d.remarks}
                          </p>
                        )}
                      </td>
                    </tr>
                  </Fragment>
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
            disabled={submitting || counts.decided === 0}
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

      {/* Decision dialog */}
      {reviewing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={closeDialog}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-lg bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className={`text-lg font-bold ${
                reviewing.status === "approved" ? "text-green-700" : "text-red-700"
              }`}
            >
              {reviewing.status === "approved" ? "Approve request" : "Reject request"}
            </h3>
            <p className="mb-3.5 text-sm text-slate-500">
              {reviewing.row.employeeName} ({reviewing.row.employeeCode})
            </p>
            <label htmlFor="decision-remarks" className="mb-1.5 block text-sm font-semibold">
              Remarks{" "}
              {reviewing.status === "approved" && (
                <span className="font-normal text-slate-400">(optional)</span>
              )}
            </label>
            <textarea
              id="decision-remarks"
              rows={4}
              autoFocus
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder={
                reviewing.status === "approved"
                  ? "Add a note for approval (optional)"
                  : "Reason for rejection"
              }
              className="w-full resize-y rounded-md border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="mt-3.5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeDialog}
                className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDecision}
                className={`rounded px-4 py-2 text-sm font-semibold text-white ${
                  reviewing.status === "approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {reviewing.status === "approved" ? "Confirm approval" : "Confirm rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
