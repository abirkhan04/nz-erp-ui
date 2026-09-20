import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  Clock3,
  Download,
  FileOutput,
  Info,
  RefreshCw,
  Search,
  Send,
  Users,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import CommonInputField, {
  type Option,
} from "../../components/CommonInputFields";

/* ============================================================
   TYPES
============================================================ */

interface PayrollExceptionRequest {
  requestId: string;
  attendanceDate: string;
  employeeId: string;
  employeeName: string;
  department: string;
  adjustmentType: string;
  shift: string;
  impact: number;
  submittedBy: string;
  submittedOn: string;
  status: "Pending" | "Forwarded" | "Rejected";
}

interface PayrollFilterForm {
  requestId: string;
  employeeIdName: string;
  department: string;
  adjustmentType: string;
  status: string;
  attendanceDateFrom: string;
  attendanceDateTo: string;
}

/* ============================================================
   MOCK DATA
============================================================ */

const MOCK_REQUESTS: PayrollExceptionRequest[] = [
  {
    requestId: "PAY2505012",
    attendanceDate: "2025-05-10",
    employeeId: "102346",
    employeeName: "Md. Rahman",
    department: "Spinning",
    adjustmentType: "Post-Lock Correction",
    shift: "B (02:00 PM - 10:00 PM)",
    impact: 700,
    submittedBy: "Attendance Cell",
    submittedOn: "15 May 2025 09:25 AM",
    status: "Pending",
  },
  {
    requestId: "PA-2025-0515-0002",
    attendanceDate: "2025-05-08",
    employeeId: "102512",
    employeeName: "Jannatul Ferdous",
    department: "Weaving",
    adjustmentType: "Post-Lock OT Addition",
    shift: "A (06:00 AM - 02:00 PM)",
    impact: 1250,
    submittedBy: "Attendance Cell",
    submittedOn: "15 May 2025 09:40 AM",
    status: "Pending",
  },
  {
    requestId: "PA-2025-0515-0003",
    attendanceDate: "2025-05-07",
    employeeId: "102789",
    employeeName: "Kamrul Hasan",
    department: "Maintenance",
    adjustmentType: "Post-Lock Correction",
    shift: "C (10:00 PM - 06:00 AM)",
    impact: 550,
    submittedBy: "Attendance Cell",
    submittedOn: "15 May 2025 10:00 AM",
    status: "Pending",
  },
  {
    requestId: "PA-2025-0515-0004",
    attendanceDate: "2025-05-09",
    employeeId: "103045",
    employeeName: "Akter Hossain",
    department: "Finishing",
    adjustmentType: "Post-Lock Leave Adj.",
    shift: "A (06:00 AM - 02:00 PM)",
    impact: 375,
    submittedBy: "Attendance Cell",
    submittedOn: "15 May 2025 10:20 AM",
    status: "Pending",
  },
  {
    requestId: "PA-2025-0515-0005",
    attendanceDate: "2025-05-06",
    employeeId: "101223",
    employeeName: "Rasheda Akter",
    department: "Cutting",
    adjustmentType: "Post-Lock OT Addition",
    shift: "B (02:00 PM - 10:00 PM)",
    impact: 950,
    submittedBy: "Attendance Cell",
    submittedOn: "15 May 2025 10:35 AM",
    status: "Pending",
  },
  {
    requestId: "PA-2025-0515-0006",
    attendanceDate: "2025-05-05",
    employeeId: "103678",
    employeeName: "Pushpa Rani",
    department: "Cutting",
    adjustmentType: "Post-Lock Correction",
    shift: "A (06:00 AM - 02:00 PM)",
    impact: 300,
    submittedBy: "Attendance Cell",
    submittedOn: "15 May 2025 10:45 AM",
    status: "Pending",
  },
  {
    requestId: "PA-2025-0515-0007",
    attendanceDate: "2025-05-08",
    employeeId: "102913",
    employeeName: "Shofiul Islam",
    department: "Dyeing",
    adjustmentType: "Post-Lock Shift Change",
    shift: "C (10:00 PM - 06:00 AM)",
    impact: 0,
    submittedBy: "Attendance Cell",
    submittedOn: "15 May 2025 10:55 AM",
    status: "Pending",
  },

  {
    requestId: "PA-2025-0515-0008",
    attendanceDate: "2025-05-04",
    employeeId: "104211",
    employeeName: "Mizanur Rahman",
    department: "Spinning",
    adjustmentType: "Post-Lock Correction",
    shift: "A (06:00 AM - 02:00 PM)",
    impact: 450,
    submittedBy: "Attendance Cell",
    submittedOn: "15 May 2025 11:00 AM",
    status: "Pending",
  },
  {
    requestId: "PA-2025-0515-0009",
    attendanceDate: "2025-05-03",
    employeeId: "103211",
    employeeName: "Shahana Akter",
    department: "Quality",
    adjustmentType: "Post-Lock OT Addition",
    shift: "B (02:00 PM - 10:00 PM)",
    impact: 800,
    submittedBy: "Attendance Cell",
    submittedOn: "15 May 2025 11:05 AM",
    status: "Pending",
  },
  {
    requestId: "PA-2025-0515-0010",
    attendanceDate: "2025-05-02",
    employeeId: "102345",
    employeeName: "Jamal Uddin",
    department: "Washing",
    adjustmentType: "Post-Lock Correction",
    shift: "C (10:00 PM - 06:00 AM)",
    impact: 250,
    submittedBy: "Attendance Cell",
    submittedOn: "15 May 2025 11:10 AM",
    status: "Pending",
  },
  {
    requestId: "PA-2025-0515-0011",
    attendanceDate: "2025-05-01",
    employeeId: "103876",
    employeeName: "Nusrat Jahan",
    department: "Finishing",
    adjustmentType: "Post-Lock Leave Adj.",
    shift: "A (06:00 AM - 02:00 PM)",
    impact: 400,
    submittedBy: "Attendance Cell",
    submittedOn: "15 May 2025 11:15 AM",
    status: "Pending",
  },
  {
    requestId: "PA-2025-0515-0012",
    attendanceDate: "2025-05-04",
    employeeId: "101876",
    employeeName: "Abdul Karim",
    department: "Sewing",
    adjustmentType: "Post-Lock Correction",
    shift: "B (02:00 PM - 10:00 PM)",
    impact: 600,
    submittedBy: "Attendance Cell",
    submittedOn: "15 May 2025 11:20 AM",
    status: "Pending",
  },
  {
    requestId: "PA-2025-0515-0013",
    attendanceDate: "2025-05-05",
    employeeId: "102123",
    employeeName: "Rina Parvin",
    department: "Sewing",
    adjustmentType: "Post-Lock OT Addition",
    shift: "C (10:00 PM - 06:00 AM)",
    impact: 1100,
    submittedBy: "Attendance Cell",
    submittedOn: "15 May 2025 11:25 AM",
    status: "Pending",
  },
  {
    requestId: "PA-2025-0515-0014",
    attendanceDate: "2025-05-06",
    employeeId: "102678",
    employeeName: "Md. Salim",
    department: "Maintenance",
    adjustmentType: "Post-Lock Correction",
    shift: "A (06:00 AM - 02:00 PM)",
    impact: 500,
    submittedBy: "Attendance Cell",
    submittedOn: "15 May 2025 11:30 AM",
    status: "Pending",
  },
  {
    requestId: "PA-2025-0515-0015",
    attendanceDate: "2025-05-07",
    employeeId: "103456",
    employeeName: "Farhana Yasmin",
    department: "Quality",
    adjustmentType: "Post-Lock OT Addition",
    shift: "B (02:00 PM - 10:00 PM)",
    impact: 900,
    submittedBy: "Attendance Cell",
    submittedOn: "15 May 2025 11:35 AM",
    status: "Forwarded",
  },
  {
    requestId: "PA-2025-0515-0016",
    attendanceDate: "2025-05-08",
    employeeId: "104567",
    employeeName: "Sohel Rana",
    department: "Dyeing",
    adjustmentType: "Post-Lock Correction",
    shift: "C (10:00 PM - 06:00 AM)",
    impact: 350,
    submittedBy: "Attendance Cell",
    submittedOn: "15 May 2025 11:40 AM",
    status: "Forwarded",
  },
  {
    requestId: "PA-2025-0515-0017",
    attendanceDate: "2025-05-09",
    employeeId: "102456",
    employeeName: "Mousumi Akter",
    department: "Weaving",
    adjustmentType: "Post-Lock Leave Adj.",
    shift: "A (06:00 AM - 02:00 PM)",
    impact: 275,
    submittedBy: "Attendance Cell",
    submittedOn: "15 May 2025 11:45 AM",
    status: "Forwarded",
  },
  {
    requestId: "PA-2025-0515-0018",
    attendanceDate: "2025-05-10",
    employeeId: "101567",
    employeeName: "Ruhul Amin",
    department: "Spinning",
    adjustmentType: "Post-Lock Correction",
    shift: "B (02:00 PM - 10:00 PM)",
    impact: 725,
    submittedBy: "Attendance Cell",
    submittedOn: "15 May 2025 11:50 AM",
    status: "Forwarded",
  },
  {
    requestId: "PA-2025-0515-0019",
    attendanceDate: "2025-05-08",
    employeeId: "103567",
    employeeName: "Tania Sultana",
    department: "Cutting",
    adjustmentType: "Post-Lock OT Addition",
    shift: "C (10:00 PM - 06:00 AM)",
    impact: 650,
    submittedBy: "Attendance Cell",
    submittedOn: "15 May 2025 11:55 AM",
    status: "Forwarded",
  },
  {
    requestId: "PA-2025-0515-0020",
    attendanceDate: "2025-05-07",
    employeeId: "102987",
    employeeName: "Hasan Mahmud",
    department: "Finishing",
    adjustmentType: "Post-Lock Correction",
    shift: "A (06:00 AM - 02:00 PM)",
    impact: 425,
    submittedBy: "Attendance Cell",
    submittedOn: "15 May 2025 12:00 PM",
    status: "Rejected",
  },
  {
    requestId: "PA-2025-0515-0021",
    attendanceDate: "2025-05-06",
    employeeId: "101987",
    employeeName: "Shamima Begum",
    department: "Sewing",
    adjustmentType: "Post-Lock Shift Change",
    shift: "B (02:00 PM - 10:00 PM)",
    impact: 0,
    submittedBy: "Attendance Cell",
    submittedOn: "15 May 2025 12:05 PM",
    status: "Pending",
  },
];

/* ============================================================
   OPTIONS
============================================================ */

const departmentOptions: Option[] = [
  { label: "All", value: "All" },
  { label: "Spinning", value: "Spinning" },
  { label: "Weaving", value: "Weaving" },
  { label: "Maintenance", value: "Maintenance" },
  { label: "Finishing", value: "Finishing" },
  { label: "Cutting", value: "Cutting" },
  { label: "Dyeing", value: "Dyeing" },
  { label: "Quality", value: "Quality" },
  { label: "Washing", value: "Washing" },
  { label: "Sewing", value: "Sewing" },
];

const adjustmentTypeOptions: Option[] = [
  { label: "All", value: "All" },
  {
    label: "Post-Lock Correction",
    value: "Post-Lock Correction",
  },
  {
    label: "Post-Lock OT Addition",
    value: "Post-Lock OT Addition",
  },
  {
    label: "Post-Lock Leave Adj.",
    value: "Post-Lock Leave Adj.",
  },
  {
    label: "Post-Lock Shift Change",
    value: "Post-Lock Shift Change",
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

const defaultFilters: PayrollFilterForm = {
  requestId: "",
  employeeIdName: "",
  department: "All",
  adjustmentType: "All",
  status: "Pending",
  attendanceDateFrom: "",
  attendanceDateTo: "",
};

/* ============================================================
   COMPONENT
============================================================ */

const PayrollExceptionRequestPostLock: React.FC = () => {
  const navigate = useNavigate();

  /* ----------------------------------------------------------
     FORM
  ---------------------------------------------------------- */

  const {
    register,
    control,
    handleSubmit,
    reset,
  } = useForm<PayrollFilterForm>({
    defaultValues: defaultFilters,
  });

  const [appliedFilters, setAppliedFilters] =
    useState<PayrollFilterForm>(defaultFilters);

  /* ----------------------------------------------------------
     PAGINATION
  ---------------------------------------------------------- */

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /* ----------------------------------------------------------
     SELECTION
  ---------------------------------------------------------- */

  const [selectedRequestIds, setSelectedRequestIds] =
    useState<string[]>([]);

  /* ----------------------------------------------------------
     REMARKS
  ---------------------------------------------------------- */

  const [remarks, setRemarks] = useState("");

  /* ----------------------------------------------------------
     FORWARDING STATE
  ---------------------------------------------------------- */

  const [isForwarding, setIsForwarding] =
    useState(false);

  /* ==========================================================
     FILTER DATA
  ========================================================== */

  const filteredRequests = useMemo(() => {
    return MOCK_REQUESTS.filter((request) => {
      const requestIdSearch =
        appliedFilters.requestId
          .trim()
          .toLowerCase();

      const employeeSearch =
        appliedFilters.employeeIdName
          .trim()
          .toLowerCase();

      const matchesRequestId =
        !requestIdSearch ||
        request.requestId
          .toLowerCase()
          .includes(requestIdSearch);

      const matchesEmployee =
        !employeeSearch ||
        request.employeeId
          .toLowerCase()
          .includes(employeeSearch) ||
        request.employeeName
          .toLowerCase()
          .includes(employeeSearch);

      const matchesDepartment =
        appliedFilters.department === "All" ||
        request.department ===
          appliedFilters.department;

      const matchesAdjustmentType =
        appliedFilters.adjustmentType === "All" ||
        request.adjustmentType ===
          appliedFilters.adjustmentType;

      const matchesStatus =
        appliedFilters.status === "All" ||
        request.status ===
          appliedFilters.status;

      const matchesDateFrom =
        !appliedFilters.attendanceDateFrom ||
        request.attendanceDate >=
          appliedFilters.attendanceDateFrom;

      const matchesDateTo =
        !appliedFilters.attendanceDateTo ||
        request.attendanceDate <=
          appliedFilters.attendanceDateTo;

      return (
        matchesRequestId &&
        matchesEmployee &&
        matchesDepartment &&
        matchesAdjustmentType &&
        matchesStatus &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
  }, [appliedFilters]);

  /* ==========================================================
     PAGINATION
  ========================================================== */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredRequests.length / pageSize
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedRequests = useMemo(() => {
    const start =
      (safeCurrentPage - 1) * pageSize;

    return filteredRequests.slice(
      start,
      start + pageSize
    );
  }, [
    filteredRequests,
    safeCurrentPage,
    pageSize,
  ]);

  /* ==========================================================
     SELECTION
  ========================================================== */

  const selectedRequests = useMemo(() => {
    return MOCK_REQUESTS.filter((request) =>
      selectedRequestIds.includes(
        request.requestId
      )
    );
  }, [selectedRequestIds]);

  const selectedEmployeeCount = useMemo(() => {
    return new Set(
      selectedRequests.map(
        (request) => request.employeeId
      )
    ).size;
  }, [selectedRequests]);

  const totalImpact = useMemo(() => {
    return selectedRequests.reduce(
      (sum, request) =>
        sum + request.impact,
      0
    );
  }, [selectedRequests]);

  const earliestDate = useMemo(() => {
    if (!selectedRequests.length) {
      return "-";
    }

    return formatDisplayDate(
      [...selectedRequests]
        .sort((a, b) =>
          a.attendanceDate.localeCompare(
            b.attendanceDate
          )
        )[0].attendanceDate
    );
  }, [selectedRequests]);

  const latestDate = useMemo(() => {
    if (!selectedRequests.length) {
      return "-";
    }

    return formatDisplayDate(
      [...selectedRequests]
        .sort((a, b) =>
          b.attendanceDate.localeCompare(
            a.attendanceDate
          )
        )[0].attendanceDate
    );
  }, [selectedRequests]);

  /* ==========================================================
     CURRENT PAGE SELECTION
  ========================================================== */

  const visibleIds = paginatedRequests.map(
    (request) => request.requestId
  );

  const allVisibleSelected =
    visibleIds.length > 0 &&
    visibleIds.every((id) =>
      selectedRequestIds.includes(id)
    );

  const someVisibleSelected =
    visibleIds.some((id) =>
      selectedRequestIds.includes(id)
    );

  /* ==========================================================
     SELECT ALL
  ========================================================== */

  const handleSelectAll = (
    checked: boolean
  ) => {
    if (checked) {
      setSelectedRequestIds((previous) => {
        const next = new Set(previous);

        visibleIds.forEach((id) =>
          next.add(id)
        );

        return Array.from(next);
      });

      return;
    }

    setSelectedRequestIds((previous) =>
      previous.filter(
        (id) => !visibleIds.includes(id)
      )
    );
  };

  /* ==========================================================
     INDIVIDUAL CHECKBOX
  ========================================================== */

  const handleSelectRequest = (
    requestId: string,
    checked: boolean
  ) => {
    setSelectedRequestIds((previous) => {
      if (checked) {
        if (
          previous.includes(requestId)
        ) {
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

  const handleSearch = (
    values: PayrollFilterForm
  ) => {
    setAppliedFilters(values);
    setCurrentPage(1);
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
     CLEAR SELECTION
  ========================================================== */

  const handleClearSelection = () => {
    setSelectedRequestIds([]);
    setRemarks("");
  };

  /* ==========================================================
     FORWARD
  ========================================================== */

  const handleForwardSelected = () => {
    if (!selectedRequestIds.length) {
      return;
    }

    setIsForwarding(true);

    /*
     * Mock API delay
     */

    setTimeout(() => {
      setIsForwarding(false);

      setSelectedRequestIds([]);
      setRemarks("");

      alert(
        `${selectedRequestIds.length} request(s) forwarded to Head Office IT.`
      );
    }, 700);
  };

  /* ==========================================================
     VIEW DETAILS
  ========================================================== */

  const handleViewRequest = (
    request: PayrollExceptionRequest
  ) => {
    navigate(
      `/payroll-and-workforce-movement/attendance-cell/exception-request/payroll-adjustment/${request.requestId}`
    );
  };

  /* ==========================================================
     REFRESH
  ========================================================== */

  const handleRefresh = () => {
    /*
     * Mock data doesn't require a real API call.
     * This is intentionally left as a refresh action.
     */
    setAppliedFilters((previous) => ({
      ...previous,
    }));
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="min-h-screen bg-white text-[#14204e]">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="h-[59px] bg-[#082b87] px-5 text-white">
        <div className="flex h-full items-center justify-between">
          {/* LEFT */}

          <div className="flex h-full items-center">
            <div className="flex items-center gap-2 pr-5">
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded bg-white">
                <span className="text-[31px] font-bold leading-none text-[#173e98]">
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
                <span className="mx-2">
                  &gt;
                </span>
                Payroll Exception Requests (Post-Lock)
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-4">
            <div className="flex h-[32px] items-center gap-2 rounded bg-white px-3 text-[10px] font-semibold text-[#17275c]">
              <CalendarDays size={14} />

              15 May 2025 | Thursday
            </div>

            <div className="flex items-center gap-2 border-l border-white/30 pl-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                <Users
                  size={17}
                  className="text-[#173e98]"
                />
              </div>

              <div className="text-[8px] leading-[1.3]">
                <div className="font-bold">
                  Nusrat Jahan
                </div>
                <div>Attendance &amp; Workforce</div>
                <div>Movement Section</div>
              </div>

              <ChevronRight
                size={11}
                className="rotate-90"
              />
            </div>
          </div>
        </div>
      </header>

      {/* ======================================================
          PAGE CONTENT
      ====================================================== */}

      <main className="px-6 pb-6 pt-4">
        {/* ====================================================
            TITLE + TOP ACTIONS
        ==================================================== */}

        <div className="mb-3 flex items-start justify-between">
          <div>
            <h1 className="text-[15px] font-bold uppercase text-[#f05a00]">
              PAYROLL EXCEPTION REQUEST (POST-LOCK)
            </h1>

            <p className="mt-1 text-[9px] font-medium text-[#26345d]">
              Review and forward post-lock attendance
              adjustments to Head Office IT for payroll
              processing.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRefresh}
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
              className="flex h-[25px] items-center gap-1.5 rounded bg-[#ff6900] px-4 text-[9px] font-bold text-white hover:bg-[#e95d00] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={11} />
              Forward All to Head Office IT
            </button>
          </div>
        </div>

        {/* ====================================================
            STAT CARDS
        ==================================================== */}

        <div className="grid grid-cols-4 gap-3">
          <StatCard
            title="TOTAL REQUESTS"
            value={
              MOCK_REQUESTS.length
            }
            icon={
              <FileOutput size={18} />
            }
            iconClass="bg-[#edf3ff] text-[#1752df]"
          />

          <StatCard
            title="PENDING WITH ME"
            value={
              MOCK_REQUESTS.filter(
                (request) =>
                  request.status ===
                  "Pending"
              ).length
            }
            icon={
              <Clock3 size={18} />
            }
            iconClass="bg-[#fff1df] text-[#f27400]"
          />

          <StatCard
            title="FORWARDED TO HO IT"
            value={
              MOCK_REQUESTS.filter(
                (request) =>
                  request.status ===
                  "Forwarded"
              ).length
            }
            icon={
              <Send size={18} />
            }
            iconClass="bg-[#eaf8f0] text-[#20955b]"
          />

          <StatCard
            title="REJECTED"
            value={
              MOCK_REQUESTS.filter(
                (request) =>
                  request.status ===
                  "Rejected"
              ).length
            }
            icon={
              <CircleX size={18} />
            }
            iconClass="bg-[#fff0f0] text-[#ed3748]"
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
            onSubmit={handleSubmit(
              handleSearch
            )}
          >
            <div className="grid grid-cols-7 gap-2">
              {/* REQUEST ID */}

              <CommonInputField<PayrollFilterForm>
                label="Request ID"
                name="requestId"
                register={register}
                errors={{}}
                placeholder="Enter Request ID"
              />

              {/* EMPLOYEE ID / NAME */}

              <CommonInputField<PayrollFilterForm>
                label="Employee ID / Name"
                name="employeeIdName"
                register={register}
                errors={{}}
                placeholder="Search by ID or Name"
              />

              {/* DEPARTMENT */}

              <CommonInputField<PayrollFilterForm>
                label="Department"
                name="department"
                register={register}
                control={control}
                errors={{}}
                type="dropdown"
                options={departmentOptions}
                isPlaceholderVisible={false}
              />

              {/* ADJUSTMENT TYPE */}

              <CommonInputField<PayrollFilterForm>
                label="Adjustment Type"
                name="adjustmentType"
                register={register}
                control={control}
                errors={{}}
                type="dropdown"
                options={adjustmentTypeOptions}
                isPlaceholderVisible={false}
              />

              {/* STATUS */}

              <CommonInputField<PayrollFilterForm>
                label="Status"
                name="status"
                register={register}
                control={control}
                errors={{}}
                type="dropdown"
                options={statusOptions}
                isPlaceholderVisible={false}
              />

              {/* DATE FROM */}

              <CommonInputField<PayrollFilterForm>
                label="Attendance Date From"
                name="attendanceDateFrom"
                register={register}
                control={control}
                errors={{}}
                type="date"
              />

              {/* DATE TO */}

              <CommonInputField<PayrollFilterForm>
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
                onClick={
                  handleResetFilters
                }
                className="h-[25px] rounded border border-[#ccd7eb] px-4 text-[9px] font-semibold text-[#26345d]"
              >
                Clear
              </button>

              <button
                type="submit"
                className="flex h-[25px] items-center gap-1.5 rounded bg-[#ff6900] px-5 text-[9px] font-bold text-white hover:bg-[#e95d00]"
              >
                <Search size={11} />
                Search
              </button>
            </div>
          </form>
        </section>

        {/* ====================================================
            MAIN BODY
        ==================================================== */}

        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_196px] gap-5">
          {/* ==================================================
              LEFT
          ================================================== */}

          <div className="min-w-0">
            {/* TABLE */}

            <section className="rounded border border-[#dce4f2] bg-white">
              <div className="flex items-center justify-between border-b border-[#e4e9f2] px-3 py-3">
                <h2 className="text-[10px] font-bold text-[#112b70]">
                  Payroll Exception Requests
                  (Post-Lock)
                </h2>

                <div className="flex items-center gap-2">
                  <span className="text-[8px] text-[#586582]">
                    {
                      filteredRequests.length
                    }{" "}
                    record(s) found
                  </span>

                  <button
                    type="button"
                    disabled={
                      safeCurrentPage ===
                      1
                    }
                    onClick={() =>
                      setCurrentPage(
                        (page) =>
                          Math.max(
                            1,
                            page - 1
                          )
                      )
                    }
                    className="flex h-6 w-6 items-center justify-center rounded border border-[#d4ddec] disabled:opacity-40"
                  >
                    <ChevronLeft
                      size={11}
                    />
                  </button>

                  <span className="flex h-6 min-w-6 items-center justify-center rounded bg-[#ff6900] px-2 text-[8px] font-bold text-white">
                    {safeCurrentPage}
                  </span>

                  <button
                    type="button"
                    disabled={
                      safeCurrentPage ===
                      totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        (page) =>
                          Math.min(
                            totalPages,
                            page + 1
                          )
                      )
                    }
                    className="flex h-6 w-6 items-center justify-center rounded border border-[#d4ddec] disabled:opacity-40"
                  >
                    <ChevronRight
                      size={11}
                    />
                  </button>
                </div>
              </div>

              {/* TABLE */}

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] border-collapse">
                  <thead>
                    <tr className="bg-[#f7f9fd] text-[8px] font-bold text-[#182b5e]">
                      {/* FAR LEFT SELECT ALL */}

                      <th className="w-[34px] border-b border-[#e1e6ef] px-2 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={
                            allVisibleSelected
                          }
                          ref={(element) => {
                            if (element) {
                              element.indeterminate =
                                !allVisibleSelected &&
                                someVisibleSelected;
                            }
                          }}
                          onChange={(e) =>
                            handleSelectAll(
                              e.target
                                .checked
                            )
                          }
                          className="h-3 w-3 cursor-pointer accent-[#ff6900]"
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
                        Adjustment Type
                      </th>

                      <th className="border-b border-[#e1e6ef] px-2 py-2 text-left">
                        Shift
                      </th>

                      <th className="border-b border-[#e1e6ef] px-2 py-2 text-right">
                        Impact (৳)
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
                    {paginatedRequests.length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan={13}
                          className="py-10 text-center text-[9px] text-[#6b7691]"
                        >
                          No payroll exception
                          requests found.
                        </td>
                      </tr>
                    ) : (
                      paginatedRequests.map(
                        (request) => {
                          const selected =
                            selectedRequestIds.includes(
                              request.requestId
                            );

                          return (
                            <tr
                              key={
                                request.requestId
                              }
                              className={`text-[8px] ${
                                selected
                                  ? "bg-[#fff8f3]"
                                  : "bg-white"
                              } hover:bg-[#fffaf6]`}
                            >
                              {/* INDIVIDUAL CHECKBOX */}

                              <td className="border-b border-[#edf0f5] px-2 py-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={
                                    selected
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    handleSelectRequest(
                                      request.requestId,
                                      e.target
                                        .checked
                                    )
                                  }
                                  className="h-3 w-3 cursor-pointer accent-[#ff6900]"
                                />
                              </td>

                              <td className="border-b border-[#edf0f5] px-2 py-2 font-semibold text-[#173d9b]">
                                {
                                  request.requestId
                                }
                              </td>

                              <td className="whitespace-nowrap border-b border-[#edf0f5] px-2 py-2">
                                {formatDisplayDate(
                                  request.attendanceDate
                                )}
                              </td>

                              <td className="border-b border-[#edf0f5] px-2 py-2">
                                {
                                  request.employeeId
                                }
                              </td>

                              <td className="border-b border-[#edf0f5] px-2 py-2 font-medium">
                                {
                                  request.employeeName
                                }
                              </td>

                              <td className="border-b border-[#edf0f5] px-2 py-2">
                                {
                                  request.department
                                }
                              </td>

                              <td className="border-b border-[#edf0f5] px-2 py-2 whitespace-nowrap">
                                {
                                  request.adjustmentType
                                }
                              </td>

                              <td className="border-b border-[#edf0f5] px-2 py-2 whitespace-nowrap">
                                {
                                  request.shift
                                }
                              </td>

                              <td className="border-b border-[#edf0f5] px-2 py-2 text-right font-semibold">
                                {formatCurrency(
                                  request.impact
                                )}
                              </td>

                              <td className="border-b border-[#edf0f5] px-2 py-2 whitespace-nowrap">
                                {
                                  request.submittedBy
                                }
                              </td>

                              <td className="border-b border-[#edf0f5] px-2 py-2 whitespace-nowrap">
                                {
                                  request.submittedOn
                                }
                              </td>

                              <td className="border-b border-[#edf0f5] px-2 py-2 text-center">
                                <StatusBadge
                                  status={
                                    request.status
                                  }
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

              {/* TABLE FOOTER */}

              <div className="flex items-center justify-between border-t border-[#e5e9f1] px-3 py-2">
                <div className="flex items-center gap-2 text-[8px] text-[#4c5878]">
                  <span>Show</span>

                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(
                        Number(
                          e.target.value
                        )
                      );
                      setCurrentPage(1);
                    }}
                    className="h-6 rounded border border-[#d4ddec] px-2 text-[8px] outline-none"
                  >
                    <option value={10}>
                      10
                    </option>
                    <option value={20}>
                      20
                    </option>
                    <option value={50}>
                      50
                    </option>
                  </select>

                  <span>
                    entries per page
                  </span>
                </div>

                <div className="text-[8px] text-[#68728c]">
                  Showing{" "}
                  {filteredRequests.length ===
                  0
                    ? 0
                    : (safeCurrentPage - 1) *
                        pageSize +
                      1}{" "}
                  to{" "}
                  {Math.min(
                    safeCurrentPage *
                      pageSize,
                    filteredRequests.length
                  )}{" "}
                  of{" "}
                  {filteredRequests.length}
                </div>
              </div>
            </section>

            {/* ==================================================
                SUMMARY + REMARKS
            ================================================== */}

            <div className="mt-3 grid grid-cols-[1fr_1.1fr] gap-3">
              {/* SUMMARY */}

              <section className="rounded border border-[#dce4f2] bg-white p-3">
                <h2 className="text-[9px] font-bold text-[#112b70]">
                  Selected Requests
                  Summary
                </h2>

                <div className="mt-3 grid grid-cols-2 gap-y-4">
                  <SummaryItem
                    label="Total Selected"
                    value={
                      selectedRequestIds.length
                    }
                  />

                  <SummaryItem
                    label="Total Impact (৳)"
                    value={formatCurrency(
                      totalImpact
                    )}
                  />

                  <SummaryItem
                    label="Total Employees"
                    value={
                      selectedEmployeeCount
                    }
                  />

                  <SummaryItem
                    label="Earliest Attendance Date"
                    value={earliestDate}
                  />

                  <div />

                  <SummaryItem
                    label="Latest Attendance Date"
                    value={latestDate}
                  />
                </div>
              </section>

              {/* REMARKS */}

              <section className="rounded border border-[#dce4f2] bg-white p-3">
                <h2 className="text-[9px] font-bold text-[#112b70]">
                  Remarks (Optional)
                </h2>

                <textarea
                  value={remarks}
                  maxLength={250}
                  onChange={(e) =>
                    setRemarks(
                      e.target.value
                    )
                  }
                  placeholder="Enter remarks before forwarding..."
                  className="mt-2 h-[59px] w-full resize-none rounded border border-[#d6deeb] p-2 text-[8px] outline-none focus:border-[#ff6900]"
                />

                <div className="mt-1 flex justify-between text-[7px] text-[#7d88a1]">
                  <span>
                    Maximum 250 characters
                    allowed
                  </span>

                  <span>
                    {remarks.length}/250
                  </span>
                </div>
              </section>
            </div>

            {/* BOTTOM BUTTONS */}

            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={
                  handleClearSelection
                }
                className="h-[27px] rounded border border-[#cbd7eb] px-7 text-[9px] font-semibold text-[#26345d] hover:bg-[#f7f9fd]"
              >
                Clear
              </button>

              <button
                type="button"
                disabled={
                  selectedRequestIds.length ===
                    0 ||
                  isForwarding
                }
                onClick={
                  handleForwardSelected
                }
                className="flex h-[27px] items-center gap-1.5 rounded bg-[#ff6900] px-5 text-[9px] font-bold text-white hover:bg-[#e95d00] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={11} />

                {isForwarding
                  ? "Forwarding..."
                  : "Forward Selected to Head Office IT"}

                <Send size={11} />
              </button>
            </div>
          </div>

          {/* ==================================================
              RIGHT SIDEBAR
          ================================================== */}

          <aside className="space-y-3">
            {/* WORKFLOW */}

            <WorkflowCard />

            {/* QUICK ACTIONS */}

            <section className="rounded border border-[#dce4f2] bg-white p-3">
              <h2 className="mb-3 text-[10px] font-bold uppercase text-[#112b70]">
                QUICK ACTIONS
              </h2>

              <button
                type="button"
                onClick={
                  handleForwardSelected
                }
                disabled={
                  selectedRequestIds.length ===
                  0
                }
                className="mb-1 flex w-full items-center gap-2 rounded border border-[#dce4f2] px-2 py-2 text-left text-[8px] font-semibold text-[#15265b] disabled:opacity-50"
              >
                <Send
                  size={12}
                  className="text-[#0752df]"
                />
                Forward Selected to Head
                Office IT
              </button>

              <button
                type="button"
                disabled={
                  selectedRequests.length !==
                  1
                }
                onClick={() => {
                  if (
                    selectedRequests.length ===
                    1
                  ) {
                    handleViewRequest(
                      selectedRequests[0]
                    );
                  }
                }}
                className="mb-1 flex w-full items-center gap-2 rounded border border-[#dce4f2] px-2 py-2 text-left text-[8px] font-semibold text-[#15265b] disabled:opacity-50"
              >
                <Info
                  size={12}
                  className="text-[#0752df]"
                />
                View Request Details
              </button>

              <button
                type="button"
                className="mb-1 flex w-full items-center gap-2 rounded border border-[#dce4f2] px-2 py-2 text-left text-[8px] font-semibold text-[#15265b]"
              >
                <Download
                  size={12}
                  className="text-[#15955b]"
                />
                Export to Excel
              </button>

              <button
                type="button"
                className="flex w-full items-center gap-2 rounded border border-[#dce4f2] px-2 py-2 text-left text-[8px] font-semibold text-[#15265b]"
              >
                <FileOutput
                  size={12}
                  className="text-[#0752df]"
                />
                Print List
              </button>
            </section>

            {/* NOTE */}

            <section className="rounded border border-[#dce4f2] bg-white p-3">
              <div className="flex items-start gap-2">
                <Info
                  size={14}
                  className="mt-0.5 shrink-0 text-[#0752df]"
                />

                <div>
                  <h2 className="text-[9px] font-bold uppercase text-[#112b70]">
                    NOTE
                  </h2>

                  <p className="mt-2 text-[8px] leading-4 text-[#3e4b6c]">
                    Post-lock adjustments are
                    forwarded to Head Office IT
                    for approval and will be
                    applied in the next payroll.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
};

/* ================================================================
   STAT CARD
================================================================ */

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconClass,
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
  status: PayrollExceptionRequest["status"];
}> = ({ status }) => {
  if (status === "Pending") {
    return (
      <span className="inline-flex rounded bg-[#fff0dc] px-2 py-1 text-[7px] font-bold text-[#d96100]">
        Pending
      </span>
    );
  }

  if (status === "Forwarded") {
    return (
      <span className="inline-flex rounded bg-[#e7f7ee] px-2 py-1 text-[7px] font-bold text-[#15804e]">
        Forwarded
      </span>
    );
  }

  return (
    <span className="inline-flex rounded bg-[#ffe9eb] px-2 py-1 text-[7px] font-bold text-[#d53548]">
      Rejected
    </span>
  );
};

/* ================================================================
   SUMMARY ITEM
================================================================ */

const SummaryItem: React.FC<{
  label: string;
  value: string | number;
}> = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between pr-5 text-[8px]">
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
   WORKFLOW
================================================================ */

const WorkflowCard: React.FC = () => {
  return (
    <section className="rounded border border-[#dce4f2] bg-white p-3">
      <h2 className="mb-4 text-[10px] font-bold uppercase text-[#112b70]">
        WORKFLOW
      </h2>

      <WorkflowStep
        number="1."
        title="Attendance Cell"
        subtitle="Submitted"
        active
        completed
        icon={
          <Users size={12} />
        }
      />

      <WorkflowStep
        number="2."
        title="Attendance & Workforce Movement Section"
        subtitle="Review & Forward"
        active
        icon={
          <Users size={12} />
        }
      />

      <WorkflowStep
        number="3."
        title="Head Office IT"
        subtitle="Review & Approve"
        icon={
          <FileOutput size={12} />
        }
      />

      <WorkflowStep
        number="4."
        title="Next Payroll Run"
        subtitle="Adjustment Applied"
        icon={
          <Clock3 size={12} />
        }
      />

      <WorkflowStep
        number="5."
        title="Completed"
        subtitle="Completed"
        last
        icon={
          <Check size={12} />
        }
      />
    </section>
  );
};

interface WorkflowStepProps {
  number: string;
  title: string;
  subtitle: string;
  active?: boolean;
  completed?: boolean;
  last?: boolean;
  icon: React.ReactNode;
}

const WorkflowStep: React.FC<
  WorkflowStepProps
> = ({
  number,
  title,
  subtitle,
  active = false,
  completed = false,
  last = false,
  icon,
}) => {
  return (
    <div className="relative flex gap-2 pb-4">
      {!last && (
        <div className="absolute left-[10px] top-[22px] h-[38px] w-px bg-[#d8dfeb]" />
      )}

      <div
        className={`relative z-10 flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-full ${
          completed
            ? "bg-[#20955b] text-white"
            : active
            ? "bg-[#ff6900] text-white"
            : "bg-[#edf0f5] text-[#8b95a8]"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <div className="text-[8px] font-bold text-[#17275c]">
          {number} {title}
        </div>

        <div className="mt-0.5 text-[7px] text-[#52607f]">
          {subtitle}
        </div>
      </div>

      {completed && (
        <CircleCheck
          size={12}
          className="ml-auto mt-1 text-[#20955b]"
        />
      )}

      {active && !completed && (
        <div className="ml-auto mt-1 h-2.5 w-2.5 rounded-full bg-[#0752df]" />
      )}

      {!active && !completed && (
        <div className="ml-auto mt-1 h-2.5 w-2.5 rounded-full border-2 border-[#cbd2df]" />
      )}
    </div>
  );
};

/* ================================================================
   DATE
================================================================ */

const formatDisplayDate = (
  value: string
): string => {
  if (!value) {
    return "-";
  }

  const [year, month, day] =
    value.split("-");

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

  return `${Number(day)} ${
    months[Number(month) - 1]
  } ${year}`;
};

/* ================================================================
   CURRENCY
================================================================ */

const formatCurrency = (
  value: number
): string => {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default PayrollExceptionRequestPostLock;
