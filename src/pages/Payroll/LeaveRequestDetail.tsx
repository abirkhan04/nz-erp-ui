import React, { useMemo, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Download,
    FileText,
    Info,
    MessageSquare,
    Paperclip,
    User,
    XCircle,
    X,
    Star,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface LeaveRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    leaveType: string;
    leaveFrom: string;
    leaveTo: string;
    appliedOn: string;
    reason: string;
    forwardedBy: string;
    status: "Pending" | "Approved" | "Rejected";
}

interface LeaveRequestDetailsData extends LeaveRequest {
    designation?: string;
    dateOfJoining?: string;
    reportingManager?: string;
    session?: string;
    contactDuringLeave?: string;
    attachmentName?: string;
    attachmentSize?: string;
}

const LeaveRequestDetails: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const request =
        location.state?.request as LeaveRequestDetailsData | undefined;

    const [remarks, setRemarks] = useState("");

    /*
     * If the page is opened directly without navigation state,
     * return to the leave request list.
     */
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
                        No leave request was provided for this details page.
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

    const totalDays = useMemo(() => {
        /*
         * Works with values such as:
         * 22-May-2025
         * 22-May-2025 08:20 AM
         */
        const parseDate = (value: string) => {
            const datePart = value.split(" ")[0];

            const match = datePart.match(
                /^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/,
            );

            if (!match) return null;

            const [, day, month, year] = match;

            const months: Record<string, number> = {
                Jan: 0,
                Feb: 1,
                Mar: 2,
                Apr: 3,
                May: 4,
                Jun: 5,
                Jul: 6,
                Aug: 7,
                Sep: 8,
                Oct: 9,
                Nov: 10,
                Dec: 11,
            };

            return new Date(
                Number(year),
                months[month],
                Number(day),
            );
        };

        const from = parseDate(request.leaveFrom);
        const to = parseDate(request.leaveTo);

        if (!from || !to) return 1;

        const difference =
            Math.round(
                (to.getTime() - from.getTime()) /
                    (1000 * 60 * 60 * 24),
            ) + 1;

        return Math.max(difference, 1);
    }, [request.leaveFrom, request.leaveTo]);

    const handleApprove = () => {
        console.log("Approve Leave", {
            request,
            remarks,
        });

        // TODO:
        // await api.post(`/leave-requests/${request.id}/approve`, {
        //     remarks,
        // });
    };

    const handleReject = () => {
        console.log("Reject Leave", {
            request,
            remarks,
        });

        // TODO:
        // await api.post(`/leave-requests/${request.id}/reject`, {
        //     remarks,
        // });
    };

    const handleRequestInformation = () => {
        console.log("Request More Information", {
            request,
            remarks,
        });

        // TODO:
        // await api.post(
        //     `/leave-requests/${request.id}/request-information`,
        //     { remarks },
        // );
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6">
            {/* ============================================================
                HEADER
            ============================================================ */}

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
                            Review full details of the selected leave
                            request and take action.
                        </p>
                    </div>

                    {/* Previous / Next */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="
                                inline-flex items-center gap-2
                                rounded-lg border border-blue-200
                                bg-white px-4 py-2
                                text-xs font-semibold text-blue-600
                                hover:bg-blue-50
                            "
                            onClick={() =>
                                console.log(
                                    "Previous request",
                                )
                            }
                        >
                            <ArrowLeft size={14} />
                            Previous Request
                        </button>

                        <button
                            type="button"
                            className="
                                inline-flex items-center gap-2
                                rounded-lg border border-blue-200
                                bg-white px-4 py-2
                                text-xs font-semibold text-blue-600
                                hover:bg-blue-50
                            "
                            onClick={() =>
                                console.log(
                                    "Next request",
                                )
                            }
                        >
                            Next Request
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ============================================================
                SUMMARY CARDS
            ============================================================ */}

            <div className="mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="grid grid-cols-1 divide-y divide-slate-200 md:grid-cols-2 md:divide-y-0 lg:grid-cols-6">
                    {/* Request ID */}
                    <SummaryItem
                        icon={<CalendarDays size={18} />}
                        label="Request ID"
                        value={request.id}
                    />

                    {/* Employee */}
                    <SummaryItem
                        icon={<User size={18} />}
                        label="Employee"
                        value={`${request.employeeName} (${request.employeeId})`}
                        subValue={request.department}
                    />

                    {/* Leave Type */}
                    <SummaryItem
                        icon={<Star size={18} />}
                        label="Leave Type"
                        value={request.leaveType}
                    />

                    {/* Leave Period */}
                    <SummaryItem
                        icon={<CalendarDays size={18} />}
                        label="Leave Period"
                        value={`${request.leaveFrom} to ${request.leaveTo}`}
                        subValue={`(${totalDays}.0 Days)`}
                    />

                    {/* Applied On */}
                    <SummaryItem
                        icon={<Clock3 size={18} />}
                        label="Applied On"
                        value={request.appliedOn.split(" ")[0]}
                        subValue={request.appliedOn.split(" ").slice(1).join(" ")}
                    />

                    {/* Status */}
                    <SummaryItem
                        icon={<Clock3 size={18} />}
                        label="Status"
                        value={
                            <span
                                className={`
                                    inline-flex rounded-md px-2.5 py-1
                                    text-xs font-semibold
                                    ${
                                        request.status === "Pending"
                                            ? "bg-orange-50 text-orange-600"
                                            : request.status === "Approved"
                                              ? "bg-green-50 text-green-600"
                                              : "bg-red-50 text-red-600"
                                    }
                                `}
                            >
                                {request.status}
                            </span>
                        }
                    />
                </div>

                {/* Forwarded By */}
                <div className="border-t border-slate-200 px-5 py-3">
                    <div className="flex items-center gap-2">
                        <User
                            size={16}
                            className="text-blue-600"
                        />

                        <span className="text-xs text-slate-500">
                            Forwarded By
                        </span>

                        <span className="text-xs font-semibold text-slate-700">
                            {request.forwardedBy}
                        </span>

                        <span className="text-xs text-slate-400">
                            ({request.appliedOn})
                        </span>
                    </div>
                </div>
            </div>

            {/* ============================================================
                MAIN CONTENT
            ============================================================ */}

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_285px]">
                {/* LEFT */}
                <div className="min-w-0">
                    {/* Tabs */}
                    <div className="mb-3 flex border-b border-slate-200">
                        <button
                            type="button"
                            className="
                                border-b-2 border-blue-600
                                px-5 py-3
                                text-xs font-bold text-blue-600
                            "
                        >
                            REQUEST DETAILS
                        </button>

                        <button
                            type="button"
                            className="
                                px-5 py-3
                                text-xs font-bold text-slate-500
                                hover:text-blue-600
                            "
                        >
                            HISTORY
                        </button>
                    </div>

                    {/* Employee + Leave Information */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {/* Employee Information */}
                        <InfoCard title="Employee Information">
                            <InfoRow
                                label="Employee ID"
                                value={request.employeeId}
                            />

                            <InfoRow
                                label="Employee Name"
                                value={request.employeeName}
                            />

                            <InfoRow
                                label="Department"
                                value={request.department}
                            />

                            <InfoRow
                                label="Designation"
                                value={
                                    request.designation ??
                                    "Assistant Operator"
                                }
                            />

                            <InfoRow
                                label="Date of Joining"
                                value={
                                    request.dateOfJoining ??
                                    "12-Jan-2022"
                                }
                            />

                            <InfoRow
                                label="Reporting Manager"
                                value={
                                    request.reportingManager ??
                                    "Mohammad Hasan (10102)"
                                }
                            />
                        </InfoCard>

                        {/* Leave Information */}
                        <InfoCard title="Leave Information">
                            <InfoRow
                                label="Leave Type"
                                value={request.leaveType}
                            />

                            <InfoRow
                                label="Leave Period"
                                value={`${request.leaveFrom} to ${request.leaveTo}`}
                            />

                            <InfoRow
                                label="Total Days"
                                value={`${totalDays}.0 Days`}
                            />

                            <InfoRow
                                label="Session"
                                value={
                                    request.session ??
                                    "Full Day"
                                }
                            />

                            <InfoRow
                                label="Reason for Leave"
                                value={request.reason}
                            />

                            <InfoRow
                                label="Contact During Leave"
                                value={
                                    request.contactDuringLeave ??
                                    "01815-XXXXXX"
                                }
                            />
                        </InfoCard>
                    </div>

                    {/* Attachments */}
                    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="mb-3 flex items-center gap-2">
                            <Paperclip
                                size={17}
                                className="text-blue-600"
                            />

                            <h2 className="text-xs font-bold uppercase tracking-wide text-blue-700">
                                Attachments
                            </h2>
                        </div>

                        <p className="mb-3 text-[11px] text-slate-500">
                            1 attachment uploaded
                        </p>

                        <div className="flex flex-col gap-3 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-50">
                                    <FileText
                                        size={20}
                                        className="text-red-500"
                                    />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-slate-700">
                                        {request.attachmentName ??
                                            `Medical_Certificate-${request.employeeName.replace(
                                                /\s+/g,
                                                "",
                                            )}.pdf`}
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-slate-400">
                                        Uploaded on{" "}
                                        {request.appliedOn}
                                    </p>

                                    <p className="text-[10px] text-slate-500">
                                        {request.attachmentSize ??
                                            "245 KB"}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="
                                    inline-flex items-center justify-center
                                    gap-2 rounded-md border
                                    border-blue-200 bg-white
                                    px-3 py-2 text-xs font-semibold
                                    text-blue-600 hover:bg-blue-50
                                "
                                onClick={() =>
                                    console.log(
                                        "Download attachment",
                                    )
                                }
                            >
                                <Download size={14} />
                                Download
                            </button>
                        </div>
                    </div>
                </div>

                {/* ========================================================
                    RIGHT ACTION PANEL
                ======================================================== */}

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
                        {/* Approve */}
                        <button
                            type="button"
                            disabled={
                                request.status !== "Pending"
                            }
                            onClick={handleApprove}
                            className="
                                flex w-full items-center gap-3
                                rounded-md border border-green-200
                                px-3 py-3 text-left
                                transition hover:bg-green-50
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
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
                                    Approve and forward to employee.
                                </span>
                            </span>
                        </button>

                        {/* Reject */}
                        <button
                            type="button"
                            disabled={
                                request.status !== "Pending"
                            }
                            onClick={handleReject}
                            className="
                                flex w-full items-center gap-3
                                rounded-md border border-red-200
                                px-3 py-3 text-left
                                transition hover:bg-red-50
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
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
                                    Reject and inform employee.
                                </span>
                            </span>
                        </button>

                        {/* Request information */}
                        <button
                            type="button"
                            disabled={
                                request.status !== "Pending"
                            }
                            onClick={
                                handleRequestInformation
                            }
                            className="
                                flex w-full items-center gap-3
                                rounded-md border border-blue-200
                                px-3 py-3 text-left
                                transition hover:bg-blue-50
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >
                            <MessageSquare
                                size={19}
                                className="shrink-0 text-blue-600"
                            />

                            <span>
                                <span className="block text-xs font-bold text-blue-700">
                                    Request More Information
                                </span>

                                <span className="block text-[10px] text-slate-500">
                                    Ask for additional information from
                                    employee.
                                </span>
                            </span>
                        </button>
                    </div>

                    {/* Remarks */}
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
                            placeholder="Enter remarks (visible to employee)..."
                            className="
                                mt-2 w-full resize-none rounded-md
                                border border-slate-300 bg-white
                                px-3 py-2 text-xs text-slate-700
                                outline-none
                                placeholder:text-slate-400
                                focus:border-blue-400
                                focus:ring-2 focus:ring-blue-100
                            "
                        />

                        <p className="mt-1 text-[10px] text-slate-400">
                            {remarks.length}/500 characters
                        </p>
                    </div>

                    {/* Note */}
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

                                <ul className="mt-1 space-y-1 text-[10px] leading-4 text-blue-700">
                                    <li>
                                        • Approved leave will be reflected
                                        in employee's leave balance.
                                    </li>

                                    <li>
                                        • Employee will be notified via
                                        system.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ============================================================
                FOOTER
            ============================================================ */}

            <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
                <span className="text-xs font-semibold text-slate-600">
                    Request Details
                </span>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/payroll-and-workforce-movement/attendance-cell/leave-requests",
                        )
                    }
                    className="
                        inline-flex items-center gap-2
                        rounded-lg border border-slate-300
                        bg-white px-4 py-2
                        text-xs font-semibold text-slate-600
                        hover:bg-slate-50
                    "
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
        <div className="flex min-h-[82px] items-center gap-3 px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-[10px] font-medium text-slate-400">
                    {label}
                </p>

                <div className="mt-1 text-xs font-bold text-slate-700">
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
