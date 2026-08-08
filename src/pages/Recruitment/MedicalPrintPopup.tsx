import { Printer, X } from "lucide-react";
import { useEffect, useState } from "react";
import { API_ROUTES } from "../../api/routes";
import { useGet } from "../../hooks/useGet";

interface MedicalPrintPopupProps {
    onClose: () => void;
}

interface Candidate {
    employeeId: string;
    enrollmentId: string;
    employeeName: string;
    age: number;
    examinationDate: string;
    medicalResult: number;
}

const MedicalPrintPopup = ({ onClose }: MedicalPrintPopupProps) => {
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [search, setSearch] = useState("");

    const { data: candidates, isLoading } = useGet<Candidate[]>({
        key: ["candidates"],
        url: `${API_ROUTES.EMPLOYEES_BY_STATUS}?status=Medical`,
    });

    const candidateList = (candidates ?? []).filter((candidate) => {
        const searchText = search.trim().toLowerCase();

        if (!searchText) return true;

        return (
            candidate.employeeName.toLowerCase().includes(searchText) ||
            candidate.enrollmentId.toLowerCase().includes(searchText)
        );
    });

    // ============================================
    // PAGINATION
    // ============================================

    const totalPages = Math.ceil(candidateList.length / pageSize);

    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedCandidates = candidateList.slice(
        startIndex,
        endIndex
    );

    // Make sure current page remains valid
    // when data/page size changes.
    useEffect(() => {
        if (totalPages > 0 && pageNumber > totalPages) {
            setPageNumber(totalPages);
        }

        if (totalPages === 0 && pageNumber !== 1) {
            setPageNumber(1);
        }
    }, [totalPages, pageNumber]);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) {
            return;
        }

        setPageNumber(page);
    };

    const handlePageSizeChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newPageSize = Number(event.target.value);

        setPageSize(newPageSize);
        setPageNumber(1);
    };

    // ============================================
    // MEDICAL RESULT
    // ============================================

    const getMedicalResult = (value: number) => {
        switch (value) {
            case 1:
                return {
                    text: "Unfit",
                    className: "bg-yellow-100 text-yellow-700",
                };

            case 0:
                return {
                    text: "Fit",
                    className: "bg-green-100 text-green-700",
                };

            default:
                return {
                    text: "Unfit",
                    className: "bg-red-100 text-red-700",
                };
        }
    };

    const getMedicalResultText = (value: number) => {
        switch (value) {
            case 0:
                return "Fit";

            case 1:
                return "Unfit";

            default:
                return "Unfit";
        }
    };

    // ============================================
    // PRINT MEDICAL SLIP
    // ============================================

    const handlePrint = (candidate: Candidate) => {
        const medicalResult = getMedicalResultText(
            candidate.medicalResult
        );

        const printWindow = window.open(
            "",
            "_blank",
            "width=800,height=600"
        );

        if (!printWindow) {
            alert(
                "Unable to open print window. Please allow pop-ups for this site."
            );

            return;
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8" />
                    <title>Medical Slip - ${candidate.enrollmentId}</title>

                    <style>
                        * {
                            box-sizing: border-box;
                        }

                        html,
                        body {
                            margin: 0;
                            padding: 0;
                            background: white;
                            font-family: Arial, sans-serif;
                        }

                        body {
                            padding: 30px;
                        }

                        .slip {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            border: 1px solid #333;
                            padding: 30px;
                        }

                        .title {
                            text-align: center;
                            font-size: 24px;
                            font-weight: bold;
                            margin-bottom: 30px;
                        }

                        .row {
                            display: flex;
                            padding: 12px 0;
                            border-bottom: 1px solid #ddd;
                        }

                        .row:last-child {
                            border-bottom: none;
                        }

                        .label {
                            width: 180px;
                            font-weight: bold;
                        }

                        .value {
                            flex: 1;
                        }

                        .result {
                            font-weight: bold;
                        }

                        @media print {
                            body {
                                padding: 0;
                            }

                            .slip {
                                max-width: none;
                                border: 1px solid #333;
                            }
                        }
                    </style>
                </head>

                <body>
                    <div class="slip">

                        <div class="title">
                            Medical Slip
                        </div>

                        <div class="row">
                            <div class="label">
                                Employee Name
                            </div>

                            <div class="value">
                                ${candidate.employeeName}
                            </div>
                        </div>

                        <div class="row">
                            <div class="label">
                                Enrollment ID
                            </div>

                            <div class="value">
                                ${candidate.enrollmentId}
                            </div>
                        </div>

                        <div class="row">
                            <div class="label">
                                Medical Result
                            </div>

                            <div class="value result">
                                ${medicalResult}
                            </div>
                        </div>

                    </div>
                </body>
            </html>
        `);

        printWindow.document.close();

        // Wait until the document has loaded before printing.
        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
        };

        // Close the window after printing is finished.
        printWindow.onafterprint = () => {
            printWindow.close();
        };
    };

    // ============================================
    // RENDER
    // ============================================

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/50
                p-4
            "
            onClick={onClose}
        >
            <div
                className="
                    relative
                    w-full
                    max-w-5xl
                    max-h-[90vh]
                    overflow-y-auto
                    rounded-xl
                    bg-white
                    shadow-2xl
                "
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        px-6
                        py-4
                    "
                >
                    <h2 className="text-xl font-semibold text-gray-800">
                        Doctor's Slip
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-full
                            p-2
                            text-gray-500
                            hover:bg-gray-100
                            hover:text-gray-700
                        "
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-4">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPageNumber(1);
                            }}
                            placeholder="Search by employee name or enrollment ID..."
                            className="
            w-full
            rounded-md
            border
            border-gray-300
            px-4
            py-2
            text-sm
            outline-none
            focus:border-blue-500
            focus:ring-1
            focus:ring-blue-500
        "
                        />
                    </div>
                    <div className="rounded-lg border bg-white">

                        {/* Table Header */}
                        <div className="border-b px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Medical Candidates
                            </h3>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">

                                <thead className="bg-gray-50 text-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">
                                            SL
                                        </th>

                                        <th className="px-6 py-3 font-semibold">
                                            Enrollment ID
                                        </th>

                                        <th className="px-6 py-3 font-semibold">
                                            Employee Name
                                        </th>

                                        <th className="px-6 py-3 font-semibold">
                                            Medical Result
                                        </th>

                                        <th className="px-6 py-3 text-center font-semibold">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">

                                    {isLoading ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="
                                                    px-6
                                                    py-8
                                                    text-center
                                                    text-gray-500
                                                "
                                            >
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : paginatedCandidates.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="
                                                    px-6
                                                    py-8
                                                    text-center
                                                    text-gray-500
                                                "
                                            >
                                                No medical candidates found.
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedCandidates.map(
                                            (candidate, index) => {
                                                const result =
                                                    getMedicalResult(
                                                        candidate.medicalResult
                                                    );

                                                return (
                                                    <tr
                                                        key={
                                                            candidate.employeeId
                                                        }
                                                        className="hover:bg-gray-50"
                                                    >
                                                        {/* SL */}
                                                        <td className="px-6 py-4">
                                                            {(pageNumber - 1) *
                                                                pageSize +
                                                                index +
                                                                1}
                                                        </td>

                                                        {/* Enrollment ID */}
                                                        <td
                                                            className="
                                                                px-6
                                                                py-4
                                                                font-medium
                                                                text-gray-800
                                                            "
                                                        >
                                                            {
                                                                candidate.enrollmentId
                                                            }
                                                        </td>

                                                        {/* Employee Name */}
                                                        <td className="px-6 py-4">
                                                            {
                                                                candidate.employeeName
                                                            }
                                                        </td>

                                                        {/* Medical Result */}
                                                        <td className="px-6 py-4">
                                                            <span
                                                                className={`
                                                                    inline-flex
                                                                    rounded-full
                                                                    px-3
                                                                    py-1
                                                                    text-xs
                                                                    font-medium
                                                                    ${result.className}
                                                                `}
                                                            >
                                                                {result.text}
                                                            </span>
                                                        </td>

                                                        {/* Print */}
                                                        <td className="px-6 py-4 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handlePrint(
                                                                        candidate
                                                                    )
                                                                }
                                                                className="
                                                                    inline-flex
                                                                    items-center
                                                                    gap-2
                                                                    rounded-md
                                                                    bg-blue-600
                                                                    px-4
                                                                    py-2
                                                                    text-sm
                                                                    font-medium
                                                                    text-white
                                                                    shadow-sm
                                                                    hover:bg-blue-700
                                                                "
                                                            >
                                                                <Printer
                                                                    size={16}
                                                                />

                                                                Print
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

                        {/* Pagination */}
                        <div
                            className="
                                flex
                                flex-col
                                gap-4
                                border-t
                                px-6
                                py-4
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >
                            {/* Page Size */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                    Rows per page:
                                </span>

                                <select
                                    value={pageSize}
                                    onChange={handlePageSizeChange}
                                    className="
                                        rounded-md
                                        border
                                        border-gray-300
                                        px-3
                                        py-2
                                        text-sm
                                        outline-none
                                        focus:border-blue-500
                                        focus:ring-1
                                        focus:ring-blue-500
                                    "
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>

                            {/* Page Information */}
                            <div className="text-sm text-gray-600">
                                {candidateList.length === 0
                                    ? "0"
                                    : `${startIndex + 1}-${Math.min(
                                        endIndex,
                                        candidateList.length
                                    )}`}{" "}
                                of {candidateList.length}
                            </div>

                            {/* Pagination Buttons */}
                            <div className="flex items-center gap-1">

                                {/* Previous */}
                                <button
                                    type="button"
                                    disabled={pageNumber === 1}
                                    onClick={() =>
                                        handlePageChange(
                                            pageNumber - 1
                                        )
                                    }
                                    className="
                                        rounded-md
                                        border
                                        px-3
                                        py-2
                                        text-sm
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                        hover:bg-gray-50
                                    "
                                >
                                    Previous
                                </button>

                                {/* Page Numbers */}
                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => index + 1
                                ).map((page) => (
                                    <button
                                        key={page}
                                        type="button"
                                        onClick={() =>
                                            handlePageChange(page)
                                        }
                                        className={`
                                            min-w-[38px]
                                            rounded-md
                                            border
                                            px-3
                                            py-2
                                            text-sm
                                            font-medium
                                            ${pageNumber === page
                                                ? "border-blue-600 bg-blue-600 text-white"
                                                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                            }
                                        `}
                                    >
                                        {page}
                                    </button>
                                ))}

                                {/* Next */}
                                <button
                                    type="button"
                                    disabled={
                                        pageNumber === totalPages ||
                                        totalPages === 0
                                    }
                                    onClick={() =>
                                        handlePageChange(
                                            pageNumber + 1
                                        )
                                    }
                                    className="
                                        rounded-md
                                        border
                                        px-3
                                        py-2
                                        text-sm
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                        hover:bg-gray-50
                                    "
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalPrintPopup;
