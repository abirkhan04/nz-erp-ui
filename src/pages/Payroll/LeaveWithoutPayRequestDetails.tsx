import React, { useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    FileText,
    Info,
    User,
    XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { API_ROUTES } from "../../api/routes";
import { useGet } from "../../hooks/useGet";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

type LeaveRequestDetails = {
    requestId: string;
    status: string;
    appliedOn: string | null;
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
};

const LeaveWithoutPayRequestsDetails: React.FC = () => {
    const navigate = useNavigate();
    const { requestId } = useParams<{ requestId: string }>();

    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [remarks, setRemarks] = useState("");

    /*
     * GET REQUEST
     *
     * The requestId comes directly from the route:
     *
     * /leave-without-pay-request/:requestId
     */

    const {
        data: leaveRequest,
        isLoading,
        refetch,
        } = useGet({
        key: ["leaveWithoutPayRequest", requestId],
        url: `${API_ROUTES.LEAVE}/leave-request/${requestId}`,
        enabled: !!requestId,
    });

    /*
     * The API returns the request object directly:
     *
     * {
     *   requestId,
     *   status,
     *   appliedOn,
     *   employee: {...},
     *   leave: {...}
     * }
     */
    const request =
        leaveRequest as LeaveRequestDetails | undefined;

    /*
     * APPROVE / REJECT
     */

    const {user} = useAuth();

    const handleApproval = async (
        approvalStatus: "APPROVED" | "REJECTED"
    ) => {
        if (!request) {
            return;
        }

        if (approvalStatus === "APPROVED") {
            setIsApproving(true);
        } else {
            setIsRejecting(true);
        }

        try {
            const payload = 
                {
                    requestId: request.requestId,
                    leaveType: request.leave.leaveType,
                    fromDate: request.leave.startDate,
                    toDate: request.leave.endDate,
                    reason: request.leave.reason,
                    forwardedBy: request.forwardedBy ?? "",
                    forwardedDate: request.appliedOn?.split("T")[0] ?? "",
                    approvedBy: user?.userName,
                    approvStatus: approvalStatus,
                };

             await api.put(
                `${API_ROUTES.LEAVE}/${request.requestId}`,
                payload
            );

            await refetch();
        } catch (error) {
            console.error(
                "Leave request approval/rejection failed:",
                error
            );

            alert(
                approvalStatus === "APPROVED"
                    ? "Failed to approve the leave request."
                    : "Failed to reject the leave request."
            );
        } finally {
            setIsApproving(false);
            setIsRejecting(false);
        }
    };

    /*
     * LOADING
     */
    if (isLoading) {
        return (
            <div className="min-h-screen bg-white px-4 py-4 text-[#17245B]">
                <div className="flex min-h-[400px] items-center justify-center">
                    <div className="text-sm font-semibold text-gray-500">
                        Loading leave request...
                    </div>
                </div>
            </div>
        );
    }

    /*
     * NO DATA
     */
    if (!request) {
        return (
            <div className="min-h-screen bg-white px-4 py-4 text-[#17245B]">
                <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-center">
                    <p className="text-sm font-semibold text-red-700">
                        Leave request could not be loaded.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const isForwarded = request.status === "FORWARDED";
    const isApproved = request.status === "APPROVED";
    const isRejected = request.status === "REJECTED";

    return (
        <div className="min-h-screen bg-white px-4 py-4 text-[#17245B]">

            {/* HEADER */}
            <header className="h-[59px] bg-[#082b87] px-5 text-white">
                <div className="flex h-full items-center justify-between">

                    <div className="flex h-full items-center">

                        <div className="flex items-center gap-2 pr-5">
                            <div className="flex h-[38px] w-[38px] items-center justify-center rounded bg-white">
                                <span className="text-[32px] font-bold leading-none text-[#173e98]">
                                    S
                                </span>
                            </div>

                            <div>
                                <div className="text-[18px] font-bold leading-none">
                                    SYNEXIS
                                </div>

                                <div className="mt-1 text-[7px]">
                                    Creating Enterprise Synergy
                                </div>
                            </div>
                        </div>

                        <div className="h-[38px] w-px bg-white/30" />

                        <div className="pl-5">
                            <div className="text-[13px] font-bold">
                                PAYROLL &amp; WORKFORCE MOVEMENT SECTION –
                                ATTENDANCE CELL
                            </div>

                            <div className="mt-1 text-[10px]">
                                Dashboard
                                <span className="mx-2">&gt;</span>
                                Leave Without Pay Requests
                                <span className="mx-2">&gt;</span>
                                Details
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">

                        <div className="flex h-[32px] items-center gap-2 rounded bg-white px-3 text-[10px] font-semibold text-[#17275c]">
                            <CalendarDays size={14} />
                            30 September 2026
                        </div>

                        <div className="flex items-center gap-2 border-l border-white/30 pl-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                                <User
                                    size={18}
                                    className="text-[#173e98]"
                                />
                            </div>

                            <div className="text-[8px] leading-[1.35]">
                                <div className="font-bold">
                                    Nusrat Jahan
                                </div>
                                <div>Section Incharge</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* TITLE */}
            <div className="mb-5 mt-5 flex items-start justify-between">

                <div>
                    <div className="flex items-center gap-3">

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex h-9 w-9 items-center justify-center rounded-md border border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
                        >
                            <ArrowLeft size={17} />
                        </button>

                        <div>
                            <h1 className="text-xl font-bold text-[#07185C]">
                                LEAVE WITHOUT PAY REQUEST DETAILS
                            </h1>

                            <p className="mt-1 text-sm text-gray-600">
                                View and manage leave without pay request
                                details.
                            </p>
                        </div>
                    </div>
                </div>

                {/* STATUS */}
                <StatusBadge status={request.status} />
            </div>

            {/* REQUEST INFORMATION */}
            <div className="mb-5 rounded-lg border border-blue-100 bg-white">

                <div className="flex items-center justify-between border-b border-blue-100 px-5 py-4">

                    <div className="flex items-center gap-2">
                        <FileText
                            size={18}
                            className="text-blue-600"
                        />

                        <h2 className="text-sm font-bold text-[#17245B]">
                            Request Information
                        </h2>
                    </div>

                    <div className="text-xs text-gray-500">
                        Request ID:
                        <span className="ml-1 font-bold text-blue-700">
                            {request.requestId}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-4">

                    <InfoItem
                        label="Request ID"
                        value={request.requestId}
                    />

                    <InfoItem
                        label="Status"
                        value={
                            <StatusBadge
                                status={request.status}
                            />
                        }
                    />

                    <InfoItem
                        label="Applied On"
                        value={formatDateTime(
                            request.appliedOn
                        )}
                    />

                    <InfoItem
                        label="Forwarded By"
                        value={
                            request.forwardedBy || "-"
                        }
                    />
                </div>
            </div>

            {/* EMPLOYEE INFORMATION */}
            <div className="mb-5 rounded-lg border border-blue-100 bg-white">

                <div className="flex items-center gap-2 border-b border-blue-100 px-5 py-4">

                    <User
                        size={18}
                        className="text-blue-600"
                    />

                    <h2 className="text-sm font-bold text-[#17245B]">
                        Employee Information
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-3">

                    <InfoItem
                        label="Employee ID"
                        value={request.employee.employeeId}
                    />

                    <InfoItem
                        label="Employee Name"
                        value={request.employee.employeeName}
                    />

                    <InfoItem
                        label="Department"
                        value={
                            request.employee.department || "-"
                        }
                    />

                    <InfoItem
                        label="Designation"
                        value={
                            request.employee.designation || "-"
                        }
                    />

                    <InfoItem
                        label="Date of Joining"
                        value={
                            request.employee.dateOfJoining
                                ? formatDate(
                                    request.employee.dateOfJoining
                                )
                                : "-"
                        }
                    />

                    <InfoItem
                        label="Reporting Manager"
                        value={
                            request.employee.reportingManager ||
                            "-"
                        }
                    />
                </div>
            </div>

            {/* LEAVE INFORMATION */}
            <div className="mb-5 rounded-lg border border-blue-100 bg-white">

                <div className="flex items-center gap-2 border-b border-blue-100 px-5 py-4">

                    <CalendarDays
                        size={18}
                        className="text-blue-600"
                    />

                    <h2 className="text-sm font-bold text-[#17245B]">
                        Leave Information
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-4">

                    <InfoItem
                        label="Leave Type"
                        value={request.leave.leaveType}
                    />

                    <InfoItem
                        label="Leave Code"
                        value={request.leave.leaveCode}
                    />

                    <InfoItem
                        label="From Date"
                        value={formatDate(
                            request.leave.startDate
                        )}
                    />

                    <InfoItem
                        label="To Date"
                        value={formatDate(
                            request.leave.endDate
                        )}
                    />

                    <InfoItem
                        label="Total Days"
                        value={`${request.leave.totalDays} day${
                            request.leave.totalDays === 1
                                ? ""
                                : "s"
                        }`}
                    />

                    <InfoItem
                        label="Session"
                        value={request.leave.session}
                    />

                    <InfoItem
                        label="Contact Number"
                        value={
                            request.leave.contactNumber || "-"
                        }
                    />
                </div>

                {/* REASON */}
                <div className="border-t border-gray-100 px-5 py-4">

                    <p className="mb-2 text-xs font-bold text-gray-500">
                        Reason
                    </p>

                    <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">
                        {request.leave.reason || "-"}
                    </div>
                </div>
            </div>

            {/* REMARKS */}
            <div className="mb-5 rounded-lg border border-blue-100 bg-white">

                <div className="border-b border-blue-100 px-5 py-4">
                    <h2 className="text-sm font-bold text-[#17245B]">
                        Remarks (Optional)
                    </h2>
                </div>

                <div className="p-5">

                    <textarea
                        value={remarks}
                        onChange={(event) =>
                            setRemarks(
                                event.target.value.slice(0, 250)
                            )
                        }
                        maxLength={250}
                        rows={3}
                        disabled={!isForwarded}
                        placeholder="Enter remarks..."
                        className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                    />

                    <div className="mt-1 flex justify-between text-[11px] text-gray-500">
                        <span>
                            Maximum 250 characters allowed
                        </span>

                        <span>
                            {remarks.length}/250
                        </span>
                    </div>
                </div>
            </div>

            {/* INFORMATION */}
            <div className="mb-5 rounded-md border border-blue-100 bg-blue-50/40 p-3">

                <div className="flex gap-2">

                    <Info
                        size={16}
                        className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <div>
                        <p className="text-xs font-bold text-blue-800">
                            Note
                        </p>

                        <p className="mt-1 text-xs text-gray-600">
                            Approved Leave Without Pay requests will
                            be reflected in attendance and payroll.
                        </p>
                    </div>
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3">

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                    Back
                </button>

                {isForwarded && (
                    <>
                        <button
                            type="button"
                            onClick={() =>
                                handleApproval("REJECTED")
                            }
                            disabled={
                                isApproving ||
                                isRejecting
                            }
                            className="flex items-center gap-2 rounded-md bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <XCircle size={16} />

                            {isRejecting
                                ? "Rejecting..."
                                : "Reject"}
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                handleApproval("APPROVED")
                            }
                            disabled={
                                isApproving ||
                                isRejecting
                            }
                            className="flex items-center gap-2 rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <CheckCircle2 size={16} />

                            {isApproving
                                ? "Approving..."
                                : "Approve"}
                        </button>
                    </>
                )}

                {isApproved && (
                    <div className="flex items-center gap-2 rounded-md bg-green-50 px-5 py-2 text-sm font-semibold text-green-700">
                        <CheckCircle2 size={16} />
                        Request Approved
                    </div>
                )}

                {isRejected && (
                    <div className="flex items-center gap-2 rounded-md bg-red-50 px-5 py-2 text-sm font-semibold text-red-700">
                        <XCircle size={16} />
                        Request Rejected
                    </div>
                )}
            </div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/* INFO ITEM                                                                  */
/* -------------------------------------------------------------------------- */

const InfoItem: React.FC<{
    label: string;
    value: React.ReactNode;
}> = ({ label, value }) => {
    return (
        <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                {label}
            </p>

            <div className="min-h-[20px] text-sm font-semibold text-[#17245B]">
                {value}
            </div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/* STATUS BADGE                                                               */
/* -------------------------------------------------------------------------- */

const StatusBadge: React.FC<{
    status: string;
}> = ({ status }) => {

    const className =
        status === "FORWARDED"
            ? "border-orange-200 bg-orange-50 text-orange-700"
            : status === "APPROVED"
                ? "border-green-200 bg-green-50 text-green-700"
                : status === "REJECTED"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-gray-200 bg-gray-50 text-gray-700";

    return (
        <span
            className={`inline-flex rounded border px-2 py-1 text-[10px] font-bold ${className}`}
        >
            {status}
        </span>
    );
};

/* -------------------------------------------------------------------------- */
/* DATE HELPERS                                                               */
/* -------------------------------------------------------------------------- */

const formatDate = (date: string) => {
    if (!date) {
        return "-";
    }

    const [year, month, day] = date.split("-");

    if (!year || !month || !day) {
        return date;
    }

    return `${day}/${month}/${year}`;
};

const formatDateTime = (date: string | null) => {
    if (!date) {
        return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleString();
};

export default LeaveWithoutPayRequestsDetails;
