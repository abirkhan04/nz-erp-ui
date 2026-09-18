import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  Info,
  LogIn,
  LogOut,
  Send,
  UserRound,
  Users,
  WalletCards,
  Clock3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../../api/routes";
import { useGet } from "../../hooks/useGet";
import { usePost } from "../../hooks/usePost";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

interface ExceptionRequest {
  id: string;
  reqNo: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  forwardedOn: string;
  punchCorrection: "OUT PUNCH MISSING" | "IN PUNCH MISSING" | "BOTH PUNCH MISSING";
  exceptionType: string;
  remarks: string;
  forwardedBy: string;
  documents: boolean;
  status: "Pending" | "Forwarded" | "Submitted";
}

const NormalExceptionRequest: React.FC = () => {
  const navigate = useNavigate();

  const { mutate: forwardExceptionRequests } = usePost<any>(`${API_ROUTES.ATTENDANCE_EXCEPTIONS}/forward`);

  const { data: rawExceptionResponse, refetch: refetchExceptionRequests } = useGet<any>({ key: ["exceptionRequests"], url: `${API_ROUTES.ATTENDANCE_EXCEPTIONS}?status=Submitted` });
  const exceptionRequests: ExceptionRequest[] = Array.isArray(rawExceptionResponse)
    ? rawExceptionResponse
    : rawExceptionResponse?.items ?? [];
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 6;

  const totalPages = Math.ceil(exceptionRequests.length / pageSize);

  const paginatedRequests = exceptionRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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

  const pendingRequests = exceptionRequests.filter(
    (request: ExceptionRequest) => request.status === "Pending",
  );

  const allSelected =
    pendingRequests.length > 0 &&
    pendingRequests.every((request: ExceptionRequest) =>
      selectedIds.includes(request.id),
    );

  const someSelected =
    selectedIds.length > 0 && !allSelected;

  const toggleRow = (id: string) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(
        pendingRequests.map((request: ExceptionRequest) => request.id),
      );
    }
  };

  const { user } = useAuth();

  const handleForwardSelected = () => {
    if (selectedIds.length === 0 || !user?.userId) return;

    const payload = selectedIds.map((id) => {
      const request = exceptionRequests.find(
        (item: ExceptionRequest) => item.id === id
      );

      return {
        id,
        userId: user.userId,
        comments: request?.remarks ?? "",
      };
    });

    forwardExceptionRequests(payload, {
      onSuccess: (response) => {
        toast.success(
          response.message || "Exception requests forwarded successfully!"
        );

        setSelectedIds([]);
        refetchExceptionRequests();
      },

      onError: (error) => {
        toast.error(
          error.message || "Failed to forward exception requests."
        );
      },
    });
  };

  const handleForwardAll = () => {
    if (pendingRequests.length === 0 || !user?.userId) return;

    const payload = pendingRequests.map((request) => ({
      id: request.id,
      userId: user.userId,
      comments: request.remarks ?? "",
    }));

    forwardExceptionRequests(payload, {
      onSuccess: (response) => {
        toast.success(
          response.message || "Exception requests forwarded successfully!"
        );

        setSelectedIds([]);
        refetchExceptionRequests();
      },

      onError: (error) => {
        toast.error(
          error.message || "Failed to forward exception requests."
        );
      },
    });
  };

  const handleBack = () => {
    navigate("/attendance-cell-exception-request");
  };

  return (
    <div className="min-h-screen bg-white text-[#172554]">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="bg-[#073da8] text-white">
        <div className="flex min-h-[60px] items-center justify-between px-5">
          {/* LEFT */}

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className="flex h-11 w-11 items-center justify-center text-[46px] font-bold leading-none">
                S
              </div>

              <div className="ml-1">
                <div className="text-[21px] font-bold leading-none">
                  SYNEXIS
                </div>

                <div className="mt-1 text-[7px]">
                  Creating Enterprise Synergy
                </div>
              </div>
            </div>

            <div className="h-9 w-px bg-white/30" />

            <div>
              <h1 className="text-[16px] font-bold tracking-wide">
                ATTENDANCE CELL – EXCEPTION REQUESTS
              </h1>

              <div className="mt-1 text-[10px]">
                HR Branch&nbsp; &gt;&nbsp; Payroll & Workforce
                Movement&nbsp; &gt;&nbsp; Attendance Cell
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-[10px] font-semibold text-[#172554]">
              <CalendarDays size={15} />

              <span>
                {currentDate.date} | {currentDate.day}
              </span>
            </div>

            <div className="h-9 w-px bg-white/30" />

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0a45b8]">
                <UserRound size={18} />
              </div>

              <div className="text-[9px]">
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
          MAIN
      ===================================================== */}

      <main className="px-5 py-2">
        {/* ===================================================
            SHIFT CARDS
        =================================================== */}

        <div className="grid grid-cols-2 gap-4">
          {/* CURRENT SHIFT */}

          <div className="rounded-md border border-[#dce4f0] bg-white">
            <div className="flex items-center justify-between border-b border-[#e5eaf2] px-4 py-2">
              <div className="text-[10px] font-bold">
                <span className="text-[#0645bd]">1.</span>{" "}
                CURRENT SHIFT{" "}
                <span className="text-[8px]">(INCOMING)</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded bg-green-600 px-2 py-1 text-[8px] font-bold text-white">
                  SHIFT A
                </span>

                <span className="text-[8px] font-semibold">
                  06:00 AM - 02:00 PM
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 px-4 py-2">
              <ShiftMetric
                icon={<Users size={25} />}
                title="PRESENT"
                value="1,256"
                iconClass="text-green-600"
                valueClass="text-green-600"
              />

              <ShiftMetric
                icon={<UserRound size={25} />}
                title="ABSENT"
                value="87"
                iconClass="text-red-600"
                valueClass="text-red-600"
              />

              <ShiftMetric
                icon={<Clock3 size={25} />}
                title="PUNCH MISSING"
                value="46"
                iconClass="text-orange-500"
                valueClass="text-orange-500"
                border={false}
              />
            </div>

            <div className="mx-4 mb-2 flex items-center gap-2 rounded border border-[#e5eaf2] bg-[#f8faff] px-3 py-1.5 text-[8px]">
              <Info size={12} className="text-blue-600" />

              <span className="font-semibold">
                Last Punch Time:
              </span>

              <span className="font-bold text-green-600">
                06:48 AM
              </span>
            </div>
          </div>

          {/* PREVIOUS SHIFT */}

          <div className="rounded-md border border-[#dce4f0] bg-white">
            <div className="flex items-center justify-between border-b border-[#e5eaf2] px-4 py-2">
              <div className="text-[10px] font-bold">
                <span className="text-[#0645bd]">2.</span>{" "}
                PREVIOUS SHIFT{" "}
                <span className="text-[8px]">(OUTGOING)</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded bg-blue-600 px-2 py-1 text-[8px] font-bold text-white">
                  SHIFT C
                </span>

                <span className="text-[8px] font-semibold">
                  10:00 PM - 06:00 AM
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 px-4 py-2">
              <ShiftMetric
                icon={<LogOut size={25} />}
                title="OUT PUNCH DONE"
                value="1,184"
                iconClass="text-blue-600"
                valueClass="text-blue-600"
              />

              <ShiftMetric
                icon={<Clock3 size={25} />}
                title="MISSING OUT PUNCH"
                value="32"
                iconClass="text-red-600"
                valueClass="text-red-600"
                border={false}
              />
            </div>

            <div className="mx-4 mb-2 flex items-center gap-2 rounded border border-[#e5eaf2] bg-[#f8faff] px-3 py-1.5 text-[8px] text-blue-700">
              <Info size={12} />

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

        <div className="my-3 grid grid-cols-5 gap-3">
          <SummaryCard
            icon={<CalendarDays size={28} />}
            title={<>LEAVE REQUESTS<br />RECEIVED</>}
            count="18"
            color="blue"
          />

          <SummaryCard
            icon={<WalletCards size={28} />}
            title={<>EARNED LEAVE<br />ENCASHMENT REQUESTS</>}
            count="06"
            color="green"
          />

          <SummaryCard
            icon={<UserRound size={28} />}
            title={<>MATERNITY LEAVE<br />ENCASHMENT REQUESTS</>}
            count="04"
            color="purple"
          />

          <SummaryCard
            icon={<AlertTriangle size={28} />}
            title={<>EXCEPTION REQUESTS<br />(FROM TIME OFFICE)</>}
            count="11"
            color="orange"
          />

          <SummaryCard
            icon={<WalletCards size={28} />}
            title={<>LEAVE WITHOUT<br />PAY REQUESTS</>}
            count="09"
            color="cyan"
          />
        </div>

        {/* ===================================================
            TABLE SECTION
        =================================================== */}

        <section className="rounded-md border border-[#dce4f0] bg-white">
          {/* TITLE */}

          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#172554]">
              <AlertTriangle
                size={15}
                className="text-orange-500"
              />

              EXCEPTION REQUESTS RECEIVED FROM PRODUCTION FLOOR
            </div>

            <div className="text-[8px] font-bold">
              Total Requests:{" "}
              <span className="text-blue-600">
                {exceptionRequests.length}
              </span>
            </div>
          </div>

          {/* TABLE */}

          <div className="overflow-x-auto px-2">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr className="bg-[#f5f8fc]">
                  <th className="border border-[#dfe5ef] px-2 py-2 text-[7px] font-bold">
                    #
                  </th>

                  <th className="border border-[#dfe5ef] px-2 py-2 text-[7px] font-bold">
                    Req. No.
                  </th>

                  <th className="border border-[#dfe5ef] px-2 py-2 text-[7px] font-bold">
                    Emp ID
                  </th>

                  <th className="border border-[#dfe5ef] px-2 py-2 text-[7px] font-bold">
                    Employee Name
                  </th>

                  <th className="border border-[#dfe5ef] px-2 py-2 text-[7px] font-bold">
                    Department
                  </th>

                  <th className="border border-[#dfe5ef] px-2 py-2 text-[7px] font-bold">
                    Exception Date
                  </th>

                  <th className="border border-[#dfe5ef] px-2 py-2 text-[7px] font-bold">
                    <div className="flex items-center justify-center gap-1">
                      Punch Correction Required
                      <Info size={8} />
                    </div>
                  </th>

                  <th className="border border-[#dfe5ef] px-2 py-2 text-[7px] font-bold">
                    Reason
                  </th>

                  <th className="border border-[#dfe5ef] px-2 py-2 text-[7px] font-bold">
                    Requested By
                    <br />
                    (Production)
                  </th>

                  <th className="border border-[#dfe5ef] px-2 py-2 text-[7px] font-bold">
                    Request Date & Time
                  </th>

                  <th className="border border-[#dfe5ef] px-2 py-2 text-[7px] font-bold">
                    Documents
                  </th>

                  <th className="border border-[#dfe5ef] px-2 py-2 text-[7px] font-bold">
                    Status
                  </th>

                  {/* ACTION */}

                  <th className="border border-[#dfe5ef] px-2 py-2 text-[7px] font-bold">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(element) => {
                          if (element) {
                            element.indeterminate = someSelected;
                          }
                        }}
                        onChange={toggleSelectAll}
                        className="h-3.5 w-3.5 cursor-pointer accent-[#0754c7]"
                        title="Select all"
                      />
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedRequests.map((request: ExceptionRequest, index: number) => {
                  const isSelected = selectedIds.includes(
                    request.id,
                  );

                  return (
                    <tr
                      key={request.id}
                      className={`hover:bg-[#f8fbff] ${isSelected ? "bg-blue-50" : ""
                        }`}
                    >
                      <td className="border border-[#dfe5ef] px-2 py-2 text-[7px]">
                        {index + 1}
                      </td>

                      <td className="whitespace-nowrap border border-[#dfe5ef] px-2 py-2 text-[7px]">
                        {request.reqNo}
                      </td>

                      <td className="border border-[#dfe5ef] px-2 py-2 text-[7px]">
                        {request.employeeCode}
                      </td>

                      <td className="whitespace-nowrap border border-[#dfe5ef] px-2 py-2 text-[7px] font-medium">
                        {request.employeeName}
                      </td>

                      <td className="border border-[#dfe5ef] px-2 py-2 text-[7px]">
                        {request.department}
                      </td>

                      <td className="whitespace-nowrap border border-[#dfe5ef] px-2 py-2 text-[7px]">
                        {request.forwardedOn}
                      </td>

                      {/* PUNCH CORRECTION */}

                      <td className="border border-[#dfe5ef] px-2 py-2">
                        {
                          request.exceptionType
                        /* <PunchBadge
                          type={request.punchCorrection}
                        /> */}
                      </td>

                      <td className="border border-[#dfe5ef] px-2 py-2 text-[7px]">
                        {request.remarks}
                      </td>

                      <td className="whitespace-nowrap border border-[#dfe5ef] px-2 py-2 text-[7px]">
                        {request.forwardedBy}
                      </td>

                      <td className="whitespace-nowrap border border-[#dfe5ef] px-2 py-2 text-[7px]">
                        {request.forwardedOn}
                      </td>

                      {/* DOCUMENT */}

                      <td className="border border-[#dfe5ef] px-2 py-2">
                        {request.documents ? (
                          <FileCheck2
                            size={13}
                            className="mx-auto text-green-600"
                          />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* STATUS */}

                      <td className="border border-[#dfe5ef] px-2 py-2">
                        {request.status === "Submitted" || request.status === "Pending" ? (
                          <span className="rounded bg-orange-100 px-2 py-1 text-[7px] font-semibold text-orange-600">
                            Pending
                          </span>
                        ) : (
                          <span className="rounded bg-green-100 px-2 py-1 text-[7px] font-semibold text-green-700">
                            Forwarded
                          </span>
                        )}
                      </td>

                      {/* ACTION CHECKBOX */}

                      <td className="border border-[#dfe5ef] px-2 py-2">
                        {request.status === "Submitted" || request.status === "Pending" ? (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                              toggleRow(request.id)
                            }
                            className="h-3.5 w-3.5 cursor-pointer accent-[#0754c7]"
                            title="Select request"
                          />
                        ) : (
                          <span className="text-[8px] text-green-600">
                            ✓
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

          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-[8px] font-semibold">
              Showing{" "}
              {exceptionRequests.length === 0
                ? 0
                : (currentPage - 1) * pageSize + 1}{" "}
              to{" "}
              {Math.min(currentPage * pageSize, exceptionRequests.length)}{" "}
              of {exceptionRequests.length} entries
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                disabled={currentPage === 1}
                className="text-gray-500 disabled:text-gray-300"
              >
                <ChevronLeft size={13} />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-5 w-5 items-center justify-center rounded text-[8px] font-bold ${currentPage === page
                        ? "bg-blue-600 text-white"
                        : "border border-[#dce4f0] text-[#172554]"
                      }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="text-gray-500 disabled:text-gray-300"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

          {/* =================================================
              NOTE
          ================================================= */}

          <div className="mx-3 mb-2 flex items-center gap-2 rounded bg-[#f3f7ff] px-3 py-2 text-[8px] text-blue-700">
            <Info size={12} />

            <span>
              <strong>Note:</strong> Only verified and valid
              exception requests will be forwarded to Payroll &
              Workforce Movement.
            </span>
          </div>

          {/* =================================================
              LEGEND
          ================================================= */}

          <div className="flex flex-wrap items-center gap-3 px-3 pb-2 text-[7px]">
            <span className="font-bold">
              Punch Correction Required Legend:
            </span>

            <span className="flex items-center gap-1 rounded border border-blue-100 px-2 py-1">
              <LogIn size={9} className="text-blue-600" />
              IN PUNCH MISSING – In time not recorded
            </span>

            <span className="flex items-center gap-1 rounded border border-orange-100 px-2 py-1">
              <LogOut size={9} className="text-orange-500" />
              OUT PUNCH MISSING – Out time not recorded
            </span>

            <span className="flex items-center gap-1 rounded border border-green-100 px-2 py-1">
              <Users size={9} className="text-green-600" />
              BOTH PUNCH MISSING – No in & out time recorded
            </span>
          </div>
        </section>

        {/* ===================================================
            BOTTOM ACTIONS
        =================================================== */}

        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 rounded border border-blue-400 bg-white px-4 py-2 text-[9px] font-semibold text-blue-600 hover:bg-blue-50"
          >
            <ArrowLeft size={13} />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            {/* FORWARD SELECTED */}

            <button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={handleForwardSelected}
              className="flex items-center gap-2 rounded border border-green-500 bg-white px-5 py-2 text-[9px] font-semibold text-green-600 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
            >
              <Send size={12} />

              Forward Selected

              {selectedIds.length > 0 && (
                <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[7px]">
                  {selectedIds.length}
                </span>
              )}
            </button>

            {/* FORWARD ALL */}

            <button
              type="button"
              disabled={pendingRequests.length === 0}
              onClick={handleForwardAll}
              className="flex items-center gap-2 rounded bg-green-600 px-5 py-2 text-[9px] font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <ArrowRight size={13} />
              Forward All
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

/* =============================================================
   SHIFT METRIC
============================================================= */

interface ShiftMetricProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  iconClass: string;
  valueClass: string;
  border?: boolean;
}

const ShiftMetric: React.FC<ShiftMetricProps> = ({
  icon,
  title,
  value,
  iconClass,
  valueClass,
  border = true,
}) => {
  return (
    <div
      className={`flex items-center justify-center gap-3 ${border ? "border-r border-[#e5eaf2]" : ""
        }`}
    >
      <div className={iconClass}>{icon}</div>

      <div>
        <div className="text-[8px] font-bold">{title}</div>

        <div
          className={`text-[23px] font-bold ${valueClass}`}
        >
          {value}
        </div>
      </div>
    </div>
  );
};

/* =============================================================
   SUMMARY CARD
============================================================= */

interface SummaryCardProps {
  icon: React.ReactNode;
  title: React.ReactNode;
  count: string;
  color: "blue" | "green" | "purple" | "orange" | "cyan";
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  icon,
  title,
  count,
  color,
}) => {
  const styles = {
    blue: {
      wrapper:
        "border-blue-100 bg-gradient-to-br from-white to-blue-50/60",
      icon: "bg-blue-100 text-blue-600",
      count: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700",
    },
    green: {
      wrapper:
        "border-green-100 bg-gradient-to-br from-white to-green-50/60",
      icon: "bg-green-100 text-green-600",
      count: "text-green-600",
      button: "bg-green-600 hover:bg-green-700",
    },
    purple: {
      wrapper:
        "border-purple-100 bg-gradient-to-br from-white to-purple-50/60",
      icon: "bg-purple-100 text-purple-600",
      count: "text-purple-600",
      button: "bg-purple-600 hover:bg-purple-700",
    },
    orange: {
      wrapper:
        "border-orange-100 bg-gradient-to-br from-white to-orange-50/60",
      icon: "bg-orange-100 text-orange-600",
      count: "text-orange-600",
      button: "bg-orange-500 hover:bg-orange-600",
    },
    cyan: {
      wrapper:
        "border-cyan-100 bg-gradient-to-br from-white to-cyan-50/60",
      icon: "bg-cyan-100 text-cyan-600",
      count: "text-cyan-600",
      button: "bg-cyan-600 hover:bg-cyan-700",
    },
  };

  const style = styles[color];

  return (
    <div
      className={`rounded-md border p-3 ${style.wrapper}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${style.icon}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <div className="text-[8px] font-bold leading-3">
            {title}
          </div>

          <div
            className={`mt-1 text-xl font-bold ${style.count}`}
          >
            {count}
          </div>

          <div className="text-[7px] text-gray-600">
            Pending Verification
          </div>

          <button
            type="button"
            className={`mt-1 flex w-full items-center justify-between rounded px-3 py-1 text-[7px] font-semibold text-white ${style.button}`}
          >
            View List
            <ArrowRight size={10} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* =============================================================
   PUNCH BADGE
============================================================= */

export default NormalExceptionRequest;