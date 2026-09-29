import React, { useState } from "react";
import {
  ArrowLeft,
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
import { useNavigate, useParams } from "react-router-dom";
import { API_ROUTES } from "../../api/routes";
import { useGet } from "../../hooks/useGet";
import { api } from "../../api/client";

type PostLockRequest = {
  requestId: string;
  status: "Pending" | "Forwarded" | "Rejected";
  adjustmentDate: string;
  shift: string;

  employee: {
    employeeId: string;
    employeeName: string;
    department: string;
    designation: string;
    dateOfJoining: string;
    reportingManager: string | null;
  };

  adjustment: {
    adjustmentType: string;
    adjustmentNature: string;
    originalOutPunch: string | null;
    correctedOutPunch: string | null;
    otApplicable: string | null;
    otType: string | null;
    otHours: string | null;
    otRate: string | null;
    impactOnPayroll: boolean;
    reasonProvided: string | null;
    remarksByAttendanceCell: string | null;
  };

  forwardedBy: {
    department: string;
    forwardedDateTime: string;
  };

  attachments: Array<{
    fileName?: string;
    uploadedOn?: string;
    size?: string;
    [key: string]: unknown;
  }>;
};

const PayrollExceptionRequestPostLockDetails: React.FC = () => {
  const navigate = useNavigate();
  const { requestId } = useParams();

  const [remarks, setRemarks] = useState("");

  const { data: response } = useGet({
    key: ["payroll_adjustment_request", requestId],
    url: `${API_ROUTES.PAYROLL_ADJUSTMENTS}/${requestId}`,
  });

  const request = response as PostLockRequest | undefined;

  /* -------------------------------------------------------------------------- */
  /* BACK                                                                        */
  /* -------------------------------------------------------------------------- */

  const handleBack = () => {
    navigate(
      "/payroll-and-workforce-movement/attendance-cell/exception-request/payroll-adjustment"
    );
  };

  /* -------------------------------------------------------------------------- */
  /* ACTIONS                                                                      */
  /* -------------------------------------------------------------------------- */
  const handleForward =async () => {
    if (!request) return;

    const payload = {
      requestId: request.requestId,
      remarks,
    };
    await api.put(`${API_ROUTES.PAYROLL_ADJUSTMENTS}/${requestId}/forward-to-it`, payload);
  };

  const handleReject = () => {
    if (!request) return;

    console.log("Reject Request", {
      requestId: request.requestId,
      remarks,
    });

    alert(`Request ${request.requestId} rejected`);
  };

  const handleRequestInformation = () => {
    if (!request) return;

    console.log("Request More Information", {
      requestId: request.requestId,
      remarks,
    });

    alert(`More information requested for ${request.requestId}`);
  };

  /* -------------------------------------------------------------------------- */
  /* LOADING                                                                      */
  /* -------------------------------------------------------------------------- */

  if (!request) {
    return (
      <div className="min-h-screen bg-white text-[#07185C]">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-gray-500">
            Loading request details...
          </p>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* UI                                                                           */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-white text-[#07185C]">

      {/* ---------------------------------------------------------------------- */}
      {/* PAGE HEADER                                                             */}
      {/* ---------------------------------------------------------------------- */}

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
          Review full details of the post-lock payroll exception request
          and forward to Head Office IT if valid.
        </p>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* SUMMARY CARD                                                            */}
      {/* ---------------------------------------------------------------------- */}

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
            value={`${request.employee.employeeName} (${request.employee.employeeId})`}
            secondary={request.employee.department}
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
            value={request.forwardedBy.department}
            secondary={request.forwardedBy.forwardedDateTime}
          />

        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* MAIN CONTENT                                                            */}
      {/* ---------------------------------------------------------------------- */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.8fr)_minmax(350px,1fr)]">

        {/* ==================================================================== */}
        {/* LEFT COLUMN                                                           */}
        {/* ==================================================================== */}

        <div>

          {/* ------------------------------------------------------------------ */}
          {/* EMPLOYEE + ADJUSTMENT INFORMATION                                  */}
          {/* ------------------------------------------------------------------ */}

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.2fr]">

            {/* Employee Information */}
            <InfoCard title="EMPLOYEE INFORMATION">

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
                value={request.employee.department}
              />

              <InfoRow
                label="Designation"
                value={request.employee.designation}
              />

              <InfoRow
                label="Date of Joining"
                value={request.employee.dateOfJoining}
              />

              <InfoRow
                label="Reporting Manager"
                value={request.employee.reportingManager ?? "-"}
              />

            </InfoCard>

            {/* Adjustment Information */}
            <InfoCard title="ADJUSTMENT INFORMATION">

              <InfoRow
                label="Adjustment Type"
                value={request.adjustment.adjustmentType}
              />

              <InfoRow
                label="Adjustment Nature"
                value={request.adjustment.adjustmentNature}
              />

              <InfoRow
                label="Original Out Punch"
                value={request.adjustment.originalOutPunch ?? "-"}
              />

              <InfoRow
                label="Corrected Out Punch"
                value={request.adjustment.correctedOutPunch ?? "-"}
              />

              <InfoRow
                label="OT Applicable"
                value={request.adjustment.otApplicable ?? "-"}
              />

              <InfoRow
                label="OT Type"
                value={request.adjustment.otType ?? "-"}
              />

              <InfoRow
                label="OT Hours"
                value={request.adjustment.otHours ?? "-"}
              />

              <InfoRow
                label="OT Rate"
                value={request.adjustment.otRate ?? "-"}
              />

              <InfoRow
                label="Impact on Payroll"
                value={
                  request.adjustment.impactOnPayroll
                    ? "Yes"
                    : "No"
                }
              />

              <InfoRow
                label="Reason Provided"
                value={
                  request.adjustment.reasonProvided ?? "-"
                }
              />

              <InfoRow
                label="Remarks by Attendance Cell"
                value={
                  request.adjustment.remarksByAttendanceCell ?? "-"
                }
              />

            </InfoCard>

          </div>

          {/* ------------------------------------------------------------------ */}
          {/* ATTACHMENTS                                                          */}
          {/* ------------------------------------------------------------------ */}

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
                {request.attachments?.length
                  ? `${request.attachments.length} attachment${
                      request.attachments.length > 1
                        ? "s"
                        : ""
                    } uploaded`
                  : "No attachments uploaded"}
              </p>

            </div>

            {request.attachments?.length > 0 && (
              <div className="space-y-3 p-4">

                {request.attachments.map(
                  (attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md border border-gray-200 px-4 py-3"
                    >

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50">
                          <FileImage
                            size={18}
                            className="text-blue-600"
                          />
                        </div>

                        <div>

                          <p className="text-sm font-semibold text-[#17245B]">
                            {attachment.fileName ??
                              `Attachment ${index + 1}`}
                          </p>

                          {attachment.uploadedOn && (
                            <p className="text-xs text-gray-600">
                              Uploaded on{" "}
                              {attachment.uploadedOn}
                            </p>
                          )}

                          {attachment.size && (
                            <p className="text-xs text-gray-600">
                              {attachment.size}
                            </p>
                          )}

                        </div>

                      </div>

                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-blue-200 text-blue-700 hover:bg-blue-50"
                        title="Download attachment"
                        onClick={() =>
                          console.log(
                            "Download attachment",
                            attachment
                          )
                        }
                      >
                        <Download size={17} />
                      </button>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

        </div>

        {/* ==================================================================== */}
        {/* RIGHT COLUMN                                                          */}
        {/* ==================================================================== */}

        <div>

          {/* ------------------------------------------------------------------ */}
          {/* ACTIONS                                                             */}
          {/* ------------------------------------------------------------------ */}

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

            {/* ---------------------------------------------------------------- */}
            {/* REMARKS                                                          */}
            {/* ---------------------------------------------------------------- */}

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
                  setRemarks(
                    e.target.value.slice(0, 500)
                  )
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

            {/* ---------------------------------------------------------------- */}
            {/* NOTE                                                              */}
            {/* ---------------------------------------------------------------- */}

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