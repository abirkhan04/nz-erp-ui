import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  Clock3,
  FileOutput,
  RefreshCw,
  Search,
  Send,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { API_ROUTES } from "../../api/routes";
import { useGet } from "../../hooks/useGet";
import {usePost} from "../../hooks/usePost";
import CommonInputField from "../../components/CommonInputFields";
import {type Option} from "../../components/CommonInputFields";

interface NormalExceptionRequest {
  requestId: string;
  attendanceDate: string;
  employeeId: string;
  employeeName: string;
  department: string;
  exceptionType: string;
  shift: string;
  submittedBy: string;
  submittedOn: string;
  status: string;
}

interface FilterForm {
  requestId: string;
  employeeIdName: string;
  department: string;
  exceptionType: string;
  status: string;
  attendanceDateFrom: string;
  attendanceDateTo: string;
}

interface ApiResponse {
  data?: NormalExceptionRequest[];
  content?: NormalExceptionRequest[];
  totalCount?: number;
}

/* ============================================================
   OPTIONS
============================================================ */

const departmentOptions: Option[] = [
  { label: "All", value: "All" },
  { label: "Sewing", value: "Sewing" },
  { label: "Finishing", value: "Finishing" },
  { label: "Maintenance", value: "Maintenance" },
  { label: "Quality", value: "Quality" },
  { label: "Washing", value: "Washing" },
  { label: "Cutting", value: "Cutting" },
];

const exceptionTypeOptions: Option[] = [
  { label: "All", value: "All" },
  {
    label: "Missing Punch (Out)",
    value: "Missing Punch (Out)",
  },
  {
    label: "Missing Punch (In)",
    value: "Missing Punch (In)",
  },
  {
    label: "Late In Punch",
    value: "Late In Punch",
  },
  {
    label: "Early Out Punch",
    value: "Early Out Punch",
  },
  {
    label: "Shift Correction",
    value: "Shift Correction",
  },
  {
    label: "OT Correction",
    value: "OT Correction",
  },
];

const statusOptions: Option[] = [
  { label: "All", value: "All" },
  { label: "Pending", value: "Pending" },
  { label: "Forwarded", value: "Forwarded" },
  { label: "Rejected", value: "Rejected" },
];

/* ============================================================
   DEFAULT FILTER
============================================================ */

const defaultFilters: FilterForm = {
  requestId: "",
  employeeIdName: "",
  department: "All",
  exceptionType: "All",
  status: "Pending",
  attendanceDateFrom: "",
  attendanceDateTo: "",
};

/* ============================================================
   COMPONENT
============================================================ */

const NormalExceptionRequests: React.FC = () => {
  const navigate = useNavigate();

  /* ----------------------------------------------------------
     FILTER FORM
  ---------------------------------------------------------- */

  const {
    register,
    control,
    handleSubmit,
    reset,
  } = useForm<FilterForm>({
    defaultValues: defaultFilters,
  });

  const [appliedFilters, setAppliedFilters] =
    useState<FilterForm>(defaultFilters);

  /* ----------------------------------------------------------
     PAGINATION
  ---------------------------------------------------------- */

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /* ----------------------------------------------------------
     CHECKBOX SELECTION
  ---------------------------------------------------------- */

  const [selectedRequestIds, setSelectedRequestIds] =
    useState<string[]>([]);

  /* ----------------------------------------------------------
     REMARKS
  ---------------------------------------------------------- */
  const [remarks, setRemarks] = useState("");

  /* ----------------------------------------------------------
     GET REQUESTS
  ---------------------------------------------------------- */
  const {
    data: response,
    isLoading,
    refetch,
  } = useGet({
    key: ["normal-exception-requests"],
    url: "",
  });

  /* ----------------------------------------------------------
     NORMALIZE BACKEND RESPONSE
  ---------------------------------------------------------- */

  const requests: NormalExceptionRequest[] = useMemo(() => {
    if (!response) {
      return [];
    }

    const apiResponse = response as ApiResponse;

    if (Array.isArray(response)) {
      return response as NormalExceptionRequest[];
    }

    if (Array.isArray(apiResponse.data)) {
      return apiResponse.data;
    }

    if (Array.isArray(apiResponse.content)) {
      return apiResponse.content;
    }

    return [];
  }, [response]);

  /* ==========================================================
     FILTERING
  ========================================================== */

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      /* -------------------------------------------------------
         Request ID
      ------------------------------------------------------- */

      const matchesRequestId =
        !appliedFilters.requestId ||
        request.requestId
          .toLowerCase()
          .includes(
            appliedFilters.requestId.toLowerCase()
          );

      /* -------------------------------------------------------
         Employee ID / Name
      ------------------------------------------------------- */

      const employeeSearch =
        appliedFilters.employeeIdName
          .trim()
          .toLowerCase();

      const matchesEmployee =
        !employeeSearch ||
        request.employeeId
          .toLowerCase()
          .includes(employeeSearch) ||
        request.employeeName
          .toLowerCase()
          .includes(employeeSearch);

      /* -------------------------------------------------------
         Department
      ------------------------------------------------------- */

      const matchesDepartment =
        appliedFilters.department === "All" ||
        request.department === appliedFilters.department;

      /* -------------------------------------------------------
         Exception Type
      ------------------------------------------------------- */

      const matchesExceptionType =
        appliedFilters.exceptionType === "All" ||
        request.exceptionType ===
          appliedFilters.exceptionType;

      /* -------------------------------------------------------
         Status
      ------------------------------------------------------- */

      const matchesStatus =
        appliedFilters.status === "All" ||
        request.status === appliedFilters.status;

      /* -------------------------------------------------------
         Date From
      ------------------------------------------------------- */

      const requestDate = normalizeDate(
        request.attendanceDate
      );

      const fromDate = normalizeDate(
        appliedFilters.attendanceDateFrom
      );

      const toDate = normalizeDate(
        appliedFilters.attendanceDateTo
      );

      const matchesDateFrom =
        !fromDate ||
        !requestDate ||
        requestDate >= fromDate;

      /* -------------------------------------------------------
         Date To
      ------------------------------------------------------- */

      const matchesDateTo =
        !toDate ||
        !requestDate ||
        requestDate <= toDate;

      return (
        matchesRequestId &&
        matchesEmployee &&
        matchesDepartment &&
        matchesExceptionType &&
        matchesStatus &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
  }, [requests, appliedFilters]);

  /* ==========================================================
     PAGINATED DATA
  ========================================================== */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRequests.length / pageSize)
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedRequests = useMemo(() => {
    const startIndex =
      (safeCurrentPage - 1) * pageSize;

    return filteredRequests.slice(
      startIndex,
      startIndex + pageSize
    );
  }, [
    filteredRequests,
    safeCurrentPage,
    pageSize,
  ]);

  /* ==========================================================
     SELECTED REQUESTS
  ========================================================== */

  const selectedRequests = useMemo(() => {
    return requests.filter((request) =>
      selectedRequestIds.includes(request.requestId)
    );
  }, [requests, selectedRequestIds]);

  const selectedEmployees = useMemo(() => {
    return new Set(
      selectedRequests.map(
        (request) => request.employeeId
      )
    ).size;
  }, [selectedRequests]);

  const earliestAttendanceDate = useMemo(() => {
    if (!selectedRequests.length) {
      return "-";
    }

    const dates = selectedRequests
      .map((request) =>
        normalizeDate(request.attendanceDate)
      )
      .filter(Boolean)
      .sort();

    return dates[0] || "-";
  }, [selectedRequests]);

  const latestAttendanceDate = useMemo(() => {
    if (!selectedRequests.length) {
      return "-";
    }

    const dates = selectedRequests
      .map((request) =>
        normalizeDate(request.attendanceDate)
      )
      .filter(Boolean)
      .sort();

    return dates[dates.length - 1] || "-";
  }, [selectedRequests]);

  /* ==========================================================
     CHECKBOX LOGIC
  ========================================================== */

  const visibleRequestIds = paginatedRequests.map(
    (request) => request.requestId
  );

  const allVisibleSelected =
    visibleRequestIds.length > 0 &&
    visibleRequestIds.every((id) =>
      selectedRequestIds.includes(id)
    );

  const someVisibleSelected =
    visibleRequestIds.some((id) =>
      selectedRequestIds.includes(id)
    );

  const handleSelectAll = (
    checked: boolean
  ) => {
    if (checked) {
      setSelectedRequestIds((previous) => {
        const merged = new Set(previous);

        visibleRequestIds.forEach((id) => {
          merged.add(id);
        });

        return Array.from(merged);
      });

      return;
    }

    setSelectedRequestIds((previous) =>
      previous.filter(
        (id) => !visibleRequestIds.includes(id)
      )
    );
  };

  const handleSelectRequest = (
    requestId: string,
    checked: boolean
  ) => {
    setSelectedRequestIds((previous) => {
      if (checked) {
        if (previous.includes(requestId)) {
          return previous;
        }

        return [...previous, requestId];
      }

      return previous.filter(
        (id) => id !== requestId
      );
    });
  };

  /* ==========================================================
     SEARCH
  ========================================================== */

  const handleSearch = (values: FilterForm) => {
    setAppliedFilters(values);
    setCurrentPage(1);

    /*
     * Keep selected requests that still exist.
     * We don't automatically clear selections because the
     * selection is intentionally independent from filters.
     */
  };

  /* ==========================================================
     RESET FILTERS
  ========================================================== */

  const handleResetFilters = () => {
    reset(defaultFilters);
    setAppliedFilters(defaultFilters);
    setCurrentPage(1);
  };

  /* ==========================================================
     VIEW DETAILS
  ========================================================== */

  const handleViewRequest = (
    request: NormalExceptionRequest
  ) => {
    navigate(
      `/attendance-cell/normal-exception-requests/details?requestId=${encodeURIComponent(
        request.requestId
      )}`
    );
  };

  /* ==========================================================
     FORWARD SELECTED
  ========================================================== */

  const { mutate: forwardSelected, isPending: isForwarding } =
    usePost();

  const handleForwardSelected = () => {
    if (!selectedRequestIds.length) {
      return;
    }

    /*
     * Keep this payload according to your backend contract.
     *
     * If your existing API expects a different payload,
     * replace only this object.
     */

    const payload = selectedRequestIds.map(
      (requestId) => ({
        requestId,
        remarks,
      })
    );

    forwardSelected({
      url: API_ROUTES.NORMAL_EXCEPTION_REQUESTS_FORWARD,
      data: payload,
      onSuccess: () => {
        setSelectedRequestIds([]);
        setRemarks("");
        refetch();
      },
    });
  };

  /* ==========================================================
     CLEAR SELECTION
  ========================================================== */

  const handleClearSelection = () => {
    setSelectedRequestIds([]);
    setRemarks("");
  };

  /* ==========================================================
     PAGE CHANGE
  ========================================================== */

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  /* ==========================================================
     LOADING
  ========================================================== */

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-sm font-semibold text-[#0750df]">
          Loading exception requests...
        </div>
      </div>
    );
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="min-h-screen bg-white text-[#101b4b]">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="h-[59px] bg-[#082b87] px-5 text-white">
        <div className="flex h-full items-center justify-between">
          <div className="flex h-full items-center">
            {/* Logo */}

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
                Normal Exception Requests
              </div>
            </div>
          </div>

          {/* Header Right */}

          <div className="flex items-center gap-4">
            <div className="flex h-[32px] items-center gap-2 rounded bg-white px-3 text-[10px] font-semibold text-[#17275c]">
              <CalendarDays size={14} />

              15 May 2025 | Thursday
            </div>

            <div className="flex items-center gap-2 border-l border-white/30 pl-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                <Users
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

      {/* ======================================================
          PAGE
      ====================================================== */}

      <main className="px-6 pb-6 pt-4">
        {/* PAGE TITLE */}

        <div className="mb-3 flex items-start justify-between">
          <div>
            <h1 className="text-[15px] font-bold uppercase text-[#071d61]">
              NORMAL EXCEPTION REQUESTS
            </h1>

            <p className="mt-1 text-[9px] font-medium text-[#26345d]">
              View and manage normal attendance exceptions
              forwarded by Attendance Cell.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              className="flex h-[25px] items-center gap-1.5 rounded border border-[#c6d4ef] px-4 text-[9px] font-semibold text-[#0750df] hover:bg-[#f5f8ff]"
            >
              <RefreshCw size={11} />
              Refresh
            </button>

            <button
              type="button"
              disabled={
                selectedRequestIds.length === 0 ||
                isForwarding
              }
              onClick={handleForwardSelected}
              className="flex h-[25px] items-center gap-1.5 rounded bg-[#0752e6] px-4 text-[9px] font-bold text-white hover:bg-[#0644c5] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={11} />
              Forward All to Factory IT
            </button>
          </div>
        </div>

        {/* ====================================================
            STAT CARDS
        ==================================================== */}

        <div className="grid grid-cols-4 gap-3">
          <StatCard
            icon={<FileOutput size={18} />}
            iconClass="bg-[#edf3ff] text-[#1752df]"
            title="TOTAL REQUESTS"
            value={requests.length}
          />

          <StatCard
            icon={<Clock3 size={18} />}
            iconClass="bg-[#fff2e5] text-[#f27400]"
            title="PENDING WITH ME"
            value={
              requests.filter(
                (request) =>
                  request.status === "Pending"
              ).length
            }
          />

          <StatCard
            icon={<CircleCheck size={18} />}
            iconClass="bg-[#eaf8f0] text-[#20955b]"
            title="FORWARDED TO IT"
            value={
              requests.filter(
                (request) =>
                  request.status === "Forwarded"
              ).length
            }
          />

          <StatCard
            icon={<CircleX size={18} />}
            iconClass="bg-[#f3f1fb] text-[#66609c]"
            title="REJECTED"
            value={
              requests.filter(
                (request) =>
                  request.status === "Rejected"
              ).length
            }
          />
        </div>

        {/* ====================================================
            SEARCH & FILTER
        ==================================================== */}

        <section className="mt-3 rounded border border-[#dce4f2] bg-white p-3">
          <h2 className="mb-3 text-[10px] font-bold text-[#112b70]">
            Search &amp; Filter
          </h2>

          <form
            onSubmit={handleSubmit(handleSearch)}
          >
            <div className="grid grid-cols-7 gap-2">
              {/* Request ID */}

              <CommonInputField<FilterForm>
                label="Request ID"
                name="requestId"
                register={register}
                errors={{}}
                placeholder="Enter Request ID"
              />

              {/* Employee ID / Name */}

              <CommonInputField<FilterForm>
                label="Employee ID / Name"
                name="employeeIdName"
                register={register}
                errors={{}}
                placeholder="Search by ID or Name"
              />

              {/* Department */}

              <CommonInputField<FilterForm>
                label="Department"
                name="department"
                register={register}
                control={control}
                errors={{}}
                type="dropdown"
                options={departmentOptions}
                isPlaceholderVisible={false}
              />

              {/* Exception Type */}

              <CommonInputField<FilterForm>
                label="Exception Type"
                name="exceptionType"
                register={register}
                control={control}
                errors={{}}
                type="dropdown"
                options={exceptionTypeOptions}
                isPlaceholderVisible={false}
              />

              {/* Status */}

              <CommonInputField<FilterForm>
                label="Status"
                name="status"
                register={register}
                control={control}
                errors={{}}
                type="dropdown"
                options={statusOptions}
                isPlaceholderVisible={false}
              />

              {/* Date From */}

              <CommonInputField<FilterForm>
                label="Attendance Date From"
                name="attendanceDateFrom"
                register={register}
                control={control}
                errors={{}}
                type="date"
              />

              {/* Date To */}

              <CommonInputField<FilterForm>
                label="Attendance Date To"
                name="attendanceDateTo"
                register={register}
                control={control}
                errors={{}}
                type="date"
              />
            </div>

            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex h-[25px] items-center gap-1 rounded border border-[#ccd7eb] px-3 text-[9px] font-semibold text-[#26345d]"
              >
                Clear
              </button>

              <button
                type="submit"
                className="flex h-[25px] items-center gap-1.5 rounded bg-[#0752e6] px-4 text-[9px] font-bold text-white"
              >
                <Search size={11} />
                Search
              </button>
            </div>
          </form>
        </section>

        {/* ====================================================
            TABLE
        ==================================================== */}

        <section className="mt-3 rounded border border-[#dce4f2] bg-white">
          {/* Table Header */}

          <div className="flex items-center justify-between border-b border-[#e4e9f2] px-3 py-3">
            <h2 className="text-[10px] font-bold text-[#112b70]">
              Exception Requests List (Normal)
            </h2>

            <div className="flex items-center gap-2">
              <span className="text-[8px] text-[#586582]">
                {filteredRequests.length} record
                {filteredRequests.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </span>

              {/* Pagination top */}

              <button
                type="button"
                disabled={safeCurrentPage === 1}
                onClick={() =>
                  handlePageChange(
                    safeCurrentPage - 1
                  )
                }
                className="flex h-6 w-6 items-center justify-center rounded border border-[#d4ddec] disabled:opacity-40"
              >
                <ChevronLeft size={11} />
              </button>

              <span className="flex h-6 min-w-6 items-center justify-center rounded bg-[#0752e6] px-2 text-[8px] font-bold text-white">
                {safeCurrentPage}
              </span>

              <button
                type="button"
                disabled={
                  safeCurrentPage === totalPages
                }
                onClick={() =>
                  handlePageChange(
                    safeCurrentPage + 1
                  )
                }
                className="flex h-6 w-6 items-center justify-center rounded border border-[#d4ddec] disabled:opacity-40"
              >
                <ChevronRight size={11} />
              </button>
            </div>
          </div>

          {/* ==================================================
              TABLE
          ================================================== */}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#f7f9fd] text-[8px] font-bold text-[#182b5e]">
                  {/* IMPORTANT: FAR LEFT CHECKBOX */}

                  <th className="w-[35px] border-b border-[#e1e6ef] px-2 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      ref={(element) => {
                        if (element) {
                          element.indeterminate =
                            !allVisibleSelected &&
                            someVisibleSelected;
                        }
                      }}
                      onChange={(e) =>
                        handleSelectAll(
                          e.target.checked
                        )
                      }
                      className="h-3 w-3 cursor-pointer accent-[#0752e6]"
                    />
                  </th>

                  <th className="border-b border-[#e1e6ef] px-2 py-2 text-left">
                    Request ID
                  </th>

                  <th className="border-b border-[#e1e6ef] px-2 py-2 text-left">
                    Attendance Date
                  </th>

                  <th className="border-b border-[#e1e6ef] px-2 py-2 text-left">
                    Employee ID
                  </th>

                  <th className="border-b border-[#e1e6ef] px-2 py-2 text-left">
                    Employee Name
                  </th>

                  <th className="border-b border-[#e1e6ef] px-2 py-2 text-left">
                    Department
                  </th>

                  <th className="border-b border-[#e1e6ef] px-2 py-2 text-left">
                    Exception Type
                  </th>

                  <th className="border-b border-[#e1e6ef] px-2 py-2 text-left">
                    Shift
                  </th>

                  <th className="border-b border-[#e1e6ef] px-2 py-2 text-left">
                    Submitted By
                  </th>

                  <th className="border-b border-[#e1e6ef] px-2 py-2 text-left">
                    Submitted On
                  </th>

                  <th className="border-b border-[#e1e6ef] px-2 py-2 text-center">
                    Status
                  </th>

                  <th className="border-b border-[#e1e6ef] px-2 py-2 text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={12}
                      className="py-10 text-center text-[9px] text-[#6b7691]"
                    >
                      No exception requests found.
                    </td>
                  </tr>
                ) : (
                  paginatedRequests.map(
                    (request) => {
                      const isSelected =
                        selectedRequestIds.includes(
                          request.requestId
                        );

                      return (
                        <tr
                          key={request.requestId}
                          className={`text-[8px] ${
                            isSelected
                              ? "bg-[#f4f7ff]"
                              : "bg-white"
                          } hover:bg-[#f8faff]`}
                        >
                          {/* =================================================
                              INDIVIDUAL CHECKBOX
                              ================================================= */}

                          <td className="border-b border-[#edf0f5] px-2 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) =>
                                handleSelectRequest(
                                  request.requestId,
                                  e.target.checked
                                )
                              }
                              className="h-3 w-3 cursor-pointer accent-[#0752e6]"
                            />
                          </td>

                          <td className="border-b border-[#edf0f5] px-2 py-2 font-semibold text-[#173d9b]">
                            {request.requestId}
                          </td>

                          <td className="border-b border-[#edf0f5] px-2 py-2 whitespace-nowrap">
                            {formatDisplayDate(
                              request.attendanceDate
                            )}
                          </td>

                          <td className="border-b border-[#edf0f5] px-2 py-2">
                            {request.employeeId}
                          </td>

                          <td className="border-b border-[#edf0f5] px-2 py-2 font-medium">
                            {request.employeeName}
                          </td>

                          <td className="border-b border-[#edf0f5] px-2 py-2">
                            {request.department}
                          </td>

                          <td className="border-b border-[#edf0f5] px-2 py-2">
                            {request.exceptionType}
                          </td>

                          <td className="border-b border-[#edf0f5] px-2 py-2 whitespace-nowrap">
                            {request.shift}
                          </td>

                          <td className="border-b border-[#edf0f5] px-2 py-2">
                            {request.submittedBy}
                          </td>

                          <td className="border-b border-[#edf0f5] px-2 py-2 whitespace-nowrap">
                            {request.submittedOn}
                          </td>

                          <td className="border-b border-[#edf0f5] px-2 py-2 text-center">
                            <StatusBadge
                              status={request.status}
                            />
                          </td>

                          <td className="border-b border-[#edf0f5] px-2 py-2 text-center">
                            <button
                              type="button"
                              onClick={() =>
                                handleViewRequest(
                                  request
                                )
                              }
                              className="rounded border border-[#bfd0ef] px-2 py-1 text-[8px] font-semibold text-[#0752df] hover:bg-[#f3f7ff]"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    }
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* ==================================================
              TABLE FOOTER
          ================================================== */}

          <div className="flex items-center justify-between border-t border-[#e5e9f1] px-3 py-2">
            <div className="flex items-center gap-2 text-[8px] text-[#4c5878]">
              <span>Show</span>

              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(
                    Number(e.target.value)
                  );
                  setCurrentPage(1);
                }}
                className="h-6 rounded border border-[#d4ddec] px-2 text-[8px] outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>

              <span>entries per page</span>
            </div>

            <div className="text-[8px] text-[#68728c]">
              Showing{" "}
              {filteredRequests.length === 0
                ? 0
                : (safeCurrentPage - 1) *
                    pageSize +
                  1}{" "}
              to{" "}
              {Math.min(
                safeCurrentPage * pageSize,
                filteredRequests.length
              )}{" "}
              of {filteredRequests.length}
            </div>
          </div>
        </section>

        {/* ====================================================
            SELECTED REQUEST SUMMARY + REMARKS
        ==================================================== */}

        <div className="mt-3 grid grid-cols-[1fr_1fr] gap-3">
          {/* Selected Summary */}

          <section className="rounded border border-[#dce4f2] bg-white p-3">
            <h2 className="text-[9px] font-bold text-[#112b70]">
              Selected Requests Summary
            </h2>

            <div className="mt-3 grid grid-cols-2 gap-y-3 text-[8px]">
              <SummaryValue
                label="Total Selected"
                value={selectedRequestIds.length}
              />

              <SummaryValue
                label="Earliest Attendance Date"
                value={earliestAttendanceDate}
              />

              <SummaryValue
                label="Total Employees"
                value={selectedEmployees}
              />

              <SummaryValue
                label="Latest Attendance Date"
                value={latestAttendanceDate}
              />
            </div>
          </section>

          {/* Remarks */}

          <section className="rounded border border-[#dce4f2] bg-white p-3">
            <h2 className="text-[9px] font-bold text-[#112b70]">
              Remarks (Optional)
            </h2>

            <textarea
              value={remarks}
              maxLength={250}
              onChange={(e) =>
                setRemarks(e.target.value)
              }
              placeholder="Enter remarks before forwarding..."
              className="mt-2 h-[49px] w-full resize-none rounded border border-[#d6deeb] p-2 text-[8px] outline-none focus:border-[#0752e6]"
            />

            <div className="mt-1 flex justify-between text-[7px] text-[#7d88a1]">
              <span>
                Maximum 250 characters allowed
              </span>

              <span>
                {remarks.length}/250
              </span>
            </div>
          </section>
        </div>

        {/* ====================================================
            BOTTOM ACTIONS
        ==================================================== */}

        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClearSelection}
            className="h-[27px] rounded border border-[#cbd7eb] px-5 text-[9px] font-semibold text-[#26345d] hover:bg-[#f7f9fd]"
          >
            Clear
          </button>

          <button
            type="button"
            disabled={
              selectedRequestIds.length === 0 ||
              isForwarding
            }
            onClick={handleForwardSelected}
            className="flex h-[27px] items-center gap-1.5 rounded bg-[#0752e6] px-5 text-[9px] font-bold text-white hover:bg-[#0644c5] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={11} />

            {isForwarding
              ? "Forwarding..."
              : "Forward Selected to Factory IT"}

            <ArrowRight size={12} />
          </button>
        </div>
      </main>
    </div>
  );
};

/* ================================================================
   STAT CARD
================================================================ */

interface StatCardProps {
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  value: number;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  iconClass,
  title,
  value,
}) => {
  return (
    <div className="flex h-[58px] items-center gap-3 rounded border border-[#dfe6f2] bg-white px-4">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full ${iconClass}`}
      >
        {icon}
      </div>

      <div>
        <div className="text-[8px] font-bold text-[#52607f]">
          {title}
        </div>

        <div className="mt-1 text-[18px] font-bold leading-none text-[#14204e]">
          {value}
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   STATUS BADGE
================================================================ */

const StatusBadge: React.FC<{
  status: string;
}> = ({ status }) => {
  const normalizedStatus =
    status.toLowerCase();

  let className =
    "bg-[#edf2ff] text-[#1851d6]";

  if (normalizedStatus === "pending") {
    className =
      "bg-[#fff0dc] text-[#d96100]";
  }

  if (normalizedStatus === "forwarded") {
    className =
      "bg-[#e7f7ee] text-[#15804e]";
  }

  if (normalizedStatus === "rejected") {
    className =
      "bg-[#ffe9eb] text-[#d53548]";
  }

  return (
    <span
      className={`inline-flex rounded px-2 py-1 text-[7px] font-bold ${className}`}
    >
      {status}
    </span>
  );
};

/* ================================================================
   SUMMARY VALUE
================================================================ */

const SummaryValue: React.FC<{
  label: string;
  value: string | number;
}> = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between border-r border-[#e7ebf2] pr-5">
      <span className="font-medium text-[#4c5877]">
        {label}
      </span>

      <span className="font-bold text-[#162453]">
        {value}
      </span>
    </div>
  );
};

/* ================================================================
   DATE NORMALIZATION
================================================================ */

const normalizeDate = (
  value?: string
): string => {
  if (!value) {
    return "";
  }

  /*
   * yyyy-MM-dd
   */

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  /*
   * dd-MM-yyyy
   */

  const ddMmYyyy = value.match(
    /^(\d{2})-(\d{2})-(\d{4})$/
  );

  if (ddMmYyyy) {
    return `${ddMmYyyy[3]}-${ddMmYyyy[2]}-${ddMmYyyy[1]}`;
  }

  /*
   * dd/MM/yyyy
   */

  const ddMmSlash = value.match(
    /^(\d{2})\/(\d{2})\/(\d{4})$/
  );

  if (ddMmSlash) {
    return `${ddMmSlash[3]}-${ddMmSlash[2]}-${ddMmSlash[1]}`;
  }

  /*
   * Example:
   * 14 May 2025
   */

  const parsed = new Date(value);

  if (!Number.isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = String(
      parsed.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      parsed.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return value;
};

/* ================================================================
   DISPLAY DATE
================================================================ */

const formatDisplayDate = (
  value?: string
): string => {
  if (!value) {
    return "-";
  }

  const normalized =
    normalizeDate(value);

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      normalized
    )
  ) {
    return value;
  }

  const [
    year,
    month,
    day,
  ] = normalized.split("-");

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${day} ${months[Number(month) - 1]} ${year}`;
};

export default NormalExceptionRequests;