import React, { useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Info,
    User,
    X,
    XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useGet } from "../../hooks/useGet";
import { API_ROUTES } from "../../api/routes";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

interface LeaveRequestDetailsData {
    requestId: string;
    status: string;
    appliedOn: string;
    forwardedBy: string | null;
    employee: {
        employeeId: string;
        employeeName: string;
        department: string | null;
        designation: string;
        dateOfJoining: string | null;
        reportingManager: string | null;
    };
    leave: {
        leaveType: string;
        leaveCode: string;
        startDate: string;
        endDate: string;
        totalDays: number;
        session: string;
        reason: string;
        contactNumber: string;
    };
}

const LeaveRequestDetails: React.FC = () => {
    const navigate = useNavigate();
    const { requestId } = useParams();
    const { user } = useAuth();

    const [remarks, setRemarks] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: request, refetch } =
        useGet<LeaveRequestDetailsData>({
            key: ["leave_request_detail", requestId],
            url: `${API_ROUTES.LEAVE}/leave-request/${requestId}`,
            enabled: !!requestId,
        });

    const formatDate = (date?: string | null) => {
        if (!date) return "-";

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) {
            return date;
        }

        return parsed.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const handleAction = async (
        approvStatus: "APPROVED" | "REJECTED",
    ) => {
        if (!request || !requestId) return;

        try {
            setIsSubmitting(true);

            const payload = {
                requestId: request.requestId,
                leaveType: request.leave.leaveType,
                fromDate: request.leave.startDate,
                toDate: request.leave.endDate,
                reason: request.leave.reason,
                forwardedBy: request.forwardedBy ?? "",
                forwardedDate: new Date().toISOString().split("T")[0],
                approvedBy: user?.userId ?? "",
                approvStatus,
            };

            console.log(
                `${approvStatus} Leave Payload`,
                payload,
            );

            await api.put(
                `${API_ROUTES.LEAVE}/${requestId}`,
                payload,
            );

            await refetch();
        } catch (error) {
            console.error(
                `Failed to ${approvStatus.toLowerCase()} leave request`,
                error,
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!request) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <Info
                        size={40}
                        className="mx-auto mb-3 text-blue-500"
                    />

                    <h1 className="text-lg font-bold text-slate-800">
                        Leave Request Not Found
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        No leave request was found for this details page.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/payroll-and-workforce-movement/attendance-cell/leave-requests",
                            )
                        }
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        <ArrowLeft size={16} />
                        Back to Leave Requests
                    </button>
                </div>
            </div>
        );
    }

    const isPending =
        request.status === "FORWARDED" ||
        request.status === "PENDING";

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6">

            {/* HEADER */}
            <div className="mb-4 rounded-xl border border-blue-100 bg-white px-5 py-4 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <CalendarDays
                                size={21}
                                className="text-blue-600"
                            />

                            <h1 className="text-lg font-bold text-blue-800">
                                Leave Request Details
                            </h1>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                            Review the leave request and take appropriate action.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/payroll-and-workforce-movement/attendance-cell/leave-requests",
                            )
                        }
                        className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                        <ArrowLeft size={14} />
                        Back
                    </button>
                </div>
            </div>

            {/* SUMMARY */}
            <div className="mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">

                    <SummaryItem
                        icon={<CalendarDays size={18} />}
                        label="Request ID"
                        value={request.requestId}
                    />

                    <SummaryItem
                        icon={<User size={18} />}
                        label="Employee"
                        value={request.employee.employeeName}
                        subValue={request.employee.employeeId}
                    />

                    <SummaryItem
                        icon={<CalendarDays size={18} />}
                        label="Leave Period"
                        value={`${formatDate(request.leave.startDate)} - ${formatDate(request.leave.endDate)}`}
                        subValue={`${request.leave.totalDays} Day(s)`}
                    />

                    <SummaryItem
                        icon={<Clock3 size={18} />}
                        label="Applied On"
                        value={formatDate(request.appliedOn)}
                    />

                    <SummaryItem
                        icon={<Clock3 size={18} />}
                        label="Status"
                        value={
                            <StatusBadge status={request.status} />
                        }
                    />
                </div>
            </div>

            {/* MAIN */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">

                {/* LEFT */}
                <div className="min-w-0">

                    {/* EMPLOYEE + LEAVE */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

                        {/* EMPLOYEE INFORMATION */}
                        <InfoCard title="Employee Information">

                            <InfoRow
                                label="Employee ID"
                                value={request.employee.employeeId}
                            />

                            <InfoRow
                                label="Employee Name"
                                value={request.employee.employeeName}
                            />

                            <InfoRow
                                label="Department"
                                value={request.employee.department || "-"}
                            />

                            <InfoRow
                                label="Designation"
                                value={request.employee.designation || "-"}
                            />

                            <InfoRow
                                label="Date of Joining"
                                value={formatDate(
                                    request.employee.dateOfJoining,
                                )}
                            />

                            <InfoRow
                                label="Reporting Manager"
                                value={
                                    request.employee.reportingManager || "-"
                                }
                            />

                        </InfoCard>

                        {/* LEAVE INFORMATION */}
                        <InfoCard title="Leave Information">

                            <InfoRow
                                label="Leave Type"
                                value={request.leave.leaveType}
                            />

                            <InfoRow
                                label="Leave Code"
                                value={request.leave.leaveCode}
                            />

                            <InfoRow
                                label="Leave From"
                                value={formatDate(request.leave.startDate)}
                            />

                            <InfoRow
                                label="Leave To"
                                value={formatDate(request.leave.endDate)}
                            />

                            <InfoRow
                                label="Total Days"
                                value={`${request.leave.totalDays} Day(s)`}
                            />

                            <InfoRow
                                label="Session"
                                value={request.leave.session}
                            />

                            <InfoRow
                                label="Contact During Leave"
                                value={
                                    request.leave.contactNumber || "-"
                                }
                            />

                        </InfoCard>
                    </div>

                    {/* REASON */}
                    <div className="mt-4 rounded-xl border border-slate-200 bg-white shadow-sm">

                        <div className="border-b border-slate-100 px-4 py-3">
                            <h2 className="text-xs font-bold text-blue-700">
                                REASON FOR LEAVE
                            </h2>
                        </div>

                        <div className="px-4 py-4">
                            <p className="text-sm text-slate-700">
                                {request.leave.reason || "-"}
                            </p>
                        </div>

                    </div>

                    {/* REQUEST INFORMATION */}
                    <div className="mt-4 rounded-xl border border-slate-200 bg-white shadow-sm">

                        <div className="border-b border-slate-100 px-4 py-3">
                            <h2 className="text-xs font-bold text-blue-700">
                                REQUEST INFORMATION
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-x-8 px-4 py-2 md:grid-cols-2">

                            <InfoRow
                                label="Applied On"
                                value={formatDate(request.appliedOn)}
                            />

                            <InfoRow
                                label="Forwarded By"
                                value={request.forwardedBy || "-"}
                            />

                            <InfoRow
                                label="Request Status"
                                value={
                                    <StatusBadge
                                        status={request.status}
                                    />
                                }
                            />

                        </div>

                    </div>
                </div>

                {/* RIGHT ACTION PANEL */}
                <div className="h-fit overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 bg-blue-50 px-4 py-3">
                        <h2 className="text-sm font-bold text-blue-800">
                            ACTIONS
                        </h2>

                        <p className="mt-1 text-[11px] text-slate-500">
                            Review the request and take appropriate action.
                        </p>
                    </div>

                    <div className="space-y-2 p-3">

                        {/* APPROVE */}
                        <button
                            type="button"
                            disabled={!isPending || isSubmitting}
                            onClick={() =>
                                handleAction("APPROVED")
                            }
                            className="flex w-full items-center gap-3 rounded-md border border-green-200 px-3 py-3 text-left transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <CheckCircle2
                                size={19}
                                className="shrink-0 text-green-600"
                            />

                            <span>
                                <span className="block text-xs font-bold text-green-700">
                                    Approve Leave
                                </span>

                                <span className="block text-[10px] text-slate-500">
                                    Approve this leave request.
                                </span>
                            </span>
                        </button>

                        {/* REJECT */}
                        <button
                            type="button"
                            disabled={!isPending || isSubmitting}
                            onClick={() =>
                                handleAction("REJECTED")
                            }
                            className="flex w-full items-center gap-3 rounded-md border border-red-200 px-3 py-3 text-left transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <XCircle
                                size={19}
                                className="shrink-0 text-red-600"
                            />

                            <span>
                                <span className="block text-xs font-bold text-red-700">
                                    Reject Leave
                                </span>

                                <span className="block text-[10px] text-slate-500">
                                    Reject this leave request.
                                </span>
                            </span>
                        </button>

                    </div>

                    {/* REMARKS */}
                    <div className="border-t border-slate-200 p-4">

                        <label
                            htmlFor="remarks"
                            className="text-xs font-bold text-slate-700"
                        >
                            REMARKS{" "}
                            <span className="font-normal text-slate-400">
                                (Optional)
                            </span>
                        </label>

                        <textarea
                            id="remarks"
                            value={remarks}
                            onChange={(e) =>
                                setRemarks(e.target.value)
                            }
                            maxLength={500}
                            rows={4}
                            placeholder="Enter remarks..."
                            className="mt-2 w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />

                        <p className="mt-1 text-[10px] text-slate-400">
                            {remarks.length}/500 characters
                        </p>

                    </div>

                    {/* NOTE */}
                    <div className="border-t border-slate-200 bg-blue-50 p-4">

                        <div className="flex items-start gap-2">

                            <Info
                                size={15}
                                className="mt-0.5 shrink-0 text-blue-600"
                            />

                            <div>
                                <p className="text-[11px] font-bold text-blue-700">
                                    Note:
                                </p>

                                <p className="mt-1 text-[10px] leading-4 text-blue-700">
                                    The request will be updated after
                                    approval or rejection.
                                </p>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">

                <span className="text-xs font-semibold text-slate-600">
                    Leave Request
                </span>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/payroll-and-workforce-movement/attendance-cell/leave-requests",
                        )
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                    <X size={14} />
                    Close
                </button>

            </div>
        </div>
    );
};

/* ================================================================
   SUMMARY ITEM
================================================================ */

interface SummaryItemProps {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    subValue?: React.ReactNode;
}

const SummaryItem: React.FC<SummaryItemProps> = ({
    icon,
    label,
    value,
    subValue,
}) => {
    return (
        <div className="flex min-h-[82px] items-center gap-3 border-b border-slate-200 px-4 py-3 lg:border-b-0 lg:border-r lg:last:border-r-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-[10px] font-medium text-slate-400">
                    {label}
                </p>

                <div className="mt-1 truncate text-xs font-bold text-slate-700">
                    {value}
                </div>

                {subValue && (
                    <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                        {subValue}
                    </p>
                )}
            </div>
        </div>
    );
};

/* ================================================================
   STATUS BADGE
================================================================ */

const StatusBadge = ({ status }: { status: string }) => {
    const className =
        status === "APPROVED"
            ? "bg-green-50 text-green-600"
            : status === "REJECTED"
                ? "bg-red-50 text-red-600"
                : "bg-orange-50 text-orange-600";

    return (
        <span
            className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${className}`}
        >
            {status}
        </span>
    );
};

/* ================================================================
   INFORMATION CARD
================================================================ */

interface InfoCardProps {
    title: string;
    children: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({
    title,
    children,
}) => {
    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-4 py-3">
                <h2 className="text-xs font-bold text-blue-700">
                    {title}
                </h2>
            </div>

            <div className="px-4 py-2">
                {children}
            </div>

        </div>
    );
};

/* ================================================================
   INFORMATION ROW
================================================================ */

interface InfoRowProps {
    label: string;
    value: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({
    label,
    value,
}) => {
    return (
        <div className="grid grid-cols-[145px_minmax(0,1fr)] gap-3 border-b border-slate-100 py-2 last:border-b-0">

            <span className="text-[10px] font-semibold text-slate-500">
                {label}
            </span>

            <span className="text-[10px] font-semibold text-slate-700">
                {value}
            </span>

        </div>
    );
};

export default LeaveRequestDetails;