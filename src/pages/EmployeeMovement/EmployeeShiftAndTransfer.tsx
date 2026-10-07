import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { format, isValid, parse, subDays } from "date-fns";
import { ArrowLeftRight, ChevronRight, Clock, Eye, Save } from "lucide-react";

import CommonInputField, { type Option } from "../../components/CommonInputFields";
import { api } from "../../api/client";
import { useCurrentShift } from "../Attendance/utils/getCurrentShifts";
import { useGet } from "../../hooks/useGet";
import { API_ROUTES } from "../../api/routes";

/* ============================================================
   API
============================================================ */

const EMPLOYEE_SEARCH_API = "/employees/search-extention";
const SHIFT_CHANGE_API = "EmployeeShiftChanges";
const TRANSFER_API = "EmployeeTransfers";

// "Recent" shift changes = effective in the last N days (View All removes the limit)
const RECENT_DAYS = 3;

/* ============================================================
   TYPES
============================================================ */

interface Employee {
  id: string;
  employeeCode: string;
  employeeName: string;
  company: string;
  departmentName: string;
  designationName: string;
  // Not in the search response you shared. Add them to the API if you can,
  // so the "current" fields can be pre-filled.
  departmentId?: string;
  sectionId?: string;
  sectionName?: string;
  currentShiftId?: string;
}

interface Department {
  departmentId: string;
  departmentName: string;
}

interface Section {
  id: string;
  sectionName: string;
}

interface Shift {
  id: string;
  shiftName: string;
  startTime: string; // "10:00:00"
  endTime: string; // "06:00:00"
  sortOrder?: number;
  isActive?: boolean;
  shiftType?: string;
}

// One item of GET EmployeeShiftChanges
interface ShiftChangeRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  previousShiftId: string;
  previousShiftName: string;
  newShiftId: string;
  newShiftName: string;
  effectiveFrom: string; // yyyy-MM-dd
  remarks: string;
  isActive: boolean;
}

// One item of GET EmployeeTransfers
interface TransferRecord {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  previousDepartmentId: string;
  previousDepartmentName: string;
  previousSectionId: string;
  previousSectionName: string;
  newDepartmentId: string;
  newDepartmentName: string;
  newSectionId: string;
  newSectionName: string;
  effectiveFrom: string; // yyyy-MM-dd
  remarks: string;
  isActive: boolean;
}

type SearchForm = { employeeId: string };

type ShiftForm = {
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  sectionName: string;
  previousShiftId: string;
  newShiftId: string;
  effectiveFrom: string; // yyyy-MM-dd
  remarks: string;
};

type TransferForm = {
  employeeCode: string;
  employeeName: string;
  previousDepartmentId: string;
  previousSectionId: string;
  newDepartmentId: string;
  newSectionId: string;
  effectiveFrom: string; // yyyy-MM-dd
  remarks: string;
};

// Exact POST bodies from Swagger
interface ShiftChangePayload {
  employeeId: string;
  previousShiftId: string;
  newShiftId: string;
  effectiveFrom: string;
  remarks: string;
}

interface TransferPayload {
  employeeId: string;
  previousDepartmentId: string;
  previousSectionId: string;
  newDepartmentId: string;
  newSectionId: string;
  effectiveFrom: string;
  remarks: string;
}

type RecentRow = {
  id: string;
  cells: string[]; // already formatted for display
};

type Notice = { type: "success" | "error"; text: string } | null;

/* ============================================================
   MOCK DATA (recent tables only, replace with real APIs)
============================================================ */

/* ============================================================
   HELPERS
============================================================ */

const today = () => format(new Date(), "yyyy-MM-dd");

const formatDisplayDate = (value: string) => {
  const d = parse(value, "yyyy-MM-dd", new Date());
  return isValid(d) ? format(d, "dd-MMM-yyyy") : value;
};

const formatTime = (value?: string) => (value ? value.slice(0, 5) : ""); // "10:00:00" -> "10:00"

const emptyShiftForm = (): ShiftForm => ({
  employeeCode: "",
  employeeName: "",
  departmentName: "",
  sectionName: "",
  previousShiftId: "",
  newShiftId: "",
  effectiveFrom: today(),
  remarks: "",
});

const emptyTransferForm = (): TransferForm => ({
  employeeCode: "",
  employeeName: "",
  previousDepartmentId: "",
  previousSectionId: "",
  newDepartmentId: "",
  newSectionId: "",
  effectiveFrom: today(),
  remarks: "",
});

/* ============================================================
   SMALL UI PIECES
============================================================ */

const NoticeBanner = ({ notice }: { notice: Notice }) =>
  notice ? (
    <div
      role="status"
      className={`mb-3 rounded-lg px-4 py-2 text-xs ${
        notice.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"
      }`}
    >
      {notice.text}
    </div>
  ) : null;

const RecentTable = ({
  title,
  headers,
  rows,
  viewAllLabel,
  accent,
  loading = false,
  error = null,
  onViewAll,
}: {
  title: string;
  headers: string[];
  rows: RecentRow[];
  viewAllLabel: string;
  accent: string;
  loading?: boolean;
  error?: string | null;
  onViewAll?: () => void;
}) => (
  <div className="rounded-b-xl border-t border-gray-200 bg-gray-50 px-4 py-4">
    <h3 className="mb-2 text-xs font-bold text-gray-800">{title}</h3>

    <div className="max-h-72 overflow-auto rounded-md border border-gray-200 bg-white">
      <table className="w-full min-w-[560px] text-center text-[11px]">
        <thead className="sticky top-0 bg-gray-100 font-semibold text-gray-700">
          <tr>
            <th className="px-2 py-2">SL No.</th>
            {headers.map((h) => (
              <th key={h} className="px-2 py-2">
                {h}
              </th>
            ))}
            <th className="px-2 py-2">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {loading ? (
            <tr>
              <td colSpan={headers.length + 2} className="py-6 text-gray-500">
                Loading...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={headers.length + 2} className="py-6 text-red-600">
                {error}
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length + 2} className="py-6 text-gray-500">
                Nothing recorded yet.
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={row.id} className="border-t border-gray-100">
                <td className="px-2 py-2">{i + 1}</td>
                {row.cells.map((c, ci) => (
                  <td key={ci} className="px-2 py-2">
                    {c}
                  </td>
                ))}
                <td className="px-2 py-2">
                  <button
                    type="button"
                    aria-label={`View ${row.cells[0]}`}
                    // TODO: open a details modal / navigate once the API exists
                    className={`inline-flex ${accent}`}
                  >
                    <Eye size={15} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    <div className="mt-3 text-center">
      <button
        type="button"
        onClick={onViewAll}
        className={`inline-flex items-center gap-1 text-xs font-semibold ${accent}`}
      >
        {viewAllLabel}
        <ChevronRight size={14} />
      </button>
    </div>
  </div>
);

/* ============================================================
   PAGE
============================================================ */

/**
 * Loads a change-history list (GET <endpoint>).
 * Default: only items effective in the last RECENT_DAYS days.
 * toggleShowAll() switches to the full list (no date limit) and back.
 */
const useChangeHistory = <T extends { effectiveFrom: string }>(endpoint: string) => {
  const [showAll, setShowAll] = useState(false);
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef(0);

  const load = useCallback(
    async (all: boolean) => {
      const requestId = ++requestRef.current;
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(endpoint, {
          params: {
            includeInactive: false,
            ...(all ? {} : { fromDate: format(subDays(new Date(), RECENT_DAYS), "yyyy-MM-dd") }),
          },
        });
        if (requestId !== requestRef.current) return; // a newer request replaced this one

        const data = response.data?.items ?? response.data?.data ?? response.data ?? [];
        const list: T[] = Array.isArray(data) ? [...data] : [];
        list.sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom)); // newest first
        setItems(list);
      } catch (err) {
        console.error(`Unable to load ${endpoint}`, err);
        if (requestId !== requestRef.current) return;
        setItems([]);
        setError("Could not load the list. Please try again.");
      } finally {
        if (requestId === requestRef.current) setLoading(false);
      }
    },
    [endpoint]
  );

  useEffect(() => {
    load(showAll);
  }, [showAll, load]);

  const reload = useCallback(() => load(showAll), [load, showAll]);
  const toggleShowAll = useCallback(() => setShowAll((prev) => !prev), []);

  return { items, loading, error, showAll, toggleShowAll, reload };
};

const EmployeeShiftAndTransfer = () => {
  /* ---------- employee search ---------- */
  const searchForm = useForm<SearchForm>({ defaultValues: { employeeId: "" } });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const requestIdRef = useRef(0);

  const employeeOptions: Option[] = employees.map((e) => ({
    label: `${e.employeeCode} - ${e.employeeName}`,
    value: e.id,
  }));

  /* ---------- the two action forms ---------- */
  const shiftForm = useForm<ShiftForm>({ defaultValues: emptyShiftForm() });
  const transferForm = useForm<TransferForm>({ defaultValues: emptyTransferForm() });

  const [shiftSaving, setShiftSaving] = useState(false);
  const [transferSaving, setTransferSaving] = useState(false);
  const [shiftNotice, setShiftNotice] = useState<Notice>(null);
  const [transferNotice, setTransferNotice] = useState<Notice>(null);

  /* ---------- history tables (last RECENT_DAYS days by default, all on request) ---------- */
  const shiftHistory = useChangeHistory<ShiftChangeRecord>(SHIFT_CHANGE_API);
  const transferHistory = useChangeHistory<TransferRecord>(TRANSFER_API);

  const recentShifts: RecentRow[] = useMemo(
    () =>
      shiftHistory.items.map((r) => ({
        id: r.id,
        cells: [
          r.employeeName,
          r.previousShiftName,
          r.newShiftName,
          formatDisplayDate(r.effectiveFrom),
        ],
      })),
    [shiftHistory.items]
  );

  const recentTransfers: RecentRow[] = useMemo(
    () =>
      transferHistory.items.map((r) => ({
        id: r.id,
        cells: [
          r.employeeCode,
          r.employeeName,
          `${r.previousDepartmentName} / ${r.previousSectionName}`,
          `${r.newDepartmentName} / ${r.newSectionName}`,
          formatDisplayDate(r.effectiveFrom),
        ],
      })),
    [transferHistory.items]
  );

  const hasEmployee = !!selectedEmployee;

  /* ---------- shifts ---------- */
  const { shifts } = useCurrentShift();

  const shiftOptions: Option[] = useMemo(
    () =>
      ((shifts ?? []) as Shift[])
        .filter((s) => s.isActive !== false)
        .map((s) => ({
          label: `${s.shiftName} (${formatTime(s.startTime)} - ${formatTime(s.endTime)})`,
          value: s.id,
        })),
    [shifts]
  );

  /* ---------- departments ---------- */
  const { data: departments = [] } = useGet<Department[]>({
    key: ["departments"],
    url: `${API_ROUTES.DEPARTMENT}`,
  });

  const departmentOptions: Option[] = useMemo(
    () =>
      departments.map((d) => ({
        label: d.departmentName,
        value: d.departmentId,
      })),
    [departments]
  );

  /* ---------- sections, loaded for each selected department ---------- */
  const previousDepartmentId = transferForm.watch("previousDepartmentId");
  const newDepartmentId = transferForm.watch("newDepartmentId");

  const { data: previousSections = [] } = useGet<Section[]>({
    key: ["sections", previousDepartmentId],
    url: `${API_ROUTES.SECTION}?includeInactive=false&departmentId=${previousDepartmentId}`,
    enabled: !!previousDepartmentId,
  });

  const { data: newSections = [] } = useGet<Section[]>({
    key: ["sections", newDepartmentId],
    url: `${API_ROUTES.SECTION}?includeInactive=false&departmentId=${newDepartmentId}`,
    enabled: !!newDepartmentId,
  });

  const previousSectionOptions: Option[] = useMemo(
    () => previousSections.map((s) => ({ label: s.sectionName, value: s.id })),
    [previousSections]
  );

  const newSectionOptions: Option[] = useMemo(
    () => newSections.map((s) => ({ label: s.sectionName, value: s.id })),
    [newSections]
  );

  // When the user picks a different department, clear the old section.
  // Only reacts to field changes, not to reset(), so an employee's prefilled
  // section is kept while its options are still loading.
  useEffect(() => {
    const subscription = transferForm.watch((_, { name }) => {
      if (name === "previousDepartmentId") transferForm.setValue("previousSectionId", "");
      if (name === "newDepartmentId") transferForm.setValue("newSectionId", "");
    });
    return () => subscription.unsubscribe();
  }, [transferForm]);

  /* ---------- fill / clear both forms from the selected employee ---------- */
  const applyEmployee = (employee: Employee | null) => {
    setSelectedEmployee(employee);
    setShiftNotice(null);
    setTransferNotice(null);

    if (!employee) {
      shiftForm.reset(emptyShiftForm());
      transferForm.reset(emptyTransferForm());
      return;
    }

    shiftForm.reset({
      ...emptyShiftForm(),
      employeeCode: employee.employeeCode,
      employeeName: employee.employeeName,
      departmentName: employee.departmentName ?? "",
      sectionName: employee.sectionName ?? "",
      previousShiftId: employee.currentShiftId ?? "",
    });

    transferForm.reset({
      ...emptyTransferForm(),
      employeeCode: employee.employeeCode,
      employeeName: employee.employeeName,
      previousDepartmentId: employee.departmentId ?? "",
      previousSectionId: employee.sectionId ?? "",
    });
  };

  /* ---------- search handlers ---------- */
  const handleEmployeeSearch = (searchText: string) => {
    // Typing again invalidates the previous selection
    if (selectedEmployee) {
      applyEmployee(null);
      searchForm.setValue("employeeId", "");
    }

    clearTimeout(debounceRef.current);
    requestIdRef.current++; // ignore any in-flight response

    if (!searchText.trim()) {
      setEmployees([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const requestId = ++requestIdRef.current;
      try {
        const response = await api.get(EMPLOYEE_SEARCH_API, { params: { searchText } });
        if (requestId !== requestIdRef.current) return; // stale response
        const data = response.data?.data ?? response.data ?? [];
        setEmployees(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Unable to search employees", err);
        if (requestId === requestIdRef.current) setEmployees([]);
      }
    }, 300);
  };

  const handleEmployeeSelect = (option: Option) => {
    const employee = employees.find((e) => e.id === String(option.value));
    if (employee) applyEmployee(employee);
  };

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  /* ---------- submit: shift change ---------- */
  const onShiftSubmit = async (values: ShiftForm) => {
    if (!selectedEmployee) return;

    const payload: ShiftChangePayload = {
      employeeId: selectedEmployee.id,
      previousShiftId: values.previousShiftId,
      newShiftId: values.newShiftId,
      effectiveFrom: values.effectiveFrom,
      remarks: values.remarks ?? "",
    };

    try {
      setShiftSaving(true);
      setShiftNotice(null);
      await api.post(SHIFT_CHANGE_API, payload);

      // refresh the table from the server (keeps the current recent/all mode)
      shiftHistory.reload();

      // the new shift becomes the current one
      shiftForm.setValue("previousShiftId", payload.newShiftId);
      shiftForm.setValue("newShiftId", "");
      shiftForm.setValue("remarks", "");
      setShiftNotice({ type: "success", text: "Shift change applied." });
    } catch (err) {
      console.error(err);
      setShiftNotice({ type: "error", text: "Could not apply the shift change. Please try again." });
    } finally {
      setShiftSaving(false);
    }
  };

  /* ---------- submit: transfer ---------- */
  const onTransferSubmit = async (values: TransferForm) => {
    if (!selectedEmployee) return;

    const payload: TransferPayload = {
      employeeId: selectedEmployee.id,
      previousDepartmentId: values.previousDepartmentId,
      previousSectionId: values.previousSectionId,
      newDepartmentId: values.newDepartmentId,
      newSectionId: values.newSectionId,
      effectiveFrom: values.effectiveFrom,
      remarks: values.remarks ?? "",
    };

    try {
      setTransferSaving(true);
      setTransferNotice(null);
      await api.post(TRANSFER_API, payload);

      // refresh the table from the server (keeps the current recent/all mode)
      transferHistory.reload();

      // the destination becomes the current placement
      transferForm.setValue("previousDepartmentId", payload.newDepartmentId);
      transferForm.setValue("previousSectionId", payload.newSectionId);
      transferForm.setValue("newDepartmentId", "");
      transferForm.setValue("newSectionId", "");
      transferForm.setValue("remarks", "");
      setTransferNotice({ type: "success", text: "Transfer applied." });
    } catch (err) {
      console.error(err);
      setTransferNotice({ type: "error", text: "Could not apply the transfer. Please try again." });
    } finally {
      setTransferSaving(false);
    }
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      {/* Title */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-wide text-[#06247a]">
          Employee Shift Change & Transfer
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage shift changes and transfers for employees.
        </p>
      </div>

      {/* Employee search */}
      <div className="mb-6 max-w-md">
        <CommonInputField<SearchForm>
          label="Search by Employee ID"
          name="employeeId"
          type="searchable-dropdown"
          register={searchForm.register}
          control={searchForm.control}
          errors={searchForm.formState.errors}
          placeholder="Enter Employee ID"
          options={employeeOptions}
          onSearchChange={handleEmployeeSearch}
          onOptionSelect={handleEmployeeSelect}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ====================== SHIFT CHANGE ====================== */}
        <section className="rounded-xl border border-blue-100 bg-white shadow-sm">
          <div className="flex items-center gap-3 rounded-t-xl bg-blue-50 px-5 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#06247a] text-white">
              <Clock size={24} />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase text-[#06247a]">Shift Change</h2>
              <p className="text-xs text-gray-600">Change employee from one shift to another.</p>
            </div>
          </div>

          <form onSubmit={shiftForm.handleSubmit(onShiftSubmit)} className="px-5 py-4">
            <NoticeBanner notice={shiftNotice} />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <CommonInputField<ShiftForm>
                label="Employee ID"
                name="employeeCode"
                register={shiftForm.register}
                control={shiftForm.control}
                errors={shiftForm.formState.errors}
                disabled
              />
              <CommonInputField<ShiftForm>
                label="Employee Name"
                name="employeeName"
                register={shiftForm.register}
                control={shiftForm.control}
                errors={shiftForm.formState.errors}
                disabled
              />
              <CommonInputField<ShiftForm>
                label="Department"
                name="departmentName"
                register={shiftForm.register}
                control={shiftForm.control}
                errors={shiftForm.formState.errors}
                disabled
              />
              <CommonInputField<ShiftForm>
                label="Section"
                name="sectionName"
                register={shiftForm.register}
                control={shiftForm.control}
                errors={shiftForm.formState.errors}
                disabled
              />
              <CommonInputField<ShiftForm>
                label="Current Shift"
                name="previousShiftId"
                type="dropdown"
                register={shiftForm.register}
                control={shiftForm.control}
                errors={shiftForm.formState.errors}
                options={shiftOptions}
                disabled={!hasEmployee}
                rules={{ required: "Current shift is required" }}
              />
              <CommonInputField<ShiftForm>
                label="New Shift"
                name="newShiftId"
                type="dropdown"
                register={shiftForm.register}
                control={shiftForm.control}
                errors={shiftForm.formState.errors}
                options={shiftOptions}
                disabled={!hasEmployee}
                rules={{
                  required: "New shift is required",
                  validate: (value, all) =>
                    value !== all.previousShiftId || "New shift must differ from the current shift",
                }}
              />
              <CommonInputField<ShiftForm>
                label="Effective From"
                name="effectiveFrom"
                type="date"
                register={shiftForm.register}
                control={shiftForm.control}
                errors={shiftForm.formState.errors}
                disabled={!hasEmployee}
                rules={{ required: "Effective date is required" }}
              />
              <CommonInputField<ShiftForm>
                label="Remarks (Optional)"
                name="remarks"
                register={shiftForm.register}
                control={shiftForm.control}
                errors={shiftForm.formState.errors}
                placeholder="Enter remarks"
                disabled={!hasEmployee}
              />
            </div>

            <div className="mt-5 text-center">
              <button
                type="submit"
                disabled={!hasEmployee || shiftSaving}
                className="inline-flex items-center gap-2 rounded-md bg-[#06247a] px-8 py-2 text-sm font-semibold text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={16} />
                {shiftSaving ? "Applying..." : "Apply Shift Change"}
              </button>
            </div>
          </form>

          <RecentTable
            title={
              shiftHistory.showAll
                ? "All Shift Changes"
                : `Recent Shift Changes (Last ${RECENT_DAYS} Days)`
            }
            headers={["Employee Name", "From Shift", "To Shift", "Effective From"]}
            rows={recentShifts}
            loading={shiftHistory.loading}
            error={shiftHistory.error}
            viewAllLabel={
              shiftHistory.showAll ? `Show Last ${RECENT_DAYS} Days` : "View All Shift Changes"
            }
            onViewAll={shiftHistory.toggleShowAll}
            accent="text-blue-700"
          />
        </section>

        {/* ========================= TRANSFER ======================== */}
        <section className="rounded-xl border border-teal-100 bg-white shadow-sm">
          <div className="flex items-center gap-3 rounded-t-xl bg-teal-50 px-5 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-white">
              <ArrowLeftRight size={24} />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase text-teal-700">Transfer</h2>
              <p className="text-xs text-gray-600">
                Transfer employee from one department/section to another.
              </p>
            </div>
          </div>

          <form onSubmit={transferForm.handleSubmit(onTransferSubmit)} className="px-5 py-4">
            <NoticeBanner notice={transferNotice} />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <CommonInputField<TransferForm>
                label="Employee ID"
                name="employeeCode"
                register={transferForm.register}
                control={transferForm.control}
                errors={transferForm.formState.errors}
                disabled
              />
              <CommonInputField<TransferForm>
                label="Employee Name"
                name="employeeName"
                register={transferForm.register}
                control={transferForm.control}
                errors={transferForm.formState.errors}
                disabled
              />
              <CommonInputField<TransferForm>
                label="From Department"
                name="previousDepartmentId"
                type="dropdown"
                register={transferForm.register}
                control={transferForm.control}
                errors={transferForm.formState.errors}
                options={departmentOptions}
                disabled={!hasEmployee}
                rules={{ required: "From department is required" }}
              />
              <CommonInputField<TransferForm>
                label="From Section"
                name="previousSectionId"
                type="dropdown"
                register={transferForm.register}
                control={transferForm.control}
                errors={transferForm.formState.errors}
                options={previousSectionOptions}
                disabled={!hasEmployee || !previousDepartmentId}
                rules={{ required: "From section is required" }}
              />
              <CommonInputField<TransferForm>
                label="To Department"
                name="newDepartmentId"
                type="dropdown"
                register={transferForm.register}
                control={transferForm.control}
                errors={transferForm.formState.errors}
                options={departmentOptions}
                disabled={!hasEmployee}
                rules={{ required: "To department is required" }}
              />
              <CommonInputField<TransferForm>
                label="To Section"
                name="newSectionId"
                type="dropdown"
                register={transferForm.register}
                control={transferForm.control}
                errors={transferForm.formState.errors}
                options={newSectionOptions}
                disabled={!hasEmployee || !newDepartmentId}
                rules={{
                  required: "To section is required",
                  validate: (value, all) => {
                    if (!newSectionOptions.some((o) => o.value === value)) {
                      return "Select a section that belongs to the chosen department";
                    }
                    return (
                      !(
                        value === all.previousSectionId &&
                        all.newDepartmentId === all.previousDepartmentId
                      ) || "Destination must differ from the current placement"
                    );
                  },
                }}
              />
              <CommonInputField<TransferForm>
                label="Effective From"
                name="effectiveFrom"
                type="date"
                register={transferForm.register}
                control={transferForm.control}
                errors={transferForm.formState.errors}
                disabled={!hasEmployee}
                rules={{ required: "Effective date is required" }}
              />
              <CommonInputField<TransferForm>
                label="Remarks (Optional)"
                name="remarks"
                register={transferForm.register}
                control={transferForm.control}
                errors={transferForm.formState.errors}
                placeholder="Enter remarks"
                disabled={!hasEmployee}
              />
            </div>

            <div className="mt-5 text-center">
              <button
                type="submit"
                disabled={!hasEmployee || transferSaving}
                className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-8 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={16} />
                {transferSaving ? "Applying..." : "Apply Transfer"}
              </button>
            </div>
          </form>

          <RecentTable
            title={
              transferHistory.showAll
                ? "All Transfers"
                : `Recent Transfers (Last ${RECENT_DAYS} Days)`
            }
            headers={[
              "Employee ID",
              "Employee Name",
              "From (Dept. / Sec.)",
              "To (Dept. / Sec.)",
              "Effective From",
            ]}
            rows={recentTransfers}
            loading={transferHistory.loading}
            error={transferHistory.error}
            viewAllLabel={
              transferHistory.showAll ? `Show Last ${RECENT_DAYS} Days` : "View All Transfers"
            }
            onViewAll={transferHistory.toggleShowAll}
            accent="text-teal-700"
          />
        </section>
      </div>
    </div>
  );
};

export default EmployeeShiftAndTransfer;