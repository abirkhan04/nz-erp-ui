import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  FileOutput,
  Info,
  Send,
  Users,
  UserRound,
  AlertTriangle,
  Banknote,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MaternityLeaveRequest {
  id: string;
  reqNo: string;
  empId: string;
  employeeName: string;
  department: string;
  installmentNo: string;
  totalEntitlement: number;
  requestedDays: number;
  fromDate: string;
  toDate: string;
  childrenCount: number;
  doctorCertificate: boolean;
  doctorRecommendation: boolean;
  forwardedBy: string;
  forwardedDate: string;
  status: "Pending" | "Forwarded";
}

const mockRequests: MaternityLeaveRequest[] = [
  {
    id: "1",
    reqNo: "MLR250515001",
    empId: "10045",
    employeeName: "Jahid Hossain",
    department: "Weaving",
    installmentNo: "1st (64 Days)",
    totalEntitlement: 128,
    requestedDays: 64,
    fromDate: "18-May-2025",
    toDate: "19-Jul-2025",
    childrenCount: 1,
    doctorCertificate: true,
    doctorRecommendation: true,
    forwardedBy: "Prod. Manager",
    forwardedDate: "15-May-2025 08:15 AM",
    status: "Pending",
  },
  {
    id: "2",
    reqNo: "MLR250515002",
    empId: "10087",
    employeeName: "Nazma Akter",
    department: "Finishing",
    installmentNo: "2nd (64 Days)",
    totalEntitlement: 128,
    requestedDays: 64,
    fromDate: "01-Aug-2025",
    toDate: "02-Oct-2025",
    childrenCount: 1,
    doctorCertificate: true,
    doctorRecommendation: true,
    forwardedBy: "Prod. Manager",
    forwardedDate: "15-May-2025 09:05 AM",
    status: "Pending",
  },
  {
    id: "3",
    reqNo: "MLR250515003",
    empId: "10123",
    employeeName: "Ripa Sultana",
    department: "Spinning",
    installmentNo: "1st (64 Days)",
    totalEntitlement: 128,
    requestedDays: 64,
    fromDate: "20-May-2025",
    toDate: "20-Jul-2025",
    childrenCount: 2,
    doctorCertificate: true,
    doctorRecommendation: true,
    forwardedBy: "Prod. Manager",
    forwardedDate: "15-May-2025 09:25 AM",
    status: "Pending",
  },
  {
    id: "4",
    reqNo: "MLR250515004",
    empId: "10189",
    employeeName: "Shakila Parvin",
    department: "Knitting",
    installmentNo: "2nd (64 Days)",
    totalEntitlement: 128,
    requestedDays: 64,
    fromDate: "05-Aug-2025",
    toDate: "06-Oct-2025",
    childrenCount: 2,
    doctorCertificate: true,
    doctorRecommendation: true,
    forwardedBy: "Prod. Manager",
    forwardedDate: "15-May-2025 11:00 AM",
    status: "Pending",
  },
];

const AttendanceCellMaternityLeaveEncashment: React.FC = () => {
  const [requests, setRequests] =
    useState<MaternityLeaveRequest[]>(mockRequests);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  /* =========================================================
     CURRENT DATE
  ========================================================= */

  const currentDate = useMemo(() => {
    const date = new Date();

    return {
      date: date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      day: date.toLocaleDateString("en-GB", {
        weekday: "long",
      }),
    };
  }, []);

  /* =========================================================
     ELIGIBLE REQUESTS
  ========================================================= */

  const eligibleRequests = requests.filter(
    (request) =>
      request.status === "Pending" &&
      request.childrenCount <= 2 &&
      request.doctorCertificate &&
      request.doctorRecommendation,
  );

  const isAllSelected =
    eligibleRequests.length > 0 &&
    eligibleRequests.every((request) =>
      selectedIds.includes(request.id),
    );

  const isSomeSelected =
    selectedIds.length > 0 && !isAllSelected;

  /* =========================================================
     CHECKBOX HANDLERS
  ========================================================= */

  const toggleRow = (id: string) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(
      eligibleRequests.map((request) => request.id),
    );
  };

  /* =========================================================
     FORWARD SELECTED
  ========================================================= */

  const handleForwardSelected = () => {
    if (selectedIds.length === 0) return;

    setRequests((previous) =>
      previous.map((request) =>
        selectedIds.includes(request.id)
          ? {
              ...request,
              status: "Forwarded",
            }
          : request,
      ),
    );

    setSelectedIds([]);
  };

  /* =========================================================
     FORWARD ALL
  ========================================================= */

  const handleForwardAll = () => {
    if (eligibleRequests.length === 0) return;

    const eligibleIds = eligibleRequests.map(
      (request) => request.id,
    );

    setRequests((previous) =>
      previous.map((request) =>
        eligibleIds.includes(request.id)
          ? {
              ...request,
              status: "Forwarded",
            }
          : request,
      ),
    );

    setSelectedIds([]);
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#172554]">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="bg-[#073da8] text-white">
        <div className="flex min-h-[65px] items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center text-5xl font-bold">
              S
            </div>

            <div className="h-9 w-px bg-white/30" />

            <div>
              <h1 className="text-[16px] font-bold tracking-wide">
                ATTENDANCE CELL – MATERNITY LEAVE ENCASHMENT
                REQUESTS
              </h1>

              <div className="mt-1 text-[10px] text-white/90">
                HR Branch &nbsp;&gt;&nbsp; Payroll & Workforce
                Movement &nbsp;&gt;&nbsp; Attendance Cell
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-[10px] font-semibold text-[#172554]">
              <CalendarDays size={15} />

              <span>
                {currentDate.date} | {currentDate.day}
              </span>
            </div>

            <div className="h-9 w-px bg-white/30" />

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0a45b8]">
                <Users size={18} />
              </div>

              <div className="text-[10px]">
                <div className="font-semibold">Nusrat Jahan</div>

                <div className="text-white/80">
                  Attendance Officer
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="px-6 py-3">
        {/* ===================================================
            SHIFT CARDS
        =================================================== */}

        <div className="mb-3 grid grid-cols-2 gap-4">
          {/* CURRENT SHIFT */}

          <div className="rounded-md border border-[#dfe5ef] bg-white">
            <div className="flex items-center justify-between border-b border-[#e5eaf2] px-4 py-2">
              <div className="text-[11px] font-bold">
                <span className="text-[#0645bd]">1.</span>{" "}
                CURRENT SHIFT{" "}
                <span className="text-[9px] text-gray-500">
                  (INCOMING)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded bg-green-600 px-2 py-1 text-[9px] font-bold text-white">
                  SHIFT A
                </span>

                <span className="text-[9px] font-semibold">
                  06:00 AM - 02:00 PM
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 px-4 py-2">
              <div className="flex items-center justify-center gap-3 border-r border-[#e5eaf2]">
                <Users
                  size={26}
                  className="text-green-600"
                />

                <div>
                  <div className="text-[9px] font-bold">
                    PRESENT
                  </div>

                  <div className="text-2xl font-bold text-green-600">
                    1,256
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 border-r border-[#e5eaf2]">
                <UserRound
                  size={26}
                  className="text-red-600"
                />

                <div>
                  <div className="text-[9px] font-bold">
                    ABSENT
                  </div>

                  <div className="text-2xl font-bold text-red-600">
                    87
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Clock3
                  size={26}
                  className="text-orange-500"
                />

                <div>
                  <div className="text-[9px] font-bold">
                    PUNCH MISSING
                  </div>

                  <div className="text-2xl font-bold text-orange-500">
                    46
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-4 mb-2 flex items-center gap-2 rounded border border-[#e5eaf2] bg-[#f8faff] px-3 py-1.5 text-[9px]">
              <Info size={13} className="text-blue-600" />

              <span className="font-semibold">
                Last Punch Time:
              </span>

              <span className="font-bold text-green-600">
                06:48 AM
              </span>
            </div>
          </div>

          {/* PREVIOUS SHIFT */}

          <div className="rounded-md border border-[#dfe5ef] bg-white">
            <div className="flex items-center justify-between border-b border-[#e5eaf2] px-4 py-2">
              <div className="text-[11px] font-bold">
                <span className="text-[#0645bd]">2.</span>{" "}
                PREVIOUS SHIFT{" "}
                <span className="text-[9px] text-gray-500">
                  (OUTGOING)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded bg-blue-600 px-2 py-1 text-[9px] font-bold text-white">
                  SHIFT C
                </span>

                <span className="text-[9px] font-semibold">
                  10:00 PM - 06:00 AM
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 px-4 py-2">
              <div className="flex items-center justify-center gap-3 border-r border-[#e5eaf2]">
                <FileOutput
                  size={26}
                  className="text-blue-600"
                />

                <div>
                  <div className="text-[9px] font-bold">
                    OUT PUNCH DONE
                  </div>

                  <div className="text-2xl font-bold text-blue-600">
                    1,184
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Clock3
                  size={26}
                  className="text-red-600"
                />

                <div>
                  <div className="text-[9px] font-bold">
                    MISSING OUT PUNCH
                  </div>

                  <div className="text-2xl font-bold text-red-600">
                    32
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-4 mb-2 flex items-center gap-2 rounded border border-[#e5eaf2] bg-[#f8faff] px-3 py-1.5 text-[9px] text-blue-700">
              <Info size={13} />

              <span>
                Outgoing shift Out Punch entry must be completed
                before handover.
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================
            SUMMARY CARDS
        =================================================== */}

        <div className="mb-3 grid grid-cols-5 gap-3">
          <SummaryCard
            icon={<CalendarDays size={28} />}
            title="LEAVE REQUESTS"
            subtitle="RECEIVED"
            count="18"
            color="blue"
          />

          <SummaryCard
            icon={<Banknote size={28} />}
            title="EARNED LEAVE"
            subtitle="ENCASHMENT REQUESTS"
            count="06"
            color="green"
          />

          <SummaryCard
            icon={<UserRound size={28} />}
            title="MATERNITY LEAVE"
            subtitle="ENCASHMENT REQUESTS"
            count="04"
            color="purple"
          />

          <SummaryCard
            icon={<AlertTriangle size={28} />}
            title="EXCEPTION REQUESTS"
            subtitle="(FROM TIME OFFICE)"
            count="11"
            color="orange"
          />

          <SummaryCard
            icon={<Banknote size={28} />}
            title="LEAVE WITHOUT"
            subtitle="PAY REQUESTS"
            count="09"
            color="cyan"
          />
        </div>

        {/* ===================================================
            REQUEST TABLE
        =================================================== */}

        <section className="rounded-md border border-[#dfe5ef] bg-white">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#5b20b8]">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-50">
                <UserRound size={17} />
              </div>

              MATERNITY LEAVE ENCASHMENT REQUESTS RECEIVED FROM
              PRODUCTION FLOOR
            </div>

            <div className="text-[9px] font-bold">
              Total Requests:{" "}
              <span className="text-blue-600">
                {requests.length}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto px-3">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr className="bg-[#f5f8fc]">
                  {[
                    "Req. No.",
                    "Emp ID",
                    "Employee Name",
                    "Department",
                    "Installment\nNo.",
                    "Total\nEntitlement\n(Days)",
                    "Requested Days\n(This Installment)",
                    "From Date",
                    "To Date",
                    "Children\nCount",
                    "Doctor\nCertificate",
                    "Doctor\nRecommendation",
                    "Forwarded By\n(Production)",
                    "Forwarded Date\n& Time",
                    "Status",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-pre-line border border-[#e1e7f0] px-2 py-2 text-[8px] font-bold leading-3"
                    >
                      {heading === "Action" ? (
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            ref={(element) => {
                              if (element) {
                                element.indeterminate =
                                  isSomeSelected;
                              }
                            }}
                            onChange={toggleSelectAll}
                            className="h-4 w-4 cursor-pointer accent-[#0754c7]"
                            title="Select all eligible requests"
                          />
                        </div>
                      ) : (
                        heading
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => {
                  const isEligible =
                    request.status === "Pending" &&
                    request.childrenCount <= 2 &&
                    request.doctorCertificate &&
                    request.doctorRecommendation;

                  const isSelected = selectedIds.includes(
                    request.id,
                  );

                  return (
                    <tr
                      key={request.id}
                      className={`hover:bg-[#f8fbff] ${
                        isSelected ? "bg-blue-50/60" : ""
                      }`}
                    >
                      <td className="border border-[#e1e7f0] px-2 py-2 text-[8px]">
                        {request.reqNo}
                      </td>

                      <td className="border border-[#e1e7f0] px-2 py-2 text-[8px]">
                        {request.empId}
                      </td>

                      <td className="whitespace-nowrap border border-[#e1e7f0] px-2 py-2 text-[8px] font-medium">
                        {request.employeeName}
                      </td>

                      <td className="border border-[#e1e7f0] px-2 py-2 text-[8px]">
                        {request.department}
                      </td>

                      <td className="whitespace-nowrap border border-[#e1e7f0] px-2 py-2 text-[8px]">
                        {request.installmentNo}
                      </td>

                      <td className="border border-[#e1e7f0] px-2 py-2 text-[8px] font-bold text-green-600">
                        {request.totalEntitlement}
                      </td>

                      <td className="border border-[#e1e7f0] px-2 py-2 text-[8px] font-bold">
                        {request.requestedDays}
                      </td>

                      <td className="whitespace-nowrap border border-[#e1e7f0] px-2 py-2 text-[8px]">
                        {request.fromDate}
                      </td>

                      <td className="whitespace-nowrap border border-[#e1e7f0] px-2 py-2 text-[8px]">
                        {request.toDate}
                      </td>

                      <td className="border border-[#e1e7f0] px-2 py-2 text-[8px]">
                        {request.childrenCount}
                      </td>

                      {/* DOCTOR CERTIFICATE */}

                      <td className="border border-[#e1e7f0] px-2 py-2">
                        {request.doctorCertificate ? (
                          <CircleCheck
                            size={14}
                            className="mx-auto text-green-600"
                          />
                        ) : (
                          <span className="text-red-500">—</span>
                        )}
                      </td>

                      {/* DOCTOR RECOMMENDATION */}

                      <td className="border border-[#e1e7f0] px-2 py-2">
                        {request.doctorRecommendation ? (
                          <CircleCheck
                            size={14}
                            className="mx-auto text-green-600"
                          />
                        ) : (
                          <span className="text-red-500">—</span>
                        )}
                      </td>

                      <td className="whitespace-nowrap border border-[#e1e7f0] px-2 py-2 text-[8px]">
                        {request.forwardedBy}
                      </td>

                      <td className="whitespace-nowrap border border-[#e1e7f0] px-2 py-2 text-[8px]">
                        {request.forwardedDate}
                      </td>

                      {/* STATUS */}

                      <td className="border border-[#e1e7f0] px-2 py-2">
                        {request.status === "Forwarded" ? (
                          <span className="rounded bg-green-100 px-2 py-1 text-[8px] font-semibold text-green-700">
                            Forwarded
                          </span>
                        ) : (
                          <span className="rounded bg-orange-100 px-2 py-1 text-[8px] font-semibold text-orange-600">
                            Pending
                          </span>
                        )}
                      </td>

                      {/* ACTION / CHECKBOX */}

                      <td className="border border-[#e1e7f0] px-2 py-2">
                        {request.status === "Pending" &&
                        isEligible ? (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                              toggleRow(request.id)
                            }
                            className="h-4 w-4 cursor-pointer accent-[#0754c7]"
                            title="Select request"
                          />
                        ) : request.status === "Pending" ? (
                          <span className="text-[8px] font-semibold text-red-500">
                            Not Eligible
                          </span>
                        ) : (
                          <span className="text-[8px] font-semibold text-green-600">
                            Done
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* =================================================
              PAGINATION
          ================================================= */}

          <div className="flex items-center justify-between px-5 py-2">
            <span className="text-[9px] font-semibold text-gray-700">
              Showing 1 to {requests.length} of{" "}
              {requests.length} entries
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="text-gray-400"
                disabled
              >
                <ChevronLeft size={14} />
              </button>

              <button
                type="button"
                className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-[9px] font-bold text-white"
              >
                1
              </button>

              <button
                type="button"
                className="text-gray-400"
                disabled
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* =================================================
              NOTE
          ================================================= */}

          <div className="mx-4 mb-2 flex items-center gap-2 rounded bg-[#f2f6ff] px-3 py-2 text-[9px] text-blue-700">
            <Info size={13} />

            <span>
              <strong>Note:</strong> Maternity leave encashment is
              applicable for first two children only. Total
              entitlement is 128 days (64 days per installment).
            </span>
          </div>
        </section>

        {/* ===================================================
            LEGEND
        =================================================== */}

        <div className="flex items-center gap-5 px-4 py-1 text-[9px]">
          <span className="font-semibold">Legend:</span>

          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-600" />
            Eligible
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Under Review
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-600" />
            Not Eligible (Not Forwardable)
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gray-500" />
            Document Missing
          </span>
        </div>

        {/* ===================================================
            BOTTOM ACTIONS
        =================================================== */}

        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            className="flex items-center gap-2 rounded border border-blue-500 bg-white px-4 py-2 text-[10px] font-semibold text-blue-600 hover:bg-blue-50"
             onClick={()=> navigate("/attendance-cell")}
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            {/* FORWARD SELECTED */}

            <button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={handleForwardSelected}
              className="flex items-center gap-2 rounded border border-green-500 bg-white px-5 py-2 text-[10px] font-semibold text-green-600 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
            >
              <Send size={13} />

              Forward Selected

              {selectedIds.length > 0 && (
                <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[8px]">
                  {selectedIds.length}
                </span>
              )}
            </button>

            {/* FORWARD ALL */}

            <button
              type="button"
              disabled={eligibleRequests.length === 0}
              onClick={handleForwardAll}
              className="flex items-center gap-2 rounded bg-green-600 px-5 py-2 text-[10px] font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <ArrowRight size={14} />
              Forward All
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

/* =============================================================
   SUMMARY CARD
============================================================= */

interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  count: string;
  color: "blue" | "green" | "purple" | "orange" | "cyan";
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  icon,
  title,
  subtitle,
  count,
  color,
}) => {
  const styles = {
    blue: {
      wrapper: "bg-blue-50/40 border-blue-100",
      icon: "bg-blue-100 text-blue-600",
      count: "text-blue-600",
    },
    green: {
      wrapper: "bg-green-50/40 border-green-100",
      icon: "bg-green-100 text-green-600",
      count: "text-green-600",
    },
    purple: {
      wrapper: "bg-purple-50/40 border-purple-100",
      icon: "bg-purple-100 text-purple-600",
      count: "text-purple-600",
    },
    orange: {
      wrapper: "bg-orange-50/40 border-orange-100",
      icon: "bg-orange-100 text-orange-600",
      count: "text-orange-600",
    },
    cyan: {
      wrapper: "bg-cyan-50/40 border-cyan-100",
      icon: "bg-cyan-100 text-cyan-600",
      count: "text-cyan-600",
    },
  };

  const style = styles[color];

  return (
    <div
      className={`flex items-center gap-3 rounded-md border p-3 ${style.wrapper}`}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${style.icon}`}
      >
        {icon}
      </div>

      <div>
        <div className="text-[9px] font-bold leading-3">
          {title}
          <br />
          {subtitle}
        </div>

        <div
          className={`mt-1 text-xl font-bold ${style.count}`}
        >
          {count}
        </div>

        <div className="text-[8px] font-medium text-gray-600">
          Pending Verification
        </div>

        <button
          type="button"
          className={`mt-1 flex items-center justify-between rounded px-3 py-1 text-[8px] font-semibold text-white ${
            color === "blue"
              ? "bg-blue-600"
              : color === "green"
                ? "bg-green-600"
                : color === "purple"
                  ? "bg-purple-600"
                  : color === "orange"
                    ? "bg-orange-500"
                    : "bg-cyan-600"
          }`}
        >
          View List
          <ArrowRight size={11} />
        </button>
      </div>
    </div>
  );
};

export default AttendanceCellMaternityLeaveEncashment;