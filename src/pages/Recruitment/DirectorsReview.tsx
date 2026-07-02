import { useEffect, useMemo, useState } from "react";
import { CheckCircle, RefreshCw, Search, Send, XCircle } from "lucide-react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useGet } from "../../hooks/useGet";
import { API_ROUTES } from "../../api/routes";
import { usePost } from "../../hooks/usePost";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface SalaryRow {
  selected: boolean;
  employeeId: string;
  employeeEnrollmentId: string;
  grossSalary: number;
  proposedMonthlySalary: number;
  decision: "APPROVE" | "REJECT"; // Row-level decision
  remarks: string;               // Row-level remarks
}

interface DirectorReviewForm {
  employees: SalaryRow[];
}

interface Candidate {
  id: number;
  employeeId: string;
  enrollmentId: string;
  employeeName: string;
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
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // 1. Data Fetching & Mutations
  const { data: candidates = EMPTY_CANDIDATES, refetch } = useGet<Candidate[]>({
    key: ["candidates"],
    url: `${API_ROUTES.EMPLOYEES_BY_STATUS}?status=Biometric`,
  });

  const { mutate: DirectorReviewPost } = usePost<{ message: string; id: string }, any>(
    API_ROUTES.DIRECTORS_REVIEW
  );

  // 2. React Hook Form Setup
  const { register, handleSubmit, reset, control, setValue } = useForm<DirectorReviewForm>({
    defaultValues: {
      employees: [],
    },
  });

  const { replace } = useFieldArray({
    control,
    name: "employees",
  });

  // Seeds row-level defaults cleanly
  const buildRowsFromCandidates = (list: Candidate[]): SalaryRow[] =>
    list.map((item) => ({
      selected: false,
      employeeId: item.employeeId,
      employeeEnrollmentId: item.enrollmentId,
      grossSalary: item.salary,
      proposedMonthlySalary: item.salary,
      decision: "APPROVE", 
      remarks: "",        
    }));

  const candidatesKey = useMemo(() => candidates.map((c) => c.employeeId).join("|"), [candidates]);

  useEffect(() => {
    replace(buildRowsFromCandidates(candidates));
  }, [candidatesKey, replace]);

  // 3. Form Watching & Computations
  const employeeRows = useWatch({ control, name: "employees" }) || [];

  // Safely find the exact matching array index for the detail panel candidate
  const selectedCandidateFormIndex = useMemo(() => {
    if (!selectedCandidate) return -1;
    return employeeRows.findIndex((r) => r.employeeId === selectedCandidate.employeeId);
  }, [selectedCandidate, employeeRows]);

  // Search Filtering & Pagination
  const filteredData = useMemo(() => {
    return candidates.filter(
      (item) =>
        item.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
        item.enrollmentId.toLowerCase().includes(search.toLowerCase())
    );
  }, [candidates, search]);

  useEffect(() => { setPage(1); }, [search]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const paginatedData = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 4. Selections & Dynamic Calculations for Summary Cards
  const selectedRows = useMemo(() => employeeRows.filter((x) => x.selected), [employeeRows]);
  const selectedCount = selectedRows.length;
  
  const totalGrossSalary = useMemo(() => selectedRows.reduce((sum, item) => sum + (Number(item.grossSalary) || 0), 0), [selectedRows]);
  const totalProposedSalary = useMemo(() => selectedRows.reduce((sum, item) => sum + (Number(item.proposedMonthlySalary) || 0), 0), [selectedRows]);
  
  const allSelected = employeeRows.length > 0 && employeeRows.every((row) => row.selected);

  // Dynamic Metrics (calculated instantly from live row states)
  const stats = useMemo(() => {
    let approved = 0;
    let rejected = 0;
    employeeRows.forEach((row) => {
      if (row.decision === "APPROVE") approved++;
      if (row.decision === "REJECT") rejected++;
    });
    return { approved, rejected, pending: candidates.length - (approved + rejected) };
  }, [employeeRows, candidates.length]);

  const handleSelectAll = (checked: boolean) => {
    employeeRows.forEach((_, index) => {
      setValue(`employees.${index}.selected`, checked, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    });
  };

  // 5. Unified Form Submission Handler
  const onSendToIT = (data: DirectorReviewForm) => {
    const payload = data.employees
      .filter((item) => item.selected)
      .map((item) => ({
        employeeId: item.employeeId,
        employeeEnrollmentId: item.employeeEnrollmentId,
        grossSalary: item.grossSalary || null,
        proposedMonthlySalary: item.proposedMonthlySalary,
        directorsDecision: item.decision, // Sent correctly from dynamic row index
        remarks: item.remarks,            // Sent correctly from dynamic row index
      }));

    if (payload.length === 0) {
      toast.error("Please select at least one employee row to submit.");
      return;
    }

    DirectorReviewPost(payload, {
      onSuccess: (response) => {
        toast.success(response.message || "Review submitted to IT successfully!");
        setSelectedCandidate(null);
        refetch();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to submit review.");
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="flex justify-end mb-6">
        <button
          type="button"
          className="border border-blue-300 text-blue-600 rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-50 transition"
          onClick={() => navigate("/recruitment")}
        >
          ← Back to Main Menu
        </button>
      </div>

      <div className="mx-auto max-w-[1700px]">
        {/* ================= Live Summary Cards ================= */}
        <div className="mb-6 grid grid-cols-4 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-blue-600">TOTAL RECEIVED</p>
            <h2 className="mt-2 text-4xl font-bold text-blue-700">{candidates.length}</h2>
            <p className="mt-1 text-sm text-slate-500">Candidates</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-green-600">MARKED APPROVE</p>
            <h2 className="mt-2 text-4xl font-bold text-green-700">{stats.approved}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {candidates.length ? Math.round((stats.approved / candidates.length) * 100) : 0}% of Total
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-orange-600">SELECTED FOR SUBMIT</p>
            <h2 className="mt-2 text-4xl font-bold text-orange-600">{selectedCount}</h2>
            <p className="mt-1 text-sm text-slate-500">Checked Rows</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-red-600">MARKED REJECT</p>
            <h2 className="mt-2 text-4xl font-bold text-red-600">{stats.rejected}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {candidates.length ? Math.round((stats.rejected / candidates.length) * 100) : 0}% of Total
            </p>
          </div>
        </div>

        {/* Dynamic Multi-action Single Form wrapper */}
        <form onSubmit={handleSubmit(onSendToIT)}>
          
          {/* ================= Table Header ================= */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">Pending For Director Review</h2>
            <div className="text-sm text-slate-500">
              Showing {filteredData.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, filteredData.length)} of {filteredData.length}
            </div>
          </div>

          {/* ================= Search Bar ================= */}
          <div className="mb-5 flex items-center justify-between">
            <div className="relative w-96">
              <Search size={18} className="absolute left-3 top-3 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Temporary ID or Name..."
                className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="rounded-lg border border-slate-300 p-2 hover:bg-slate-100 transition"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          {/* ================= Candidate Overview Table ================= */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full border-collapse">
              <thead className="bg-slate-100">
                <tr className="text-left text-sm text-slate-700 font-medium">
                  <th className="w-12 px-4 py-3">
                    <input type="checkbox" checked={allSelected} onChange={(e) => handleSelectAll(e.target.checked)} />
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
                  <th className="px-4 py-3">Current Choice</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((item, index) => {
                  const formIndex = candidates.findIndex((c) => c.employeeId === item.employeeId);
                  if (formIndex === -1 || !employeeRows?.[formIndex]) return null;

                  return (
                    <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                        <input type="checkbox" {...register(`employees.${formIndex}.selected`)} />
                      </td>

                      <td className="px-4 py-3">{(page - 1) * PAGE_SIZE + index + 1}</td>
                      <td className="px-4 py-3 font-medium text-blue-700">{item.enrollmentId}</td>
                      <td className="px-4 py-3">{item.employeeName}</td>
                      <td className="px-4 py-3">{item.department}</td>
                      <td className="px-4 py-3">{item.section}</td>
                      <td className="px-4 py-3">{item.designation}</td>
                      <td className="px-4 py-3">{item.grade}</td>

                      <td className="px-4 py-3 font-medium">
                        ৳{Number(employeeRows[formIndex]?.grossSalary || 0).toLocaleString()}
                        <input type="hidden" {...register(`employees.${formIndex}.grossSalary`, { valueAsNumber: true })} />
                      </td>

                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min={0}
                          step="1"
                          className="w-36 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                          {...register(`employees.${formIndex}.proposedMonthlySalary`, { valueAsNumber: true })}
                        />
                      </td>

                      <td className="px-4 py-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          employeeRows[formIndex].decision === "APPROVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {employeeRows[formIndex].decision}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedCandidate(item)}
                          className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
                            selectedCandidate?.id === item.id 
                              ? "bg-blue-600 border-blue-600 text-white" 
                              : "border-blue-500 text-blue-600 hover:bg-blue-50"
                          }`}
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

          {/* ================= Pagination Control ================= */}
          {totalPages > 1 && (
            <div className="mt-5 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setPage(index + 1)}
                  className={`h-10 w-10 rounded-md border text-sm font-medium transition ${
                    page === index + 1 ? "bg-blue-600 text-white border-blue-600" : "bg-white border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}

          {/* ========================================================== */}
          {/* Detailed Row Review Panel (Synced safely to current choice) */}
          {/* ========================================================== */}
          {selectedCandidate && selectedCandidateFormIndex !== -1 && (
            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-12 gap-6">
                
                {/* Info Block */}
                <div className="col-span-5 rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 px-6 py-4">
                    <h3 className="text-lg font-semibold text-slate-800">Candidate Details</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 p-6 text-sm text-slate-600">
                    <div><p className="text-slate-400 text-xs uppercase">Temporary ID</p><p className="font-semibold text-slate-800">{selectedCandidate.enrollmentId}</p></div>
                    <div><p className="text-slate-400 text-xs uppercase">Full Name</p><p className="font-semibold text-slate-800">{selectedCandidate.employeeName}</p></div>
                    <div><p className="text-slate-400 text-xs uppercase">Father's Name</p><p className="font-semibold">{selectedCandidate.fatherName}</p></div>
                    <div><p className="text-slate-400 text-xs uppercase">Date of Birth</p><p className="font-semibold">{selectedCandidate.dob}</p></div>
                    <div><p className="text-slate-400 text-xs uppercase">Blood Group</p><p className="font-semibold">{selectedCandidate.bloodGroup}</p></div>
                    <div><p className="text-slate-400 text-xs uppercase">Worker Type</p><p className="font-semibold">{selectedCandidate.workerType}</p></div>
                    <div><p className="text-slate-400 text-xs uppercase">Department</p><p className="font-semibold">{selectedCandidate.department}</p></div>
                    <div><p className="text-slate-400 text-xs uppercase">Gross Salary</p><p className="font-semibold text-green-700">৳{selectedCandidate.salary?.toLocaleString()}</p></div>
                  </div>
                </div>

                {/* Imagery Attachments */}
                <div className="col-span-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 px-6 py-4">
                    <h3 className="text-lg font-semibold text-slate-800">Documents & Captures</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-5 p-6">
                    <div>
                      <p className="mb-2 text-xs font-medium text-slate-400 uppercase">Photo</p>
                      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 overflow-hidden">
                        {selectedCandidate.photo ? (
                          <img src={selectedCandidate.photo} alt="candidate upload" className="h-full w-full object-cover" />
                        ) : (
                          <div className="text-center">
                            <div className="mx-auto mb-2 h-14 w-14 rounded-full bg-slate-300" />
                            <p className="text-xs text-slate-400">Captured</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-medium text-slate-400 uppercase">Fingerprint</p>
                      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
                        <CheckCircle size={54} className="text-green-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Process Routing Box */}
                <div className="col-span-3 rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 px-6 py-4">
                    <h3 className="text-lg font-semibold text-slate-800">IT Routing Status</h3>
                  </div>
                  <div className="p-6">
                    <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700 inline-block">Pending Review</span>
                    <p className="mt-5 text-sm text-slate-500 leading-relaxed">
                      This item routes directly into automation setups downstream once clicked <b>"Send Selected To IT"</b> below.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Interactive Decisions Container */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/50">
                  <h3 className="text-base font-semibold text-slate-800">
                    Decision Details for: <span className="text-blue-700 font-bold">{selectedCandidate.employeeName}</span>
                  </h3>
                </div>

                <div className="p-6">
                  <textarea
                    rows={4}
                    {...register(`employees.${selectedCandidateFormIndex}.remarks`)}
                    placeholder="Enter approval / rejection remarks specific to this candidate..."
                    className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500 shadow-inner text-sm"
                  />

                  <div className="mt-4 flex gap-10 border-t border-slate-100 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer group selection:bg-transparent">
                      <input 
                        type="radio" 
                        value="APPROVE" 
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                        {...register(`employees.${selectedCandidateFormIndex}.decision`)} 
                      />
                      <span className="font-semibold text-sm text-slate-700 group-hover:text-green-700 transition">
                        Mark Candidate as Approved
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer group selection:bg-transparent">
                      <input 
                        type="radio" 
                        value="REJECT" 
                        className="w-4 h-4 text-red-600 focus:ring-red-500"
                        {...register(`employees.${selectedCandidateFormIndex}.decision`)} 
                      />
                      <span className="font-semibold text-sm text-slate-700 group-hover:text-red-700 transition">
                        Mark Candidate as Rejected
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= Global Sticky Footer Metrics / Action Center ================= */}
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-6">
              
              <div className="flex gap-10">
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Received</p>
                  <h3 className="text-2xl font-bold text-blue-700 mt-0.5">{candidates.length}</h3>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Rows Selected</p>
                  <h3 className="text-2xl font-bold text-green-600 mt-0.5">{selectedCount}</h3>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Gross Salary</p>
                  <h3 className="text-xl font-bold text-slate-700 mt-1">৳{totalGrossSalary.toLocaleString()}</h3>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Proposed Salary</p>
                  <h3 className="text-xl font-bold text-blue-700 mt-1">৳{totalProposedSalary.toLocaleString()}</h3>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    reset({ employees: buildRowsFromCandidates(candidates) });
                    setSelectedCandidate(null);
                    toast.success("All dynamic form inputs reset safely.");
                  }}
                  className="flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                >
                  <RefreshCw size={16} />
                  Reset Changes
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectAll(true)}
                  className="flex items-center gap-2 rounded-lg border border-green-600 px-5 py-3 text-sm font-medium text-green-700 hover:bg-green-50 transition"
                >
                  <CheckCircle size={16} />
                  Select All
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectAll(false)}
                  className="flex items-center gap-2 rounded-lg border border-red-500 px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                  <XCircle size={16} />
                  Unselect All
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 shadow transition"
                >
                  <Send size={16} />
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