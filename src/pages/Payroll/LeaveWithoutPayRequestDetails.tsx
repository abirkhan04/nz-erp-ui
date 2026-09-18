import React, { useMemo, useState } from "react";
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
  UserRound,
  XCircle,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  mockRequests,
  type LeaveWithoutPayRequest,
} from "./LeaveWithoutPayRequest";

type LocationState = {
  requestId?: string;
};

const LeaveWithoutPayRequestsDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;

  const initialRequestId =
    state?.requestId || mockRequests[0]?.requestId;

  const [currentRequestId, setCurrentRequestId] =
    useState(initialRequestId);

  const [remarks, setRemarks] = useState("");

  /* -------------------------------------------------------------------------- */
  /* CURRENT REQUEST                                                            */
  /* -------------------------------------------------------------------------- */

  const currentIndex = useMemo(() => {
    return mockRequests.findIndex(
      (request) =>
        request.requestId === currentRequestId
    );
  }, [currentRequestId]);

  const currentRequest: LeaveWithoutPayRequest =
    mockRequests[
      currentIndex >= 0 ? currentIndex : 0
    ];

  if (!currentRequest) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">
          No leave without pay request found.
        </p>
      </div>
    );
  }

  const isFirstRequest = currentIndex <= 0;

  const isLastRequest =
    currentIndex >= mockRequests.length - 1;

  /* -------------------------------------------------------------------------- */
  /* PREVIOUS / NEXT                                                            */
  /* -------------------------------------------------------------------------- */

  const handlePrevious = () => {
    if (isFirstRequest) return;

    const previousRequest =
      mockRequests[currentIndex - 1];

    setCurrentRequestId(
      previousRequest.requestId
    );

    setRemarks("");
  };

  const handleNext = () => {
    if (isLastRequest) return;

    const nextRequest =
      mockRequests[currentIndex + 1];

    setCurrentRequestId(nextRequest.requestId);

    setRemarks("");
  };

  /* -------------------------------------------------------------------------- */
  /* BACK                                                                       */
  /* -------------------------------------------------------------------------- */

  const handleBack = () => {
    navigate("/leave-without-pay-requests");
  };

  /* -------------------------------------------------------------------------- */
  /* ACTIONS                                                                    */
  /* -------------------------------------------------------------------------- */

  const handleApprove = () => {
    console.log("Approve LWOP Request", {
      requestId: currentRequest.requestId,
      remarks,
    });

    alert(
      `Leave Without Pay request ${currentRequest.requestId} approved.`
    );
  };

  const handleReject = () => {
    console.log("Reject LWOP Request", {
      requestId: currentRequest.requestId,
      remarks,
    });

    alert(
      `Leave Without Pay request ${currentRequest.requestId} rejected.`
    );
  };

  const handleRequestInformation = () => {
    console.log(
      "Request More Information",
      {
        requestId: currentRequest.requestId,
        remarks,
      }
    );

    alert(
      `More information requested for ${currentRequest.requestId}.`
    );
  };

  /* -------------------------------------------------------------------------- */
  /* RENDER                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-white px-4 py-4 text-[#17245B]">
      {/* ====================================================================== */}
      {/* BACK                                                                    */}
      {/* ====================================================================== */}

      <button
        type="button"
        onClick={handleBack}
        className="mb-5 flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
      >
        <ArrowLeft size={16} />
        Back to Leave Without Pay Requests
      </button>

      {/* ====================================================================== */}
      {/* PAGE TITLE                                                               */}
      {/* ====================================================================== */}

      <div className="mb-4">
        <h1 className="text-xl font-bold text-[#07185C]">
          LEAVE WITHOUT PAY REQUEST DETAILS
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          Review full details of the leave without pay
          request and take appropriate action.
        </p>
      </div>

      {/* ====================================================================== */}
      {/* TOP SUMMARY                                                             */}
      {/* ====================================================================== */}

      <div className="mb-5 rounded-lg border border-blue-100 bg-white">
        <div className="grid grid-cols-1 divide-y divide-gray-100 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-5">
          {/* Request ID */}
          <TopSummaryItem
            icon={
              <FileText
                size={23}
                className="text-orange-500"
              />
            }
            label="Request ID"
            value={currentRequest.requestId}
          />

          {/* Employee */}
          <TopSummaryItem
            icon={
              <UserRound
                size={23}
                className="text-purple-600"
              />
            }
            label="Employee"
            value={`${currentRequest.employeeName} (${currentRequest.employeeId})`}
            secondaryValue={
              currentRequest.department
            }
          />

          {/* Applied On */}
          <TopSummaryItem
            icon={
              <CalendarDays
                size={23}
                className="text-green-600"
              />
            }
            label="Applied On"
            value={formatAppliedDate(
              currentRequest.appliedOn
            )}
            secondaryValue={formatAppliedTime(
              currentRequest.appliedOn
            )}
          />

          {/* Status */}
          <TopSummaryItem
            icon={
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50">
                <span className="h-3 w-3 rounded-full bg-orange-500" />
              </span>
            }
            label="Status"
            customValue={
              <StatusBadge
                status={currentRequest.status}
              />
            }
          />

          {/* Forwarded By */}
          <TopSummaryItem
            icon={
              <UserRound
                size={23}
                className="text-blue-600"
              />
            }
            label="Forwarded By"
            value={currentRequest.forwardedBy}
            secondaryValue={formatAppliedDate(
              currentRequest.appliedOn
            )}
          />
        </div>
      </div>

      {/* ====================================================================== */}
      {/* MAIN CONTENT                                                            */}
      {/* ====================================================================== */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        {/* ==================================================================== */}
        {/* LEFT SIDE                                                             */}
        {/* ==================================================================== */}

        <div className="space-y-5">
          {/* ------------------------------------------------------------------ */}
          {/* EMPLOYEE INFORMATION                                                */}
          {/* ------------------------------------------------------------------ */}

          <SectionCard title="EMPLOYEE INFORMATION">
            <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
              <InfoRow
                label="Employee ID"
                value={currentRequest.employeeId}
              />

              <InfoRow
                label="Employee Name"
                value={currentRequest.employeeName}
              />

              <InfoRow
                label="Department"
                value={currentRequest.department}
              />

              <InfoRow
                label="Designation"
                value={getDesignation(
                  currentRequest
                )}
              />

              <InfoRow
                label="Date of Joining"
                value={getJoiningDate(
                  currentRequest
                )}
              />

              <InfoRow
                label="Reporting Manager"
                value={getReportingManager(
                  currentRequest
                )}
              />
            </div>
          </SectionCard>

          {/* ------------------------------------------------------------------ */}
          {/* LWOP DETAILS                                                        */}
          {/* ------------------------------------------------------------------ */}

          <SectionCard title="LEAVE WITHOUT PAY DETAILS">
            <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
              <InfoRow
                label="Leave Without Pay Type"
                value={
                  currentRequest.leaveWithoutPayType
                }
              />

              <InfoRow
                label="Total Days"
                value={`${currentRequest.totalDays} ${
                  currentRequest.totalDays === 1
                    ? "Day"
                    : "Days"
                }`}
              />

              <InfoRow
                label="Leave From"
                value={currentRequest.leaveFrom}
              />

              <InfoRow
                label="Leave To"
                value={currentRequest.leaveTo}
              />

              <InfoRow
                label="Reason"
                value={currentRequest.reason}
                fullWidth
              />

              <InfoRow
                label="Contact During Leave"
                value={
                  currentRequest.contactDuringLeave
                }
              />

              <InfoRow
                label="Remarks by Employee"
                value={getEmployeeRemarks(
                  currentRequest
                )}
                fullWidth
              />
            </div>
          </SectionCard>

          {/* ------------------------------------------------------------------ */}
          {/* IMPORTANT INFORMATION                                               */}
          {/* ------------------------------------------------------------------ */}

          <div className="rounded-lg border border-blue-100 bg-blue-50/40">
            <div className="border-b border-blue-100 px-4 py-3">
              <h2 className="flex items-center gap-2 text-sm font-bold text-blue-800">
                <Info size={16} />
                IMPORTANT INFORMATION
              </h2>
            </div>

            <div className="px-5 py-4">
              <ul className="space-y-2 text-xs text-[#17245B]">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>
                    Leave Without Pay (LWOP) will not
                    be counted as paid leave.
                  </span>
                </li>

                <li className="flex gap-2">
                  <span>•</span>
                  <span>
                    No salary will be paid for the
                    approved LWOP days.
                  </span>
                </li>

                <li className="flex gap-2">
                  <span>•</span>
                  <span>
                    LWOP is applicable only when no
                    earned leave balance is available
                    or employee chooses unpaid leave.
                  </span>
                </li>

                <li className="flex gap-2">
                  <span>•</span>
                  <span>
                    Approved LWOP days will be reflected
                    in attendance and payroll.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* ATTACHMENTS                                                         */}
          {/* ------------------------------------------------------------------ */}

          <SectionCard
            title="ATTACHMENTS"
            icon={
              <Paperclip
                size={15}
                className="text-blue-600"
              />
            }
            subtitle="1 attachment uploaded"
          >
            <div className="flex items-center justify-between rounded-md border border-gray-100 bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-50">
                  <FileText
                    size={20}
                    className="text-red-500"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#17245B]">
                    Application_LWOP.pdf
                  </p>

                  <p className="mt-1 text-[11px] text-gray-500">
                    Uploaded on{" "}
                    {formatAppliedDate(
                      currentRequest.appliedOn
                    )}
                  </p>

                  <p className="text-[11px] text-gray-500">
                    156 KB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  console.log(
                    "Download attachment"
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-md border border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Download size={17} />
              </button>
            </div>
          </SectionCard>
        </div>

        {/* ==================================================================== */}
        {/* RIGHT SIDE                                                            */}
        {/* ==================================================================== */}

        <div>
          <div className="rounded-lg border border-blue-100 bg-white">
            {/* ---------------------------------------------------------------- */}
            {/* ACTIONS                                                           */}
            {/* ---------------------------------------------------------------- */}

            <div className="border-b border-blue-100 px-4 py-4">
              <h2 className="text-sm font-bold text-[#17245B]">
                ACTIONS
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Review the request and take appropriate
                action.
              </p>
            </div>

            <div className="space-y-3 px-4 py-4">
              {/* Approve */}
              <button
                type="button"
                onClick={handleApprove}
                disabled={
                  currentRequest.status !==
                  "Pending"
                }
                className="w-full rounded-md border border-green-300 bg-white px-4 py-3 text-left transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={21}
                    className="mt-0.5 shrink-0 text-green-600"
                  />

                  <div>
                    <p className="text-sm font-bold text-green-700">
                      Approve Leave Without Pay
                    </p>

                    <p className="mt-0.5 text-xs text-gray-600">
                      Approve and record LWOP.
                    </p>
                  </div>
                </div>
              </button>

              {/* Reject */}
              <button
                type="button"
                onClick={handleReject}
                disabled={
                  currentRequest.status !==
                  "Pending"
                }
                className="w-full rounded-md border border-red-300 bg-white px-4 py-3 text-left transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex items-start gap-3">
                  <XCircle
                    size={21}
                    className="mt-0.5 shrink-0 text-red-600"
                  />

                  <div>
                    <p className="text-sm font-bold text-red-600">
                      Reject Request
                    </p>

                    <p className="mt-0.5 text-xs text-gray-600">
                      Reject and inform employee.
                    </p>
                  </div>
                </div>
              </button>

              {/* Request More Information */}
              <button
                type="button"
                onClick={
                  handleRequestInformation
                }
                disabled={
                  currentRequest.status !==
                  "Pending"
                }
                className="w-full rounded-md border border-indigo-300 bg-white px-4 py-3 text-left transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex items-start gap-3">
                  <MessageSquare
                    size={21}
                    className="mt-0.5 shrink-0 text-indigo-600"
                  />

                  <div>
                    <p className="text-sm font-bold text-indigo-700">
                      Request More Information
                    </p>

                    <p className="mt-0.5 text-xs text-gray-600">
                      Ask for additional information
                      from employee.
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* REMARKS                                                          */}
            {/* ---------------------------------------------------------------- */}

            <div className="border-t border-blue-100 px-4 py-4">
              <label className="mb-1 block text-sm font-bold text-[#17245B]">
                REMARKS
                <span className="ml-1 font-normal text-gray-500">
                  (Optional)
                </span>
              </label>

              <textarea
                value={remarks}
                onChange={(event) =>
                  setRemarks(
                    event.target.value.slice(
                      0,
                      500
                    )
                  )
                }
                maxLength={500}
                rows={4}
                placeholder="Enter remarks (visible to next authority)..."
                className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

              <div className="mt-1 flex justify-end text-[11px] text-gray-500">
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
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <div>
                  <p className="text-xs font-bold text-blue-800">
                    Note:
                  </p>

                  <ul className="mt-1 space-y-1 text-[11px] text-gray-600">
                    <li>
                      • After approval, LWOP days will
                      be updated in attendance.
                    </li>

                    <li>
                      • Salary will be deducted for
                      the approved LWOP days as per
                      payroll policy.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* PREVIOUS / NEXT                                                        */}
      {/* ====================================================================== */}

      <div className="mt-5 flex items-center justify-between">
        <button
          type="button"
          disabled={isFirstRequest}
          onClick={handlePrevious}
          className="flex items-center gap-2 rounded-md border border-blue-200 bg-white px-5 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft size={16} />
          Previous Request
        </button>

        <div className="text-sm font-bold text-[#17245B]">
          Request {currentIndex + 1} of{" "}
          {mockRequests.length}
        </div>

        <button
          type="button"
          disabled={isLastRequest}
          onClick={handleNext}
          className="flex items-center gap-2 rounded-md border border-blue-200 bg-white px-5 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next Request
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* TOP SUMMARY ITEM                                                           */
/* ========================================================================== */

type TopSummaryItemProps = {
  icon: React.ReactNode;
  label: string;
  value?: string;
  secondaryValue?: string;
  customValue?: React.ReactNode;
};

const TopSummaryItem: React.FC<
  TopSummaryItemProps
> = ({
  icon,
  label,
  value,
  secondaryValue,
  customValue,
}) => {
  return (
    <div className="flex min-h-[95px] items-center gap-3 px-5 py-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-50">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500">
          {label}
        </p>

        {customValue ? (
          <div className="mt-1">
            {customValue}
          </div>
        ) : (
          <>
            <p className="mt-1 text-sm font-bold text-[#17245B]">
              {value}
            </p>

            {secondaryValue && (
              <p className="mt-0.5 text-xs font-medium text-[#17245B]">
                {secondaryValue}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/* ========================================================================== */
/* SECTION CARD                                                               */
/* ========================================================================== */

type SectionCardProps = {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  subtitle?: string;
};

const SectionCard: React.FC<
  SectionCardProps
> = ({
  title,
  children,
  icon,
  subtitle,
}) => {
  return (
    <div className="rounded-lg border border-blue-100 bg-white">
      <div className="border-b border-blue-100 px-4 py-3">
        <div className="flex items-center gap-2">
          {icon}

          <h2 className="text-sm font-bold text-[#17245B]">
            {title}
          </h2>
        </div>

        {subtitle && (
          <p className="mt-1 text-xs text-gray-500">
            {subtitle}
          </p>
        )}
      </div>

      <div className="px-4 py-3">
        {children}
      </div>
    </div>
  );
};

/* ========================================================================== */
/* INFO ROW                                                                   */
/* ========================================================================== */

type InfoRowProps = {
  label: string;
  value: string;
  fullWidth?: boolean;
};

const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  fullWidth = false,
}) => {
  return (
    <div
      className={`flex gap-4 border-b border-gray-100 py-2.5 ${
        fullWidth
          ? "md:col-span-2"
          : ""
      }`}
    >
      <span className="w-[130px] shrink-0 text-xs font-medium text-[#17245B]">
        {label}
      </span>

      <span className="text-xs font-semibold text-[#17245B]">
        {value || "-"}
      </span>
    </div>
  );
};

/* ========================================================================== */
/* STATUS BADGE                                                               */
/* ========================================================================== */

const StatusBadge: React.FC<{
  status: LeaveWithoutPayRequest["status"];
}> = ({ status }) => {
  const classes =
    status === "Pending"
      ? "border-orange-200 bg-orange-50 text-orange-700"
      : status === "Approved"
        ? "border-green-200 bg-green-50 text-green-700"
        : "border-red-200 bg-red-50 text-red-700";

  return (
    <span
      className={`inline-flex rounded-md border px-2.5 py-1 text-[11px] font-bold ${classes}`}
    >
      {status}
    </span>
  );
};

/* ========================================================================== */
/* HELPERS                                                                    */
/* ========================================================================== */

const formatAppliedDate = (
  value: string
): string => {
  if (!value) return "-";

  return value.split(" ")[0] || value;
};

const formatAppliedTime = (
  value: string
): string => {
  if (!value) return "";

  const parts = value.split(" ");

  if (parts.length >= 3) {
    return `${parts[1]} ${parts[2]}`;
  }

  return "";
};

/*
 * These helpers provide the additional employee information
 * visible on the details screen.
 *
 * When the real backend is connected, replace these with
 * properties coming from the backend response.
 */

const getDesignation = (
  request: LeaveWithoutPayRequest
): string => {
  const designations: Record<
    string,
    string
  > = {
    "10145": "Weaving Operator",
    "10234": "Mechanic",
    "10267": "Finishing Operator",
    "10312": "Quality Inspector",
    "103245": "Washing Operator",
    "103678": "Cutting Operator",
    "102913": "Dyeing Operator",
  };

  return (
    designations[request.employeeId] ||
    "Employee"
  );
};

const getJoiningDate = (
  request: LeaveWithoutPayRequest
): string => {
  const joiningDates: Record<
    string,
    string
  > = {
    "10145": "12-Feb-2021",
    "10234": "10-Jan-2020",
    "10267": "18-Mar-2021",
    "10312": "05-Jun-2022",
    "103245": "14-Aug-2020",
    "103678": "20-Jan-2022",
    "102913": "11-Nov-2019",
  };

  return (
    joiningDates[request.employeeId] ||
    "-"
  );
};

const getReportingManager = (
  request: LeaveWithoutPayRequest
): string => {
  const managers: Record<
    string,
    string
  > = {
    "10145": "Abdul Karim (10063)",
    "10234": "Abul Kashem (10075)",
    "10267": "Abdul Karim (10063)",
    "10312": "Shahana Begum (10091)",
    "103245": "Abdul Karim (10063)",
    "103678": "Abul Kashem (10075)",
    "102913": "Abdul Karim (10063)",
  };

  return (
    managers[request.employeeId] ||
    "-"
  );
};

const getEmployeeRemarks = (
  request: LeaveWithoutPayRequest
): string => {
  const remarks: Record<
    string,
    string
  > = {
    LWPR2505003:
      "Requesting leave without pay as I have no leave balance.",
    LWPR2505004:
      "Unable to attend work due to urgent personal matter.",
    LWPR2505005:
      "Requesting unpaid leave due to family emergency.",
    LWPR2505006:
      "Need half day leave for personal work.",
    LWPR2505007:
      "Requesting leave due to travel outside Dhaka.",
    LWPR2505008:
      "Requesting leave for family function.",
    LWPR2505009:
      "Requesting unpaid leave for urgent personal matter.",
  };

  return (
    remarks[request.requestId] ||
    request.reason ||
    "-"
  );
};

export default LeaveWithoutPayRequestsDetails;