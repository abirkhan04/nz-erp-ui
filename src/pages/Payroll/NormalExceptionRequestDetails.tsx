import React, { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  CircleX,
  Download,
  FileImage,
  MessageSquare,
  Paperclip,
  Users,
  UserRound,
  Clock3,
  UserCheck,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useGet } from "../../hooks/useGet";
import { usePost } from "../../hooks/usePost";
import { API_ROUTES } from "../../api/routes";
import { usePut } from "../../hooks/usePut";

interface Attachment {
  id: string;
  fileName: string;
  uploadedOn: string;
  fileSize: string;
  url?: string;
}

interface ExceptionRequest {
  requestId: string;
  status: string;
  exceptionDate: string;
  shift: string;

  employee: {
    employeeId: string;
    employeeName: string;
    department: string | null;
    designation: string | null;
    dateOfJoining: string | null;
    reportingManager: string | null;
  };

  workflow: {
    forwardedByDepartment: string | null;
    forwardedBySection: string | null;
    forwardedOn: string | null;
    currentStatus: string;
  };

  exceptionInformation: {
    exceptionType: string;
    exceptionDate: string;
    shiftName: string;
    shiftTime: string;
    scheduledInTime: string;
    actualInTime: string | null;
    scheduledOutTime: string;
    actualOutTime: string | null;
    reasonProvided: string | null;
    remarksByFloor: string | null;
  };

  attachments: Attachment[];
}

const ExceptionRequestDetails: React.FC = () => {
  const navigate = useNavigate();
  const { requestId } = useParams();

  const [remarks, setRemarks] = useState("");

  /*
   * ------------------------------------------------------------
   * GET EXCEPTION DETAILS
   * ------------------------------------------------------------
   */

  const {
    data: response,
    isLoading,
  } = useGet({
    key: ["attendance-exception-detail", requestId],
    url: `${API_ROUTES.ATTENDANCE_EXCEPTIONS}/${requestId}`,
    enabled: !!requestId,
  });

  /*
   * Backend may return either:
   *
   * {
   *   requestId: "...",
   *   ...
   * }
   *
   * or
   *
   * {
   *   data: {
   *     requestId: "...",
   *     ...
   *   }
   * }
   */

  const currentRequest: ExceptionRequest | undefined =
    response?.data ?? response;

  /*
   * ------------------------------------------------------------
   * ACTION API
   * ------------------------------------------------------------
   *
   * Payload:
   *
   * {
   *   requestId: "string",
   *   action: "string",
   *   remarks: "string"
   * }
   *
   * Change only this URL if your backend uses a different
   * action endpoint.
   */

  const {
    mutate: submitAction,
    isPending: actionPending,
  } = usePut(`${API_ROUTES.ATTENDANCE_EXCEPTIONS}/action`);

  /*
   * ------------------------------------------------------------
   * ACTION HANDLER
   * ------------------------------------------------------------
   */

  const handleAction = (action: string) => {
    if (!currentRequest) {
      return;
    }

    const payload = {
      requestId: currentRequest.requestId,
      action,
      remarks,
    };

    submitAction(payload);
  };

  const handleForward = () => {
    handleAction("FORWARD-TO-HR");
  };

  const handleReject = () => {
    handleAction("REJECTED");
  };

  const handleMoreInformation = () => {
    handleAction("MORE_INFORMATION");
  };

  /*
   * ------------------------------------------------------------
   * LOADING
   * ------------------------------------------------------------
   */

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-sm font-semibold text-[#1247b8]">
          Loading exception request...
        </div>
      </div>
    );
  }

  /*
   * ------------------------------------------------------------
   * REQUEST NOT FOUND
   * ------------------------------------------------------------
   */

  if (!currentRequest) {
    return (
      <div className="min-h-screen bg-white p-8">
        <button
          type="button"
          onClick={() =>
            navigate("/attendance-cell/normal-exception-requests")
          }
          className="flex items-center gap-2 text-sm font-semibold text-[#0750df]"
        >
          <ArrowLeft size={16} />
          Back to Exception Requests
        </button>

        <div className="mt-10 rounded-lg border border-[#dce4f2] p-8 text-center">
          <CircleAlert className="mx-auto text-[#e76d00]" />

          <p className="mt-3 text-sm font-semibold">
            Exception request not found.
          </p>
        </div>
      </div>
    );
  }

  const employee = currentRequest.employee;
  const workflow = currentRequest.workflow;
  const information = currentRequest.exceptionInformation;

  /*
   * ------------------------------------------------------------
   * PAGE
   * ------------------------------------------------------------
   */

  return (
    <div className="min-h-screen bg-white text-[#101b4b]">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <header className="h-[59px] bg-[#082b87] px-5 text-white">
        <div className="flex h-full items-center justify-between">
          <div className="flex h-full items-center">
            {/* LOGO */}

            <div className="flex items-center gap-2 pr-5">
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded bg-white">
                <span className="text-[34px] font-bold leading-none text-[#163d91]">
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

            {/* TITLE */}

            <div className="pl-5">
              <div className="text-[13px] font-bold">
                PAYROLL &amp; WORKFORCE MOVEMENT SECTION – ATTENDANCE CELL
              </div>

              <div className="mt-1 text-[10px]">
                Dashboard
                <span className="mx-2">&gt;</span>
                Attendance Cell
                <span className="mx-2">&gt;</span>
                Exception Requests
                <span className="mx-2">&gt;</span>
                Request Details
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-4">
            <div className="flex h-[32px] items-center gap-2 rounded bg-white px-3 text-[10px] font-semibold text-[#17275c]">
              <CalendarDays size={15} />
              15 May 2025 | Thursday
            </div>

            <div className="flex items-center gap-2 border-l border-white/30 pl-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                <UserRound
                  size={19}
                  className="text-[#183e9b]"
                />
              </div>

              <div className="text-[8px] leading-[1.35]">
                <div className="font-bold">Nusrat Jahan</div>
                <div>Section Incharge</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================
          CONTENT
      ======================================================== */}

      <main className="px-6 pb-5 pt-4">
        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            navigate("/attendance-cell/normal-exception-requests")
          }
          className="mb-4 flex items-center gap-2 text-[10px] font-semibold text-[#0750df]"
        >
          <ArrowLeft size={14} />
          Back to Exception Requests
        </button>

        {/* TITLE */}

        <div className="mb-4">
          <h1 className="text-[15px] font-bold uppercase text-[#071d61]">
            EXCEPTION REQUEST DETAILS
          </h1>

          <p className="mt-1 text-[10px] font-medium text-[#27325b]">
            Review full details of the exception request and take the
            appropriate action.
          </p>
        </div>

        {/* ======================================================
            REQUEST SUMMARY
        ====================================================== */}

        <section className="rounded border border-[#dce4f2] bg-white">
          <div className="grid grid-cols-5 divide-x divide-[#e7ebf3]">
            {/* REQUEST ID */}

            <SummaryItem
              icon={<CircleAlert size={22} />}
              iconClass="bg-[#fff2e5] text-[#ff7800]"
              label="Request ID"
              value={currentRequest.requestId}
            />

            {/* EMPLOYEE */}

            <SummaryItem
              icon={<Users size={22} />}
              iconClass="bg-[#fff2e5] text-[#ff7800]"
              label="Employee"
              value={
                <>
                  <div>
                    {employee.employeeName} ({employee.employeeId})
                  </div>

                  {employee.department && (
                    <div className="mt-1 text-[9px] font-medium">
                      {employee.department}
                    </div>
                  )}
                </>
              }
            />

            {/* EXCEPTION DATE */}

            <SummaryItem
              icon={<CalendarDays size={22} />}
              iconClass="bg-[#fff0e7] text-[#ff4e30]"
              label="Exception Date"
              value={
                <>
                  <div>{currentRequest.exceptionDate}</div>

                  <div className="mt-1 text-[9px]">
                    ({currentRequest.shift})
                  </div>
                </>
              }
            />

            {/* STATUS */}

            <SummaryItem
              icon={<Clock3 size={22} />}
              iconClass="bg-[#fff1e2] text-[#ff7500]"
              label="Status"
              value={
                <StatusBadge status={currentRequest.status} />
              }
            />

            {/* FORWARDED */}

            <SummaryItem
              icon={<UserCheck size={22} />}
              iconClass="bg-[#eaf8f0] text-[#22945c]"
              label="Forwarded On"
              value={
                <>
                  <div>
                    {workflow.forwardedOn
                      ? new Date(
                          workflow.forwardedOn
                        ).toLocaleString()
                      : "-"}
                  </div>

                  {workflow.forwardedByDepartment && (
                    <div className="mt-1 text-[8px]">
                      {workflow.forwardedByDepartment}
                    </div>
                  )}
                </>
              }
            />
          </div>
        </section>

        {/* ======================================================
            DETAILS GRID
        ====================================================== */}

        <div className="mt-4 grid grid-cols-[285px_minmax(0,1fr)_360px] gap-4">
          {/* ====================================================
              EMPLOYEE INFORMATION
          ==================================================== */}

          <DetailCard title="EMPLOYEE INFORMATION">
            <DetailRow
              label="Employee ID"
              value={employee.employeeId}
            />

            <DetailRow
              label="Employee Name"
              value={employee.employeeName}
            />

            <DetailRow
              label="Department"
              value={employee.department || "-"}
            />

            <DetailRow
              label="Designation"
              value={employee.designation || "-"}
            />

            <DetailRow
              label="Date of Joining"
              value={employee.dateOfJoining || "-"}
            />

            <DetailRow
              label="Reporting Manager"
              value={employee.reportingManager || "-"}
            />
          </DetailCard>

          {/* ====================================================
              EXCEPTION INFORMATION
          ==================================================== */}

          <DetailCard title="EXCEPTION INFORMATION">
            <DetailRow
              label="Exception Type"
              value={information.exceptionType}
            />

            <DetailRow
              label="Date"
              value={information.exceptionDate}
            />

            <DetailRow
              label="Shift"
              value={information.shiftName}
            />

            <DetailRow
              label="Shift Time"
              value={information.shiftTime}
            />

            <DetailRow
              label="In Time (Scheduled)"
              value={information.scheduledInTime}
            />

            <DetailRow
              label="In Time (Actual)"
              value={information.actualInTime || "-"}
            />

            <DetailRow
              label="Out Time (Scheduled)"
              value={information.scheduledOutTime}
            />

            <DetailRow
              label="Out Time (Actual)"
              value={information.actualOutTime || "-"}
            />

            <DetailRow
              label="Reason Provided"
              value={information.reasonProvided || "-"}
            />

            <DetailRow
              label="Remarks by Floor"
              value={information.remarksByFloor || "-"}
            />
          </DetailCard>

          {/* ====================================================
              ACTIONS
          ==================================================== */}

          <section className="rounded border border-[#dce4f2] bg-white">
            <div className="border-b border-[#e4e9f2] px-3 py-3">
              <h2 className="text-[10px] font-bold uppercase text-[#112b70]">
                ACTIONS
              </h2>

              <p className="mt-1 text-[8px]">
                Review and take appropriate action.
              </p>
            </div>

            <div className="space-y-2 p-3">
              {/* FORWARD */}

              <ActionButton
                icon={<CheckCircle2 size={17} />}
                title="Forward to IT"
                subtitle="Forward exception to IT department."
                className="border-[#aee3ca] text-[#159151] hover:bg-[#f0fbf5]"
                onClick={handleForward}
                disabled={actionPending}
              />

              {/* REJECT */}

              <ActionButton
                icon={<CircleX size={17} />}
                title="Reject Request"
                subtitle="Reject and inform Production Floor."
                className="border-[#ffb8b8] text-[#ef3737] hover:bg-[#fff5f5]"
                onClick={handleReject}
                disabled={actionPending}
              />

              {/* MORE INFORMATION */}

              <ActionButton
                icon={<MessageSquare size={17} />}
                title="Request More Information"
                subtitle="Ask for additional information."
                className="border-[#b6c7ff] text-[#1552df] hover:bg-[#f4f7ff]"
                onClick={handleMoreInformation}
                disabled={actionPending}
              />
            </div>

            {/* REMARKS */}

            <div className="px-3 pb-3">
              <label className="text-[10px] font-bold uppercase text-[#112b70]">
                REMARKS{" "}
                <span className="font-medium normal-case">
                  (Optional)
                </span>
              </label>

              <textarea
                value={remarks}
                onChange={(e) =>
                  setRemarks(e.target.value.slice(0, 500))
                }
                placeholder="Enter remarks (visible to next authority)..."
                className="mt-2 h-[43px] w-full resize-none rounded border border-[#d6deeb] p-2 text-[8px] outline-none focus:border-[#3f70df]"
              />

              <div className="mt-1 text-[7px] text-[#7c88a4]">
                {remarks.length}/500 characters
              </div>

              {/* NOTE */}

              <div className="mt-3 rounded bg-[#f4f7fd] p-3">
                <div className="flex gap-2">
                  <CircleAlert
                    size={13}
                    className="mt-0.5 shrink-0 text-[#0751df]"
                  />

                  <div>
                    <div className="text-[8px] font-bold text-[#112b70]">
                      Note:
                    </div>

                    <ul className="mt-2 list-disc space-y-1 pl-3 text-[7px] leading-[1.5] text-[#27355e]">
                      <li>
                        All approved exceptions will be reflected
                        in attendance after IT verification.
                      </li>

                      <li>
                        Ensure valid reason and proper justification
                        before forwarding.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ======================================================
            ATTACHMENTS
        ====================================================== */}

        <section className="mt-4 w-[calc(100%-376px)] rounded border border-[#dce4f2] bg-white">
          <div className="border-b border-[#e4e9f2] px-3 py-3">
            <div className="flex items-center gap-2">
              <Paperclip size={13} className="text-[#263ed3]" />

              <h2 className="text-[10px] font-bold uppercase text-[#112b70]">
                ATTACHMENTS
              </h2>
            </div>

            <div className="mt-1 text-[8px]">
              {currentRequest.attachments?.length || 0} attachment
              {currentRequest.attachments?.length !== 1 ? "s" : ""}{" "}
              uploaded
            </div>
          </div>

          <div className="p-3">
            {currentRequest.attachments?.length ? (
              currentRequest.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center rounded border border-[#e1e7f1] px-3 py-2"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded bg-[#edf3ff]">
                    <FileImage
                      size={15}
                      className="text-[#1451df]"
                    />
                  </div>

                  <div className="ml-3">
                    <div className="text-[9px] font-bold text-[#162653]">
                      {attachment.fileName}
                    </div>

                    <div className="mt-1 text-[7px] text-[#526084]">
                      Uploaded on {attachment.uploadedOn}
                    </div>

                    <div className="text-[7px] text-[#526084]">
                      {attachment.fileSize}
                    </div>
                  </div>

                  {attachment.url && (
                    <button
                      type="button"
                      onClick={() =>
                        window.open(
                          attachment.url,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                      className="ml-auto flex h-7 w-7 items-center justify-center rounded border border-[#cbd8f0] text-[#1551dc] hover:bg-[#f4f7ff]"
                    >
                      <Download size={13} />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-[8px] text-[#7c88a4]">
                No attachments uploaded.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

/* ================================================================
   SUMMARY ITEM
================================================================ */

interface SummaryItemProps {
  icon: React.ReactNode;
  iconClass: string;
  label: string;
  value: React.ReactNode;
}

const SummaryItem: React.FC<SummaryItemProps> = ({
  icon,
  iconClass,
  label,
  value,
}) => {
  return (
    <div className="flex min-h-[76px] items-center gap-3 px-4">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconClass}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <div className="text-[8px] font-medium text-[#4b5675]">
          {label}
        </div>

        <div className="mt-1 text-[9px] font-bold text-[#172453]">
          {value}
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   DETAIL CARD
================================================================ */

const DetailCard: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <section className="rounded border border-[#dce4f2] bg-white">
      <div className="border-b border-[#e4e9f2] px-3 py-3">
        <h2 className="text-[10px] font-bold uppercase text-[#102b71]">
          {title}
        </h2>
      </div>

      <div className="px-3 py-2">{children}</div>
    </section>
  );
};

/* ================================================================
   DETAIL ROW
================================================================ */

const DetailRow: React.FC<{
  label: string;
  value: React.ReactNode;
}> = ({ label, value }) => {
  return (
    <div className="grid grid-cols-[48%_52%] py-1 text-[8px]">
      <div className="font-medium text-[#27345b]">
        {label}
      </div>

      <div className="font-bold text-[#162453]">
        {value}
      </div>
    </div>
  );
};

/* ================================================================
   STATUS
================================================================ */

const StatusBadge: React.FC<{
  status: string;
}> = ({ status }) => {
  const normalizedStatus = status
    ?.toUpperCase()
    .replace(/_/g, " ");

  const classes: Record<string, string> = {
    PENDING: "bg-[#fff0dd] text-[#d95e00]",
    FORWARDED: "bg-[#e7f7ee] text-[#15804e]",
    REJECTED: "bg-[#ffe9eb] text-[#d53548]",
    "MORE INFORMATION": "bg-[#edf2ff] text-[#1851d6]",
  };

  return (
    <span
      className={`rounded px-2 py-1 text-[8px] font-bold ${
        classes[normalizedStatus] ||
        "bg-[#edf2ff] text-[#1851d6]"
      }`}
    >
      {normalizedStatus || status}
    </span>
  );
};

/* ================================================================
   ACTION BUTTON
================================================================ */

interface ActionButtonProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  className: string;
  onClick: () => void;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  title,
  subtitle,
  className,
  onClick,
  disabled,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex min-h-[39px] w-full items-center gap-3 rounded border px-3 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      <div className="shrink-0">{icon}</div>

      <div>
        <div className="text-[9px] font-bold">
          {title}
        </div>

        <div className="mt-0.5 text-[7px] font-medium text-[#354263]">
          {subtitle}
        </div>
      </div>
    </button>
  );
};

export default ExceptionRequestDetails;
