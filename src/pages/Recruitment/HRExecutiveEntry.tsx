import {
    useMemo,
    useState,
    useEffect,
} from "react";

import { useNavigate } from "react-router-dom";

import {
    ArrowRight,
    ClipboardCheck,
    CircleCheck,
    CircleX,
    Clock3,
    Search,
    ChevronDown,
} from "lucide-react";
import { API_ROUTES } from "../../api/routes";
import { useGet } from "../../hooks/useGet";

interface HRCandidate {
    employeeId: number;
    enrollmentId: string;
    employeeName: string;
    age: number;
    medicalResult: string;
    examinationDate: string;
}

const PAGE_SIZE = 5;

const HRExecutiveEntry = () => {
    const { data: candidates } = useGet<HRCandidate[]>({
        key: ["candidates"],
        url: `${API_ROUTES.EMPLOYEES_BY_STATUS}?status=Medical`,
    });

    const [searchText, setSearchText] =
        useState("");

    const navigate = useNavigate();

    const [currentPage, setCurrentPage] =
        useState(1);

    const filteredData = useMemo(() => {
        const data = candidates ?? [];

        if (!searchText) return data;

        return data.filter(
            (candidate) =>
                candidate.enrollmentId
                    ?.toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                candidate.employeeName
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

    const statCards = [
        {
            title: "RECEIVED FROM MEDICAL",
            value: 25,
            icon: ClipboardCheck,
            color:
                "text-blue-600 bg-blue-50 border-blue-100",
            iconBg: "bg-blue-100",
        },
        {
            title: "ENTERED",
            value: 0,
            icon: CircleCheck,
            color:
                "text-green-600 bg-green-50 border-green-100",
            iconBg: "bg-green-100",
        },
        {
            title: "REJECTED BY MEDICAL",
            value: 25,
            icon: CircleX,
            color:
                "text-red-600 bg-red-50 border-red-100",
            iconBg: "bg-red-100",
        },
        {
            title: "PENDING ENTRY",
            value: 25,
            icon: Clock3,
            color:
                "text-orange-600 bg-orange-50 border-orange-100",
            iconBg: "bg-orange-100",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-[1600px] mx-auto"></div>
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
                >
                    ← Back to Main Menu
                </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
                {statCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.title}
                            className={`
                  rounded-xl
                  border
                  p-5
                  ${card.color}
                `}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`
                      h-16
                      w-16
                      rounded-full
                      flex
                      items-center
                      justify-center
                      ${card.iconBg}
                    `}
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

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                <div className="flex items-center justify-between p-4 border-b border-slate-100">

                    <div className="flex items-center gap-3">
                        <h2 className="font-bold text-[#1f2c73] text-sm">
                            CANDIDATES AWAITING HR EXECUTIVE ENTRY
                        </h2>

                        <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            25
                        </span>
                    </div>

                    <div className="relative w-[320px]">
                        <Search
                            size={18}
                            className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
                        />

                        <input
                            type="text"
                            placeholder="Search by Candidate ID or Name..."
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="
                  w-full
                  border
                  border-slate-200
                  rounded-lg
                  px-4
                  py-2
                  pr-10
                  text-sm
                  outline-none
                "
                        />
                    </div>

                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">

                                <th className="p-4 text-left text-xs font-semibold">
                                    Sr. #
                                </th>

                                <th className="p-4 text-left text-xs font-semibold">
                                    Candidate ID
                                </th>

                                <th className="p-4 text-left text-xs font-semibold">
                                    Candidate Name
                                </th>

                                <th className="p-4 text-center text-xs font-semibold">
                                    Age (Years)
                                </th>

                                <th className="p-4 text-center text-xs font-semibold">
                                    Medical Result
                                </th>

                                <th className="p-4 text-center text-xs font-semibold">
                                    Received Date
                                </th>

                                <th className="p-4 text-center text-xs font-semibold">
                                    Action
                                </th>

                            </tr>
                        </thead>

                        <tbody>
                            {paginatedData.map(
                                (candidate, index) => (
                                    <tr
                                        key={candidate.employeeId}
                                        className="
                        border-b
                        border-slate-100
                        hover:bg-slate-50
                      "
                                    >
                                        <td className="p-4 text-sm">
                                            {(currentPage - 1) *
                                                PAGE_SIZE +
                                                index +
                                                1}
                                        </td>

                                        <td className="p-4 text-sm">
                                            {candidate.enrollmentId}
                                        </td>

                                        <td className="p-4 text-sm">
                                            {candidate.employeeName}
                                        </td>

                                        <td className="p-4 text-sm text-center">
                                            {candidate.age}
                                        </td>

                                        <td className="p-4 text-center">
                                            <span
                                                className="
                            px-3
                            py-1
                            rounded-md
                            bg-green-50
                            text-green-600
                            text-xs
                            font-medium
                          "
                                            >
                                                {candidate.medicalResult}
                                            </span>
                                        </td>

                                        <td className="p-4 text-center text-sm">
                                            {new Date(candidate.examinationDate).toLocaleDateString(
                                                "en-US",
                                                {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                }
                                            )}
                                        </td>

                                        <td className="p-4 text-center">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/recruitment/hr-executive-entry/${candidate.employeeId}/${candidate.enrollmentId}`
                                                    )
                                                }
                                                className="
                                                            h-8
                                                            px-3
                                                            border
                                                            border-blue-300
                                                            rounded-md
                                                            text-blue-600
                                                            text-xs
                                                            font-medium
                                                            inline-flex
                                                            items-center
                                                            gap-2
                                                        "
                                            >
                                                Enter Details
                                                <ChevronDown size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">

                    <p className="text-sm text-slate-600">
                        Showing{" "}
                        {(currentPage - 1) *
                            PAGE_SIZE +
                            1}
                        {" "}to{" "}
                        {Math.min(
                            currentPage * PAGE_SIZE,
                            filteredData.length
                        )}
                        {" "}of{" "}
                        {filteredData.length}
                        {" "}candidates
                    </p>

                    <div className="flex gap-2">

                        <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() =>
                                setCurrentPage(
                                    currentPage - 1
                                )
                            }
                            className="
                  h-9
                  w-9
                  border
                  border-slate-200
                  rounded-md
                "
                        >
                            {"<"}
                        </button>

                        {Array.from({
                            length: totalPages,
                        }).map((_, index) => {
                            const page = index + 1;

                            return (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage(page)
                                    }
                                    className={`
                      h-9
                      w-9
                      rounded-md
                      text-sm
                      border
                      ${currentPage === page
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "border-slate-200"
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
                                currentPage === totalPages
                            }
                            onClick={() =>
                                setCurrentPage(
                                    currentPage + 1
                                )
                            }
                            className="
                  h-9
                  w-9
                  border
                  border-slate-200
                  rounded-md
                "
                        >
                            {">"}
                        </button>

                    </div>
                </div>
            </div>

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
            gap-3
          "
            >
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
              text-sm
              font-bold
            "
                >
                    i
                </div>

                <p className="text-sm text-blue-700">
                    You have 25 candidate(s)
                    from Medical Officer.
                    Please enter HR details
                    for all Fit candidates and
                    send them to IT for
                    Biometric & Picture Capture.
                </p>
            </div>

            <div className="flex justify-end mt-6">
                <button
                    type="button"
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
            "
                >
                    <ArrowRight size={18} />

                    Send All Entered Candidates
                    to IT

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
                        0
                    </span>
                </button>
            </div>

        </div>
    );
};

export default HRExecutiveEntry;