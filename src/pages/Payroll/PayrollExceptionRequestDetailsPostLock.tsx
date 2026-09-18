import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  CalendarDays,
  Clock3,
  Download,
  FileImage,
  MessageSquare,
  Paperclip,
  UserRound,
  UsersRound,
  XCircle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

type PostLockRequest = {
  requestId: string;

  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  reportingManager: string;

  adjustmentDate: string;
  shift: string;

  adjustmentType: string;
  adjustmentNature: string;
  originalOutPunch: string;
  correctedOutPunch: string;
  otApplicable: string;
  otType: string;
  otHours: string;
  otRate: string;
  impactOnPayroll: string;

  reasonProvided: string;
  remarksByAttendanceCell: string;

  status: "Pending" | "Forwarded" | "Rejected";
  forwardedBy: string;
  forwardedOn: string;

  attachment?: {
    fileName: string;
    uploadedOn: string;
    size: string;
  };
};

/* -------------------------------------------------------------------------- */
/* MOCK DATA                                                                  */
/* -------------------------------------------------------------------------- */

const mockPostLockRequests: PostLockRequest[] = [
  {
    requestId: "PAY2505012",
    employeeId: "102346",
    employeeName: "Md. Rahman",
    department: "Spinning",
    designation: "Mechanic",
    dateOfJoining: "10-Jan-2020",
    reportingManager: "Abul Kashem (10075)",

    adjustmentDate: "10-May-2025",
    shift: "Day Shift",
    adjustmentType: "Post-Lock Correction",
    adjustmentNature: "Out Punch Missing",
    originalOutPunch: "-",
    correctedOutPunch: "10:00 PM",
    otApplicable: "Yes",
    otType: "Overtime",
    otHours: "02:00",
    otRate: "1.50x",
    impactOnPayroll: "Yes",

    reasonProvided:
      "Forgot to punch out due to urgent breakdown.",
    remarksByAttendanceCell:
      "Verified through job card and supervisor confirmation.",

    status: "Pending",
    forwardedBy: "Attendance Cell",
    forwardedOn: "15-May-2025 11:25 AM",

    attachment: {
      fileName: "JobCard_102346_20250510.jpg",
      uploadedOn: "15-May-2025 11:20 AM",
      size: "198 KB",
    },
  },

  {
    requestId: "PAY2505013",
    employeeId: "102512",
    employeeName: "Jannatul Ferdous",
    department: "Weaving",
    designation: "Senior Operator",
    dateOfJoining: "15-Feb-2021",
    reportingManager: "Abdul Karim (10021)",

    adjustmentDate: "08-May-2025",
    shift: "A Shift (06:00 AM - 02:00 PM)",
    adjustmentType: "Post-Lock OT Addition",
    adjustmentNature: "Overtime Missing",
    originalOutPunch: "02:00 PM",
    correctedOutPunch: "04:00 PM",
    otApplicable: "Yes",
    otType: "Overtime",
    otHours: "02:00",
    otRate: "1.50x",
    impactOnPayroll: "Yes",

    reasonProvided:
      "Employee worked additional hours due to production requirement.",
    remarksByAttendanceCell:
      "Confirmed with production supervisor and duty roster.",

    status: "Pending",
    forwardedBy: "Attendance Cell",
    forwardedOn: "15-May-2025 11:30 AM",

    attachment: {
      fileName: "DutyRoster_102512_20250508.jpg",
      uploadedOn: "15-May-2025 11:25 AM",
      size: "245 KB",
    },
  },

  {
    requestId: "PAY2505014",
    employeeId: "102789",
    employeeName: "Kamrul Hasan",
    department: "Maintenance",
    designation: "Technician",
    dateOfJoining: "22-Jul-2019",
    reportingManager: "Mohammad Ali (10031)",

    adjustmentDate: "07-May-2025",
    shift: "C Shift (10:00 PM - 06:00 AM)",
    adjustmentType: "Post-Lock Correction",
    adjustmentNature: "Wrong Out Punch",
    originalOutPunch: "05:00 AM",
    correctedOutPunch: "06:00 AM",
    otApplicable: "No",
    otType: "-",
    otHours: "00:00",
    otRate: "-",
    impactOnPayroll: "No",

    reasonProvided:
      "Biometric device recorded an incorrect punch time.",
    remarksByAttendanceCell:
      "Verified against machine log and supervisor confirmation.",

    status: "Pending",
    forwardedBy: "Attendance Cell",
    forwardedOn: "15-May-2025 11:35 AM",

    attachment: {
      fileName: "BiometricLog_102789.pdf",
      uploadedOn: "15-May-2025 11:30 AM",
      size: "156 KB",
    },
  },

  {
    requestId: "PAY2505015",
    employeeId: "103045",
    employeeName: "Akter Hossain",
    department: "Finishing",
    designation: "Operator",
    dateOfJoining: "05-Mar-2022",
    reportingManager: "Nasir Uddin (10041)",

    adjustmentDate: "06-May-2025",
    shift: "A Shift (06:00 AM - 02:00 PM)",
    adjustmentType: "Post-Lock Leave Adjustment",
    adjustmentNature: "Attendance Correction",
    originalOutPunch: "-",
    correctedOutPunch: "-",
    otApplicable: "No",
    otType: "-",
    otHours: "00:00",
    otRate: "-",
    impactOnPayroll: "Yes",

    reasonProvided:
      "Attendance was incorrectly marked absent.",
    remarksByAttendanceCell:
      "Verified against approved leave record.",

    status: "Pending",
    forwardedBy: "Attendance Cell",
    forwardedOn: "15-May-2025 11:40 AM",

    attachment: {
      fileName: "ApprovedLeave_103045.pdf",
      uploadedOn: "15-May-2025 11:35 AM",
      size: "122 KB",
    },
  },

  {
    requestId: "PAY2505016",
    employeeId: "101223",
    employeeName: "Rasheda Akter",
    department: "Cutting",
    designation: "Operator",
    dateOfJoining: "12-Nov-2018",
    reportingManager: "Mizanur Rahman (10012)",

    adjustmentDate: "05-May-2025",
    shift: "B Shift (02:00 PM - 10:00 PM)",
    adjustmentType: "Post-Lock OT Addition",
    adjustmentNature: "Additional Overtime",
    originalOutPunch: "10:00 PM",
    correctedOutPunch: "12:00 AM",
    otApplicable: "Yes",
    otType: "Overtime",
    otHours: "02:00",
    otRate: "1.50x",
    impactOnPayroll: "Yes",

    reasonProvided:
      "Emergency production requirement.",
    remarksByAttendanceCell:
      "Supervisor confirmed additional working hours.",

    status: "Forwarded",
    forwardedBy: "Attendance Cell",
    forwardedOn: "15-May-2025 11:45 AM",

    attachment: {
      fileName: "OTApproval_101223.jpg",
      uploadedOn: "15-May-2025 11:40 AM",
      size: "215 KB",
    },
  },
];

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

const PayrollExceptionRequestPostLockDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * The list page can navigate here with:
   *
   * navigate("/payroll-exception-requests-post-lock/details", {
   *   state: { requestId: row.requestId }
   * });
   *
   * We use that requestId to determine the initial position.
   */
  const requestIdFromState = (
    location.state as { requestId?: string } | null
  )?.requestId;

  const initialIndex = useMemo(() => {
    if (!requestIdFromState) return 0;

    const index = mockPostLockRequests.findIndex(
      (request) =>
        request.requestId === requestIdFromState
    );

    return index >= 0 ? index : 0;
  }, [requestIdFromState]);

  const [currentIndex, setCurrentIndex] =
    useState(initialIndex);

  const [remarks, setRemarks] = useState("");

  const request =
    mockPostLockRequests[currentIndex];

  const totalRequests =
    mockPostLockRequests.length;

  const isFirstRequest = currentIndex === 0;
  const isLastRequest =
    currentIndex === totalRequests - 1;

  /* ------------------------------------------------------------------------ */
  /* NAVIGATION                                                               */
  /* ------------------------------------------------------------------------ */

  const handlePrevious = () => {
    if (isFirstRequest) return;

    setCurrentIndex((prev) => prev - 1);
    setRemarks("");
  };

  const handleNext = () => {
    if (isLastRequest) return;

    setCurrentIndex((prev) => prev + 1);
    setRemarks("");
  };

  const handleBack = () => {
    navigate("/payroll-and-workforce-movement/attendance-cell/exception-request/payroll-adjustment");
  };

  /* ------------------------------------------------------------------------ */
  /* ACTIONS                                                                  */
  /* ------------------------------------------------------------------------ */

  const handleForward = () => {
    console.log("Forward to Head Office IT", {
      requestId: request.requestId,
      remarks,
    });

    alert(
      `Request ${request.requestId} forwarded to Head Office IT`
    );
  };

  const handleReject = () => {
    console.log("Reject Request", {
      requestId: request.requestId,
      remarks,
    });

    alert(
      `Request ${request.requestId} rejected`
    );
  };

  const handleRequestInformation = () => {
    console.log("Request More Information", {
      requestId: request.requestId,
      remarks,
    });

    alert(
      `More information requested for ${request.requestId}`
    );
  };

  /* ------------------------------------------------------------------------ */
  /* UI                                                                       */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-white text-[#07185C]">
      {/* ------------------------------------------------------------------ */}
      {/* PAGE HEADER                                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className="mb-5">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          <ArrowLeft size={16} />
          Back to Payroll Exception Requests (Post-Lock)
        </button>
      </div>

      <div className="mb-5">
        <h1 className="text-xl font-bold text-[#07185C]">
          PAYROLL EXCEPTION REQUEST DETAILS (POST-LOCK)
        </h1>

        <p className="mt-1 text-sm text-[#1F2A5A]">
          Review full details of the post-lock payroll
          exception request and forward to Head Office IT
          if valid.
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SUMMARY CARD                                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className="mb-5 rounded-lg border border-blue-100 bg-white shadow-sm">
        <div className="grid grid-cols-1 divide-y divide-blue-100 md:grid-cols-5 md:divide-x md:divide-y-0">
          {/* Request ID */}
          <SummaryItem
            icon={
              <AlertTriangle
                size={22}
                className="text-orange-500"
              />
            }
            label="Request ID"
            value={request.requestId}
          />

          {/* Employee */}
          <SummaryItem
            icon={
              <UsersRound
                size={22}
                className="text-orange-500"
              />
            }
            label="Employee"
            value={`${request.employeeName} (${request.employeeId})`}
            secondary={request.department}
          />

          {/* Adjustment Date */}
          <SummaryItem
            icon={
              <CalendarDays
                size={22}
                className="text-red-500"
              />
            }
            label="Adjustment Date"
            value={request.adjustmentDate}
            secondary={`(${request.shift})`}
          />

          {/* Status */}
          <SummaryItem
            icon={
              <Clock3
                size={22}
                className="text-orange-500"
              />
            }
            label="Status"
            value={
              <StatusBadge status={request.status} />
            }
          />

          {/* Forwarded By */}
          <SummaryItem
            icon={
              <UserRound
                size={22}
                className="text-green-600"
              />
            }
            label="Forwarded By"
            value={request.forwardedBy}
            secondary={request.forwardedOn}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN CONTENT                                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.8fr)_minmax(350px,1fr)]">
        {/* ================================================================ */}
        {/* LEFT COLUMN                                                       */}
        {/* ================================================================ */}

        <div>
          {/* -------------------------------------------------------------- */}
          {/* EMPLOYEE + ADJUSTMENT INFORMATION                              */}
          {/* -------------------------------------------------------------- */}

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.2fr]">
            {/* Employee Information */}
            <InfoCard title="EMPLOYEE INFORMATION">
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
                value={request.designation}
              />

              <InfoRow
                label="Date of Joining"
                value={request.dateOfJoining}
              />

              <InfoRow
                label="Reporting Manager"
                value={request.reportingManager}
              />
            </InfoCard>

            {/* Adjustment Information */}
            <InfoCard title="ADJUSTMENT INFORMATION">
              <InfoRow
                label="Adjustment Type"
                value={request.adjustmentType}
              />

              <InfoRow
                label="Adjustment Nature"
                value={request.adjustmentNature}
              />

              <InfoRow
                label="Original Out Punch"
                value={request.originalOutPunch}
              />

              <InfoRow
                label="Corrected Out Punch"
                value={request.correctedOutPunch}
              />

              <InfoRow
                label="OT Applicable"
                value={request.otApplicable}
              />

              <InfoRow
                label="OT Type"
                value={request.otType}
              />

              <InfoRow
                label="OT Hours"
                value={request.otHours}
              />

              <InfoRow
                label="OT Rate"
                value={request.otRate}
              />

              <InfoRow
                label="Impact on Payroll"
                value={request.impactOnPayroll}
              />

              <InfoRow
                label="Reason Provided"
                value={request.reasonProvided}
              />

              <InfoRow
                label="Remarks by Attendance Cell"
                value={request.remarksByAttendanceCell}
              />
            </InfoCard>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* ATTACHMENTS                                                      */}
          {/* -------------------------------------------------------------- */}

          <div className="mt-5 rounded-lg border border-blue-100 bg-white">
            <div className="border-b border-blue-100 px-4 py-4">
              <div className="flex items-center gap-2">
                <Paperclip
                  size={17}
                  className="text-blue-700"
                />

                <h2 className="text-sm font-bold text-blue-800">
                  ATTACHMENTS
                </h2>
              </div>

              <p className="mt-1 pl-6 text-xs text-gray-600">
                {request.attachment
                  ? "1 attachment uploaded"
                  : "No attachments uploaded"}
              </p>
            </div>

            {request.attachment && (
              <div className="m-4 flex items-center justify-between rounded-md border border-gray-200 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50">
                    <FileImage
                      size={18}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#17245B]">
                      {request.attachment.fileName}
                    </p>

                    <p className="text-xs text-gray-600">
                      Uploaded on{" "}
                      {request.attachment.uploadedOn}
                    </p>

                    <p className="text-xs text-gray-600">
                      {request.attachment.size}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-blue-200 text-blue-700 hover:bg-blue-50"
                  title="Download attachment"
                  onClick={() =>
                    console.log(
                      "Download",
                      request.attachment?.fileName
                    )
                  }
                >
                  <Download size={17} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================================================================ */}
        {/* RIGHT COLUMN                                                      */}
        {/* ================================================================ */}

        <div>
          {/* -------------------------------------------------------------- */}
          {/* ACTIONS                                                         */}
          {/* -------------------------------------------------------------- */}

          <div className="rounded-lg border border-blue-100 bg-white">
            <div className="border-b border-blue-100 px-4 py-4">
              <h2 className="text-sm font-bold text-blue-800">
                ACTIONS
              </h2>

              <p className="mt-1 text-xs text-gray-600">
                Review and take appropriate action.
              </p>
            </div>

            <div className="space-y-3 p-4">
              {/* Forward */}
              <button
                type="button"
                onClick={handleForward}
                disabled={request.status !== "Pending"}
                className="flex w-full items-center gap-3 rounded-md border border-green-300 bg-white px-4 py-3 text-left transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle2
                  size={21}
                  className="shrink-0 text-green-600"
                />

                <div>
                  <p className="text-sm font-bold text-green-700">
                    Forward to Head Office IT
                  </p>

                  <p className="text-xs text-gray-600">
                    Forward post-lock adjustment to HO IT
                    for payroll.
                  </p>
                </div>
              </button>

              {/* Reject */}
              <button
                type="button"
                onClick={handleReject}
                disabled={request.status !== "Pending"}
                className="flex w-full items-center gap-3 rounded-md border border-red-300 bg-white px-4 py-3 text-left transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <XCircle
                  size={21}
                  className="shrink-0 text-red-600"
                />

                <div>
                  <p className="text-sm font-bold text-red-600">
                    Reject Request
                  </p>

                  <p className="text-xs text-gray-600">
                    Reject and inform Attendance Cell.
                  </p>
                </div>
              </button>

              {/* More Information */}
              <button
                type="button"
                onClick={handleRequestInformation}
                disabled={request.status !== "Pending"}
                className="flex w-full items-center gap-3 rounded-md border border-indigo-300 bg-white px-4 py-3 text-left transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <MessageSquare
                  size={21}
                  className="shrink-0 text-indigo-600"
                />

                <div>
                  <p className="text-sm font-bold text-indigo-600">
                    Request More Information
                  </p>

                  <p className="text-xs text-gray-600">
                    Ask for additional information.
                  </p>
                </div>
              </button>
            </div>

            {/* Remarks */}
            <div className="px-4 pb-4">
              <label className="mb-1 block text-sm font-bold text-blue-800">
                REMARKS
                <span className="ml-1 text-gray-500">
                  (Optional)
                </span>
              </label>

              <textarea
                value={remarks}
                onChange={(e) =>
                  setRemarks(e.target.value.slice(0, 500))
                }
                maxLength={500}
                rows={4}
                disabled={request.status !== "Pending"}
                placeholder="Enter remarks (visible to next authority)..."
                className="w-full resize-none rounded-md border border-gray-300 px-3 py-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
              />

              <div className="mt-1 text-right text-xs text-gray-500">
                {remarks.length}/500
              </div>
            </div>

            {/* Note */}
            <div className="mx-4 mb-4 rounded-md bg-blue-50 p-3">
              <div className="flex gap-2">
                <Info
                  size={15}
                  className="mt-0.5 shrink-0 text-blue-700"
                />

                <div className="text-xs text-[#17245B]">
                  <p className="font-bold">
                    Note:
                  </p>

                  <ul className="mt-1 list-disc space-y-1 pl-4">
                    <li>
                      Post-lock adjustments will be
                      applied in the next payroll cycle.
                    </li>

                    <li>
                      Ensure valid reason and proper
                      justification before forwarding.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* PREVIOUS / NEXT                                                     */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4">
        {/* Previous */}
        <button
          type="button"
          onClick={handlePrevious}
          disabled={isFirstRequest}
          className="flex items-center gap-2 rounded-md border border-blue-300 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
        >
          <ArrowLeft size={16} />
          Previous Request
        </button>

        {/* Counter */}
        <div className="text-sm font-semibold text-[#17245B]">
          Request {currentIndex + 1} of{" "}
          {totalRequests}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={handleNext}
          disabled={isLastRequest}
          className="flex items-center gap-2 rounded-md border border-blue-300 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
        >
          Next Request
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* REUSABLE COMPONENTS                                                        */
/* -------------------------------------------------------------------------- */

type SummaryItemProps = {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  secondary?: string;
};

const SummaryItem: React.FC<SummaryItemProps> = ({
  icon,
  label,
  value,
  secondary,
}) => {
  return (
    <div className="flex min-h-[95px] items-center gap-3 px-5 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-600">
          {label}
        </p>

        <div className="mt-1 text-sm font-bold text-[#17245B]">
          {value}
        </div>

        {secondary && (
          <p className="mt-1 text-xs font-medium text-[#17245B]">
            {secondary}
          </p>
        )}
      </div>
    </div>
  );
};

type InfoCardProps = {
  title: string;
  children: React.ReactNode;
};

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  children,
}) => {
  return (
    <div className="rounded-lg border border-blue-100 bg-white">
      <div className="border-b border-blue-100 px-4 py-4">
        <h2 className="text-sm font-bold text-blue-800">
          {title}
        </h2>
      </div>

      <div className="space-y-3 px-4 py-4">
        {children}
      </div>
    </div>
  );
};

type InfoRowProps = {
  label: string;
  value: React.ReactNode;
};

const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
}) => {
  return (
    <div className="grid grid-cols-[145px_minmax(0,1fr)] gap-3 text-sm">
      <span className="font-medium text-[#17245B]">
        {label}
      </span>

      <span className="font-semibold text-[#17245B]">
        {value}
      </span>
    </div>
  );
};

const StatusBadge: React.FC<{
  status: PostLockRequest["status"];
}> = ({ status }) => {
  const styles = {
    Pending:
      "bg-orange-50 text-orange-700 border-orange-200",
    Forwarded:
      "bg-green-50 text-green-700 border-green-200",
    Rejected:
      "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex rounded-md border px-2 py-1 text-xs font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
};

export default PayrollExceptionRequestPostLockDetails;