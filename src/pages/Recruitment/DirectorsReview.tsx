import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CheckCircle,
  RefreshCw,
  Search,
  Send,
  XCircle,
} from "lucide-react";

import {
  useForm,
  useFieldArray,
} from "react-hook-form";

import { useGet } from "../../hooks/useGet";
import { API_ROUTES } from "../../api/routes";
 import { useWatch } from "react-hook-form";

interface SalaryRow {
  selected: boolean;
  employeeId: string;
  employeeEnrollmentId: string;
  grossSalary: number;
  proposedMonthlySalary: number;
}

interface DirectorReviewForm {
  remarks: string;
  decision: "APPROVE" | "REJECT";
  employees: SalaryRow[];
}

interface Candidate {
  id: number;
  employeeId: string;
  enrollmentId: string;
  fullName: string;
  department: string;
  section: string;
  cell: string;
  designation: string;
  grade: string;
  shift: string;
  weekday: string;
  salary: number;
  joiningDate: string;
  status: string;

  fatherName: string;
  dob: string;
  bloodGroup: string;
  workerType: string;

  photo: string;
}

const PAGE_SIZE = 2;

const EMPTY_CANDIDATES: Candidate[] = [];

const DirectorReview = () => {
  const { data: candidates = EMPTY_CANDIDATES } =
    useGet<Candidate[]>({
      key: ["candidates"],
      url: `${API_ROUTES.EMPLOYEES_BY_STATUS}?status=Biometric`,
    });

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] =
    useState<Candidate | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
  } = useForm<DirectorReviewForm>({
    defaultValues: {
      remarks: "",
      decision: "APPROVE",
      employees: [],
    },
  });

  const { replace } = useFieldArray({
    control,
    name: "employees",
  });

  const buildRowsFromCandidates = (list: Candidate[]): SalaryRow[] =>
    list.map((item) => ({
      selected: false,
      employeeId: item.employeeId,
      employeeEnrollmentId: item.enrollmentId,
      grossSalary: item.salary,
      proposedMonthlySalary: item.salary,
    }));

  // Only re-seed the field array when the *set of employee ids* actually
  // changes, not on every render (candidates can be a fresh array
  // reference from the query hook even when its contents are the same).
  const candidatesKey = useMemo(
    () => candidates.map((c) => c.employeeId).join("|"),
    [candidates]
  );

  useEffect(() => {
    replace(buildRowsFromCandidates(candidates));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidatesKey, replace]);



const employeeRows =
  useWatch({
    control,
    name: "employees",
  }) || [];

  const filteredData = useMemo(() => {
    return candidates.filter(
      (item) =>
        item.fullName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        item.enrollmentId.toLowerCase().includes(search.toLowerCase())
    );
  }, [candidates, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

  const paginatedData = filteredData.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const onSubmit = (data: DirectorReviewForm) => {
    const payload = data.employees
      .filter((item) => item.selected)
      .map((item) => ({
        employeeId: item.employeeId,
        employeeEnrollmentId: item.employeeEnrollmentId,
        grossSalary: item.grossSalary,
        proposedMonthlySalary: item.proposedMonthlySalary,
      }));

    console.log("Final Payload", payload);
    alert(`${payload.length} Employee(s) Ready`);

    reset({
      remarks: "",
      decision: "APPROVE",
      employees: buildRowsFromCandidates(candidates),
    });

    setSelectedCandidate(null);
  };

  const handleSelectAll = (checked: boolean) => {
    employeeRows.forEach((_, index) => {
      setValue(`employees.${index}.selected`, checked, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    });
  };

  // Reuse a single watched value for all derived totals instead of
  // calling watch() again separately (avoids redundant subscriptions
  // and keeps the numbers in sync with what's rendered in the table).
  const selectedRows = useMemo(
    () => (employeeRows ?? []).filter((x) => x.selected),
    [employeeRows]
  );

  const selectedCount = selectedRows.length;

  const totalGrossSalary = useMemo(
    () =>
      selectedRows.reduce(
        (sum, item) => sum + (Number(item.grossSalary) || 0),
        0
      ),
    [selectedRows]
  );

  const totalProposedSalary = useMemo(
    () =>
      selectedRows.reduce(
        (sum, item) => sum + (Number(item.proposedMonthlySalary) || 0),
        0
      ),
    [selectedRows]
  );

  const allSelected =
    employeeRows?.length > 0 &&
    employeeRows.every((row) => row.selected);

  const handleSendToIT = handleSubmit((data) => {
    const payload = data.employees
      .filter((item) => item.selected)
      .map((item) => ({
        employeeId: item.employeeId,
        employeeEnrollmentId: item.employeeEnrollmentId,
        grossSalary: item.grossSalary,
        proposedMonthlySalary: item.proposedMonthlySalary,
      }));

    console.log("Send To IT Payload", payload);
    alert(`${payload.length} employee(s) ready to send`);
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-[1700px]">

        {/* ================= Summary Cards ================= */}

        <div className="mb-6 grid grid-cols-4 gap-6">

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold text-blue-600">
              TOTAL RECEIVED
            </p>
            <h2 className="mt-2 text-4xl font-bold text-blue-700">
              {candidates.length}
            </h2>
            <p className="mt-1 text-sm text-slate-500">Candidates</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold text-green-600">
              APPROVED
            </p>
            <h2 className="mt-2 text-4xl font-bold text-green-700">2</h2>
            <p className="mt-1 text-sm text-slate-500">50%</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold text-orange-600">
              PENDING REVIEW
            </p>
            <h2 className="mt-2 text-4xl font-bold text-orange-600">2</h2>
            <p className="mt-1 text-sm text-slate-500">Awaiting Decision</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold text-red-600">REJECTED</p>
            <h2 className="mt-2 text-4xl font-bold text-red-600">0</h2>
            <p className="mt-1 text-sm text-slate-500">0%</p>
          </div>

        </div>

        {/* Everything below shares one form so selections/totals are
            always live, regardless of whether a candidate review panel
            is open. */}
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* ================= Table Header ================= */}

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">
              Pending For Director Review
            </h2>
            <div className="text-sm text-slate-500">
              Showing{" "}
              {filteredData.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
              {" - "}
              {Math.min(page * PAGE_SIZE, filteredData.length)}
              {" of "}
              {filteredData.length}
            </div>
          </div>

          {/* ================= Search ================= */}

          <div className="mb-5 flex items-center justify-between">
            <div className="relative w-96">
              <Search
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by Temporary ID or Name..."
                className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="rounded-lg border border-slate-300 p-2 hover:bg-slate-100"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          {/* ================= Table ================= */}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr className="text-left text-sm">
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th className="px-4 py-3">Sr</th>
                  <th className="px-4 py-3">Temporary ID</th>
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Section</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Grade</th>
                  <th className="px-4 py-3">Gross Salary</th>
                  <th className="px-4 py-3">Proposed Salary</th>
                  <th className="px-4 py-3">IT Status</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((item, index) => {
                  const formIndex = candidates.findIndex(
                    (candidate) => candidate.employeeId === item.employeeId
                  );

                  if (formIndex === -1 || !employeeRows?.[formIndex]) {
                    return null;
                  }

                  return (
                    <tr
                      key={item.id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          {...register(`employees.${formIndex}.selected`)}
                        />
                      </td>

                      <td className="px-4 py-3">
                        {(page - 1) * PAGE_SIZE + index + 1}
                      </td>

                      <td className="px-4 py-3 font-medium text-blue-700">
                        {item.enrollmentId}
                      </td>

                      <td className="px-4 py-3">{item.fullName}</td>
                      <td className="px-4 py-3">{item.department}</td>
                      <td className="px-4 py-3">{item.section}</td>
                      <td className="px-4 py-3">{item.designation}</td>
                      <td className="px-4 py-3">{item.grade}</td>

                      <td className="px-4 py-3 font-medium">
                        ৳
                        {(
                          employeeRows[formIndex]?.grossSalary ?? 0
                        ).toLocaleString()}
                      </td>

                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min={0}
                          step="1"
                          className="w-36 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                          {...register(
                            `employees.${formIndex}.proposedMonthlySalary`,
                            { valueAsNumber: true }
                          )}
                        />
                      </td>

                      <td className="px-4 py-3">
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                          {item.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedCandidate(item)}
                          className="rounded-md border border-blue-500 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ================= Pagination ================= */}

          <div className="mt-5 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPage(index + 1)}
                className={`h-10 w-10 rounded-md border ${
                  page === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white hover:bg-slate-100"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* ===================================================== */}
          {/* Candidate Review Section (detail only — totals/actions
              below are always visible, not gated on this) */}
          {/* ===================================================== */}

          {selectedCandidate && (
            <div className="mt-8 grid grid-cols-12 gap-6">

              <div className="col-span-5 rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-6 py-4">
                  <h3 className="text-lg font-semibold">
                    Candidate Details
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4 p-6 text-sm">
                  <div>
                    <p className="text-slate-500">Temporary ID</p>
                    <p className="font-semibold">
                      {selectedCandidate.enrollmentId}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Full Name</p>
                    <p className="font-semibold">
                      {selectedCandidate.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Father's Name</p>
                    <p className="font-semibold">
                      {selectedCandidate.fatherName}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Date of Birth</p>
                    <p className="font-semibold">{selectedCandidate.dob}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Blood Group</p>
                    <p className="font-semibold">
                      {selectedCandidate.bloodGroup}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Worker Type</p>
                    <p className="font-semibold">
                      {selectedCandidate.workerType}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Department</p>
                    <p className="font-semibold">
                      {selectedCandidate.department}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Section</p>
                    <p className="font-semibold">
                      {selectedCandidate.section}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Cell</p>
                    <p className="font-semibold">{selectedCandidate.cell}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Designation</p>
                    <p className="font-semibold">
                      {selectedCandidate.designation}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Grade</p>
                    <p className="font-semibold">
                      {selectedCandidate.grade}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Gross Salary</p>
                    <p className="font-semibold text-green-700">
                      ৳{selectedCandidate.salary?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-4 rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-6 py-4">
                  <h3 className="text-lg font-semibold">
                    Documents & Captures
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-5 p-6">
                  <div>
                    <p className="mb-3 text-sm text-slate-500">Photo</p>
                    <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">
                      <div className="text-center">
                        <div className="mx-auto mb-3 h-20 w-20 rounded-full bg-slate-300" />
                        <p className="text-sm text-slate-500">Captured</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-sm text-slate-500">
                      Fingerprint
                    </p>
                    <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">
                      <CheckCircle size={70} className="text-green-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-3 rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-6 py-4">
                  <h3 className="text-lg font-semibold">IT Status</h3>
                </div>

                <div className="p-6">
                  <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
                    Pending
                  </span>
                  <p className="mt-5 text-sm text-slate-600">
                    Ready to send to IT after Director Approval.
                  </p>
                </div>
              </div>

            </div>
          )}

          {selectedCandidate && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-6 py-4">
                <h3 className="text-lg font-semibold">Director Remarks</h3>
              </div>

              <div className="p-6">
                <textarea
                  rows={5}
                  {...register("remarks")}
                  placeholder="Enter approval / rejection remarks..."
                  className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                />

                <div className="mt-6 flex gap-8">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="APPROVE"
                      {...register("decision")}
                    />
                    <span className="font-medium text-green-700">
                      Approve Candidate
                    </span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="REJECT"
                      {...register("decision")}
                    />
                    <span className="font-medium text-red-700">
                      Reject Candidate
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ========================================= */}
          {/* Footer Actions — always visible, totals always live */}
          {/* ========================================= */}

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-6">

              <div className="flex gap-10">
                <div>
                  <p className="text-xs text-slate-500">Total Received</p>
                  <h3 className="text-2xl font-bold text-blue-700">
                    {candidates.length}
                  </h3>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Selected</p>
                  <h3 className="text-2xl font-bold text-green-600">
                    {selectedCount}
                  </h3>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Total Gross Salary
                  </p>
                  <h3 className="text-xl font-bold text-slate-700">
                    ৳{totalGrossSalary.toLocaleString()}
                  </h3>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Total Proposed Salary
                  </p>
                  <h3 className="text-xl font-bold text-blue-700">
                    ৳{totalProposedSalary.toLocaleString()}
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    reset({
                      remarks: "",
                      decision: "APPROVE",
                      employees: buildRowsFromCandidates(candidates),
                    });
                  }}
                  className="flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-100"
                >
                  <RefreshCw size={18} />
                  Reset Changes
                </button>

                {selectedCandidate && (
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700"
                  >
                    <CheckCircle size={18} />
                    Save Decision
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleSelectAll(true)}
                  className="flex items-center gap-2 rounded-lg border border-green-600 px-5 py-3 font-medium text-green-700 hover:bg-green-50"
                >
                  <CheckCircle size={18} />
                  Select All
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectAll(false)}
                  className="flex items-center gap-2 rounded-lg border border-red-500 px-5 py-3 font-medium text-red-600 hover:bg-red-50"
                >
                  <XCircle size={18} />
                  Unselect All
                </button>

                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                  onClick={handleSendToIT}
                >
                  <Send size={18} />
                  Send Selected To IT
                </button>
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

export default DirectorReview;
