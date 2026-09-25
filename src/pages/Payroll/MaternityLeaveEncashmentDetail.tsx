import React, { useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Download,
    FileText,
    Info,
    MessageSquare,
    Paperclip,
    User,
    Users,
    XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { API_ROUTES } from "../../api/routes";
import { api } from "../../api/client";
import { useGet } from "../../hooks/useGet";

/* ==========================================================================
 * TYPES
 * ========================================================================== */

interface Attachment {
    id?: string;
    fileName?: string;
    fileType?: string;
    uploadedOn?: string;
    fileSize?: string;
    url?: string;
}

interface Employee {
    employeeId: string;
    employeeName: string;
    department: string;
    designation: string;
    dateOfJoining: string;
    reportingManager: string | null;
}

interface Workflow {
    forwardedByDepartment: string | null;
    forwardedBySection: string | null;
    forwardedOn: string | null;
}

interface EncashmentDetails {
    encashmentDaysRequested: number;
    encashmentRate: string;
    estimatedAmount: number;
    remarksByEmployee: string | null;
}

interface MaternityLeaveInfo {
    requestPart: string;
    maternityLeaveEntitlement: number;
    leaveStructure: string;
    expectedDeliveryDate: string | null;
    maternityLeaveStartDate: string | null;
    maternityLeaveEndDate: string | null;
    encashmentDaysRequested: number;
    remarksByEmployee: string | null;
    note: string | null;
}

interface MaternityLeaveEncashmentResponse {
    requestId: string;
    requestType: string;
    status: string;
    appliedOn: string;
    employee: Employee;
    workflow: Workflow;
    encashmentDetails: EncashmentDetails;
    earnedLeaveInfo: unknown | null;
    maternityLeaveInfo: MaternityLeaveInfo | null;
    attachments: Attachment[];
    importantRules: string[];
}

/* ==========================================================================
 * HELPERS
 * ========================================================================== */

const formatDate = (value?: string | null) => {
    if (!value) return "N/A";

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
    if (!value) return "N/A";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatAmount = (amount?: number | null) => {
    if (amount === null || amount === undefined) {
        return "0.00 BDT";
    }

    return `${amount.toLocaleString("en-BD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} BDT`;
};

/* ==========================================================================
 * REUSABLE COMPONENTS
 * ========================================================================== */

interface InfoRowProps {
    label: string;
    value: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({
    label,
    value,
}) => (
    <div className="grid grid-cols-[170px_minmax(0,1fr)] gap-3 border-b border-slate-100 py-2 last:border-b-0">
        <span className="text-xs font-medium text-slate-500">
            {label}
        </span>

        <span className="text-xs font-semibold text-slate-800">
            {value || "N/A"}
        </span>
    </div>
);

/* ==========================================================================
 * PAGE
 * ========================================================================== */

const MaternityLeaveEncashmentDetails: React.FC = () => {
    const navigate = useNavigate();
    const { requestId } = useParams();

    const [remarks, setRemarks] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionError, setActionError] = useState("");

    /* ======================================================================
     * GET REQUEST DETAILS
     * ====================================================================== */

    const {
        data: request,
        isLoading,
        isError,
        refetch,
    } = useGet<MaternityLeaveEncashmentResponse>({
        key: ["MaternityLeaveEncashmentRequest", requestId],
        url: `${API_ROUTES.LEAVE_ENCASHMENT_REQUESTS}/${requestId}`,
        enabled: !!requestId,
    });

    /* ======================================================================
     * ACTION
     *
     * POST PAYLOAD:
     *
     * {
     *     requestId: "...",
     *     action: "...",
     *     remarks: "..."
     * }
     * ====================================================================== */

    const handleAction = async (action: string) => {
        if (!requestId) {
            setActionError("Request ID is missing.");
            return;
        }

        try {
            setIsSubmitting(true);
            setActionError("");

            const payload = {
                requestId,
                action,
                remarks: remarks.trim(),
            };

            await api.post(
                `${API_ROUTES.LEAVE_ENCASHMENT_REQUESTS}/action`,
                payload,
            );

            await refetch();

            setRemarks("");
        } catch (error: any) {
            console.error("Maternity leave encashment action failed:", error);

            setActionError(
                error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    "Failed to process the request action.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ======================================================================
     * ATTACHMENT DOWNLOAD
     * ====================================================================== */

    const handleDownload = (attachment: Attachment) => {
        if (attachment.url) {
            window.open(attachment.url, "_blank");
            return;
        }

        console.log("Download attachment:", attachment);
    };

    /* ======================================================================
     * LOADING
     * ====================================================================== */

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="rounded-lg border border-slate-200 bg-white px-6 py-5 text-center shadow-sm">
                    <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />

                    <p className="text-xs font-semibold text-slate-600">
                        Loading request details...
                    </p>
                </div>
            </div>
        );
    }

    /* ======================================================================
     * ERROR
     * ====================================================================== */

    if (isError || !request) {
        return (
            <div className="min-h-screen bg-slate-50 p-4 md:p-6">
                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/payroll-and-workforce-movement/attendance-cell/maternity-leave-encashment-requests",
                        )
                    }
                    className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                    <ArrowLeft size={15} />

                    Back to Maternity Leave
                    Encashment Requests
                </button>

                <div className="rounded-lg border border-red-200 bg-white p-6 text-center">
                    <XCircle
                        size={32}
                        className="mx-auto mb-3 text-red-500"
                    />

                    <h2 className="text-sm font-bold text-red-700">
                        Unable to load request
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                        The maternity leave encashment request could not
                        be loaded.
                    </p>
                </div>
            </div>
        );
    }

    const maternityInfo = request.maternityLeaveInfo;
    const employee = request.employee;
    const workflow = request.workflow;
    const encashment = request.encashmentDetails;

    const requestPartLabel =
        maternityInfo?.requestPart === "1ST"
            ? "1st Part"
            : maternityInfo?.requestPart === "2ND"
              ? "2nd Part"
              : maternityInfo?.requestPart || "N/A";

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6">
            {/* ==================================================================
                BACK TO LIST
            ================================================================== */}

            <button
                type="button"
                onClick={() =>
                    navigate(
                        "/payroll-and-workforce-movement/attendance-cell/maternity-leave-encashment-requests",
                    )
                }
                className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
                <ArrowLeft size={15} />

                Back to Maternity Leave
                Encashment Requests
            </button>

            {/* ==================================================================
                TITLE
            ================================================================== */}

            <div className="mb-4">
                <h1 className="text-lg font-bold uppercase text-blue-900">
                    Maternity Leave Encashment
                    Request Details
                </h1>

                <p className="mt-1 text-xs text-slate-500">
                    Review full details of the maternity leave
                    encashment request and take appropriate action.
                </p>
            </div>

            {/* ==================================================================
                SUMMARY CARDS
            ================================================================== */}

            <div className="mb-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="grid grid-cols-1 divide-y divide-slate-100 md:grid-cols-2 lg:grid-cols-6 lg:divide-x lg:divide-y-0">
                    {/* Request ID */}

                    <div className="flex items-center gap-3 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                            <FileText size={19} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[11px] text-slate-500">
                                Request ID
                            </p>

                            <p className="truncate text-xs font-bold text-slate-800">
                                {request.requestId}
                            </p>
                        </div>
                    </div>

                    {/* Employee */}

                    <div className="flex items-center gap-3 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                            <Users size={19} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[11px] text-slate-500">
                                Employee
                            </p>

                            <p className="truncate text-xs font-bold text-slate-800">
                                {employee.employeeName}
                            </p>

                            <p className="text-[10px] text-slate-500">
                                {employee.employeeId}
                            </p>
                        </div>
                    </div>

                    {/* Request Part */}

                    <div className="flex items-center gap-3 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                            <CalendarDays size={19} />
                        </div>

                        <div>
                            <p className="text-[11px] text-slate-500">
                                Request Part
                            </p>

                            <p className="text-xs font-bold text-slate-800">
                                {requestPartLabel}
                            </p>

                            <span className="mt-1 inline-flex rounded bg-purple-50 px-2 py-0.5 text-[9px] font-semibold text-purple-700">
                                {maternityInfo?.requestPart || "N/A"}
                            </span>
                        </div>
                    </div>

                    {/* Applied On */}

                    <div className="flex items-center gap-3 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                            <CalendarDays size={19} />
                        </div>

                        <div>
                            <p className="text-[11px] text-slate-500">
                                Applied On
                            </p>

                            <p className="text-xs font-bold text-slate-800">
                                {formatDateTime(request.appliedOn)}
                            </p>
                        </div>
                    </div>

                    {/* Status */}

                    <div className="flex items-center gap-3 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                            <Clock3 size={19} />
                        </div>

                        <div>
                            <p className="text-[11px] text-slate-500">
                                Status
                            </p>

                            <span className="mt-1 inline-flex rounded bg-orange-50 px-2 py-1 text-[10px] font-semibold text-orange-700">
                                {request.status}
                            </span>
                        </div>
                    </div>

                    {/* Forwarded By */}

                    <div className="flex items-center gap-3 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <User size={19} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[11px] text-slate-500">
                                Forwarded By
                            </p>

                            <p className="truncate text-xs font-bold text-slate-800">
                                {workflow?.forwardedByDepartment ||
                                    "N/A"}
                            </p>

                            <p className="truncate text-[10px] text-slate-500">
                                {workflow?.forwardedBySection ||
                                    "N/A"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================================================================
                MAIN CONTENT
            ================================================================== */}

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_370px]">
                {/* ==============================================================
                    LEFT SIDE
                ============================================================== */}

                <div className="space-y-4">
                    {/* Employee Information */}

                    <div className="rounded-lg border border-slate-200 bg-white">
                        <div className="border-b border-slate-200 px-4 py-3">
                            <h2 className="text-xs font-bold uppercase text-purple-700">
                                Employee Information
                            </h2>
                        </div>

                        <div className="px-4 py-2">
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
                                value={formatDate(
                                    employee.dateOfJoining,
                                )}
                            />

                            <InfoRow
                                label="Reporting Manager"
                                value={
                                    employee.reportingManager ||
                                    "N/A"
                                }
                            />
                        </div>
                    </div>

                    {/* Workflow Information */}

                    <div className="rounded-lg border border-slate-200 bg-white">
                        <div className="border-b border-slate-200 px-4 py-3">
                            <h2 className="text-xs font-bold uppercase text-purple-700">
                                Workflow Information
                            </h2>
                        </div>

                        <div className="px-4 py-2">
                            <InfoRow
                                label="Forwarded By Department"
                                value={
                                    workflow?.forwardedByDepartment ||
                                    "N/A"
                                }
                            />

                            <InfoRow
                                label="Forwarded By Section"
                                value={
                                    workflow?.forwardedBySection ||
                                    "N/A"
                                }
                            />

                            <InfoRow
                                label="Forwarded On"
                                value={formatDateTime(
                                    workflow?.forwardedOn,
                                )}
                            />
                        </div>
                    </div>

                    {/* Maternity Leave Information */}

                    <div className="rounded-lg border border-slate-200 bg-white">
                        <div className="border-b border-slate-200 px-4 py-3">
                            <h2 className="text-xs font-bold uppercase text-purple-700">
                                Maternity Leave Information
                            </h2>
                        </div>

                        <div className="px-4 py-2">
                            <InfoRow
                                label="Request Part"
                                value={maternityInfo?.requestPart}
                            />

                            <InfoRow
                                label="Maternity Leave Entitlement"
                                value={
                                    maternityInfo
                                        ? `${maternityInfo.maternityLeaveEntitlement} Days`
                                        : "N/A"
                                }
                            />

                            <InfoRow
                                label="Leave Structure"
                                value={
                                    maternityInfo?.leaveStructure
                                }
                            />

                            <InfoRow
                                label="Expected Delivery Date"
                                value={formatDate(
                                    maternityInfo?.expectedDeliveryDate,
                                )}
                            />

                            <InfoRow
                                label="Leave Start Date"
                                value={formatDate(
                                    maternityInfo?.maternityLeaveStartDate,
                                )}
                            />

                            <InfoRow
                                label="Leave End Date"
                                value={formatDate(
                                    maternityInfo?.maternityLeaveEndDate,
                                )}
                            />
                        </div>

                        {/* Encashment Section */}

                        <div className="mx-4 mb-3 rounded-md bg-purple-50 px-3 py-2">
                            <p className="text-[11px] font-bold uppercase text-purple-700">
                                Encashment Request —{" "}
                                {requestPartLabel}
                            </p>
                        </div>

                        <div className="px-4 pb-3">
                            <InfoRow
                                label="Encashment Days Requested"
                                value={
                                    encashment
                                        ? `${encashment.encashmentDaysRequested} Days`
                                        : "N/A"
                                }
                            />

                            <InfoRow
                                label="Encashment Rate"
                                value={
                                    encashment?.encashmentRate
                                }
                            />

                            <InfoRow
                                label="Estimated Amount"
                                value={
                                    <span className="font-bold text-green-700">
                                        {formatAmount(
                                            encashment?.estimatedAmount,
                                        )}
                                    </span>
                                }
                            />

                            <InfoRow
                                label="Remarks by Employee"
                                value={
                                    encashment?.remarksByEmployee ||
                                    "N/A"
                                }
                            />
                        </div>

                        {/* Backend Note */}

                        {maternityInfo?.note && (
                            <div className="mx-4 mb-4 flex items-start gap-2 rounded-md bg-amber-50 px-3 py-2">
                                <Info
                                    size={14}
                                    className="mt-0.5 shrink-0 text-amber-600"
                                />

                                <p className="text-[10px] leading-4 text-amber-800">
                                    <strong>Note:</strong>{" "}
                                    {maternityInfo.note}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Important Rules */}

                    {request.importantRules?.length > 0 && (
                        <div className="rounded-lg border border-slate-200 bg-white">
                            <div className="border-b border-slate-200 px-4 py-3">
                                <h2 className="text-xs font-bold uppercase text-purple-700">
                                    Important Rules
                                </h2>
                            </div>

                            <div className="px-4 py-3">
                                <ul className="list-disc space-y-2 pl-4 text-[10px] leading-4 text-slate-600">
                                    {request.importantRules.map(
                                        (rule, index) => (
                                            <li key={index}>
                                                {rule}
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Attachments */}

                    <div className="rounded-lg border border-slate-200 bg-white">
                        <div className="border-b border-slate-200 px-4 py-3">
                            <div className="flex items-center gap-2">
                                <Paperclip
                                    size={15}
                                    className="text-purple-700"
                                />

                                <h2 className="text-xs font-bold uppercase text-purple-700">
                                    Attachments
                                </h2>
                            </div>

                            <p className="mt-1 pl-5 text-[10px] text-slate-500">
                                {request.attachments?.length || 0}{" "}
                                attachments uploaded
                            </p>
                        </div>

                        {request.attachments?.length > 0 ? (
                            <div className="divide-y divide-slate-100 px-4">
                                {request.attachments.map(
                                    (attachment, index) => (
                                        <div
                                            key={
                                                attachment.id ||
                                                index
                                            }
                                            className="flex items-center justify-between gap-3 py-3"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-red-50 text-red-500">
                                                    <FileText
                                                        size={17}
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate text-xs font-semibold text-slate-800">
                                                        {attachment.fileName ||
                                                            "Attachment"}
                                                    </p>

                                                    <p className="text-[10px] text-slate-500">
                                                        {attachment.uploadedOn
                                                            ? `Uploaded on ${formatDateTime(
                                                                  attachment.uploadedOn,
                                                              )}`
                                                            : attachment.fileType ||
                                                              ""}
                                                    </p>

                                                    {attachment.fileSize && (
                                                        <p className="text-[10px] text-slate-500">
                                                            {
                                                                attachment.fileSize
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDownload(
                                                        attachment,
                                                    )
                                                }
                                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-blue-200 text-blue-600 hover:bg-blue-50"
                                                title="Download"
                                            >
                                                <Download
                                                    size={15}
                                                />
                                            </button>
                                        </div>
                                    ),
                                )}
                            </div>
                        ) : (
                            <div className="px-4 py-6 text-center">
                                <Paperclip
                                    size={22}
                                    className="mx-auto mb-2 text-slate-300"
                                />

                                <p className="text-xs text-slate-400">
                                    No attachments uploaded
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ==============================================================
                    RIGHT SIDE - ACTIONS
                ============================================================== */}

                <div>
                    <div className="sticky top-4 rounded-lg border border-slate-200 bg-white">
                        {/* Actions Header */}

                        <div className="border-b border-slate-200 px-4 py-3">
                            <h2 className="text-xs font-bold uppercase text-slate-800">
                                Actions
                            </h2>

                            <p className="mt-1 text-[10px] text-slate-500">
                                Review the request and take appropriate
                                action.
                            </p>
                        </div>

                        {/* Action Buttons */}

                        <div className="space-y-2 p-4">
                            {/* Forward */}

                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() =>
                                    handleAction("FORWARD-TO-HR")
                                }
                                className="
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-md
                                    border
                                    border-green-200
                                    bg-white
                                    px-3
                                    py-3
                                    text-left
                                    transition
                                    hover:bg-green-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                <CheckCircle2
                                    size={19}
                                    className="shrink-0 text-green-600"
                                />

                                <div>
                                    <p className="text-xs font-bold text-green-700">
                                        Forward Request
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-slate-500">
                                        Forward request to the next
                                        authority.
                                    </p>
                                </div>
                            </button>

                            {/* Reject */}

                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() =>
                                    handleAction("REJECTED")
                                }
                                className="
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-md
                                    border
                                    border-red-200
                                    bg-white
                                    px-3
                                    py-3
                                    text-left
                                    transition
                                    hover:bg-red-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                <XCircle
                                    size={19}
                                    className="shrink-0 text-red-500"
                                />

                                <div>
                                    <p className="text-xs font-bold text-red-600">
                                        Reject Request
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-slate-500">
                                        Reject and inform employee.
                                    </p>
                                </div>
                            </button>

                            {/* Request Information */}

                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() =>
                                    handleAction(
                                        "REQUEST_INFORMATION",
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
                                    bg-white
                                    px-3
                                    py-3
                                    text-left
                                    transition
                                    hover:bg-blue-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                <MessageSquare
                                    size={19}
                                    className="shrink-0 text-blue-600"
                                />

                                <div>
                                    <p className="text-xs font-bold text-blue-600">
                                        Request More Information
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-slate-500">
                                        Ask for additional information
                                        from employee.
                                    </p>
                                </div>
                            </button>
                        </div>

                        {/* Remarks */}

                        <div className="border-t border-slate-200 p-4">
                            <label className="mb-2 block text-[10px] font-bold uppercase text-blue-800">
                                Remarks{" "}
                                <span className="font-normal text-slate-500">
                                    (Optional)
                                </span>
                            </label>

                            <textarea
                                value={remarks}
                                onChange={(event) =>
                                    setRemarks(event.target.value)
                                }
                                maxLength={500}
                                rows={4}
                                disabled={isSubmitting}
                                placeholder="Enter remarks..."
                                className="
                                    w-full
                                    resize-none
                                    rounded-md
                                    border
                                    border-slate-200
                                    px-3
                                    py-2
                                    text-xs
                                    text-slate-700
                                    outline-none
                                    placeholder:text-slate-400
                                    focus:border-blue-400
                                    focus:ring-1
                                    focus:ring-blue-100
                                    disabled:bg-slate-50
                                "
                            />

                            <p className="mt-1 text-[9px] text-slate-400">
                                {remarks.length}/500 characters
                            </p>
                        </div>

                        {/* Error */}

                        {actionError && (
                            <div className="mx-4 mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2">
                                <div className="flex items-start gap-2">
                                    <XCircle
                                        size={14}
                                        className="mt-0.5 shrink-0 text-red-500"
                                    />

                                    <p className="text-[10px] leading-4 text-red-700">
                                        {actionError}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Note */}

                        <div className="mx-4 mb-4 rounded-md bg-blue-50 p-3">
                            <div className="flex items-start gap-2">
                                <Info
                                    size={14}
                                    className="mt-0.5 shrink-0 text-blue-600"
                                />

                                <div>
                                    <p className="text-[10px] font-bold text-blue-700">
                                        Note:
                                    </p>

                                    <ul className="mt-1 list-disc space-y-1 pl-3 text-[9px] leading-4 text-blue-700">
                                        <li>
                                            Action will be recorded in
                                            the workflow audit log.
                                        </li>

                                        <li>
                                            The remarks entered above
                                            will be sent with the
                                            selected action.
                                        </li>

                                        <li>
                                            Final amount will be
                                            verified before payroll
                                            processing.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaternityLeaveEncashmentDetails;

