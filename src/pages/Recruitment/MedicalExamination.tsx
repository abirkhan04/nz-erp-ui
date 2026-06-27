import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { useGet } from "../../hooks/useGet";

import {
    ClipboardCheck,
    CircleCheck,
    CircleX,
    Clock3,
    Search,
    ArrowRight,
} from "lucide-react";

import {
    useFieldArray,
    useForm,
} from "react-hook-form";
import { API_ROUTES } from "../../api/routes";

interface Candidate {
    id: number;
    enrollmentId: string;
    employeeName: string;
    age: number;
    identificationSign: string;
    medicalResult: string;
}

interface MedicalExaminationForm {
    candidates: Candidate[];
}

const PAGE_SIZE = 5;

const MedicalExamination = () => {

    const { data: candidates } = useGet<Candidate[]>({
        key: ["candidates"],
        url: `${API_ROUTES.EMPLOYEES_BY_STATUS}?status=CandidateEntry`,
    });
    const [searchText, setSearchText] =
        useState("");

    const [currentPage, setCurrentPage] =
        useState(1);

    const filteredData = useMemo(() => {
        const data = candidates ?? [];

        if (!searchText) return data;

        return data.filter(
            (candidate) =>
                candidate.candidateId
                    ?.toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                candidate.candidateName
                    ?.toLowerCase()
                    .includes(searchText.toLowerCase())
        );
    }, [candidates, searchText]);

    useEffect(() => {
        setCurrentPage(1);
    }, [candidates]);

    const totalPages = Math.ceil(
        filteredData.length / PAGE_SIZE
    );

    const paginatedData = useMemo(() => {
        const start =
            (currentPage - 1) * PAGE_SIZE;

        return filteredData.slice(
            start,
            start + PAGE_SIZE
        );
    }, [filteredData, currentPage]);

    const {
        control,
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<MedicalExaminationForm>({
        defaultValues: {
            candidates: paginatedData,
        },
    });

    const { fields } = useFieldArray({
        control,
        name: "candidates",
    });

    useEffect(() => {
        reset({
            candidates: paginatedData,
        });
    }, [paginatedData, reset]);

    const onSubmit = (
        data: MedicalExaminationForm
    ) => {
        console.log(
            "Medical Examination Result",
            data
        );
    };

    const statCards = [
        {
            title: "RECEIVED FROM GATE",
            value: 50,
            icon: ClipboardCheck,
            color:
                "text-blue-600 border-blue-100 bg-blue-50",
            iconBg: "bg-blue-100",
        },
        {
            title: "FIT",
            value: 0,
            icon: CircleCheck,
            color:
                "text-green-600 border-green-100 bg-green-50",
            iconBg: "bg-green-100",
        },
        {
            title: "UNFIT",
            value: 0,
            icon: CircleX,
            color:
                "text-red-600 border-red-100 bg-red-50",
            iconBg: "bg-red-100",
        },
        {
            title: "PENDING EXAMINATION",
            value: 50,
            icon: Clock3,
            color:
                "text-orange-600 border-orange-100 bg-orange-50",
            iconBg: "bg-orange-100",
        },
    ];

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="min-h-screen bg-slate-50 p-6"
        >
            <div className="max-w-[1600px] mx-auto">

                {/* Header */}

                <div className="flex justify-end mb-6">
                    <button
                        type="button"
                        className="flex items-center gap-2 border border-blue-300 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50"
                    >
                        Back to Main Menu
                    </button>
                </div>

                {/* Stat Cards */}

                <div className="grid grid-cols-4 gap-4 mb-6">
                    {statCards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.title}
                                className={`rounded-xl border p-5 ${card.color}`}
                            >
                                <div className="flex items-center gap-4">

                                    <div
                                        className={`h-16 w-16 rounded-full flex items-center justify-center ${card.iconBg}`}
                                    >
                                        <Icon className="h-8 w-8" />
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-sm">
                                            {card.title}
                                        </h4>

                                        <h2 className="text-4xl font-bold">
                                            {card.value}
                                        </h2>

                                        <p className="text-sm">
                                            Candidates
                                        </p>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Candidate Medical Examination */}

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                    {/* Header */}

                    <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center gap-3">
                            <h2 className="font-bold text-[#1f2c73] text-sm">
                                CANDIDATES AWAITING MEDICAL EXAMINATION
                            </h2>

                            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                {filteredData.length}
                            </span>
                        </div>

                        <div className="relative w-[300px]">
                            <Search
                                size={18}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                placeholder="Search by Candidate ID or Name..."
                                value={searchText}
                                onChange={(e) => {
                                    setSearchText(
                                        e.target.value
                                    );

                                    setCurrentPage(1);
                                }}
                                className="
                                        w-full
                                        border
                                        rounded-lg
                                        px-4
                                        py-2
                                        pr-10
                                        text-sm
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-blue-500
                                        "
                            />
                        </div>

                    </div>

                    {/* Table */}

                    <div className="overflow-x-auto">

                        <table className="w-full border-collapse">

                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">

                                    <th className="text-left p-4 text-sm font-semibold text-slate-600">
                                        Sr. #
                                    </th>

                                    <th className="text-left p-4 text-sm font-semibold text-slate-600">
                                        Candidate ID
                                    </th>

                                    <th className="text-left p-4 text-sm font-semibold text-slate-600">
                                        Candidate Name
                                    </th>

                                    <th className="text-center p-4 text-sm font-semibold text-slate-600">
                                        Age (Years)
                                    </th>

                                    <th className="text-center p-4 text-sm font-semibold text-slate-600">
                                        Identification Sign
                                    </th>

                                    <th className="text-center p-4 text-sm font-semibold text-slate-600">
                                        Medical Result
                                    </th>

                                    <th className="text-center p-4 text-sm font-semibold text-slate-600">
                                        Action
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {fields.map(
                                    (
                                        field,
                                        index
                                    ) => (
                                        <tr
                                            key={field.id}
                                            className="border-b
                                            border-slate-100
                                            hover:bg-slate-50/50
                                            transition-colors"
                                        >
                                            <td className="p-4 text-sm text-slate-700">
                                                {(currentPage - 1) *
                                                    PAGE_SIZE +
                                                    index +
                                                    1}
                                            </td>

                                            <td className="p-4 text-sm text-slate-700">
                                                {
                                                    field.enrollmentId
                                                }
                                            </td>

                                            <td className="p-4 text-sm text-slate-700">
                                                {
                                                    field.employeeName
                                                }
                                            </td>

                                            <td className="p-4 text-sm text-slate-700 text-center">
                                                {field.age}
                                            </td>

                                            {/* Identification Sign */}

                                            <td className="p-2">

                                                <input
                                                    {...register(
                                                        `candidates.${index}.identificationSign`,
                                                        {
                                                            required:
                                                                "Required",
                                                        }
                                                    )}
                                                    placeholder="Enter Sign"
                                                    className={`
                            w-full
                            border
                            rounded-md
                            px-3
                            py-2
                            text-sm
                            ${errors
                                                            ?.candidates?.[
                                                            index
                                                        ]
                                                            ?.identificationSign
                                                            ? "border-red-500"
                                                            : ""
                                                        }
                          `}
                                                />

                                                {errors
                                                    ?.candidates?.[
                                                    index
                                                ]
                                                    ?.identificationSign && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            Required
                                                        </p>
                                                    )}

                                            </td>

                                            {/* Medical Result */}

                                            <td className="p-2">

                                                <select
                                                    {...register(
                                                        `candidates.${index}.medicalResult`,
                                                        {
                                                            required:
                                                                "Required",
                                                        }
                                                    )}
                                                    className={`
                            w-full
                            border
                            rounded-md
                            px-3
                            py-2
                            text-sm
                            ${errors
                                                            ?.candidates?.[
                                                            index
                                                        ]
                                                            ?.medicalResult
                                                            ? "border-red-500"
                                                            : ""
                                                        }
                          `}
                                                >
                                                    <option value="">
                                                        Select Result
                                                    </option>

                                                    <option value="FIT">
                                                        FIT
                                                    </option>

                                                    <option value="UNFIT">
                                                        UNFIT
                                                    </option>

                                                    <option value="PENDING">
                                                        PENDING
                                                    </option>
                                                </select>

                                                {errors
                                                    ?.candidates?.[
                                                    index
                                                ]
                                                    ?.medicalResult && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            Required
                                                        </p>
                                                    )}

                                            </td>

                                            {/* Action */}

                                            <td className="p-4 text-center">

                                                <button
                                                    type="button"
                                                    className="
                            text-blue-600
                            hover:text-blue-800
                            font-medium
                          "
                                                >
                                                    View
                                                </button>

                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* Footer Info */}

                    <div className="px-4 py-3 border-t flex items-center justify-between">

                        <p className="text-sm text-gray-600">
                            Showing{" "}
                            {(currentPage - 1) *
                                PAGE_SIZE +
                                1}
                            {" "}
                            to{" "}
                            {Math.min(
                                currentPage *
                                PAGE_SIZE,
                                filteredData.length
                            )}
                            {" "}
                            of{" "}
                            {filteredData.length}
                            {" "}
                            candidates
                        </p>

                        {/* Pagination */}

                        <div className="flex items-center gap-2">

                            <button
                                type="button"
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage(
                                        (prev) =>
                                            prev - 1
                                    )
                                }
                                className="
                  h-9
                  w-9
                  border
                  rounded-md
                  flex
                  items-center
                  justify-center
                  disabled:opacity-50
                "
                            >
                                {"<"}
                            </button>

                            {Array.from({
                                length: totalPages,
                            }).map((_, index) => {
                                const page =
                                    index + 1;

                                return (
                                    <button
                                        key={page}
                                        type="button"
                                        onClick={() =>
                                            setCurrentPage(
                                                page
                                            )
                                        }
                                        className={`
                      h-9
                      w-9
                      rounded-md
                      border
                      text-sm
                      font-medium
                      ${currentPage ===
                                                page
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white"
                                            }
                    `}
                                    >
                                        {page}
                                    </button>
                                );
                            })}

                            <button
                                type="button"
                                disabled={
                                    currentPage ===
                                    totalPages
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        (prev) =>
                                            prev + 1
                                    )
                                }
                                className="
                  h-9
                  w-9
                  border
                  rounded-md
                  flex
                  items-center
                  justify-center
                  disabled:opacity-50
                "
                            >
                                {">"}
                            </button>

                        </div>

                    </div>

                </div>

                {/* Information Banner */}

                <div
                    className="
            mt-4
            bg-blue-50
            border
            border-blue-100
            rounded-xl
            p-4
            flex
            items-center
            justify-between
          "
                >
                    <div className="flex items-center gap-3">

                        <div
                            className="
                h-8
                w-8
                rounded-full
                bg-blue-600
                text-white
                flex
                items-center
                justify-center
                font-bold
              "
                        >
                            i
                        </div>

                        <p className="text-sm text-blue-700">
                            Please examine all
                            candidates and mark
                            them as Fit or Unfit.
                            Only Fit candidates
                            will be sent to next
                            level.
                        </p>

                    </div>
                </div>

                {/* Submit Button */}

                <div className="flex justify-end mt-6">

                    <button
                        type="submit"
                        className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-8
              py-3
              rounded-lg
              flex
              items-center
              gap-3
              font-medium
              shadow-sm
            "
                    >
                        <ArrowRight
                            size={18}
                        />

                        Send Fit Candidates
                        to HR Executive Entry

                        <span
                            className="
                h-6
                min-w-[24px]
                px-2
                rounded-full
                bg-white/20
                text-xs
                flex
                items-center
                justify-center
              "
                        >
                            {
                                filteredData.length
                            }
                        </span>

                    </button>

                </div>

            </div>
        </form>
    );
};

export default MedicalExamination;
