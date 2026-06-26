import {
    useMemo,
    useState,
} from "react";

import {
    Camera,
    Fingerprint,
    RefreshCw,
    Search,
    Send,
} from "lucide-react";

interface Candidate {
    id: number;
    temporaryId: string;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    bloodGroup: string;
    joiningDate: string;
    status: string;

    fatherName: string;
    company: string;
    shed: string;
    department: string;
    section: string;
    cell: string;
    salary: number;
    workerType: string;
}

const mockCandidates: Candidate[] = [
    {
        id: 1,
        temporaryId: "TMP2505150001",
        fullName: "Ali Raza",
        dateOfBirth: "15-May-2002",
        gender: "Male",
        bloodGroup: "B+",
        joiningDate: "15-May-2025",
        status: "IT Pending",
        fatherName: "Abdul Raza",
        company: "NZ Textile Limited",
        shed: "Spinning Unit",
        department: "Production",
        section: "Weaving",
        cell: "Loom-12",
        salary: 18000,
        workerType: "Worker",
    },
    {
        id: 2,
        temporaryId: "TMP2505150002",
        fullName: "Muhammad Imran",
        dateOfBirth: "28-Mar-2001",
        gender: "Male",
        bloodGroup: "O+",
        joiningDate: "15-May-2025",
        status: "IT Pending",
        fatherName: "Rahim Uddin",
        company: "NZ Textile Limited",
        shed: "Spinning Unit",
        department: "Production",
        section: "Weaving",
        cell: "Loom-14",
        salary: 17500,
        workerType: "Worker",
    },
    {
        id: 3,
        temporaryId: "TMP2505150003",
        fullName: "Shahid Mehmood",
        dateOfBirth: "10-Jan-2003",
        gender: "Male",
        bloodGroup: "A+",
        joiningDate: "15-May-2025",
        status: "IT Pending",
        fatherName: "Akbar Ali",
        company: "NZ Textile Limited",
        shed: "Spinning Unit",
        department: "Production",
        section: "Weaving",
        cell: "Loom-15",
        salary: 18200,
        workerType: "Worker",
    },
    {
        id: 4,
        temporaryId: "TMP2505150004",
        fullName: "Nadeem Akhtar",
        dateOfBirth: "22-Feb-2002",
        gender: "Male",
        bloodGroup: "B+",
        joiningDate: "15-May-2025",
        status: "IT Pending",
        fatherName: "Sultan Ahmed",
        company: "NZ Textile Limited",
        shed: "Spinning Unit",
        department: "Production",
        section: "Weaving",
        cell: "Loom-11",
        salary: 18000,
        workerType: "Worker",
    },
    {
        id: 5,
        temporaryId: "TMP2505150005",
        fullName: "Faisal Khan",
        dateOfBirth: "05-Jul-2001",
        gender: "Male",
        bloodGroup: "AB+",
        joiningDate: "15-May-2025",
        status: "IT Pending",
        fatherName: "Hanif Khan",
        company: "NZ Textile Limited",
        shed: "Spinning Unit",
        department: "Production",
        section: "Weaving",
        cell: "Loom-16",
        salary: 18100,
        workerType: "Worker",
    },
    {
        id: 6,
        temporaryId: "TMP2505150006",
        fullName: "Umair Javed",
        dateOfBirth: "19-Nov-2002",
        gender: "Male",
        bloodGroup: "O-",
        joiningDate: "15-May-2025",
        status: "IT Pending",
        fatherName: "Javed Iqbal",
        company: "NZ Textile Limited",
        shed: "Spinning Unit",
        department: "Production",
        section: "Weaving",
        cell: "Loom-18",
        salary: 17900,
        workerType: "Worker",
    },
    {
        id: 7,
        temporaryId: "TMP2505150007",
        fullName: "Zeeshan Ali",
        dateOfBirth: "12-Apr-2002",
        gender: "Male",
        bloodGroup: "A-",
        joiningDate: "15-May-2025",
        status: "IT Pending",
        fatherName: "Ali Noor",
        company: "NZ Textile Limited",
        shed: "Spinning Unit",
        department: "Production",
        section: "Weaving",
        cell: "Loom-20",
        salary: 18500,
        workerType: "Worker",
    },
];

const PAGE_SIZE = 5;

const BiometricCapture = () => {
    const [search, setSearch] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [
        selectedCandidate,
        setSelectedCandidate,
    ] = useState<
        Candidate | null
    >(null);

    const [
        photoCaptured,
        setPhotoCaptured,
    ] = useState(false);

    const [
        fingerprintCaptured,
        setFingerprintCaptured,
    ] = useState(false);

    const filteredData =
        useMemo(() => {
            return mockCandidates.filter(
                (item) =>
                    item.temporaryId
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        ) ||
                    item.fullName
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )
            );
        }, [search]);

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

    const handleCapture =
        (
            candidate: Candidate
        ) => {
            setSelectedCandidate(
                candidate
            );

            setPhotoCaptured(false);

            setFingerprintCaptured(
                false
            );
        };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-[1700px]">

                {/* Header */}

                <div className="mb-5 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <h2 className="text-2xl font-semibold text-slate-800">
                            Pending for Biometric & Picture Capture
                        </h2>

                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                            {filteredData.length}
                        </span>

                    </div>

                    <div className="text-sm text-slate-500">
                        Showing{" "}
                        {filteredData.length === 0
                            ? 0
                            : (page - 1) * PAGE_SIZE + 1}
                        {" "}
                        -
                        {" "}
                        {Math.min(
                            page * PAGE_SIZE,
                            filteredData.length
                        )}
                        {" "}
                        of
                        {" "}
                        {filteredData.length}
                        {" "}
                        Candidates
                    </div>

                </div>

                {/* Search */}

                <div className="mb-5 flex items-center justify-between">

                    <div className="relative w-96">

                        <Search
                            size={18}
                            className="absolute left-3 top-3 text-gray-400"
                        />

                        <input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Search by Temporary ID or Name..."
                            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 outline-none focus:border-blue-500"
                        />

                    </div>

                    <button
                        onClick={() => {
                            setSearch("");
                            setPage(1);
                        }}
                        className="rounded-lg border border-gray-300 p-2 hover:bg-slate-100"
                    >
                        <RefreshCw size={18} />
                    </button>

                </div>

                {/* Table */}

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

                    <table className="w-full">

                        <thead className="bg-slate-100">

                            <tr className="text-left text-sm text-slate-700">

                                <th className="px-4 py-3">
                                    Sr.#
                                </th>

                                <th className="px-4 py-3">
                                    Temporary ID
                                </th>

                                <th className="px-4 py-3">
                                    Full Name
                                </th>

                                <th className="px-4 py-3">
                                    Date of Birth
                                </th>

                                <th className="px-4 py-3">
                                    Gender
                                </th>

                                <th className="px-4 py-3">
                                    Blood Group
                                </th>

                                <th className="px-4 py-3">
                                    Date of Joining
                                </th>

                                <th className="px-4 py-3">
                                    Status
                                </th>

                                <th className="px-4 py-3 text-center">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {paginatedData.map(
                                (
                                    candidate,
                                    index
                                ) => (
                                    <tr
                                        key={
                                            candidate.id
                                        }
                                        className="border-t border-slate-100 hover:bg-slate-50"
                                    >

                                        <td className="px-4 py-3">
                                            {(page - 1) *
                                                PAGE_SIZE +
                                                index +
                                                1}
                                        </td>

                                        <td className="px-4 py-3 font-medium text-blue-700">
                                            {
                                                candidate.temporaryId
                                            }
                                        </td>

                                        <td className="px-4 py-3">
                                            {
                                                candidate.fullName
                                            }
                                        </td>

                                        <td className="px-4 py-3">
                                            {
                                                candidate.dateOfBirth
                                            }
                                        </td>

                                        <td className="px-4 py-3">
                                            {
                                                candidate.gender
                                            }
                                        </td>

                                        <td className="px-4 py-3">
                                            {
                                                candidate.bloodGroup
                                            }
                                        </td>

                                        <td className="px-4 py-3">
                                            {
                                                candidate.joiningDate
                                            }
                                        </td>

                                        <td className="px-4 py-3">

                                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                                                {
                                                    candidate.status
                                                }
                                            </span>

                                        </td>

                                        <td className="px-4 py-3 text-center">

                                            <button
                                                onClick={() =>
                                                    handleCapture(
                                                        candidate
                                                    )
                                                }
                                                className="inline-flex items-center gap-2 rounded-md border border-blue-500 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                                            >

                                                <Camera size={16} />

                                                Capture

                                            </button>

                                        </td>

                                    </tr>
                                )
                            )}

                            {paginatedData.length ===
                                0 && (
                                    <tr>

                                        <td
                                            colSpan={9}
                                            className="py-10 text-center text-gray-500"
                                        >
                                            No candidate found.
                                        </td>

                                    </tr>
                                )}

                        </tbody>

                    </table>

                </div>

                {/* Pagination */}

                <div className="mt-5 flex justify-center gap-2">

                    {Array.from({
                        length: totalPages,
                    }).map((_, index) => (

                        <button
                            key={index}
                            onClick={() =>
                                setPage(index + 1)
                            }
                            className={`h-10 w-10 rounded-md border transition ${page === index + 1
                                    ? "border-blue-600 bg-blue-600 text-white"
                                    : "border-gray-300 bg-white hover:bg-slate-100"
                                }`}
                        >
                            {index + 1}
                        </button>

                    ))}

                </div>

                {/* ===================================================== */}
                {/* Candidate Details */}
                {/* ===================================================== */}

                {selectedCandidate && (
                    <>
                        <div className="mt-8 rounded-xl border border-slate-200 bg-white">

                            <div className="border-b border-slate-200 px-6 py-4">

                                <h3 className="text-lg font-semibold text-slate-800">
                                    Candidate Information
                                </h3>

                            </div>

                            <div className="grid grid-cols-2 gap-x-10 gap-y-5 p-6">

                                <div>
                                    <label className="text-sm text-gray-500">
                                        Temporary ID
                                    </label>

                                    <input
                                        readOnly
                                        value={selectedCandidate.temporaryId}
                                        className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-500">
                                        Full Name
                                    </label>

                                    <input
                                        readOnly
                                        value={selectedCandidate.fullName}
                                        className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-500">
                                        Father's Name
                                    </label>

                                    <input
                                        readOnly
                                        value={selectedCandidate.fatherName}
                                        className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-500">
                                        Date of Birth
                                    </label>

                                    <input
                                        readOnly
                                        value={selectedCandidate.dateOfBirth}
                                        className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-500">
                                        Company
                                    </label>

                                    <input
                                        readOnly
                                        value={selectedCandidate.company}
                                        className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-500">
                                        Department
                                    </label>

                                    <input
                                        readOnly
                                        value={selectedCandidate.department}
                                        className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-500">
                                        Section
                                    </label>

                                    <input
                                        readOnly
                                        value={selectedCandidate.section}
                                        className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-500">
                                        Cell
                                    </label>

                                    <input
                                        readOnly
                                        value={selectedCandidate.cell}
                                        className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-500">
                                        Worker Type
                                    </label>

                                    <input
                                        readOnly
                                        value={selectedCandidate.workerType}
                                        className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-500">
                                        Proposed Salary
                                    </label>

                                    <input
                                        readOnly
                                        value={`৳ ${selectedCandidate.salary}`}
                                        className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2"
                                    />
                                </div>

                            </div>

                        </div>

                        {/* ====================================== */}
                        {/* Capture Section */}
                        {/* ====================================== */}

                        <div className="mt-8 grid grid-cols-2 gap-6">

                            {/* Photo */}

                            <div className="rounded-xl border border-slate-200 bg-white">

                                <div className="border-b px-6 py-4">

                                    <h3 className="flex items-center gap-2 text-lg font-semibold">

                                        <Camera
                                            size={20}
                                            className="text-blue-600"
                                        />

                                        Picture Capture

                                    </h3>

                                </div>

                                <div className="p-6">

                                    <div className="flex h-80 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50">

                                        {photoCaptured ? (

                                            <div className="text-center">

                                                <Camera
                                                    size={70}
                                                    className="mx-auto mb-4 text-green-600"
                                                />

                                                <p className="font-semibold text-green-600">
                                                    Photo Captured Successfully
                                                </p>

                                            </div>

                                        ) : (

                                            <div className="text-center">

                                                <Camera
                                                    size={70}
                                                    className="mx-auto mb-4 text-slate-400"
                                                />

                                                <p className="text-gray-500">
                                                    Camera Preview
                                                </p>

                                            </div>

                                        )}

                                    </div>

                                    <button
                                        onClick={() =>
                                            setPhotoCaptured(true)
                                        }
                                        className="mt-5 w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
                                    >
                                        Capture Picture
                                    </button>

                                </div>

                            </div>

                            {/* Fingerprint */}

                            <div className="rounded-xl border border-slate-200 bg-white">

                                <div className="border-b px-6 py-4">

                                    <h3 className="flex items-center gap-2 text-lg font-semibold">

                                        <Fingerprint
                                            size={20}
                                            className="text-blue-600"
                                        />

                                        Biometric Capture

                                    </h3>

                                </div>

                                <div className="p-6">

                                    <div className="flex h-80 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50">

                                        {fingerprintCaptured ? (

                                            <div className="text-center">

                                                <Fingerprint
                                                    size={75}
                                                    className="mx-auto mb-4 text-green-600"
                                                />

                                                <p className="font-semibold text-green-600">
                                                    Fingerprint Captured Successfully
                                                </p>

                                            </div>

                                        ) : (

                                            <div className="text-center">

                                                <Fingerprint
                                                    size={75}
                                                    className="mx-auto mb-4 text-slate-400"
                                                />

                                                <p className="text-gray-500">
                                                    Waiting For Fingerprint Device...
                                                </p>

                                            </div>

                                        )}

                                    </div>

                                    <button
                                        onClick={() =>
                                            setFingerprintCaptured(true)
                                        }
                                        className="mt-5 w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
                                    >
                                        Capture Fingerprint
                                    </button>

                                </div>

                            </div>

                        </div>

                        {/* Capture Status */}
                        {/* ===================================================== */}

                        <div className="mt-8 grid grid-cols-4 gap-5">

                            <div className="rounded-xl border border-slate-200 bg-white p-5">

                                <div className="flex items-center justify-between">

                                    <h4 className="font-semibold text-slate-700">
                                        Picture
                                    </h4>

                                    <Camera
                                        size={20}
                                        className={
                                            photoCaptured
                                                ? "text-green-600"
                                                : "text-slate-400"
                                        }
                                    />

                                </div>

                                <p
                                    className={`mt-4 text-lg font-semibold ${photoCaptured
                                            ? "text-green-600"
                                            : "text-orange-500"
                                        }`}
                                >
                                    {photoCaptured
                                        ? "Completed"
                                        : "Pending"}
                                </p>

                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-5">

                                <div className="flex items-center justify-between">

                                    <h4 className="font-semibold text-slate-700">
                                        Fingerprint
                                    </h4>

                                    <Fingerprint
                                        size={20}
                                        className={
                                            fingerprintCaptured
                                                ? "text-green-600"
                                                : "text-slate-400"
                                        }
                                    />

                                </div>

                                <p
                                    className={`mt-4 text-lg font-semibold ${fingerprintCaptured
                                            ? "text-green-600"
                                            : "text-orange-500"
                                        }`}
                                >
                                    {fingerprintCaptured
                                        ? "Completed"
                                        : "Pending"}
                                </p>

                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-5">

                                <h4 className="font-semibold text-slate-700">
                                    Camera Status
                                </h4>

                                <div className="mt-4 flex items-center gap-2">

                                    <span className="h-3 w-3 rounded-full bg-green-500" />

                                    <span className="font-medium text-green-600">
                                        Connected
                                    </span>

                                </div>

                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-5">

                                <h4 className="font-semibold text-slate-700">
                                    Scanner Status
                                </h4>

                                <div className="mt-4 flex items-center gap-2">

                                    <span className="h-3 w-3 rounded-full bg-green-500" />

                                    <span className="font-medium text-green-600">
                                        Ready
                                    </span>

                                </div>

                            </div>

                        </div>

                        {/* ===================================================== */}
                        {/* Fingerprint Quality */}
                        {/* ===================================================== */}

                        <div className="mt-8 rounded-xl border border-slate-200 bg-white">

                            <div className="border-b border-slate-200 px-6 py-4">

                                <h3 className="text-lg font-semibold text-slate-800">
                                    Fingerprint Quality
                                </h3>

                            </div>

                            <div className="grid grid-cols-4 gap-5 p-6">

                                <div>

                                    <p className="mb-2 text-sm text-slate-500">
                                        Left Thumb
                                    </p>

                                    <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                                        <div
                                            className={`h-full ${fingerprintCaptured
                                                    ? "w-[92%] bg-green-500"
                                                    : "w-0"
                                                }`}
                                        />

                                    </div>

                                </div>

                                <div>

                                    <p className="mb-2 text-sm text-slate-500">
                                        Left Index
                                    </p>

                                    <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                                        <div
                                            className={`h-full ${fingerprintCaptured
                                                    ? "w-[89%] bg-green-500"
                                                    : "w-0"
                                                }`}
                                        />

                                    </div>

                                </div>

                                <div>

                                    <p className="mb-2 text-sm text-slate-500">
                                        Right Thumb
                                    </p>

                                    <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                                        <div
                                            className={`h-full ${fingerprintCaptured
                                                    ? "w-[95%] bg-green-500"
                                                    : "w-0"
                                                }`}
                                        />

                                    </div>

                                </div>

                                <div>

                                    <p className="mb-2 text-sm text-slate-500">
                                        Right Index
                                    </p>

                                    <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                                        <div
                                            className={`h-full ${fingerprintCaptured
                                                    ? "w-[91%] bg-green-500"
                                                    : "w-0"
                                                }`}
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* ===================================================== */}
                        {/* Employee Summary */}
                        {/* ===================================================== */}

                        <div className="mt-8 rounded-xl border border-slate-200 bg-white">

                            <div className="border-b border-slate-200 px-6 py-4">

                                <h3 className="text-lg font-semibold text-slate-800">
                                    Employee Summary
                                </h3>

                            </div>

                            <div className="grid grid-cols-3 gap-6 p-6">

                                <div>

                                    <p className="text-sm text-slate-500">
                                        Company
                                    </p>

                                    <p className="mt-1 font-semibold">
                                        {selectedCandidate.company}
                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm text-slate-500">
                                        Shed
                                    </p>

                                    <p className="mt-1 font-semibold">
                                        {selectedCandidate.shed}
                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm text-slate-500">
                                        Department
                                    </p>

                                    <p className="mt-1 font-semibold">
                                        {selectedCandidate.department}
                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm text-slate-500">
                                        Section
                                    </p>

                                    <p className="mt-1 font-semibold">
                                        {selectedCandidate.section}
                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm text-slate-500">
                                        Cell
                                    </p>

                                    <p className="mt-1 font-semibold">
                                        {selectedCandidate.cell}
                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm text-slate-500">
                                        Salary
                                    </p>

                                    <p className="mt-1 font-semibold text-green-700">
                                        ৳ {selectedCandidate.salary.toLocaleString()}
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* ===================================================== */}
                        {/* Capture Validation */}
                        {/* ===================================================== */}

                        <div className="mt-8 rounded-xl border border-slate-200 bg-white">

                            <div className="border-b border-slate-200 px-6 py-4">

                                <h3 className="text-lg font-semibold text-slate-800">
                                    Capture Checklist
                                </h3>

                            </div>

                            <div className="grid grid-cols-2 gap-6 p-6">

                                <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">

                                    <span className="font-medium">
                                        Candidate Picture
                                    </span>

                                    {photoCaptured ? (
                                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                                            Completed
                                        </span>
                                    ) : (
                                        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                                            Pending
                                        </span>
                                    )}

                                </div>

                                <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">

                                    <span className="font-medium">
                                        Fingerprint
                                    </span>

                                    {fingerprintCaptured ? (
                                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                                            Completed
                                        </span>
                                    ) : (
                                        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                                            Pending
                                        </span>
                                    )}

                                </div>

                            </div>

                        </div>

                        {/* ===================================================== */}
                        {/* Footer Actions */}
                        {/* ===================================================== */}

                        <div className="mt-8 flex flex-wrap items-center justify-end gap-4">

                            <button
                                type="button"
                                onClick={() => {
                                    setPhotoCaptured(false);
                                }}
                                className="rounded-lg border border-blue-500 px-6 py-3 font-medium text-blue-600 transition hover:bg-blue-50"
                            >
                                Retake Picture
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setFingerprintCaptured(false);
                                }}
                                className="rounded-lg border border-blue-500 px-6 py-3 font-medium text-blue-600 transition hover:bg-blue-50"
                            >
                                Retake Fingerprint
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedCandidate(null);
                                    setPhotoCaptured(false);
                                    setFingerprintCaptured(false);
                                }}
                                className="rounded-lg border border-red-500 px-6 py-3 font-medium text-red-600 transition hover:bg-red-50"
                            >
                                Clear
                            </button>

                            <button
                                type="button"
                                disabled={
                                    !photoCaptured ||
                                    !fingerprintCaptured
                                }
                                onClick={() => {
                                    alert(
                                        "Biometric Successfully Submitted!"
                                    );
                                }}
                                className={`flex items-center gap-2 rounded-lg px-8 py-3 font-semibold text-white transition ${photoCaptured &&
                                        fingerprintCaptured
                                        ? "bg-blue-600 hover:bg-blue-700"
                                        : "cursor-not-allowed bg-slate-300"
                                    }`}
                            >

                                <Send size={18} />

                                Send To Director Review

                            </button>

                        </div>

                        {/* ===================================================== */}
                        {/* Footer Summary */}
                        {/* ===================================================== */}

                        <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-5">

                            <div className="flex flex-wrap items-center justify-between">

                                <div>

                                    <p className="text-sm text-slate-500">
                                        Selected Candidate
                                    </p>

                                    <h4 className="mt-1 font-semibold text-slate-800">
                                        {selectedCandidate.fullName}
                                    </h4>

                                </div>

                                <div>

                                    <p className="text-sm text-slate-500">
                                        Temporary ID
                                    </p>

                                    <h4 className="mt-1 font-semibold text-slate-800">
                                        {selectedCandidate.temporaryId}
                                    </h4>

                                </div>

                                <div>

                                    <p className="text-sm text-slate-500">
                                        Capture Progress
                                    </p>

                                    <h4 className="mt-1 font-semibold">

                                        {photoCaptured &&
                                            fingerprintCaptured ? (
                                            <span className="text-green-600">
                                                Ready For Director Review
                                            </span>
                                        ) : (
                                            <span className="text-orange-600">
                                                Capture Remaining
                                            </span>
                                        )}

                                    </h4>

                                </div>

                            </div>

                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default BiometricCapture;