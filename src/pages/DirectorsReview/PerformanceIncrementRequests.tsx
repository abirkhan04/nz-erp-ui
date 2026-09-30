import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Send, UserRound, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { api } from "../../api/client";
import { API_ROUTES } from "../../api/routes";
import { useAuth } from "../../context/AuthContext";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface IncrementApproval {
    id: string;
    payIncHistId: string;
    approvedBy: string;
    approvalDate: string;
    createdOn: string;
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
    status: string;
    requests?: IncrementApproval[];
}

interface IncrementHistoryResponse {
    items: IncrementHistory[];
    message?: string;
}

type Decision = "Approved" | "Rejected";

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value ?? 0);

const formatDate = (date?: string) => {
    if (!date) return "";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "";
    return d
        .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        .replace(/ /g, "-");
};

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

const DirectorPerformanceIncrementRequests: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [rows, setRows] = useState<IncrementHistory[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    /** id -> decision. A missing key means "not decided yet". */
    const [decisions, setDecisions] = useState<Record<string, Decision>>({});

    /* ------------------------------ FETCH ---------------------------------- */

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get<IncrementHistoryResponse>(
                `${API_ROUTES.PAYROLL}/increment-histories?status=PENDING`,
            );

            const items = (response.data?.items ?? []).filter(
                (item) =>
                    item.incrementType === "performance"
            );

            setRows(items);
            setDecisions({});
        } catch (error) {
            console.error("Failed to load increment requests:", error);
            toast.error("Failed to load performance increment requests.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    /* ------------------------------ TOGGLE --------------------------------- */

    /**
     * Clicking the active button clears the decision (back to pending).
     * Clicking the other button switches the decision.
     */
    const toggleDecision = (id: string, next: Decision) => {
        setDecisions((prev) => {
            const updated = { ...prev };
            if (updated[id] === next) {
                delete updated[id];
            } else {
                updated[id] = next;
            }
            return updated;
        });
    };

    const approvedCount = useMemo(
        () => Object.values(decisions).filter((d) => d === "Approved").length,
        [decisions],
    );
    const rejectedCount = useMemo(
        () => Object.values(decisions).filter((d) => d === "Rejected").length,
        [decisions],
    );
    const decidedCount = approvedCount + rejectedCount;

    /* ------------------------------ SUBMIT --------------------------------- */

    const handleForward = async () => {
        if (decidedCount === 0 || submitting) return;

        /*
         * Adjust this payload to match your backend PUT contract.
         * One call carries every approved AND rejected row.
         */
        const payload = {
            requests: Object.entries(decisions).map(([id, status]) => ({
                id,
                status, // "Approved" | "Rejected"
            })),
            approvedBy: user?.userName ?? "",
            approvalDate: new Date().toISOString(),
        };

        setSubmitting(true);
        try {
            const response = await api.put(
                `${API_ROUTES.PAYROLL}/increment-histories`,
                payload,
            );

            toast.success(
                response.data?.message ||
                    "Decisions forwarded to Employee Movement Cell.",
            );

            // Reload so processed rows leave the pending list
            await fetchRequests();
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to forward decisions.",
            );
        } finally {
            setSubmitting(false);
        }
    };

    /* ------------------------------ DATE ----------------------------------- */

    const today = new Date();
    const headerDate = `${today.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })} | ${today.toLocaleDateString("en-US", { weekday: "long" })}`;

    /* ------------------------------ RENDER --------------------------------- */

    const th = "border-b border-[#e0e5ef] px-3 py-3 text-[11px] font-semibold text-[#17244e]";

    return (
        <div className="min-h-screen bg-white text-[#101b4b]">
            {/* HEADER */}
            <header className="flex h-[76px] items-center justify-between bg-[#00194f] px-7 text-white">
                <div>
                    <h1 className="text-[20px] font-bold tracking-wide">
                        DIRECTOR – PERFORMANCE INCREMENT REQUESTS
                    </h1>
                    <p className="mt-1 text-[13px] text-white/90">
                        Review &amp; Approve Requests Forwarded by Production Floor
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[13px] font-medium">
                        <CalendarDays size={18} />
                        <span>{headerDate}</span>
                    </div>

                    <div className="h-10 w-px bg-[#52709e]" />

                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#00194f]">
                            <UserRound size={22} />
                        </div>
                        <span className="text-[13px] font-semibold">Director</span>
                        <ChevronDown size={16} />
                    </div>
                </div>
            </header>

            <main className="px-7 py-6">
                {/* TITLE ROW */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="absolute left-0 top-0 flex items-center gap-2 rounded-md border border-[#1c3a8a] bg-white px-6 py-2 text-[13px] font-semibold text-[#00194f] hover:bg-[#f3f6fc]"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>

                    <div className="text-center">
                        <h2 className="text-[19px] font-bold text-[#0b2a7a]">
                            PERFORMANCE INCREMENT REQUESTS
                        </h2>
                        <p className="mt-2 text-[13px] text-[#5b6580]">
                            Total Requests: {rows.length}
                        </p>
                    </div>
                </div>

                {/* TABLE */}
                <div className="mt-6 overflow-x-auto rounded-md border border-[#e0e5ef]">
                    <table className="w-full border-collapse text-center text-[12px]">
                        <thead>
                            <tr>
                                <th rowSpan={2} className={`${th} w-[60px] border-r`}>SL No.</th>
                                <th rowSpan={2} className={`${th} border-r`}>Employee ID</th>
                                <th rowSpan={2} className={`${th} border-r`}>Employee Name</th>
                                <th rowSpan={2} className={`${th} border-r`}>Department / Section</th>
                                <th colSpan={2} className={`${th} border-r`}>Last Performance Increment</th>
                                <th colSpan={2} className={`${th} border-r`}>
                                    Previous Increment
                                    <br />
                                    (5% Basic)
                                </th>
                                <th colSpan={2} className={`${th} border-r`}>
                                    Proposed Performance
                                    <br />
                                    Increment
                                </th>
                                <th rowSpan={2} className={`${th} border-r`}>Submitted On</th>
                                <th rowSpan={2} className={th}>Action</th>
                            </tr>
                            <tr>
                                <th className={`${th} border-r`}>Date</th>
                                <th className={`${th} border-r`}>Percent</th>
                                <th className={`${th} border-r`}>Date</th>
                                <th className={`${th} border-r`}>Amount (BDT)</th>
                                <th className={`${th} border-r`}>Percent</th>
                                <th className={`${th} border-r`}>Amount (BDT)</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={12} className="py-10 text-gray-400">
                                        Loading requests...
                                    </td>
                                </tr>
                            ) : rows.length === 0 ? (
                                <tr>
                                    <td colSpan={12} className="py-10 text-gray-400">
                                        No pending performance increment requests.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row, index) => {
                                    const decision = decisions[row.id];
                                    const isApproved = decision === "Approved";
                                    const isRejected = decision === "Rejected";

                                    const submittedOn = formatDate(
                                        row.requests?.[0]?.createdOn ?? row.effectiveDate,
                                    );

                                    return (
                                        <tr
                                            key={row.id}
                                            className={`border-b border-[#e8ebf1] last:border-0 ${
                                                isApproved
                                                    ? "bg-[#f3fbf6]"
                                                    : isRejected
                                                      ? "bg-[#fff5f5]"
                                                      : ""
                                            }`}
                                        >
                                            <td className="px-3 py-4">{index + 1}</td>
                                            <td className="px-3 py-4">{row.employeeCode}</td>
                                            <td className="px-3 py-4">{row.employeeName}</td>
                                            <td className="px-3 py-4">
                                                {row.departmentName} / {row.sectionName}
                                            </td>

                                            {/* Last Performance Increment – intentionally blank */}
                                            <td className="px-3 py-4" />
                                            <td className="px-3 py-4" />

                                            {/* Previous Increment (5%) – intentionally blank */}
                                            <td className="px-3 py-4" />
                                            <td className="px-3 py-4" />

                                            {/* Proposed */}
                                            <td className="px-3 py-4">
                                                {row.incrementPercent.toFixed(2)}%
                                            </td>
                                            <td className="px-3 py-4">
                                                {formatCurrency(row.incrementAmount)}
                                            </td>

                                            <td className="px-3 py-4">{submittedOn}</td>

                                            <td className="px-3 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        aria-pressed={isApproved}
                                                        disabled={submitting}
                                                        onClick={() => toggleDecision(row.id, "Approved")}
                                                        className={`rounded border px-3 py-1.5 text-[11px] font-semibold transition disabled:opacity-50 ${
                                                            isApproved
                                                                ? "border-green-600 bg-green-600 text-white"
                                                                : "border-green-500 bg-white text-green-700 hover:bg-green-50"
                                                        }`}
                                                    >
                                                        {isApproved ? "Approved" : "Approve"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        aria-pressed={isRejected}
                                                        disabled={submitting}
                                                        onClick={() => toggleDecision(row.id, "Rejected")}
                                                        className={`rounded border px-3 py-1.5 text-[11px] font-semibold transition disabled:opacity-50 ${
                                                            isRejected
                                                                ? "border-red-600 bg-red-600 text-white"
                                                                : "border-red-400 bg-white text-red-600 hover:bg-red-50"
                                                        }`}
                                                    >
                                                        {isRejected ? "Rejected" : "Reject"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER */}
                <div className="mt-8 flex flex-col items-center gap-2">
                    <button
                        type="button"
                        onClick={handleForward}
                        disabled={decidedCount === 0 || submitting}
                        className="flex items-center gap-3 rounded-md bg-[#00194f] px-10 py-3 text-[13px] font-semibold text-white transition hover:bg-[#0a2a73] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <Send size={16} />
                        {submitting
                            ? "Forwarding..."
                            : "Forward Approved & Rejected Requests to Employee Movement Cell"}
                    </button>

                    <p className="text-[11px] text-[#5b6580]">
                        {approvedCount} approved · {rejectedCount} rejected ·{" "}
                        {rows.length - decidedCount} undecided
                    </p>
                </div>
            </main>
        </div>
    );
};

export default DirectorPerformanceIncrementRequests;
