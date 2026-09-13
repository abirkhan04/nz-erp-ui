import React, { useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Download,
    FileText,
    Info,
    MessageSquare,
    Paperclip,
    User,
    XCircle,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

/* ==========================================================================
 * TYPES
 * ========================================================================== */

interface EarnedLeaveEncashmentRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    designation: string;
    appliedOn: string;
    status: "Pending" | "Approved" | "Rejected";
    forwardedBy: string;

    // Details
    dateOfJoining?: string;
    reportingManager?: string;

    totalEarnedLeaveCredited?: number;
    earnedLeaveEnjoyed?: number;
    balanceEarnedLeave?: number;
    eligibleForEncashment?: number;
    encashmentDaysRequested?: number;
    encashmentRate?: string;
    encashmentAmount?: number;
    remarksByEmployee?: string;

    attachmentName?: string;
    attachmentSize?: string;
}

/* ==========================================================================
 * COMPONENT
 * ========================================================================== */

const EarnedLeaveEncashmentDetails: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const request =
        location.state?.request as
            | EarnedLeaveEncashmentRequest
            | undefined;

    const [remarks, setRemarks] = useState("");

    /* ==========================================================================
     * FALLBACK WHEN NO REQUEST IS PROVIDED
     * ========================================================================== */

    if (!request) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <Info
                        size={40}
                        className="mx-auto mb-3 text-blue-500"
                    />

                    <h1 className="text-lg font-bold text-slate-800">
                        Encashment Request Not Found
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        No earned leave encashment request was
                        provided for this page.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/payroll-and-workforce-movement/attendance-cell/earned-leave-encashment-requests",
                            )
                        }
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
                        Back to Earned Leave Encashment Requests
                    </button>
                </div>
            </div>
        );
    }

    /* ==========================================================================
     * DEFAULT / DERIVED VALUES
     * ========================================================================== */

    const totalEarnedLeaveCredited =
        request.totalEarnedLeaveCredited ?? 24;

    const earnedLeaveEnjoyed =
        request.earnedLeaveEnjoyed ?? 14;

    const balanceEarnedLeave =
        request.balanceEarnedLeave ??
        totalEarnedLeaveCredited -
            earnedLeaveEnjoyed;

    const eligibleForEncashment =
        request.eligibleForEncashment ??
        balanceEarnedLeave * 0.5;

    const encashmentDaysRequested =
        request.encashmentDaysRequested ??
        eligibleForEncashment;

    const encashmentRate =
        request.encashmentRate ??
        "As per Company Policy";

    const encashmentAmount =
        request.encashmentAmount ?? 10975;

    /* ==========================================================================
     * ACTIONS
     * ========================================================================== */

    const handleForward = () => {
        console.log(
            "Forward Earned Leave Encashment Request:",
            {
                request,
                remarks,
            },
        );

        /*
         * Real API:
         *
         * await api.post(
         *     `/earned-leave-encashment/${request.id}/forward`,
         *     {
         *         remarks,
         *     },
         * );
         */
    };

    const handleReject = () => {
        console.log(
            "Reject Earned Leave Encashment Request:",
            {
                request,
                remarks,
            },
        );

        /*
         * Real API:
         *
         * await api.post(
         *     `/earned-leave-encashment/${request.id}/reject`,
         *     {
         *         remarks,
         *     },
         * );
         */
    };

    const handleRequestInformation = () => {
        console.log(
            "Request More Information:",
            {
                request,
                remarks,
            },
        );

        /*
         * Real API:
         *
         * await api.post(
         *     `/earned-leave-encashment/${request.id}/request-information`,
         *     {
         *         remarks,
         *     },
         * );
         */
    };

    /* ==========================================================================
     * NAVIGATION
     * ========================================================================== */

    const handlePreviousRequest = () => {
        console.log("Previous Request");
    };

    const handleNextRequest = () => {
        console.log("Next Request");
    };

    const handleBack = () => {
        navigate(
            "/payroll-and-workforce-movement/attendance-cell/earned-leave-encashment-requests",
        );
    };

    /* ==========================================================================
     * UI
     * ========================================================================== */

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6">
            {/* ==================================================================
                BACK TO LIST
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
                PAGE HEADER
            ================================================================== */}

            <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="text-lg font-bold uppercase text-blue-900">
                        Earned Leave Encashment Request Details
                    </h1>

                    <p className="mt-1 text-xs text-slate-500">
                        Review full details of the earned leave
                        encashment request and take appropriate
                        action.
                    </p>
                </div>

                {/* Previous / Next */}

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={
                            handlePreviousRequest
                        }
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-md
                            border
                            border-blue-200
                            bg-white
                            px-3
                            py-2
                            text-xs
                            font-semibold
                            text-blue-600
                            hover:bg-blue-50
                        "
                    >
                        <ArrowLeft size={14} />
                        Previous Request
                    </button>

                    <button
                        type="button"
                        onClick={
                            handleNextRequest
                        }
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-md
                            border
                            border-blue-200
                            bg-white
                            px-3
                            py-2
                            text-xs
                            font-semibold
                            text-blue-600
                            hover:bg-blue-50
                        "
                    >
                        Next Request
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>

            {/* ==================================================================
                SUMMARY
            ================================================================== */}

            <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="grid grid-cols-1 divide-y divide-slate-200 md:grid-cols-2 lg:grid-cols-5 lg:divide-y-0">
                    {/* Request ID */}

                    <SummaryItem
                        icon={
                            <CalendarDays size={18} />
                        }
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

                    {/* Applied On */}

                    <SummaryItem
                        icon={<CalendarDays size={18} />}
                        label="Applied On"
                        value={
                            request.appliedOn.split(
                                " ",
                            )[0]
                        }
                        subValue={request.appliedOn
                            .split(" ")
                            .slice(1)
                            .join(" ")}
                    />

                    {/* Status */}

                    <SummaryItem
                        icon={
                            <CheckCircle2 size={18} />
                        }
                        label="Status"
                        value={
                            <StatusBadge
                                status={
                                    request.status
                                }
                            />
                        }
                    />

                    {/* Forwarded By */}

                    <SummaryItem
                        icon={<User size={18} />}
                        label="Forwarded By"
                        value={
                            request.forwardedBy
                        }
                        subValue={
                            request.appliedOn
                        }
                    />
                </div>
            </div>

            {/* ==================================================================
                MAIN CONTENT
            ================================================================== */}

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_450px]">
                {/* ==============================================================
                    LEFT CONTENT
                ============================================================== */}

                <div className="min-w-0">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {/* ======================================================
                            EMPLOYEE INFORMATION
                        ====================================================== */}

                        <InfoCard title="Employee Information">
                            <InfoRow
                                label="Employee ID"
                                value={
                                    request.employeeId
                                }
                            />

                            <InfoRow
                                label="Employee Name"
                                value={
                                    request.employeeName
                                }
                            />

                            <InfoRow
                                label="Department"
                                value={
                                    request.department
                                }
                            />

                            <InfoRow
                                label="Designation"
                                value={
                                    request.designation
                                }
                            />

                            <InfoRow
                                label="Date of Joining"
                                value={
                                    request.dateOfJoining ??
                                    "16-Jan-2020"
                                }
                            />

                            <InfoRow
                                label="Reporting Manager"
                                value={
                                    request.reportingManager ??
                                    "Abul Kashem (10075)"
                                }
                            />
                        </InfoCard>

                        {/* ======================================================
                            EARNED LEAVE BALANCE
                        ====================================================== */}

                        <InfoCard title="Earned Leave Balance (Current Year)">
                            <InfoRow
                                label="Total Earned Leave Credited (Current Year)"
                                value={`${totalEarnedLeaveCredited.toFixed(
                                    1,
                                )} Days`}
                            />

                            <InfoRow
                                label="Earned Leave Enjoyed / Utilized (Current Year)"
                                value={`${earnedLeaveEnjoyed.toFixed(
                                    1,
                                )} Days`}
                            />

                            <InfoRow
                                label="Balance Earned Leave (Current Year)"
                                value={
                                    <span className="text-green-600">
                                        {balanceEarnedLeave.toFixed(
                                            1,
                                        )} Days
                                        <span className="block text-[9px] font-normal">
                                            (
                                            {
                                                totalEarnedLeaveCredited
                                            }
                                            .0 -{" "}
                                            {
                                                earnedLeaveEnjoyed
                                            }
                                            .0)
                                        </span>
                                    </span>
                                }
                            />

                            {/* Eligible */}

                            <div className="my-1 rounded-md bg-green-50 px-2">
                                <InfoRow
                                    label="Eligible for Encashment (50% of Balance)"
                                    value={
                                        <span className="text-green-600">
                                            {eligibleForEncashment.toFixed(
                                                1,
                                            )}{" "}
                                            Days
                                            <span className="block text-[9px] font-normal">
                                                (50% of{" "}
                                                {balanceEarnedLeave.toFixed(
                                                    1,
                                                )} Days)
                                            </span>
                                        </span>
                                    }
                                />
                            </div>

                            <InfoRow
                                label="Encashment Days Requested"
                                value={`${encashmentDaysRequested.toFixed(
                                    1,
                                )} Days`}
                            />

                            <InfoRow
                                label="Encashment Rate"
                                value={encashmentRate}
                            />

                            <InfoRow
                                label="Encashment Amount (Est.)"
                                value={`${encashmentAmount.toLocaleString(
                                    "en-BD",
                                )}.00 BDT`}
                            />

                            <InfoRow
                                label="Remarks by Employee"
                                value={
                                    request.remarksByEmployee ??
                                    "For personal financial requirement."
                                }
                            />
                        </InfoCard>
                    </div>

                    {/* ==========================================================
                        ATTACHMENTS
                    ========================================================== */}

                    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="mb-2 flex items-center gap-2">
                            <Paperclip
                                size={16}
                                className="text-blue-600"
                            />

                            <h2 className="text-xs font-bold uppercase text-blue-700">
                                Attachments
                            </h2>
                        </div>

                        <p className="mb-3 text-[10px] text-slate-500">
                            1 attachment uploaded
                        </p>

                        <div className="flex flex-col gap-3 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                {/* PDF Icon */}

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-50">
                                    <FileText
                                        size={21}
                                        className="text-red-500"
                                    />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-slate-700">
                                        {request.attachmentName ??
                                            "Application_EL_Encashment.pdf"}
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-slate-400">
                                        Uploaded on{" "}
                                        {request.appliedOn}
                                    </p>

                                    <p className="text-[10px] text-slate-500">
                                        {request.attachmentSize ??
                                            "185 KB"}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    console.log(
                                        "Download attachment",
                                    )
                                }
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-md
                                    border
                                    border-blue-200
                                    bg-white
                                    px-3
                                    py-2
                                    text-xs
                                    font-semibold
                                    text-blue-600
                                    hover:bg-blue-50
                                "
                            >
                                <Download size={14} />
                                Download
                            </button>
                        </div>
                    </div>
                </div>

                {/* ==============================================================
                    RIGHT COLUMN
                ============================================================== */}

                <div className="space-y-4">
                    {/* ==========================================================
                        IMPORTANT RULES
                    ========================================================== */}

                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="mb-2 flex items-center gap-2">
                            <Info
                                size={15}
                                className="text-blue-600"
                            />

                            <h2 className="text-xs font-bold uppercase text-blue-700">
                                Important Rules
                            </h2>
                        </div>

                        <ul className="space-y-1.5 pl-4 text-[10px] leading-4 text-slate-600">
                            <li>
                                • Encashment is allowed only
                                on Current Year's Earned
                                Leave.
                            </li>

                            <li>
                                • Eligible encashment is 50%
                                of the balance Earned Leave
                                of the Current Year.
                            </li>

                            <li>
                                • Balance Earned Leave =
                                Total Earned Leave Credited -
                                Earned Leave Enjoyed.
                            </li>

                            <li>
                                • Encashment can be done only
                                once in a year.
                            </li>

                            <li>
                                • Final encashment amount will
                                be calculated by Payroll as
                                per Company Policy.
                            </li>
                        </ul>
                    </div>

                    {/* ==========================================================
                        ACTIONS
                    ========================================================== */}

                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 bg-white px-4 py-3">
                            <h2 className="text-sm font-bold uppercase text-blue-800">
                                Actions
                            </h2>

                            <p className="mt-1 text-[10px] text-slate-500">
                                Review the request and take
                                appropriate action.
                            </p>
                        </div>

                        <div className="space-y-2 p-3">
                            {/* Forward */}

                            <button
                                type="button"
                                disabled={
                                    request.status !==
                                    "Pending"
                                }
                                onClick={
                                    handleForward
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
                                        Forward to HR Manager
                                    </span>

                                    <span className="block text-[10px] text-slate-500">
                                        Forward request to
                                        next higher authority.
                                    </span>
                                </span>
                            </button>

                            {/* Reject */}

                            <button
                                type="button"
                                disabled={
                                    request.status !==
                                    "Pending"
                                }
                                onClick={
                                    handleReject
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
                                        Reject and inform
                                        employee.
                                    </span>
                                </span>
                            </button>

                            {/* Request Information */}

                            <button
                                type="button"
                                disabled={
                                    request.status !==
                                    "Pending"
                                }
                                onClick={
                                    handleRequestInformation
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
                                        Ask for additional
                                        information from
                                        employee.
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
                                    setRemarks(
                                        e.target.value,
                                    )
                                }
                                maxLength={500}
                                rows={3}
                                placeholder="Enter remarks (visible to next authority)..."
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
                                "
                            />

                            <p className="mt-1 text-[10px] text-slate-400">
                                {remarks.length}/500
                                characters
                            </p>
                        </div>

                        {/* ======================================================
                            NOTE
                        ====================================================== */}

                        <div className="border-t border-slate-200 bg-blue-50 p-4">
                            <div className="flex items-start gap-2">
                                <Info
                                    size={14}
                                    className="mt-0.5 shrink-0 text-blue-600"
                                />

                                <div>
                                    <p className="text-[11px] font-bold text-blue-700">
                                        Note:
                                    </p>

                                    <ul className="mt-1 space-y-1 text-[10px] leading-4 text-blue-700">
                                        <li>
                                            • Encashment will
                                            be processed after
                                            approval from HR
                                            Manager.
                                        </li>

                                        <li>
                                            • Encashment amount
                                            will be paid with
                                            salary as per
                                            Payroll schedule.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================================================================
                FOOTER NAVIGATION
            ================================================================== */}

            {/* <div className="mt-4 flex items-center justify-between">
                <button
                    type="button"
                    onClick={
                        handlePreviousRequest
                    }
                    className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-md
                        border
                        border-blue-200
                        bg-white
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-blue-600
                        hover:bg-blue-50
                    "
                >
                    <ArrowLeft size={14} />
                    Previous Request
                </button>

                <span className="text-xs font-semibold text-slate-600">
                    Request 2 of 6
                </span>

                <button
                    type="button"
                    onClick={
                        handleNextRequest
                    }
                    className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-md
                        border
                        border-blue-200
                        bg-white
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-blue-600
                        hover:bg-blue-50
                    "
                >
                    Next Request
                    <ArrowRight size={14} />
                </button>
            </div> */}
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

                <div className="mt-1 text-[11px] font-bold text-slate-700">
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

interface StatusBadgeProps {
    status:
        | "Pending"
        | "Approved"
        | "Rejected";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
}) => {
    return (
        <span
            className={`
                inline-flex
                rounded-md
                px-2.5
                py-1
                text-[10px]
                font-semibold
                ${
                    status === "Pending"
                        ? "bg-orange-50 text-orange-600"
                        : status === "Approved"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                }
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

            <div className="px-4 py-2">
                {children}
            </div>
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
        <div className="grid grid-cols-[minmax(145px,1fr)_minmax(100px,1fr)] gap-3 border-b border-slate-100 py-2 last:border-b-0">
            <span className="text-[9px] font-semibold leading-4 text-slate-500">
                {label}
            </span>

            <span className="text-right text-[10px] font-semibold leading-4 text-slate-700">
                {value}
            </span>
        </div>
    );
};

export default EarnedLeaveEncashmentDetails;
