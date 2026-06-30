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
} from "react-hook-form";
import { useGet } from "../../hooks/useGet";
import { API_ROUTES } from "../../api/routes";

interface DirectorReviewForm {
  remarks: string;
  decision: "APPROVE" | "REJECT";
}

interface Candidate {
  id: number;
  employeeId: string;
  enrollmentId: string;
  ///temporaryId: string;
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

const DirectorReview = () => {
  
    const { data: candidates=[] } = useGet<Candidate[]>({
        key: ["candidates"],
        url: `${API_ROUTES.EMPLOYEES_BY_STATUS}?status=Biometric`,
    });

  const [page, setPage] =
    useState(1);

  const [search, setSearch] =
    useState("");

  const [
    selectedCandidate,
    setSelectedCandidate,
  ] =
    useState<Candidate | null>(
      null
    );

  const {
    register,
    handleSubmit,
    reset,
  } =
    useForm<DirectorReviewForm>({
      defaultValues: {
        remarks: "",
        decision: "APPROVE",
      },
    });

  const filteredData =
    useMemo(() => {
      return candidates.filter(
        (item) =>
          item.fullName?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          item.enrollmentId
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [candidates, search]);

    useEffect(() => {
        setPage(1);
    }, [candidates]);

  const totalPages =
    Math.ceil(
      filteredData.length /
        PAGE_SIZE
    );

  const paginatedData =
    filteredData.slice(
      (page - 1) *
        PAGE_SIZE,
      page * PAGE_SIZE
    );

  const onSubmit = (
    data: DirectorReviewForm
  ) => {
    console.log(
      selectedCandidate,
      data
    );

    alert(
      `${data.decision} Successfully`
    );

    reset();

    setSelectedCandidate(null);
  };

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
            4
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Mock Candidates
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-semibold text-green-600">
            APPROVED
          </p>

          <h2 className="mt-2 text-4xl font-bold text-green-700">
            2
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            50%
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-semibold text-orange-600">
            PENDING REVIEW
          </p>

          <h2 className="mt-2 text-4xl font-bold text-orange-600">
            2
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Awaiting Decision
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-semibold text-red-600">
            REJECTED
          </p>

          <h2 className="mt-2 text-4xl font-bold text-red-600">
            0
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            0%
          </p>
        </div>

      </div>

      {/* ================= Table Header ================= */}

      <div className="mb-4 flex items-center justify-between">

        <h2 className="text-xl font-semibold text-slate-800">
          Pending For Director Review
        </h2>

        <div className="text-sm text-slate-500">
          Showing{" "}
          {(page - 1) * PAGE_SIZE + 1}
          {" - "}
          {Math.min(
            page * PAGE_SIZE,
            filteredData.length
          )}
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

              <th className="px-4 py-3">Sr</th>

              <th className="px-4 py-3">
                Temporary ID
              </th>

              <th className="px-4 py-3">
                Full Name
              </th>

              <th className="px-4 py-3">
                Department
              </th>

              <th className="px-4 py-3">
                Section
              </th>

              <th className="px-4 py-3">
                Designation
              </th>

              <th className="px-4 py-3">
                Grade
              </th>

              <th className="px-4 py-3">
                Salary
              </th>

              <th className="px-4 py-3">
                IT Status
              </th>

              <th className="px-4 py-3 text-center">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {paginatedData.map(
              (
                item,
                index
              ) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >

                  <td className="px-4 py-3">
                    {(page - 1) *
                      PAGE_SIZE +
                      index +
                      1}
                  </td>

                  <td className="px-4 py-3 font-medium text-blue-700">
                    {item.enrollmentId}
                  </td>

                  <td className="px-4 py-3">
                    {item.fullName}
                  </td>

                  <td className="px-4 py-3">
                    {item.department}
                  </td>

                  <td className="px-4 py-3">
                    {item.section}
                  </td>

                  <td className="px-4 py-3">
                    {item.designation}
                  </td>

                  <td className="px-4 py-3">
                    {item.grade}
                  </td>

                  <td className="px-4 py-3">
                    ৳
                    {item.salary?.toLocaleString()}
                  </td>

                  <td className="px-4 py-3">

                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                      {item.status}
                    </span>

                  </td>

                  <td className="px-4 py-3 text-center">

                    <button
                      onClick={() =>
                        setSelectedCandidate(
                          item
                        )
                      }
                      className="rounded-md border border-blue-500 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                    >
                      Review
                    </button>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

      {/* ================= Pagination ================= */}

      <div className="mt-5 flex justify-center gap-2">

        {Array.from({
          length: totalPages,
        }).map((_, index) => (

          <button
            key={index}
            onClick={() =>
              setPage(index + 1)
            }
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
      {/* Candidate Review Section */}
      {/* ===================================================== */}

      {selectedCandidate && (
        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
        >
          <div className="mt-8 grid grid-cols-12 gap-6">

            {/* ========================================= */}
            {/* Candidate Details */}
            {/* ========================================= */}

            <div className="col-span-5 rounded-xl border border-slate-200 bg-white">

              <div className="border-b border-slate-200 px-6 py-4">

                <h3 className="text-lg font-semibold">
                  Candidate Details
                </h3>

              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-4 p-6 text-sm">

                <div>
                  <p className="text-slate-500">
                    Temporary ID
                  </p>

                  <p className="font-semibold">
                    {
                      selectedCandidate.enrollmentId
                    }
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">
                    Full Name
                  </p>

                  <p className="font-semibold">
                    {
                      selectedCandidate.fullName
                    }
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">
                    Father's Name
                  </p>

                  <p className="font-semibold">
                    {
                      selectedCandidate.fatherName
                    }
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">
                    Date of Birth
                  </p>

                  <p className="font-semibold">
                    {selectedCandidate.dob}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">
                    Blood Group
                  </p>

                  <p className="font-semibold">
                    {
                      selectedCandidate.bloodGroup
                    }
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">
                    Worker Type
                  </p>

                  <p className="font-semibold">
                    {
                      selectedCandidate.workerType
                    }
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">
                    Department
                  </p>

                  <p className="font-semibold">
                    {
                      selectedCandidate.department
                    }
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">
                    Section
                  </p>

                  <p className="font-semibold">
                    {
                      selectedCandidate.section
                    }
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">
                    Cell
                  </p>

                  <p className="font-semibold">
                    {selectedCandidate.cell}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">
                    Designation
                  </p>

                  <p className="font-semibold">
                    {
                      selectedCandidate.designation
                    }
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">
                    Grade
                  </p>

                  <p className="font-semibold">
                    {
                      selectedCandidate.grade
                    }
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">
                    Salary
                  </p>

                  <p className="font-semibold text-green-700">
                    ৳
                    {selectedCandidate.salary?.toLocaleString()}
                  </p>
                </div>

              </div>

            </div>

            {/* ========================================= */}
            {/* IT Documents */}
            {/* ========================================= */}

            <div className="col-span-4 rounded-xl border border-slate-200 bg-white">

              <div className="border-b border-slate-200 px-6 py-4">

                <h3 className="text-lg font-semibold">
                  Documents & Captures
                </h3>

              </div>

              <div className="grid grid-cols-2 gap-5 p-6">

                <div>

                  <p className="mb-3 text-sm text-slate-500">
                    Photo
                  </p>

                  <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">

                    <div className="text-center">

                      <div className="mx-auto mb-3 h-20 w-20 rounded-full bg-slate-300" />

                      <p className="text-sm text-slate-500">
                        Captured
                      </p>

                    </div>

                  </div>

                </div>

                <div>

                  <p className="mb-3 text-sm text-slate-500">
                    Fingerprint
                  </p>

                  <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">

                    <CheckCircle
                      size={70}
                      className="text-green-600"
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* ========================================= */}
            {/* IT Status */}
            {/* ========================================= */}

            <div className="col-span-3 rounded-xl border border-slate-200 bg-white">

              <div className="border-b border-slate-200 px-6 py-4">

                <h3 className="text-lg font-semibold">
                  IT Status
                </h3>

              </div>

              <div className="p-6">

                <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
                  Pending
                </span>

                <p className="mt-5 text-sm text-slate-600">
                  Ready to send to IT after
                  Director Approval.
                </p>

              </div>

            </div>

          </div>

          {/* ========================================= */}
          {/* Director Remarks */}
          {/* ========================================= */}

          <div className="mt-6 rounded-xl border border-slate-200 bg-white">

            <div className="border-b border-slate-200 px-6 py-4">

              <h3 className="text-lg font-semibold">
                Director Remarks
              </h3>

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
                    value="APPROVE"
                    type="radio"
                    {...register(
                      "decision"
                    )}
                  />

                  <span className="font-medium text-green-700">
                    Approve Candidate
                  </span>

                </label>

                <label className="flex items-center gap-2">

                  <input
                    value="REJECT"
                    type="radio"
                    {...register(
                      "decision"
                    )}
                  />

                  <span className="font-medium text-red-700">
                    Reject Candidate
                  </span>

                </label>

              </div>

            </div>

          </div>
                    {/* ========================================= */}
          {/* Footer Actions */}
          {/* ========================================= */}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5">

            {/* Summary */}

            <div className="flex gap-10">

              <div>
                <p className="text-xs text-slate-500">
                  Total Received
                </p>

                <h3 className="text-2xl font-bold text-blue-700">
                  {candidates.length}
                </h3>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Approved
                </p>

                <h3 className="text-2xl font-bold text-green-600">
                  2
                </h3>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Pending
                </p>

                <h3 className="text-2xl font-bold text-orange-500">
                  2
                </h3>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Rejected
                </p>

                <h3 className="text-2xl font-bold text-red-600">
                  0
                </h3>
              </div>

            </div>

            {/* Buttons */}

            <div className="flex flex-wrap gap-3">

              <button
                type="button"
                onClick={() => {
                  reset();
                }}
                className="flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-100"
              >
                <RefreshCw size={18} />

                Reset Changes
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700"
              >
                <CheckCircle size={18} />

                Save Decision
              </button>

              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-green-600 px-5 py-3 font-medium text-green-700 hover:bg-green-50"
                onClick={() =>
                  alert(
                    "All Candidates Approved"
                  )
                }
              >
                <CheckCircle size={18} />

                Approve All
              </button>

              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-red-500 px-5 py-3 font-medium text-red-600 hover:bg-red-50"
                onClick={() =>
                  alert(
                    "All Candidates Rejected"
                  )
                }
              >
                <XCircle size={18} />

                Reject All
              </button>

              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                onClick={() =>
                  alert(
                    "Approved Candidates Sent To IT"
                  )
                }
              >
                <Send size={18} />

                Send Approved To IT
              </button>

            </div>

          </div>

        </form>
      )}

    </div>

  </div>
);

};

export default DirectorReview;