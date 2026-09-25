import React, { useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    FileText,
    Info,
    MessageSquare,
    Paperclip,
    User,
    XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useGet } from "../../hooks/useGet";
import { API_ROUTES } from "../../api/routes";
import { api } from "../../api/client";

/* ==========================================================================
 * TYPES
 * ========================================================================== */

interface Employee {
    employeeId: string;
    employeeName: string;
    department: string;
    designation: string;
    dateOfJoining: string;
    reportingManager: string | null;
}

interface Workflow {
    forwardedByDepartment: string;
    forwardedBySection: string;
    forwardedOn: string;
}

interface EncashmentDetails {
    encashmentDaysRequested: number;
    encashmentRate: string;
    estimatedAmount: number;
    remarksByEmployee: string;
}

interface EarnedLeaveInfo {
    totalEarnedLeaveCredited: number;
    earnedLeaveUtilized: number;
    balanceEarnedLeave: number;
    eligibleForEncashment: number;
}

interface Attachment {
    [key: string]: any;
}

interface EarnedLeaveEncashmentResponse {
    requestId: string;
    requestType: string;
    status: string;
    appliedOn: string;
    employee: Employee;
    workflow: Workflow;
    encashmentDetails: EncashmentDetails;
    earnedLeaveInfo: EarnedLeaveInfo;
    maternityLeaveInfo: any | null;
    attachments: Attachment[];
    importantRules: string[];
}

/* ==========================================================================
 * ACTIONS
 *
 * Change these values if your backend uses different action names.
 * ========================================================================== */

const ACTIONS = {
    FORWARD_TO_HR: "FORWARD-TO-HR",
    REJECT: "REJECTED",
    REQUEST_INFORMATION: "REQUEST_INFORMATION",
} as const;

/* ==========================================================================
 * COMPONENT
 * ========================================================================== */

const EarnedLeaveEncashmentDetails: React.FC = () => {
    const navigate = useNavigate();
    const { requestId } = useParams();

    const [remarks, setRemarks] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionError, setActionError] = useState("");

    /* ==========================================================================
     * GET REQUEST
     * ========================================================================== */

    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useGet<EarnedLeaveEncashmentResponse>({
        key: ["earnedLeaveEncashmentRequest", requestId],
        url: `${API_ROUTES.LEAVE_ENCASHMENT_REQUESTS}/${requestId}`,
        enabled: !!requestId,
    });

    const request = response;

    /* ==========================================================================
     * ACTION API
     * ========================================================================== */

    const handleAction = async (action: string) => {
        if (!request?.requestId || isSubmitting) {
            return;
        }

        setActionError("");

        try {
            setIsSubmitting(true);

            await api.post(
                `${API_ROUTES.LEAVE_ENCASHMENT_REQUESTS}/action`,
                {
                    requestId: request.requestId,
                    action,
                    remarks: remarks.trim(),
                },
            );

            await refetch();
            setRemarks("");
        } catch (error: any) {
            console.error("Earned leave encashment action failed:", error);

            setActionError(
                error?.response?.data?.message ??
                    error?.response?.data?.error ??
                    "Failed to process the request. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ==========================================================================
     * NAVIGATION
     * ========================================================================== */

    const handleBack = () => {
        navigate(
            "/payroll-and-workforce-movement/attendance-cell/earned-leave-encashment-requests",
        );
    };

    /* ==========================================================================
     * LOADING
     * ========================================================================== */

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />

                        <p className="mt-3 text-sm font-medium text-slate-600">
                            Loading encashment request...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    /* ==========================================================================
     * ERROR
     * ========================================================================== */

    if (isError || !request) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <Info
                        size={40}
                        className="mx-auto mb-3 text-red-500"
                    />

                    <h1 className="text-lg font-bold text-slate-800">
                        Encashment Request Not Found
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Unable to load the earned leave encashment request.
                    </p>

                    <button
                        type="button"
                        onClick={handleBack}
                        className="
                            mt-5
                            inline-flex
                            items-center
                            gap-2
                            rounded-lg
                            bg-blue-600
                            px-4
                            py-2
                            text-sm
                            font-semibold
                            text-white
                            hover:bg-blue-700
                        "
                    >
                        <ArrowLeft size={16} />
                        Back to Requests
                    </button>
                </div>
            </div>
        );
    }

    /* ==========================================================================
     * DERIVED VALUES
     * ========================================================================== */

    const {
        employee,
        workflow,
        encashmentDetails,
        earnedLeaveInfo,
        importantRules,
    } = request;

    const isActionable =
        request.status !== "APPROVED" &&
        request.status !== "REJECTED";

    const formattedAppliedOn = formatDateTime(request.appliedOn);
    const formattedForwardedOn = formatDateTime(workflow.forwardedOn);
    const formattedJoiningDate = formatDate(employee.dateOfJoining);

    /* ==========================================================================
     * UI
     * ========================================================================== */

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6">
            <div className="mx-auto max-w-7xl">
                {/* ==================================================================
                    BACK
                ================================================================== */}

                <button
                    type="button"
                    onClick={handleBack}
                    className="
                        mb-4
                        inline-flex
                        items-center
                        gap-2
                        text-xs
                        font-semibold
                        text-blue-600
                        hover:text-blue-800
                    "
                >
                    <ArrowLeft size={14} />
                    Back to Earned Leave Encashment Requests
                </button>

                {/* ==================================================================
                    HEADER
                ================================================================== */}

                <div className="mb-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-lg font-bold uppercase text-blue-900">
                                Earned Leave Encashment Request
                            </h1>

                            <p className="mt-1 text-xs text-slate-500">
                                Review the employee's earned leave encashment
                                request and take appropriate action.
                            </p>
                        </div>

                        <StatusBadge status={request.status} />
                    </div>
                </div>

                {/* ==================================================================
                    SUMMARY
                ================================================================== */}

                <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="grid grid-cols-1 divide-y divide-slate-200 md:grid-cols-2 lg:grid-cols-5 lg:divide-y-0">
                        <SummaryItem
                            icon={<FileText size={18} />}
                            label="Request ID"
                            value={request.requestId}
                        />

                        <SummaryItem
                            icon={<User size={18} />}
                            label="Employee"
                            value={employee.employeeName}
                            subValue={employee.employeeId}
                        />

                        <SummaryItem
                            icon={<CalendarDays size={18} />}
                            label="Applied On"
                            value={formattedAppliedOn.date}
                            subValue={formattedAppliedOn.time}
                        />

                        <SummaryItem
                            icon={<CheckCircle2 size={18} />}
                            label="Status"
                            value={
                                <StatusBadge status={request.status} />
                            }
                        />

                        <SummaryItem
                            icon={<User size={18} />}
                            label="Forwarded From"
                            value={workflow.forwardedByDepartment}
                            subValue={workflow.forwardedBySection}
                        />
                    </div>
                </div>

                {/* ==================================================================
                    MAIN CONTENT
                ================================================================== */}

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
                    {/* ==============================================================
                        LEFT
                    ============================================================== */}

                    <div className="min-w-0 space-y-4">
                        {/* ==========================================================
                            EMPLOYEE INFORMATION
                        ========================================================== */}

                        <InfoCard title="Employee Information">
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <InfoRow
                                    label="Employee ID"
                                    value={employee.employeeId}
                                />

                                <InfoRow
                                    label="Employee Name"
                                    value={employee.employeeName}
                                />

                                <InfoRow
                                    label="Department"
                                    value={employee.department}
                                />

                                <InfoRow
                                    label="Designation"
                                    value={employee.designation}
                                />

                                <InfoRow
                                    label="Date of Joining"
                                    value={formattedJoiningDate}
                                />

                                <InfoRow
                                    label="Reporting Manager"
                                    value={
                                        employee.reportingManager ??
                                        "Not Available"
                                    }
                                />
                            </div>
                        </InfoCard>

                        {/* ==========================================================
                            ENCASHMENT DETAILS
                        ========================================================== */}

                        <InfoCard title="Encashment Details">
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <InfoRow
                                    label="Days Requested"
                                    value={
                                        <span className="font-bold text-blue-700">
                                            {
                                                encashmentDetails.encashmentDaysRequested
                                            }{" "}
                                            Days
                                        </span>
                                    }
                                />

                                <InfoRow
                                    label="Encashment Rate"
                                    value={
                                        encashmentDetails.encashmentRate
                                    }
                                />

                                <InfoRow
                                    label="Estimated Amount"
                                    value={
                                        <span className="font-bold text-green-700">
                                            {formatAmount(
                                                encashmentDetails.estimatedAmount,
                                            )}{" "}
                                            BDT
                                        </span>
                                    }
                                />

                                <InfoRow
                                    label="Employee Remarks"
                                    value={
                                        encashmentDetails
                                            .remarksByEmployee || "No remarks"
                                    }
                                />
                            </div>
                        </InfoCard>

                        {/* ==========================================================
                            EARNED LEAVE INFORMATION
                        ========================================================== */}

                        <InfoCard title="Earned Leave Information">
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <InfoRow
                                    label="Total Earned Leave Credited"
                                    value={`${earnedLeaveInfo.totalEarnedLeaveCredited} Days`}
                                />

                                <InfoRow
                                    label="Earned Leave Utilized"
                                    value={`${earnedLeaveInfo.earnedLeaveUtilized} Days`}
                                />

                                <InfoRow
                                    label="Balance Earned Leave"
                                    value={
                                        <span className="font-bold text-green-600">
                                            {
                                                earnedLeaveInfo.balanceEarnedLeave
                                            }{" "}
                                            Days
                                        </span>
                                    }
                                />

                                <InfoRow
                                    label="Eligible for Encashment"
                                    value={
                                        <span className="font-bold text-blue-700">
                                            {
                                                earnedLeaveInfo.eligibleForEncashment
                                            }{" "}
                                            Days
                                        </span>
                                    }
                                />
                            </div>

                            <div className="mt-3 rounded-lg border border-green-100 bg-green-50 p-3">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2
                                        size={15}
                                        className="mt-0.5 shrink-0 text-green-600"
                                    />

                                    <div>
                                        <p className="text-[11px] font-bold text-green-700">
                                            Encashment Eligibility
                                        </p>

                                        <p className="mt-1 text-[10px] leading-4 text-green-700">
                                            The employee is eligible to
                                            encash{" "}
                                            <strong>
                                                {
                                                    earnedLeaveInfo.eligibleForEncashment
                                                }{" "}
                                                days
                                            </strong>{" "}
                                            of earned leave according to the
                                            information returned by the API.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </InfoCard>

                        {/* ==========================================================
                            WORKFLOW INFORMATION
                        ========================================================== */}

                        <InfoCard title="Workflow Information">
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <InfoRow
                                    label="Forwarded By Department"
                                    value={
                                        workflow.forwardedByDepartment
                                    }
                                />

                                <InfoRow
                                    label="Forwarded By Section"
                                    value={workflow.forwardedBySection}
                                />

                                <InfoRow
                                    label="Forwarded On"
                                    value={
                                        <>
                                            {formattedForwardedOn.date}
                                            <span className="ml-1 text-slate-400">
                                                {
                                                    formattedForwardedOn.time
                                                }
                                            </span>
                                        </>
                                    }
                                />

                                <InfoRow
                                    label="Current Status"
                                    value={
                                        <StatusBadge
                                            status={request.status}
                                        />
                                    }
                                />
                            </div>
                        </InfoCard>

                        {/* ==========================================================
                            ATTACHMENTS
                        ========================================================== */}

                        <InfoCard title="Attachments">
                            {request.attachments?.length > 0 ? (
                                <div className="space-y-2">
                                    {request.attachments.map(
                                        (attachment, index) => (
                                            <div
                                                key={index}
                                                className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    rounded-lg
                                                    border
                                                    border-slate-200
                                                    p-3
                                                "
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-red-50">
                                                        <Paperclip
                                                            size={17}
                                                            className="text-red-500"
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-700">
                                                            {getAttachmentName(
                                                                attachment,
                                                                index,
                                                            )}
                                                        </p>

                                                        <p className="text-[10px] text-slate-400">
                                                            Attachment{" "}
                                                            {index + 1}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <div className="py-5 text-center">
                                    <Paperclip
                                        size={22}
                                        className="mx-auto text-slate-300"
                                    />

                                    <p className="mt-2 text-xs text-slate-400">
                                        No attachments available
                                    </p>
                                </div>
                            )}
                        </InfoCard>
                    </div>

                    {/* ==============================================================
                        RIGHT
                    ============================================================== */}

                    <div className="space-y-4">
                        {/* ==========================================================
                            IMPORTANT RULES
                        ========================================================== */}

                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="mb-3 flex items-center gap-2">
                                <Info
                                    size={16}
                                    className="text-blue-600"
                                />

                                <h2 className="text-xs font-bold uppercase text-blue-700">
                                    Important Rules
                                </h2>
                            </div>

                            <ul className="space-y-2">
                                {importantRules?.map((rule, index) => (
                                    <li
                                        key={index}
                                        className="flex gap-2 text-[10px] leading-4 text-slate-600"
                                    >
                                        <span className="font-bold text-blue-500">
                                            •
                                        </span>

                                        <span>{rule}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ==========================================================
                            ACTIONS
                        ========================================================== */}

                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 px-4 py-3">
                                <h2 className="text-sm font-bold uppercase text-blue-800">
                                    Actions
                                </h2>

                                <p className="mt-1 text-[10px] text-slate-500">
                                    Review the request and take appropriate
                                    action.
                                </p>
                            </div>

                            <div className="space-y-2 p-3">
                                {/* APPROVE */}

                                <button
                                    type="button"
                                    disabled={
                                        !isActionable || isSubmitting
                                    }
                                    onClick={() =>
                                        handleAction(ACTIONS.FORWARD_TO_HR)
                                    }
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        gap-3
                                        rounded-md
                                        border
                                        border-green-200
                                        px-3
                                        py-2.5
                                        text-left
                                        transition
                                        hover:bg-green-50
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >
                                    <CheckCircle2
                                        size={18}
                                        className="shrink-0 text-green-600"
                                    />

                                    <span>
                                        <span className="block text-xs font-bold text-green-700">
                                            Forward to HR
                                        </span>

                                        <span className="block text-[10px] text-slate-500">
                                           Forward request to next higher authority
                                        </span>
                                    </span>
                                </button>

                                {/* REJECT */}

                                <button
                                    type="button"
                                    disabled={
                                        !isActionable || isSubmitting
                                    }
                                    onClick={() =>
                                        handleAction(ACTIONS.REJECT)
                                    }
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        gap-3
                                        rounded-md
                                        border
                                        border-red-200
                                        px-3
                                        py-2.5
                                        text-left
                                        transition
                                        hover:bg-red-50
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >
                                    <XCircle
                                        size={18}
                                        className="shrink-0 text-red-600"
                                    />

                                    <span>
                                        <span className="block text-xs font-bold text-red-700">
                                            Reject Request
                                        </span>

                                        <span className="block text-[10px] text-slate-500">
                                            Reject the encashment request.
                                        </span>
                                    </span>
                                </button>

                                {/* REQUEST INFORMATION */}

                                <button
                                    type="button"
                                    disabled={
                                        !isActionable || isSubmitting
                                    }
                                    onClick={() =>
                                        handleAction(
                                            ACTIONS.REQUEST_INFORMATION,
                                        )
                                    }
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        gap-3
                                        rounded-md
                                        border
                                        border-blue-200
                                        px-3
                                        py-2.5
                                        text-left
                                        transition
                                        hover:bg-blue-50
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >
                                    <MessageSquare
                                        size={18}
                                        className="shrink-0 text-blue-600"
                                    />

                                    <span>
                                        <span className="block text-xs font-bold text-blue-700">
                                            Request More Information
                                        </span>

                                        <span className="block text-[10px] text-slate-500">
                                            Ask the employee for additional
                                            information.
                                        </span>
                                    </span>
                                </button>
                            </div>

                            {/* ======================================================
                                REMARKS
                            ====================================================== */}

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
                                    disabled={isSubmitting}
                                    placeholder="Enter remarks..."
                                    className="
                                        mt-2
                                        w-full
                                        resize-none
                                        rounded-md
                                        border
                                        border-slate-300
                                        px-3
                                        py-2
                                        text-xs
                                        outline-none
                                        placeholder:text-slate-400
                                        focus:border-blue-400
                                        focus:ring-2
                                        focus:ring-blue-100
                                        disabled:bg-slate-50
                                    "
                                />

                                <p className="mt-1 text-[10px] text-slate-400">
                                    {remarks.length}/500 characters
                                </p>

                                {actionError && (
                                    <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-2.5">
                                        <p className="text-[10px] leading-4 text-red-700">
                                            {actionError}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* ======================================================
                                STATUS NOTE
                            ====================================================== */}

                            <div className="border-t border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-start gap-2">
                                    <Info
                                        size={14}
                                        className="mt-0.5 shrink-0 text-slate-500"
                                    />

                                    <div>
                                        <p className="text-[10px] font-bold text-slate-600">
                                            Current Status
                                        </p>

                                        <p className="mt-1 text-[10px] leading-4 text-slate-500">
                                            This request is currently{" "}
                                            <strong>
                                                {request.status}
                                            </strong>
                                            .
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ==========================================================================
 * SUMMARY ITEM
 * ========================================================================== */

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
        <div className="flex min-h-[72px] items-center gap-3 px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-[9px] font-medium text-slate-400">
                    {label}
                </p>

                <div className="mt-1 truncate text-[11px] font-bold text-slate-700">
                    {value}
                </div>

                {subValue && (
                    <p className="mt-0.5 text-[9px] font-medium text-slate-500">
                        {subValue}
                    </p>
                )}
            </div>
        </div>
    );
};

/* ==========================================================================
 * STATUS BADGE
 * ========================================================================== */

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const normalized = status?.toUpperCase();

    const className =
        normalized === "APPROVED"
            ? "bg-green-50 text-green-600"
            : normalized === "REJECTED"
              ? "bg-red-50 text-red-600"
              : normalized === "FORWARDED"
                ? "bg-blue-50 text-blue-600"
                : "bg-orange-50 text-orange-600";

    return (
        <span
            className={`
                inline-flex
                rounded-md
                px-2.5
                py-1
                text-[10px]
                font-semibold
                ${className}
            `}
        >
            {status}
        </span>
    );
};

/* ==========================================================================
 * INFORMATION CARD
 * ========================================================================== */

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
                <h2 className="text-[11px] font-bold uppercase text-blue-700">
                    {title}
                </h2>
            </div>

            <div className="px-4 py-2">{children}</div>
        </div>
    );
};

/* ==========================================================================
 * INFORMATION ROW
 * ========================================================================== */

interface InfoRowProps {
    label: string;
    value: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({
    label,
    value,
}) => {
    return (
        <div className="grid grid-cols-[minmax(150px,1fr)_minmax(100px,1.5fr)] gap-3 border-b border-slate-100 py-2 last:border-b-0">
            <span className="text-[9px] font-semibold leading-4 text-slate-500">
                {label}
            </span>

            <span className="break-words text-right text-[10px] font-semibold leading-4 text-slate-700">
                {value}
            </span>
        </div>
    );
};

/* ==========================================================================
 * HELPERS
 * ========================================================================== */

const formatDate = (value?: string | null) => {
    if (!value) {
        return "Not Available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatDateTime = (value?: string | null) => {
    if (!value) {
        return {
            date: "Not Available",
            time: "",
        };
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return {
            date: value,
            time: "",
        };
    }

    return {
        date: date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }),
        time: date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
        }),
    };
};

const formatAmount = (amount: number) => {
    return Number(amount ?? 0).toLocaleString("en-BD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const getAttachmentName = (
    attachment: Record<string, any>,
    index: number,
) => {
    return (
        attachment?.fileName ??
        attachment?.name ??
        attachment?.attachmentName ??
        `Attachment ${index + 1}`
    );
};

export default EarnedLeaveEncashmentDetails;
