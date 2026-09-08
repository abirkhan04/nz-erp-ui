import React, { useMemo, useState } from "react";
import {
    Calendar,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    FileSpreadsheet,
    Filter,
    Search,
    Send,
    Users,
    X,
} from "lucide-react";
import { useForm } from "react-hook-form";

// You will provide this import later.
import RequestForwardingFlow from "./shared/RequestForwardingFlow";
import { api } from "../../api/client";
import { API_ROUTES } from "../../api/routes";
import CommonInputField from "../../components/CommonInputFields"

interface Learner {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    currentDesignation: string;
    previousDesignation: string;
    dateOfJoining: string;
    probationCompletedDate: string;
    probationPeriodMonths: number;
    currentGrossSalary: number;
    standardGrossSalary: number;
    adjustmentAmount: number;
}


interface AdjustmentIncrementForm {
    joiningDateFrom: string;
    joiningDateTo: string;
    probationPeriodMonths: number;
}

const AdjustmentIncrementRequest: React.FC = () => {
    // =========================================================
    // FILTER STATE
    // =========================================================

    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<AdjustmentIncrementForm>({
        defaultValues: {
            joiningDateFrom: "",
            joiningDateTo: "",
            probationPeriodMonths: 3,
        },
    });

    const [probationPeriod, setProbationPeriod] =
        useState<number>(3);

    // =========================================================
    // API DATA
    // =========================================================

    const [learners, setLearners] = useState<Learner[]>(
        [],
    );

    const [loading, setLoading] = useState(false);

    const [forwarding, setForwarding] =
        useState(false);

    // =========================================================
    // PAGINATION
    //
    // This is intentionally UI-side pagination.
    // The API returns the complete filtered result.
    // =========================================================

    const [pageNumber, setPageNumber] = useState(1);

    const [pageSize, setPageSize] = useState(10);

    // =========================================================
    // SELECTED ROW IDS
    //
    // Selection persists across UI pages.
    // =========================================================

    const [selectedIds, setSelectedIds] =
        useState<Set<string>>(new Set());

    // =========================================================
    // GET ELIGIBLE LEARNERS
    // =========================================================

    const getEligibleLearners = async (
        data: AdjustmentIncrementForm,
    ) => {
        try {
            setLoading(true);

            const response = await api.post(
                `${API_ROUTES.LEARNERS}/eligible-adjustments/search`,
                {
                    joiningDateFrom: data.joiningDateFrom,
                    joiningDateTo: data.joiningDateTo,
                    probationPeriodMonths:
                        Number(data.probationPeriodMonths),

                    // Server returns all filtered records.
                    // Pagination is handled on the UI.
                    pageNumber: 0,
                    pageSize: 100000,
                },
                {
                    headers: {
                        accept: "text/plain",
                        "Content-Type": "application/json",
                    },
                },
            );

            setLearners(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.data ?? [],
            );

            // Reset selection for a new search
            setSelectedIds(new Set());

            // Reset UI pagination
            setPageNumber(1);
        } catch (error) {
            console.error(
                "Failed to retrieve eligible learners:",
                error,
            );

            setLearners([]);
            setSelectedIds(new Set());
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // APPLY FILTER
    // =========================================================

    const handleApplyFilter = (data: AdjustmentIncrementForm) => {
        getEligibleLearners({
            joiningDateFrom: data.joiningDateFrom,
            joiningDateTo: data.joiningDateTo,
            probationPeriodMonths: data.probationPeriodMonths,
        });
    };

    // =========================================================
    // UI PAGINATION
    // =========================================================

    const totalCount = learners.length;

    const totalPages = Math.max(
        1,
        Math.ceil(totalCount / pageSize),
    );

    const paginatedLearners = useMemo(() => {
        const startIndex =
            (pageNumber - 1) * pageSize;

        return learners.slice(
            startIndex,
            startIndex + pageSize,
        );
    }, [learners, pageNumber, pageSize]);

    const pageStart =
        totalCount === 0
            ? 0
            : (pageNumber - 1) * pageSize + 1;

    const pageEnd = Math.min(
        pageNumber * pageSize,
        totalCount,
    );

    // =========================================================
    // SELECTED LEARNERS
    // =========================================================

    const selectedLearners = useMemo(() => {
        return learners.filter((learner) =>
            selectedIds.has(learner.id),
        );
    }, [learners, selectedIds]);

    // =========================================================
    // CURRENT PAGE SELECTION
    // =========================================================

    const currentPageSelectedCount =
        paginatedLearners.filter((learner) =>
            selectedIds.has(learner.id),
        ).length;

    const isCurrentPageFullySelected =
        paginatedLearners.length > 0 &&
        currentPageSelectedCount ===
        paginatedLearners.length;

    // =========================================================
    // TOGGLE SINGLE ROW
    // =========================================================

    const handleToggleRow = (id: string) => {
        setSelectedIds((previous) => {
            const next = new Set(previous);

            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }

            return next;
        });
    };

    // =========================================================
    // SELECT / DESELECT CURRENT PAGE
    // =========================================================

    const handleToggleCurrentPage = () => {
        setSelectedIds((previous) => {
            const next = new Set(previous);

            if (isCurrentPageFullySelected) {
                paginatedLearners.forEach(
                    (learner) => {
                        next.delete(learner.id);
                    },
                );
            } else {
                paginatedLearners.forEach(
                    (learner) => {
                        next.add(learner.id);
                    },
                );
            }

            return next;
        });
    };

    // =========================================================
    // CLEAR SELECTION
    // =========================================================

    const handleClearSelection = () => {
        setSelectedIds(new Set());
    };

    // =========================================================
    // FORWARD SELECTED ROWS
    // =========================================================

    const handleForwardToDirector = async () => {
        if (selectedLearners.length === 0) {
            return;
        }

        try {
            setForwarding(true);

            /*
             * IMPORTANT:
             *
             * Only selectedLearners are sent.
             *
             * learners is NOT sent.
             */

            const payload = {
                requests: selectedLearners,
            };

            const response = await fetch(
                "/api/adjustment-increment/forward-to-director",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(payload),
                },
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to forward adjustment request.",
                );
            }

            const result = await response.json();

            console.log(
                "Forwarded successfully:",
                result,
            );

            // Clear selection after successful forwarding.
            setSelectedIds(new Set());

            /*
             * Depending on your business logic, we can either:
             *
             * 1. Remove forwarded employees from learners
             * 2. Re-fetch the filtered list
             * 3. Keep them but mark them as forwarded
             *
             * I recommend re-fetching once we know your API.
             */

            await getEligibleLearners({
                joiningDateFrom,
                joiningDateTo,
                probationPeriod,
            });
        } catch (error) {
            console.error(
                "Forwarding failed:",
                error,
            );
        } finally {
            setForwarding(false);
        }
    };

    // =========================================================
    // PAGINATION HANDLERS
    // =========================================================

    const handlePageChange = (page: number) => {
        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }

        setPageNumber(page);
    };

    const handlePageSizeChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setPageSize(
            Number(event.target.value),
        );

        setPageNumber(1);
    };

    // =========================================================
    // SUMMARY
    //
    // These are calculated from the API result, NOT the
    // current UI page.
    // =========================================================

    const totalCurrentGrossSalary =
        learners.reduce(
            (sum, learner) =>
                sum +
                learner.currentGrossSalary,
            0,
        );

    const totalStandardGrossSalary =
        learners.reduce(
            (sum, learner) =>
                sum +
                learner.standardGrossSalary,
            0,
        );

    const totalAdjustmentAmount =
        learners.reduce(
            (sum, learner) =>
                sum +
                learner.adjustmentAmount,
            0,
        );

    const averageAdjustment =
        totalCount > 0
            ? totalAdjustmentAmount /
            totalCount
            : 0;

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="min-h-screen bg-slate-50 p-5">
            {/* =========================================================
    PAGE HEADER
========================================================= */}

            <div className="mb-5 flex items-center justify-between rounded-xl bg-[#102878] px-5 py-3 text-white shadow-sm">
                <div>
                    <h1 className="text-base font-bold tracking-wide">
                        ADJUSTMENT INCREMENT REQUEST
                    </h1>

                    <div className="mt-1 flex items-center gap-2 text-[11px] text-blue-100">
                        <span>Dashboard</span>
                        <span>›</span>
                        <span>Production Floor</span>
                        <span>›</span>
                        <span>Employee Increment / Promotion Request</span>
                        <span>›</span>
                        <span className="font-semibold text-white">
                            Adjustment Increment
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-2 rounded-md bg-white px-3 py-2 text-xs font-semibold text-slate-700 sm:flex">
                        <Calendar
                            size={15}
                            className="text-[#102878]"
                        />

                        {new Date().toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#102878]">
                        <Users size={17} />
                    </div>

                    <div className="hidden text-right md:block">
                        <p className="text-xs font-semibold">
                            Production Incharge
                        </p>

                        <p className="text-[10px] text-blue-100">
                            Spinning Department
                        </p>
                    </div>
                </div>
            </div>
            {/* =================================================
                1. FILTER
            ================================================== */}

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#102878] text-xs font-bold text-white">
                        1
                    </div>

                    <h2 className="text-sm font-bold uppercase text-[#102878]">
                        Filter Learners by Joining Date & Probation
                    </h2>
                </div>

                {/* Joining From */}
                <form
                    onSubmit={handleSubmit(handleApplyFilter)}
                    className="grid w-full grid-cols-1 items-end gap-4 md:grid-cols-[180px_180px_180px_120px]"
                >
                    <CommonInputField
                        label="Date of Joining From"
                        name="joiningDateFrom"
                        control={control}
                        register={register}
                        errors={errors}
                        type="date"
                        rules={{
                            required: "Joining date from is required",
                        }}
                    />

                    <CommonInputField
                        label="Date of Joining To"
                        name="joiningDateTo"
                        control={control}
                        register={register}
                        errors={errors}
                        type="date"
                        rules={{
                            required: "Joining date to is required",
                        }}
                    />

                    <CommonInputField
                        label="Probation Period"
                        name="probationPeriodMonths"
                        control={control}
                        register={register}
                        errors={errors}
                        type="dropdown"
                        options={[
                            { label: "3 Months", value: 3 },
                            { label: "6 Months", value: 6 },
                            { label: "12 Months", value: 12 },
                        ]}
                        rules={{
                            required: "Probation period is required",
                        }}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="h-10 w-full rounded-lg bg-[#102878] px-4 text-sm font-semibold text-white hover:bg-[#0b1f63] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Loading..." : "Apply Filter"}
                    </button>
                </form>

                <div className="mt-4 flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-2.5 text-xs text-blue-800">
                    <Filter size={14} />

                    <span>
                        The system will retrieve
                        eligible learners from the
                        server based on the selected
                        joining date range and
                        probation period.
                    </span>
                </div>
            </div>

            {/* =================================================
                2. SUMMARY
            ================================================== */}

            <div className="mt-5">
                <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#102878] text-xs font-bold text-white">
                        2
                    </div>

                    <h2 className="text-sm font-bold uppercase text-[#102878]">
                        Eligible Learners Summary
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard
                        icon={
                            <Users
                                size={21}
                            />
                        }
                        value={
                            totalCount
                        }
                        label="Total Eligible Learners"
                        iconClass="bg-purple-50 text-purple-600"
                    />

                    <SummaryCard
                        icon={
                            <CheckCircle2
                                size={21}
                            />
                        }
                        value={
                            totalCount
                        }
                        label="Ready for Adjustment (Completed Probation)"
                        iconClass="bg-green-50 text-green-600"
                    />

                    <SummaryCard
                        icon={
                            <ClipboardList
                                size={21}
                            />
                        }
                        value={`${totalAdjustmentAmount.toLocaleString()} BDT`}
                        label="Total Adjustment Amount"
                        iconClass="bg-orange-50 text-orange-500"
                    />

                    <SummaryCard
                        icon={
                            <span className="text-lg font-bold">
                                ৳
                            </span>
                        }
                        value={`${averageAdjustment.toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits:
                                    2,
                            },
                        )} BDT`}
                        label="Average Adjustment per Employee"
                        iconClass="bg-blue-50 text-blue-600"
                    />
                </div>
            </div>

            {/* =================================================
                3 + 4. TABLE / SUMMARY
            ================================================== */}

            <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
                {/* TABLE */}

                <div className="min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#102878] text-xs font-bold text-white">
                                3
                            </div>

                            <h2 className="text-sm font-bold uppercase text-[#102878]">
                                Eligible Learners List
                            </h2>
                        </div>

                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700"
                        >
                            <FileSpreadsheet
                                size={14}
                            />
                            Export to Excel
                        </button>
                    </div>

                    {/* Selection toolbar */}

                    {selectedLearners.length >
                        0 && (
                            <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50 px-4 py-2.5">
                                <div className="flex items-center gap-2 text-xs font-semibold text-blue-800">
                                    <CheckCircle2
                                        size={15}
                                    />

                                    {
                                        selectedLearners.length
                                    }{" "}
                                    employee
                                    {selectedLearners.length !==
                                        1
                                        ? "s"
                                        : ""}{" "}
                                    selected
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        handleClearSelection
                                    }
                                    className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-red-600"
                                >
                                    <X size={14} />

                                    Clear Selection
                                </button>
                            </div>
                        )}

                    {/* TABLE */}

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1250px] border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-[11px] font-bold uppercase text-slate-600">
                                    <th className="w-10 border-b px-2 py-3 text-center">
                                        <input
                                            type="checkbox"
                                            checked={
                                                isCurrentPageFullySelected
                                            }
                                            onChange={
                                                handleToggleCurrentPage
                                            }
                                            disabled={
                                                paginatedLearners.length ===
                                                0
                                            }
                                            className="h-4 w-4 accent-[#102878]"
                                        />
                                    </th>

                                    <th className="border-b px-3 py-3 text-left">
                                        #
                                    </th>

                                    <th className="border-b px-3 py-3 text-left">
                                        Employee ID
                                    </th>

                                    <th className="border-b px-3 py-3 text-left">
                                        Employee Name
                                    </th>

                                    <th className="border-b px-3 py-3 text-left">
                                        Department /
                                        Section
                                    </th>

                                    <th className="border-b px-3 py-3 text-left">
                                        Designation
                                        <span className="block text-[9px] font-normal normal-case text-slate-400">
                                            (Current)
                                        </span>
                                    </th>

                                    {/* NEW COLUMN */}

                                    <th className="border-b px-3 py-3 text-left">
                                        Previous
                                        <span className="block text-[9px] font-normal normal-case text-slate-400">
                                            Designation
                                        </span>
                                    </th>

                                    <th className="border-b px-3 py-3 text-left">
                                        Date of Joining
                                    </th>

                                    <th className="border-b px-3 py-3 text-left">
                                        Probation
                                        <span className="block text-[9px] font-normal normal-case text-slate-400">
                                            Completed
                                        </span>
                                    </th>

                                    <th className="border-b px-3 py-3 text-right">
                                        Current Gross
                                        <span className="block text-[9px] font-normal normal-case text-slate-400">
                                            Salary
                                        </span>
                                    </th>

                                    <th className="border-b px-3 py-3 text-right">
                                        Standard Gross
                                        <span className="block text-[9px] font-normal normal-case text-slate-400">
                                            Salary
                                        </span>
                                    </th>

                                    <th className="border-b px-3 py-3 text-right">
                                        Adjustment
                                        <span className="block text-[9px] font-normal normal-case text-slate-400">
                                            Amount
                                        </span>
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={
                                                12
                                            }
                                            className="py-12 text-center text-sm text-slate-400"
                                        >
                                            Loading
                                            eligible
                                            learners...
                                        </td>
                                    </tr>
                                ) : paginatedLearners.length ===
                                    0 ? (
                                    <tr>
                                        <td
                                            colSpan={
                                                12
                                            }
                                            className="py-12 text-center text-sm text-slate-400"
                                        >
                                            No eligible
                                            learners
                                            found.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedLearners.map(
                                        (
                                            learner,
                                            index,
                                        ) => {
                                            const selected =
                                                selectedIds.has(
                                                    learner.id,
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        learner.id
                                                    }
                                                    className={
                                                        selected
                                                            ? "bg-blue-50"
                                                            : "hover:bg-slate-50"
                                                    }
                                                >
                                                    <td className="border-b px-2 py-3 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                selected
                                                            }
                                                            onChange={() =>
                                                                handleToggleRow(
                                                                    learner.id,
                                                                )
                                                            }
                                                            className="h-4 w-4 accent-[#102878]"
                                                        />
                                                    </td>

                                                    <td className="border-b px-3 py-3 text-slate-500">
                                                        {(pageNumber -
                                                            1) *
                                                            pageSize +
                                                            index +
                                                            1}
                                                    </td>

                                                    <td className="border-b px-3 py-3 font-semibold">
                                                        {
                                                            learner.employeeId
                                                        }
                                                    </td>

                                                    <td className="border-b px-3 py-3 font-semibold">
                                                        {
                                                            learner.employeeName
                                                        }
                                                    </td>

                                                    <td className="border-b px-3 py-3">
                                                        {
                                                            learner.department
                                                        }
                                                    </td>

                                                    <td className="border-b px-3 py-3">
                                                        {
                                                            learner.currentDesignation
                                                        }
                                                    </td>

                                                    {/* PREVIOUS DESIGNATION */}

                                                    <td className="border-b px-3 py-3">
                                                        {
                                                            learner.previousDesignation
                                                        }
                                                    </td>

                                                    <td className="border-b px-3 py-3">
                                                        {
                                                            learner.dateOfJoining
                                                        }
                                                    </td>

                                                    <td className="border-b px-3 py-3">
                                                        {
                                                            learner.probationCompletedDate
                                                        }
                                                    </td>

                                                    <td className="border-b px-3 py-3 text-right">
                                                        {
                                                            learner.currentGrossSalary
                                                        }
                                                    </td>

                                                    <td className="border-b px-3 py-3 text-right">
                                                        {
                                                            learner.standardGrossSalary
                                                        }
                                                    </td>

                                                    <td className="border-b px-3 py-3 text-right font-bold text-green-700">
                                                        {
                                                            learner.adjustmentAmount
                                                        }
                                                    </td>
                                                </tr>
                                            );
                                        },
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* =================================================
                        UI PAGINATION
                    ================================================== */}

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
                        <span className="text-xs text-slate-500">
                            Showing{" "}
                            <strong>
                                {pageStart}
                            </strong>{" "}
                            to{" "}
                            <strong>
                                {pageEnd}
                            </strong>{" "}
                            of{" "}
                            <strong>
                                {totalCount}
                            </strong>{" "}
                            entries
                        </span>

                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                disabled={
                                    pageNumber ===
                                    1
                                }
                                onClick={() =>
                                    handlePageChange(
                                        pageNumber -
                                        1,
                                    )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded border text-slate-600 disabled:opacity-40"
                            >
                                <ChevronLeft
                                    size={14}
                                />
                            </button>

                            {Array.from(
                                {
                                    length: totalPages,
                                },
                                (_, index) =>
                                    index + 1,
                            ).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() =>
                                        handlePageChange(
                                            page,
                                        )
                                    }
                                    className={`h-8 min-w-8 rounded border px-2 text-xs font-semibold ${page ===
                                        pageNumber
                                        ? "border-[#102878] bg-[#102878] text-white"
                                        : "border-slate-200 text-slate-600"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                type="button"
                                disabled={
                                    pageNumber ===
                                    totalPages
                                }
                                onClick={() =>
                                    handlePageChange(
                                        pageNumber +
                                        1,
                                    )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded border text-slate-600 disabled:opacity-40"
                            >
                                <ChevronRight
                                    size={14}
                                />
                            </button>

                            <select
                                value={
                                    pageSize
                                }
                                onChange={
                                    handlePageSizeChange
                                }
                                className="ml-2 h-8 rounded border px-2 text-xs"
                            >
                                <option value={5}>
                                    5 / page
                                </option>

                                <option value={10}>
                                    10 / page
                                </option>

                                <option value={20}>
                                    20 / page
                                </option>

                                <option value={50}>
                                    50 / page
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    ADJUSTMENT SUMMARY
                ================================================== */}

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#102878] text-xs font-bold text-white">
                            4
                        </div>

                        <h2 className="text-sm font-bold uppercase text-[#102878]">
                            Adjustment Summary
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <SummaryRow
                            label="Total Eligible Learners"
                            value={String(
                                totalCount,
                            )}
                        />

                        <SummaryRow
                            label="Total Current Gross Salary"
                            value={`${totalCurrentGrossSalary.toLocaleString()} BDT`}
                        />

                        <SummaryRow
                            label="Total Standard Gross Salary"
                            value={`${totalStandardGrossSalary.toLocaleString()} BDT`}
                        />

                        <SummaryRow
                            label="Total Adjustment Amount"
                            value={`${totalAdjustmentAmount.toLocaleString()} BDT`}
                        />

                        <SummaryRow
                            label="Average Adjustment per Employee"
                            value={`${averageAdjustment.toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits:
                                        2,
                                },
                            )} BDT`}
                        />
                    </div>
                </div>
            </div>

            {/* =================================================
                REQUEST FORWARDING FLOW
            ================================================== */}

            <div className="mt-5">
                {/* Replace with your actual import later */}

                <RequestForwardingFlow />
            </div>

            {/* =================================================
                ACTIONS
            ================================================== */}

            <div className="mt-5 flex items-center justify-between">
                <button
                    type="button"
                    className="rounded-lg border border-[#102878] bg-white px-5 py-2.5 text-sm font-semibold text-[#102878]"
                >
                    ← Back to Request Type
                </button>

                <div className="flex flex-col items-end gap-2">
                    {selectedLearners.length >
                        0 && (
                            <span className="text-xs text-slate-500">
                                {
                                    selectedLearners.length
                                }{" "}
                                employee
                                {selectedLearners.length !==
                                    1
                                    ? "s"
                                    : ""}{" "}
                                selected
                            </span>
                        )}

                    <button
                        type="button"
                        disabled={
                            selectedLearners.length ===
                            0 ||
                            forwarding
                        }
                        onClick={
                            handleForwardToDirector
                        }
                        className="flex items-center gap-2 rounded-lg bg-[#102878] px-6 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        <Send size={16} />

                        {forwarding
                            ? "Forwarding..."
                            : "Forward to Director"}

                        {selectedLearners.length >
                            0 && (
                                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                                    {
                                        selectedLearners.length
                                    }
                                </span>
                            )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// =============================================================
// SUMMARY CARD
// =============================================================

interface SummaryCardProps {
    icon: React.ReactNode;
    value: string | number;
    label: string;
    iconClass: string;
}

const SummaryCard: React.FC<
    SummaryCardProps
> = ({
    icon,
    value,
    label,
    iconClass,
}) => (
        <div className="flex min-h-[92px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
            >
                {icon}
            </div>

            <div>
                <p className="text-lg font-bold text-slate-800">
                    {value}
                </p>

                <p className="text-[11px] text-slate-500">
                    {label}
                </p>
            </div>
        </div>
    );

// =============================================================
// SUMMARY ROW
// =============================================================

interface SummaryRowProps {
    label: string;
    value: string;
}

const SummaryRow: React.FC<
    SummaryRowProps
> = ({ label, value }) => (
    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
        <span className="text-[11px] text-slate-500">
            {label}
        </span>

        <span className="text-right text-xs font-bold text-slate-800">
            {value}
        </span>
    </div>
);

export default AdjustmentIncrementRequest;