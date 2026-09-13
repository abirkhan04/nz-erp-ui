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
    Users,
    XCircle,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

/* ==========================================================================
 * TYPES
 * ========================================================================== */

interface Attachment {
    id: string;
    fileName: string;
    fileType: "PDF" | "DOC" | "DOCX";
    uploadedOn: string;
    fileSize: string;
}

interface MaternityLeaveEncashmentRequest {
    requestId: string;

    employeeId: string;
    employeeName: string;
    department: string;
    designation: string;
    dateOfJoining: string;
    reportingManager: string;

    requestPart: string;
    requestPartLabel: string;

    appliedOn: string;
    status: "Pending" | "Approved" | "Rejected";
    forwardedBy: string;
    forwardedOn: string;

    maternityLeaveEntitlement: string;
    leaveStructure: string;
    expectedDeliveryDate: string;
    maternityLeavePeriod: string;

    encashmentDaysRequested: string;
    encashmentRate: string;
    encashmentAmount: string;
    remarksByEmployee: string;

    attachments: Attachment[];
}

/* ==========================================================================
 * MOCK REQUESTS
 *
 * In production, replace this with your API response.
 *
 * The order of this array determines Previous / Next Request.
 * ========================================================================== */

const MATERNITY_REQUESTS: MaternityLeaveEncashmentRequest[] = [
    {
        requestId: "MLENC2505001",
        employeeId: "10102",
        employeeName: "Sabina Akter",
        department: "Dyeing",
        designation: "Dyeing Operator",
        dateOfJoining: "05-Jun-2019",
        reportingManager: "Mostafa Kamal (10056)",

        requestPart: "Part-1",
        requestPartLabel: "Part-1 (Pre-Delivery)",

        appliedOn: "14-May-2025 02:35 PM",
        status: "Pending",
        forwardedBy: "Production Floor Dyeing Floor",
        forwardedOn: "14-May-2025 03:10 PM",

        maternityLeaveEntitlement: "128 Days",
        leaveStructure:
            "64 Days Pre-Delivery + 64 Days Post-Delivery",
        expectedDeliveryDate: "30-Jun-2025",
        maternityLeavePeriod:
            "02-May-2025 to 27-Sep-2025",

        encashmentDaysRequested:
            "64 Days (Pre-Delivery)",
        encashmentRate: "As per Company Policy",
        encashmentAmount: "78,400.00 BDT",
        remarksByEmployee:
            "For personal financial requirement.",

        attachments: [
            {
                id: "ATT-001",
                fileName: "Doctor_Certificate_Sabina.pdf",
                fileType: "PDF",
                uploadedOn: "14-May-2025 02:30 PM",
                fileSize: "245 KB",
            },
            {
                id: "ATT-002",
                fileName: "Recommendation_Letter.pdf",
                fileType: "PDF",
                uploadedOn: "14-May-2025 02:32 PM",
                fileSize: "186 KB",
            },
        ],
    },

    {
        requestId: "MLENC2505002",
        employeeId: "10245",
        employeeName: "Nusrat Jahan",
        department: "HR",
        designation: "Executive",
        dateOfJoining: "12-Aug-2020",
        reportingManager: "Rahim Uddin (10023)",

        requestPart: "Part-1",
        requestPartLabel: "Part-1 (Pre-Delivery)",

        appliedOn: "14-May-2025 02:40 PM",
        status: "Pending",
        forwardedBy: "HR Department",
        forwardedOn: "14-May-2025 03:15 PM",

        maternityLeaveEntitlement: "128 Days",
        leaveStructure:
            "64 Days Pre-Delivery + 64 Days Post-Delivery",
        expectedDeliveryDate: "05-Jul-2025",
        maternityLeavePeriod:
            "10-May-2025 to 05-Oct-2025",

        encashmentDaysRequested:
            "64 Days (Pre-Delivery)",
        encashmentRate: "As per Company Policy",
        encashmentAmount: "82,500.00 BDT",
        remarksByEmployee:
            "Requested for personal financial requirement.",

        attachments: [
            {
                id: "ATT-003",
                fileName: "Medical_Certificate.pdf",
                fileType: "PDF",
                uploadedOn: "14-May-2025 02:38 PM",
                fileSize: "210 KB",
            },
        ],
    },

    {
        requestId: "MLENC2505003",
        employeeId: "10321",
        employeeName: "Farzana Yasmin",
        department: "Finishing",
        designation: "Operator",
        dateOfJoining: "21-Jan-2021",
        reportingManager: "Abdul Karim (10087)",

        requestPart: "Part-2",
        requestPartLabel: "Part-2 (Post-Delivery)",

        appliedOn: "14-May-2025 02:45 PM",
        status: "Pending",
        forwardedBy: "Finishing Floor",
        forwardedOn: "14-May-2025 03:20 PM",

        maternityLeaveEntitlement: "128 Days",
        leaveStructure:
            "64 Days Pre-Delivery + 64 Days Post-Delivery",
        expectedDeliveryDate: "15-Apr-2025",
        maternityLeavePeriod:
            "15-Mar-2025 to 12-Aug-2025",

        encashmentDaysRequested:
            "64 Days (Post-Delivery)",
        encashmentRate: "As per Company Policy",
        encashmentAmount: "75,600.00 BDT",
        remarksByEmployee:
            "Post-delivery encashment request.",

        attachments: [
            {
                id: "ATT-004",
                fileName: "Delivery_Certificate.pdf",
                fileType: "PDF",
                uploadedOn: "14-May-2025 02:43 PM",
                fileSize: "198 KB",
            },
        ],
    },

    {
        requestId: "MLENC2505004",
        employeeId: "10456",
        employeeName: "Sumaiya Akter",
        department: "Accounts",
        designation: "Accounts Executive",
        dateOfJoining: "18-Mar-2018",
        reportingManager: "Mostafa Kamal (10056)",

        requestPart: "Part-1",
        requestPartLabel: "Part-1 (Pre-Delivery)",

        appliedOn: "14-May-2025 02:50 PM",
        status: "Pending",
        forwardedBy: "Accounts Department",
        forwardedOn: "14-May-2025 03:25 PM",

        maternityLeaveEntitlement: "128 Days",
        leaveStructure:
            "64 Days Pre-Delivery + 64 Days Post-Delivery",
        expectedDeliveryDate: "25-Jul-2025",
        maternityLeavePeriod:
            "27-May-2025 to 21-Oct-2025",

        encashmentDaysRequested:
            "64 Days (Pre-Delivery)",
        encashmentRate: "As per Company Policy",
        encashmentAmount: "80,200.00 BDT",
        remarksByEmployee:
            "For personal financial requirement.",

        attachments: [
            {
                id: "ATT-005",
                fileName: "Doctor_Certificate.pdf",
                fileType: "PDF",
                uploadedOn: "14-May-2025 02:48 PM",
                fileSize: "220 KB",
            },
        ],
    },
];

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
    <div className="grid grid-cols-[150px_minmax(0,1fr)] gap-3 border-b border-slate-100 py-2 last:border-b-0">
        <span className="text-xs font-medium text-slate-500">
            {label}
        </span>

        <span className="text-xs font-semibold text-slate-800">
            {value}
        </span>
    </div>
);

/* ==========================================================================
 * PAGE
 * ========================================================================== */

const MaternityLeaveEncashmentDetails: React.FC =
    () => {
        const navigate = useNavigate();
        const location = useLocation();

        const { requestId } = useParams<{
            requestId: string;
        }>();

        const [remarks, setRemarks] =
            useState("");

        /*
         * First try to use the request passed from the list page.
         * If the page is refreshed/directly opened, find it from
         * the request collection.
         */

        const request =
            (location.state as {
                request?: MaternityLeaveEncashmentRequest;
            } | null)?.request ??
            MATERNITY_REQUESTS.find(
                (item) =>
                    item.requestId === requestId,
            ) ??
            MATERNITY_REQUESTS[0];

        /* ======================================================================
         * PREVIOUS / NEXT REQUEST
         * ====================================================================== */

        const currentIndex = useMemo(() => {
            return MATERNITY_REQUESTS.findIndex(
                (item) =>
                    item.requestId ===
                    request.requestId,
            );
        }, [request.requestId]);

        const previousRequest =
            currentIndex > 0
                ? MATERNITY_REQUESTS[
                      currentIndex - 1
                  ]
                : null;

        const nextRequest =
            currentIndex <
            MATERNITY_REQUESTS.length - 1
                ? MATERNITY_REQUESTS[
                      currentIndex + 1
                  ]
                : null;

        const navigateToRequest = (
            target: MaternityLeaveEncashmentRequest,
        ) => {
            navigate(
                `/payroll-and-workforce-movement/attendance-cell/maternity-leave-encashment-requests/${target.requestId}`,
                {
                    state: {
                        request: target,
                    },
                },
            );
        };

        /* ======================================================================
         * ACTIONS
         * ====================================================================== */

        const handleForward = () => {
            console.log(
                "Forward request:",
                request.requestId,
                remarks,
            );
        };

        const handleReject = () => {
            console.log(
                "Reject request:",
                request.requestId,
                remarks,
            );
        };

        const handleRequestInformation = () => {
            console.log(
                "Request more information:",
                request.requestId,
                remarks,
            );
        };

        const handleDownload = (
            attachment: Attachment,
        ) => {
            console.log(
                "Download attachment:",
                attachment.fileName,
            );
        };

        /* ======================================================================
         * RENDER
         * ====================================================================== */

        return (
            <div className="min-h-screen bg-slate-50 p-4 md:p-6">

                {/* ==============================================================
                    BACK TO LIST
                ============================================================== */}

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

                {/* ==============================================================
                    TITLE
                ============================================================== */}

                <div className="mb-4">

                    <h1 className="text-lg font-bold uppercase text-blue-900">
                        Maternity Leave Encashment
                        Request Details
                    </h1>

                    <p className="mt-1 text-xs text-slate-500">
                        Review full details of the
                        maternity leave encashment
                        request and take appropriate
                        action.
                    </p>

                </div>

                {/* ==============================================================
                    SUMMARY CARDS
                ============================================================== */}

                <div className="mb-4 overflow-hidden rounded-lg border border-slate-200 bg-white">

                    <div className="grid grid-cols-1 divide-y divide-slate-100 md:grid-cols-2 lg:grid-cols-6 lg:divide-x lg:divide-y-0">

                        {/* Request ID */}

                        <div className="flex items-center gap-3 p-4">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                                <FileText size={19} />
                            </div>

                            <div>
                                <p className="text-[11px] text-slate-500">
                                    Request ID
                                </p>

                                <p className="text-xs font-bold text-slate-800">
                                    {request.requestId}
                                </p>
                            </div>

                        </div>

                        {/* Employee */}

                        <div className="flex items-center gap-3 p-4">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                                <Users size={19} />
                            </div>

                            <div>
                                <p className="text-[11px] text-slate-500">
                                    Employee
                                </p>

                                <p className="text-xs font-bold text-slate-800">
                                    {request.employeeName}{" "}
                                    ({request.employeeId})
                                </p>

                                <p className="text-[10px] text-slate-500">
                                    {request.department} Dept.
                                </p>
                            </div>

                        </div>

                        {/* Request Part */}

                        <div className="flex items-center gap-3 p-4">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                                <CalendarDays
                                    size={19}
                                />
                            </div>

                            <div>
                                <p className="text-[11px] text-slate-500">
                                    Request Part
                                </p>

                                <p className="text-xs font-bold text-slate-800">
                                    {
                                        request.requestPartLabel
                                    }
                                </p>

                                <span className="mt-1 inline-flex rounded bg-purple-50 px-2 py-0.5 text-[9px] font-semibold text-purple-700">
                                    First Installment
                                </span>
                            </div>

                        </div>

                        {/* Applied On */}

                        <div className="flex items-center gap-3 p-4">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                                <CalendarDays
                                    size={19}
                                />
                            </div>

                            <div>
                                <p className="text-[11px] text-slate-500">
                                    Applied On
                                </p>

                                <p className="text-xs font-bold text-slate-800">
                                    {request.appliedOn}
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

                            <div>
                                <p className="text-[11px] text-slate-500">
                                    Forwarded By
                                </p>

                                <p className="text-xs font-bold text-slate-800">
                                    {
                                        request.forwardedBy
                                    }
                                </p>

                                <p className="text-[10px] text-slate-500">
                                    {
                                        request.forwardedOn
                                    }
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

                {/* ==============================================================
                    MAIN CONTENT
                ============================================================== */}

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_370px]">

                    {/* ==========================================================
                        LEFT SIDE
                    ========================================================== */}

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
                                        request.dateOfJoining
                                    }
                                />

                                <InfoRow
                                    label="Reporting Manager"
                                    value={
                                        request.reportingManager
                                    }
                                />

                            </div>

                        </div>

                        {/* Maternity Leave Information */}

                        <div className="rounded-lg border border-slate-200 bg-white">

                            <div className="border-b border-slate-200 px-4 py-3">

                                <h2 className="text-xs font-bold uppercase text-purple-700">
                                    Maternity Leave
                                    Information
                                </h2>

                            </div>

                            <div className="px-4 py-2">

                                <InfoRow
                                    label="Maternity Leave Entitlement"
                                    value={
                                        request.maternityLeaveEntitlement
                                    }
                                />

                                <InfoRow
                                    label="Leave Structure"
                                    value={
                                        request.leaveStructure
                                    }
                                />

                                <InfoRow
                                    label="Expected Delivery Date (EDD)"
                                    value={
                                        request.expectedDeliveryDate
                                    }
                                />

                                <InfoRow
                                    label="Maternity Leave Period"
                                    value={
                                        request.maternityLeavePeriod
                                    }
                                />

                            </div>

                            {/* Encashment section */}

                            <div className="mx-4 mb-3 rounded-md bg-purple-50 px-3 py-2">

                                <p className="text-[11px] font-bold uppercase text-purple-700">
                                    Encashment Request —
                                    {` ${request.requestPartLabel}`}
                                </p>

                            </div>

                            <div className="px-4 pb-3">

                                <InfoRow
                                    label="Encashment Days Requested"
                                    value={
                                        request.encashmentDaysRequested
                                    }
                                />

                                <InfoRow
                                    label="Encashment Rate"
                                    value={
                                        request.encashmentRate
                                    }
                                />

                                <InfoRow
                                    label="Encashment Amount (Est.)"
                                    value={
                                        request.encashmentAmount
                                    }
                                />

                                <InfoRow
                                    label="Remarks by Employee"
                                    value={
                                        request.remarksByEmployee
                                    }
                                />

                            </div>

                            {/* Note */}

                            <div className="mx-4 mb-4 flex items-start gap-2 rounded-md bg-amber-50 px-3 py-2">

                                <Info
                                    size={14}
                                    className="mt-0.5 shrink-0 text-amber-600"
                                />

                                <p className="text-[10px] leading-4 text-amber-800">

                                    <strong>
                                        Note:
                                    </strong>{" "}

                                    Part 2 (Post-Delivery
                                    – 64 Days) can be
                                    requested after
                                    delivery.

                                </p>

                            </div>

                        </div>

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
                                    {
                                        request
                                            .attachments
                                            ?.length
                                    }{" "}
                                    attachments
                                    uploaded
                                </p>

                            </div>

                            <div className="divide-y divide-slate-100 px-4">

                                {request.attachments?.map(
                                    (
                                        attachment,
                                    ) => (
                                        <div
                                            key={
                                                attachment.id
                                            }
                                            className="flex items-center justify-between gap-3 py-3"
                                        >

                                            <div className="flex min-w-0 items-center gap-3">

                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-red-50 text-red-500">
                                                    <FileText
                                                        size={
                                                            17
                                                        }
                                                    />
                                                </div>

                                                <div className="min-w-0">

                                                    <p className="truncate text-xs font-semibold text-slate-800">
                                                        {
                                                            attachment.fileName
                                                        }
                                                    </p>

                                                    <p className="text-[10px] text-slate-500">
                                                        Uploaded
                                                        on{" "}
                                                        {
                                                            attachment.uploadedOn
                                                        }
                                                    </p>

                                                    <p className="text-[10px] text-slate-500">
                                                        {
                                                            attachment.fileSize
                                                        }
                                                    </p>

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
                                                    size={
                                                        15
                                                    }
                                                />
                                            </button>

                                        </div>
                                    ),
                                )}

                            </div>

                        </div>

                    </div>

                    {/* ==========================================================
                        RIGHT SIDE - ACTIONS
                    ========================================================== */}

                    <div>

                        <div className="sticky top-4 rounded-lg border border-slate-200 bg-white">

                            {/* Actions */}

                            <div className="border-b border-slate-200 px-4 py-3">

                                <h2 className="text-xs font-bold uppercase text-slate-800">
                                    Actions
                                </h2>

                                <p className="mt-1 text-[10px] text-slate-500">
                                    Review the request
                                    and take
                                    appropriate
                                    action.
                                </p>

                            </div>

                            <div className="space-y-2 p-4">

                                {/* Forward */}

                                <button
                                    type="button"
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
                                        bg-white
                                        px-3
                                        py-3
                                        text-left
                                        transition
                                        hover:bg-green-50
                                    "
                                >

                                    <CheckCircle2
                                        size={19}
                                        className="shrink-0 text-green-600"
                                    />

                                    <div>
                                        <p className="text-xs font-bold text-green-700">
                                            Forward to HR
                                            Manager
                                        </p>

                                        <p className="mt-0.5 text-[10px] text-slate-500">
                                            Forward request
                                            to next higher
                                            authority.
                                        </p>
                                    </div>

                                </button>

                                {/* Reject */}

                                <button
                                    type="button"
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
                                        bg-white
                                        px-3
                                        py-3
                                        text-left
                                        transition
                                        hover:bg-red-50
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
                                            Reject and
                                            inform
                                            employee.
                                        </p>
                                    </div>

                                </button>

                                {/* More Information */}

                                <button
                                    type="button"
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
                                        bg-white
                                        px-3
                                        py-3
                                        text-left
                                        transition
                                        hover:bg-blue-50
                                    "
                                >

                                    <MessageSquare
                                        size={19}
                                        className="shrink-0 text-blue-600"
                                    />

                                    <div>
                                        <p className="text-xs font-bold text-blue-600">
                                            Request More
                                            Information
                                        </p>

                                        <p className="mt-0.5 text-[10px] text-slate-500">
                                            Ask for
                                            additional
                                            information
                                            from
                                            employee.
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
                                        setRemarks(
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    maxLength={500}
                                    rows={4}
                                    placeholder="Enter remarks (visible to next authority)..."
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
                                    "
                                />

                                <p className="mt-1 text-[9px] text-slate-400">
                                    {remarks.length}/500
                                    characters
                                </p>

                            </div>

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
                                                This is
                                                Part 1
                                                (Pre-Delivery)
                                                encashment
                                                request.
                                            </li>

                                            <li>
                                                After
                                                delivery,
                                                employee
                                                can request
                                                Part 2
                                                (Post-Delivery
                                                – 64 Days).
                                            </li>

                                            <li>
                                                Encashment
                                                amount will
                                                be paid with
                                                salary as
                                                per Payroll
                                                schedule.
                                            </li>

                                        </ul>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ==============================================================
                    PREVIOUS / NEXT REQUEST
                ============================================================== */}

                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">

                    <button
                        type="button"
                        disabled={!previousRequest}
                        onClick={() => {
                            if (
                                previousRequest
                            ) {
                                navigateToRequest(
                                    previousRequest,
                                );
                            }
                        }}
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-md
                            border
                            border-blue-200
                            bg-white
                            px-4
                            py-2
                            text-xs
                            font-semibold
                            text-blue-600
                            transition
                            hover:bg-blue-50
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >

                        <ArrowLeft size={14} />

                        Previous Request

                    </button>

                    {/* Request Counter */}

                    <div className="text-center">

                        <p className="text-xs font-semibold text-slate-700">
                            Request{" "}
                            {currentIndex + 1} of{" "}
                            {MATERNITY_REQUESTS.length}
                        </p>

                    </div>

                    <button
                        type="button"
                        disabled={!nextRequest}
                        onClick={() => {
                            if (nextRequest) {
                                navigateToRequest(
                                    nextRequest,
                                );
                            }
                        }}
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-md
                            border
                            border-blue-200
                            bg-white
                            px-4
                            py-2
                            text-xs
                            font-semibold
                            text-blue-600
                            transition
                            hover:bg-blue-50
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >

                        Next Request

                        <ArrowRight size={14} />

                    </button>

                </div>

            </div>
        );
    };

export default MaternityLeaveEncashmentDetails;