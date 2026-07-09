import {
    useMemo,
    useState,
    useRef,
    useEffect,
} from "react";

import {
    Camera,
    Fingerprint,
    RefreshCw,
    Search,
    Send,
} from "lucide-react";
import { useGet } from "../../hooks/useGet";
import { API_ROUTES } from "../../api/routes";
import { usePost } from "../../hooks/usePost";
import toast from "react-hot-toast";
import { api } from "../../api/client";
import { useNavigate } from "react-router-dom";
import { bloodGroupMap, genderMapFromNumber } from "../EmployeeInformation/types";

export interface Document {
    employeeId: string | undefined;
    documentType: number;
    documentNo: string;
    issueDate: string;
    expiryDate: string | null;
    fileName: string;
    filePath: string;
}

interface Candidate {
    id: number;
    employeeId: string;
    enrollmentId: string;
    employeeName: string;
    dateOfBirth: string;
    gender: string;
    bloodGroup: string;
    dateOfJoining: string;
    status: string;
    joiningDate: string;

    fatherName: string;
    unitName: string;
    shed: string;
    department: string;
    sectionName: string;
    cell: string;
    salary: number;
    workerType: string;
}

const PAGE_SIZE = 5;

const BiometricCapture = () => {

    const { data: candidates=[], refetch } = useGet<Candidate[]>({
        key: ["candidates"],
        url: `${API_ROUTES.EMPLOYEES_BY_STATUS}?status=HRExecutive`,
    });

    const { mutate: BiometricCapturePost } = usePost<{ message: string; id: string }, any>(
        API_ROUTES.BIOMETRIC_CAPTURE
    );

    const [documents, setDocuments] = useState<Document[]>([]);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [photo, setPhoto] = useState<string>("");
    const [stream, setStream] = useState<MediaStream | null>(null);

    const dataURLToFile = (dataUrl: string, fileName: string): File => {
        const arr = dataUrl.split(",");
        const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], fileName, { type: mime });
    };

    const uploadPhoto = async (imageData: string) => {
        const file = dataURLToFile(
            imageData,
            `employee-photo-${Date.now()}.png`
        );

        const formData = new FormData();
        formData.append("files", file);

        const { data } = await api.post(
            `Employees/upload-files?employeeEnrollmentId=${selectedCandidate?.enrollmentId}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return data;
    };


    const startCamera = async () => {
        setPhoto("");
        console.log(window.isSecureContext);
        try {
            const mediaStream = await navigator?.mediaDevices?.getUserMedia({
                video: true,
            });

            setStream(mediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error(err);
        }
    };
    const capturePhoto = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        try {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // Capture image from camera
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Base64 image
            const image = canvas.toDataURL("image/png");

            // Preview image
            setPhoto(image);
            setPhotoCaptured(true);

            // Stop camera
            stream?.getTracks().forEach(track => track.stop());

            // Upload image
            const uploadResponse = await uploadPhoto(image);

            if (
                !uploadResponse.fileNames ||
                uploadResponse.fileNames.length === 0
            ) {
                throw new Error("No file returned from upload.");
            }

            const fileName = uploadResponse.fileNames[0];

            // Update documents
            setDocuments([
                {
                    employeeId: selectedCandidate?.employeeId,
                    documentType: 0,
                    documentNo: "",
                    issueDate: new Date().toISOString().split("T")[0],
                    expiryDate: null,
                    fileName,
                    filePath: fileName, // Change if your backend expects a full path
                },
            ]);

            console.log("Photo uploaded successfully:", fileName);
        } catch (error) {
            console.error("Error capturing/uploading photo:", error);
        }
    };

    const biometricSubmitted = () => {
        const payload = {
            employeeId: selectedCandidate?.employeeId,
            employeeEnrollmentId: selectedCandidate?.enrollmentId,
            cardNo: "123",
            documents
        }

        BiometricCapturePost(payload, {
            onSuccess: (response) => {
                toast.success(response.message);
                refetch();
            },

            onError: (error) => {
                toast.error(error.message);
            },
        })
    }

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

    const filteredData = useMemo(() => {

        if (!search) return candidates;

        return candidates.filter(
            (candidate) =>
                candidate.enrollmentId
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                candidate.employeeName
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
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

    const handleCapture =
       async  (
            candidate: Candidate
        ) => {
            const response = await api.get(`${API_ROUTES.EMPLOYEES}/employee-detail/${candidate.employeeId}`)
            setSelectedCandidate(
                response.data
            );

            setPhotoCaptured(false);

            setFingerprintCaptured(
                false
            );
        };

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-[1700px]">

                {/* Header */}
                <div className="flex justify-end mb-6">
                    <button
                        type="button"
                        className="
              border
              border-blue-300
              text-blue-600
              rounded-lg
              px-4
              py-2
              text-sm
              font-medium
            "
                        onClick={() => navigate("/recruitment")}
                    >
                        ← Back to Main Menu
                    </button>
                </div>

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
                                                candidate.enrollmentId
                                            }
                                        </td>

                                        <td className="px-4 py-3">
                                            {
                                                candidate.employeeName
                                            }
                                        </td>

                                        <td className="px-4 py-3">
                                            {
                                                candidate.dateOfBirth
                                            }
                                        </td>

                                        <td className="px-4 py-3">
                                            {
                                                genderMapFromNumber[Number(candidate.gender)]
                                            }
                                        </td>

                                        <td className="px-4 py-3">
                                            {
                                               bloodGroupMap[candidate.bloodGroup]
                                            }
                                        </td>

                                        <td className="px-4 py-3">
                                            {
                                                candidate.dateOfJoining
                                            }
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
                                <h3 className="text-lg font-semibold text-blue-700">
                                    Candidate Details (From HR Executive Entry)
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-x-12 p-6">

                                {/* Left Column */}
                                <div className="space-y-3">

                                    <div className="grid grid-cols-[110px_15px_1fr]">
                                        <span className="text-sm text-slate-600">Temporary ID</span>
                                        <span>:</span>
                                        <span className="font-medium">{selectedCandidate.enrollmentId}</span>
                                    </div>

                                    <div className="grid grid-cols-[110px_15px_1fr]">
                                        <span className="text-sm text-slate-600">Full Name</span>
                                        <span>:</span>
                                        <span className="font-medium">{selectedCandidate.employeeName}</span>
                                    </div>

                                    <div className="grid grid-cols-[110px_15px_1fr]">
                                        <span className="text-sm text-slate-600">Father's Name</span>
                                        <span>:</span>
                                        <span className="font-medium">{selectedCandidate.fatherName}</span>
                                    </div>

                                    <div className="grid grid-cols-[110px_15px_1fr]">
                                        <span className="text-sm text-slate-600">Date of Birth</span>
                                        <span>:</span>
                                        <span className="font-medium">{selectedCandidate.dateOfBirth}</span>
                                    </div>

                                    <div className="grid grid-cols-[110px_15px_1fr]">
                                        <span className="text-sm text-slate-600">Gender</span>
                                        <span>:</span>
                                        <span className="font-medium">{genderMapFromNumber[Number(selectedCandidate.gender)]}</span>
                                    </div>

                                    <div className="grid grid-cols-[110px_15px_1fr]">
                                        <span className="text-sm text-slate-600">Blood Group</span>
                                        <span>:</span>
                                        <span className="font-medium">{bloodGroupMap[selectedCandidate.bloodGroup]}</span>
                                    </div>

                                    <div className="grid grid-cols-[110px_15px_1fr]">
                                        <span className="text-sm text-slate-600">Date of Joining</span>
                                        <span>:</span>
                                        <span className="font-medium">{selectedCandidate.joiningDate}</span>
                                    </div>

                                    <div className="grid grid-cols-[110px_15px_1fr]">
                                        <span className="text-sm text-slate-600">Type of Worker</span>
                                        <span>:</span>
                                        <span className="font-medium">{selectedCandidate.workerType}</span>
                                    </div>

                                </div>

                                {/* Right Column */}
                                <div className="space-y-3">

                                    <div className="grid grid-cols-[150px_15px_1fr]">
                                        <span className="text-sm text-slate-600">Company</span>
                                        <span>:</span>
                                        <span className="font-medium">{selectedCandidate.unitName}</span>
                                    </div>

                                    <div className="grid grid-cols-[150px_15px_1fr]">
                                        <span className="text-sm text-slate-600">Sub Unit / Oblique Shed</span>
                                        <span>:</span>
                                        <span className="font-medium">{selectedCandidate.shed}</span>
                                    </div>

                                    <div className="grid grid-cols-[150px_15px_1fr]">
                                        <span className="text-sm text-slate-600">Department</span>
                                        <span>:</span>
                                        <span className="font-medium">{selectedCandidate.department}</span>
                                    </div>

                                    <div className="grid grid-cols-[150px_15px_1fr]">
                                        <span className="text-sm text-slate-600">Section</span>
                                        <span>:</span>
                                        <span className="font-medium">{selectedCandidate.sectionName}</span>
                                    </div>

                                    <div className="grid grid-cols-[150px_15px_1fr]">
                                        <span className="text-sm text-slate-600">Cell</span>
                                        <span>:</span>
                                        <span className="font-medium">{selectedCandidate.cell}</span>
                                    </div>

                                    <div className="grid grid-cols-[150px_15px_1fr]">
                                        <span className="text-sm text-slate-600">Proposed Salary</span>
                                        <span>:</span>
                                        <span className="font-medium">
                                            BDT {selectedCandidate.salary?.toLocaleString()}
                                        </span>
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* ====================================== */}
                        {/* Capture Section */}
                        {/* ====================================== */}

                        <div className="mt-8 grid grid-cols-2 gap-6">

                            {/* Photo */}
                            <div className="h-80 rounded-lg overflow-hidden border">

                                {photo ? (
                                    <img
                                        src={photo}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        className="h-full w-full object-cover"
                                    />
                                )}

                                <canvas
                                    ref={canvasRef}
                                    style={{ display: "none" }}
                                />

                            </div>

                            <div className="mt-4 flex gap-3">

                                <button
                                    onClick={startCamera}
                                >
                                    Start Camera
                                </button>

                                <button
                                    onClick={capturePhoto}
                                >
                                    Capture
                                </button>

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
                                        ৳ {selectedCandidate.salary?.toLocaleString()}
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
                                onClick={biometricSubmitted}
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
                                        {selectedCandidate.employeeName}
                                    </h4>

                                </div>

                                <div>

                                    <p className="text-sm text-slate-500">
                                        Temporary ID
                                    </p>

                                    <h4 className="mt-1 font-semibold text-slate-800">
                                        {selectedCandidate.enrollmentId}
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
