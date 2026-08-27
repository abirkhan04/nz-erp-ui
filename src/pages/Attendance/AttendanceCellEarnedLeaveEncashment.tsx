import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Clock3,
  FileOutput,
  Info,
  Send,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EncashmentRequest {
  id: string;
  reqNo: string;
  empId: string;
  employeeName: string;
  department: string;
  elBalance: number;
  elAccrued: number;
  maxEncashable: number;
  requestedDays: number;
  fromDate: string;
  toDate: string;
  reason: string;
  forwardedBy: string;
  forwardedDate: string;
  status: "Pending" | "Forwarded";
}

const mockRequests: EncashmentRequest[] = [
  {
    id: "1",
    reqNo: "ELR250515001",
    empId: "10045",
    employeeName: "Jahid Hossain",
    department: "Weaving",
    elBalance: 24,
    elAccrued: 20,
    maxEncashable: 10,
    requestedDays: 5,
    fromDate: "18-May-2025",
    toDate: "22-May-2025",
    reason: "Personal Need",
    forwardedBy: "Prod. Manager",
    forwardedDate: "15-May-2025 08:15 AM",
    status: "Pending",
  },
  {
    id: "2",
    reqNo: "ELR250515002",
    empId: "10087",
    employeeName: "Ripon Miah",
    department: "Spinning",
    elBalance: 18.5,
    elAccrued: 16,
    maxEncashable: 8,
    requestedDays: 6,
    fromDate: "17-May-2025",
    toDate: "22-May-2025",
    reason: "Family Event",
    forwardedBy: "Prod. Manager",
    forwardedDate: "15-May-2025 09:05 AM",
    status: "Pending",
  },
  {
    id: "3",
    reqNo: "ELR250515003",
    empId: "10123",
    employeeName: "Sagor Ali",
    department: "Dyeing",
    elBalance: 30,
    elAccrued: 24,
    maxEncashable: 12,
    requestedDays: 10,
    fromDate: "20-May-2025",
    toDate: "29-May-2025",
    reason: "Child Education",
    forwardedBy: "Prod. Manager",
    forwardedDate: "15-May-2025 09:25 AM",
    status: "Pending",
  },
  {
    id: "4",
    reqNo: "ELR250515004",
    empId: "10145",
    employeeName: "Nazma Akter",
    department: "Finishing",
    elBalance: 12,
    elAccrued: 10,
    maxEncashable: 5,
    requestedDays: 5,
    fromDate: "25-May-2025",
    toDate: "29-May-2025",
    reason: "Medical Expense",
    forwardedBy: "Prod. Manager",
    forwardedDate: "15-May-2025 10:10 AM",
    status: "Pending",
  },
  {
    id: "5",
    reqNo: "ELR250515005",
    empId: "10166",
    employeeName: "Monir Hossain",
    department: "Maintenance",
    elBalance: 9,
    elAccrued: 8,
    maxEncashable: 4,
    requestedDays: 4,
    fromDate: "21-May-2025",
    toDate: "24-May-2025",
    reason: "Home Renovation",
    forwardedBy: "Prod. Manager",
    forwardedDate: "15-May-2025 10:20 AM",
    status: "Pending",
  },
];

const AttendanceCellEarnedLeaveEncashment: React.FC = () => {
  const [requests, setRequests] =
    useState<EncashmentRequest[]>(mockRequests);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  /* ================= CURRENT DATE ================= */

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

  /* ================= ELIGIBLE REQUESTS ================= */

  const eligibleRequests = requests.filter(
    (request) =>
      request.requestedDays <= request.maxEncashable &&
      request.status === "Pending",
  );

  const isAllSelected =
    eligibleRequests.length > 0 &&
    eligibleRequests.every((request) =>
      selectedIds.includes(request.id),
    );

  const isSomeSelected =
    selectedIds.length > 0 && !isAllSelected;

  /* ================= SELECTION ================= */

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

  /* ================= FORWARD SELECTED ================= */

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

  /* ================= FORWARD ALL ================= */

  const handleForwardAll = () => {
    const eligibleIds = eligibleRequests.map(
      (request) => request.id,
    );

    if (eligibleIds.length === 0) return;

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
      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="bg-[#073da8] text-white">
        <div className="flex min-h-[74px] items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center text-5xl font-bold">
              S
            </div>

            <div className="h-10 w-px bg-white/30" />

            <div>
              <h1 className="text-[17px] font-bold tracking-wide">
                ATTENDANCE CELL – EARNED LEAVE ENCASHMENT REQUESTS
              </h1>

              <div className="mt-1 text-[11px] text-white/90">
                HR Branch &nbsp;&gt;&nbsp; Payroll & Workforce
                Movement &nbsp;&gt;&nbsp; Attendance Cell
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-[11px] font-semibold text-[#172554]">
              <CalendarDays size={16} />

              <span>
                {currentDate.date} | {currentDate.day}
              </span>
            </div>

            <div className="h-10 w-px bg-white/30" />

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0a45b8]">
                <Users size={20} />
              </div>

              <div className="text-[11px]">
                <div className="font-semibold">Nusrat Jahan</div>

                <div className="text-white/80">
                  Attendance Officer
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================
          CONTENT
      ========================================================= */}

      <main className="px-6 py-4">
        {/* =======================================================
            SHIFT CARDS
        ======================================================= */}

        <div className="mb-6 grid grid-cols-2 gap-4">
          {/* CURRENT SHIFT */}

          <div className="rounded-md border border-[#dfe5ef] bg-white">
            <div className="flex items-center justify-between border-b border-[#e5eaf2] px-4 py-3">
              <div className="text-[12px] font-bold">
                <span className="text-[#0645bd]">1.</span>{" "}
                CURRENT SHIFT{" "}
                <span className="text-[10px] text-gray-500">
                  (INCOMING)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded bg-green-600 px-2 py-1 text-[10px] font-bold text-white">
                  SHIFT A
                </span>

                <span className="text-[10px] font-semibold">
                  06:00 AM - 02:00 PM
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 px-4 py-3">
              <div className="flex items-center justify-center gap-3 border-r border-[#e5eaf2]">
                <Users className="text-green-600" size={27} />

                <div>
                  <div className="text-[10px] font-bold">
                    PRESENT
                  </div>

                  <div className="mt-1 text-2xl font-bold text-green-600">
                    1,256
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 border-r border-[#e5eaf2]">
                <Users className="text-red-600" size={27} />

                <div>
                  <div className="text-[10px] font-bold">
                    ABSENT
                  </div>

                  <div className="mt-1 text-2xl font-bold text-red-600">
                    87
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Clock3 className="text-orange-500" size={27} />

                <div>
                  <div className="text-[10px] font-bold">
                    PUNCH MISSING
                  </div>

                  <div className="mt-1 text-2xl font-bold text-orange-500">
                    46
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-4 mb-3 flex items-center gap-2 rounded border border-[#e5eaf2] bg-[#f8faff] px-3 py-2 text-[10px]">
              <Info size={14} className="text-blue-600" />

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
            <div className="flex items-center justify-between border-b border-[#e5eaf2] px-4 py-3">
              <div className="text-[12px] font-bold">
                <span className="text-[#0645bd]">2.</span>{" "}
                PREVIOUS SHIFT{" "}
                <span className="text-[10px] text-gray-500">
                  (OUTGOING)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded bg-blue-600 px-2 py-1 text-[10px] font-bold text-white">
                  SHIFT C
                </span>

                <span className="text-[10px] font-semibold">
                  10:00 PM - 06:00 AM
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 px-4 py-3">
              <div className="flex items-center justify-center gap-3 border-r border-[#e5eaf2]">
                <FileOutput className="text-blue-600" size={27} />

                <div>
                  <div className="text-[10px] font-bold">
                    OUT PUNCH DONE
                  </div>

                  <div className="mt-1 text-2xl font-bold text-blue-600">
                    1,184
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <CircleAlert className="text-red-600" size={27} />

                <div>
                  <div className="text-[10px] font-bold">
                    MISSING OUT PUNCH
                  </div>

                  <div className="mt-1 text-2xl font-bold text-red-600">
                    32
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-4 mb-3 flex items-center gap-2 rounded border border-[#e5eaf2] bg-[#f8faff] px-3 py-2 text-[10px] text-blue-700">
              <Info size={14} />

              <span>
                Outgoing shift Out Punch entry must be completed
                before handover
              </span>
            </div>
          </div>
        </div>

        {/* =======================================================
            TABLE
        ======================================================= */}

        <section className="rounded-md border border-[#dfe5ef] bg-white">
          {/* TABLE TITLE */}

          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-2 text-[12px] font-bold">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-50">
                <CircleCheck
                  size={18}
                  className="text-green-600"
                />
              </div>

              EARNED LEAVE ENCASHMENT REQUESTS RECEIVED FROM
              PRODUCTION FLOOR
            </div>

            <div className="text-[10px] font-bold">
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
                  {/* NO EXTRA CHECKBOX COLUMN */}

                  {[
                    "Req. No.",
                    "Emp ID",
                    "Employee Name",
                    "Department",
                    "EL Balance\n(Total)",
                    "EL Accrued\n(Current Year)",
                    "Max Encashable\n(50% of Accrued)",
                    "Requested\nDays",
                    "From Date",
                    "To Date",
                    "Reason",
                    "Forwarded By\n(Production)",
                    "Forwarded Date",
                    "Status",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-pre-line border border-[#e1e7f0] px-2 py-2 text-[9px] font-bold leading-3"
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
                    request.requestedDays <=
                      request.maxEncashable &&
                    request.status === "Pending";

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
                      <td className="border border-[#e1e7f0] px-2 py-2 text-[9px]">
                        {request.reqNo}
                      </td>

                      <td className="border border-[#e1e7f0] px-2 py-2 text-[9px]">
                        {request.empId}
                      </td>

                      <td className="whitespace-nowrap border border-[#e1e7f0] px-2 py-2 text-[9px] font-medium">
                        {request.employeeName}
                      </td>

                      <td className="border border-[#e1e7f0] px-2 py-2 text-[9px]">
                        {request.department}
                      </td>

                      <td className="border border-[#e1e7f0] px-2 py-2 text-[9px] font-bold text-green-600">
                        {request.elBalance.toFixed(2)}
                      </td>

                      <td className="border border-[#e1e7f0] px-2 py-2 text-[9px] font-bold text-green-600">
                        {request.elAccrued.toFixed(2)}
                      </td>

                      <td className="border border-[#e1e7f0] px-2 py-2 text-[9px] font-bold text-green-600">
                        {request.maxEncashable.toFixed(2)}
                      </td>

                      <td
                        className={`border border-[#e1e7f0] px-2 py-2 text-[9px] font-bold ${
                          request.requestedDays >
                          request.maxEncashable
                            ? "text-red-600"
                            : "text-[#172554]"
                        }`}
                      >
                        {request.requestedDays.toFixed(2)}
                      </td>

                      <td className="whitespace-nowrap border border-[#e1e7f0] px-2 py-2 text-[9px]">
                        {request.fromDate}
                      </td>

                      <td className="whitespace-nowrap border border-[#e1e7f0] px-2 py-2 text-[9px]">
                        {request.toDate}
                      </td>

                      <td className="whitespace-nowrap border border-[#e1e7f0] px-2 py-2 text-[9px]">
                        {request.reason}
                      </td>

                      <td className="whitespace-nowrap border border-[#e1e7f0] px-2 py-2 text-[9px]">
                        {request.forwardedBy}
                      </td>

                      <td className="whitespace-nowrap border border-[#e1e7f0] px-2 py-2 text-[8px]">
                        {request.forwardedDate}
                      </td>

                      {/* STATUS */}

                      <td className="border border-[#e1e7f0] px-2 py-2">
                        {request.status === "Forwarded" ? (
                          <span className="rounded bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-700">
                            Forwarded
                          </span>
                        ) : (
                          <span className="rounded bg-orange-100 px-2 py-1 text-[10px] font-semibold text-orange-600">
                            Pending
                          </span>
                        )}
                      </td>

                      {/* ACTION = CHECKBOX */}

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
                          <span className="text-[9px] font-semibold text-red-500">
                            Not Eligible
                          </span>
                        ) : (
                          <span className="text-[9px] font-semibold text-green-600">
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

          {/* =====================================================
              PAGINATION
          ===================================================== */}

          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-[10px] font-semibold text-gray-700">
              Showing 1 to {requests.length} of{" "}
              {requests.length} entries
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="text-gray-400"
                disabled
              >
                <ChevronLeft size={15} />
              </button>

              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded bg-blue-600 text-[10px] font-bold text-white"
              >
                1
              </button>

              <button
                type="button"
                className="text-gray-400"
                disabled
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {/* =====================================================
              NOTE
          ===================================================== */}

          <div className="mx-4 mb-3 flex items-center gap-2 rounded bg-[#f2f6ff] px-3 py-2 text-[10px] text-blue-700">
            <Info size={14} />

            <span>
              <strong>Note:</strong> Only requests within the
              encashable limit (50% of accrued EL) can be
              forwarded.
            </span>
          </div>
        </section>

        {/* =======================================================
            LEGEND
        ======================================================= */}

        <div className="flex items-center gap-5 px-4 py-2 text-[10px]">
          <span className="font-semibold">Legend:</span>

          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-600" />
            Sufficient Balance
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Within Limit
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-600" />
            Exceeds Limit (Not Forwardable)
          </span>
        </div>

        {/* =======================================================
            BOTTOM ACTIONS
        ======================================================= */}

        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            className="flex items-center gap-2 rounded border border-blue-500 bg-white px-4 py-2 text-[11px] font-semibold text-blue-600 hover:bg-blue-50"
            onClick={()=> navigate("/attendance-cell")}
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            {/* FORWARD SELECTED */}

            <button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={handleForwardSelected}
              className="flex items-center gap-2 rounded border border-green-500 bg-white px-5 py-2 text-[11px] font-semibold text-green-600 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
            >
              <Send size={14} />

              Forward Selected

              {selectedIds.length > 0 && (
                <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[9px]">
                  {selectedIds.length}
                </span>
              )}
            </button>

            {/* FORWARD ALL */}

            <button
              type="button"
              disabled={eligibleRequests.length === 0}
              onClick={handleForwardAll}
              className="flex items-center gap-2 rounded bg-green-600 px-5 py-2 text-[11px] font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <ArrowRight size={15} />
              Forward All
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendanceCellEarnedLeaveEncashment;