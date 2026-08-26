import React, { useMemo, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    Info,
    Plus,
    Trash2,
    UserRound,
    Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type {
    Control,
    FieldErrors,
    UseFormRegister,
} from "react-hook-form";
import { useForm } from "react-hook-form";

import CommonInputField , {type Option }from "../../components/CommonInputFields";
import RequestForwardingFlow from "./shared/RequestForwardingFlow";
import { API_ROUTES } from "../../api/routes";
import { api } from "../../api/client";

interface Employee {
    id: string;
    employeeCode: string;
    employeeNameEnglish: string;
    employeeType: string;
    department: string;
    section: string;
    designation: string;
    grade: string;
    dateOfJoining: string;
    basicSalary: number;
    grossSalary: number;
}

interface PromotionRequest {
    employeeId: string;
    employeeName: string;
    department: string;
    currentDesignation: string;
    proposedDesignation: string;
    currentGrade: string;
    newGrade: string;
    currentBasicSalary: number;
    currentGrossSalary: number;
    incrementPercent: number;
    incrementAmount: number;
    newBasicSalary: number;
    newGrossSalary: number;
    effectiveFrom: string;
    reason: string;
}

interface PromotionSearchForm {
    searchEmployee: string;
}

const PromotionIncrementRequest: React.FC = () => {
    const navigate = useNavigate();

    /* =========================================================
       SEARCH OPTIONS
    ========================================================= */

    const [employeeOptions, setEmployeeOptions] = useState<
        {
            label: string;
            value: string;
        }[]
    >([]);

    const [searchedEmployees, setSearchedEmployees] = useState<
        Employee[]
    >([]);

    /* =========================================================
       SEARCH FORM
    ========================================================= */

    const {
        register,
        control,
        setValue,
    } = useForm<PromotionSearchForm>({
        defaultValues: {
            searchEmployee: "",
        },
    });

    /* =========================================================
       EMPLOYEE STATE
    ========================================================= */

    const [employeeFound, setEmployeeFound] =
        useState(false);

    const [employee, setEmployee] =
        useState<Employee | null>(null);

    /* =========================================================
       PROMOTION / INCREMENT STATE
    ========================================================= */

    const [proposedDesignation, setProposedDesignation] =
        useState("Manager");

    const [newGrade, setNewGrade] =
        useState("M-4");

    const [effectiveFrom, setEffectiveFrom] =
        useState("2025-06-01");

    const [incrementType, setIncrementType] =
        useState<"percentage" | "amount">(
            "percentage",
        );

    const [incrementPercent, setIncrementPercent] =
        useState<number>(12);

    const [incrementAmount, setIncrementAmount] =
        useState<number>(0);

    const [reason, setReason] =
        useState("");

    const [requests, setRequests] =
        useState<PromotionRequest[]>([]);

    /* =========================================================
       CURRENT DATE
    ========================================================= */

    const today = new Date();

    const formattedDate =
        today.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    const dayName =
        today.toLocaleDateString("en-US", {
            weekday: "long",
        });

    /* =========================================================
       RESET EMPLOYEE DETAILS
    ========================================================= */

    const resetEmployeeDetails = () => {
        setEmployee(null);
        setEmployeeFound(false);

        setProposedDesignation("Manager");
        setNewGrade("M-4");

        setIncrementType("percentage");
        setIncrementPercent(12);
        setIncrementAmount(0);

        setEffectiveFrom("2025-06-01");
        setReason("");
    };

    /* =========================================================
       EMPLOYEE SEARCH
       
       This is the ONLY API call for employee searching.
    ========================================================= */

    const handleEmployeeSearch = async (
        searchText: string,
    ) => {
        const text = searchText.trim();

        /*
         * Clear the currently displayed employee whenever
         * the user starts changing/searching the employee.
         */
        resetEmployeeDetails();

        if (!text) {
            setEmployeeOptions([]);
            setSearchedEmployees([]);
            return;
        }

        try {
            const response = await api.get(
                `${API_ROUTES.EMPLOYEES}/search?searchText=${encodeURIComponent(
                    text,
                )}`,
            );

            /*
             * IMPORTANT:
             *
             * The search API response itself is used as the
             * employee-detail source.
             *
             * No second API request is made after selection.
             */
            const data: Employee[] =
                response.data ?? [];

            setSearchedEmployees(data);

            setEmployeeOptions(
                data.map((item) => ({
                    label: `${item.employeeCode} - ${item.employeeNameEnglish}`,
                    value: item.id,
                })),
            );
        } catch (error) {
            console.error(
                "Employee search failed:",
                error,
            );

            setEmployeeOptions([]);
            setSearchedEmployees([]);
            resetEmployeeDetails();
        }
    };

    /* =========================================================
       EMPLOYEE SELECT
       
       IMPORTANT:
       Selecting an employee DOES NOT trigger another search.
       
       The selected object from searchedEmployees is directly
       used to populate Section 2.
    ========================================================= */
const handleEmployeeSelect = (option: Option) => {
        const employeeId = option?.value;

        if (!employeeId) {
            resetEmployeeDetails();
            return;
        }

        /*
         * Find the employee from the results that are already
         * loaded by the previous search API call.
         */
        const selectedEmployee =
            searchedEmployees.find(
                (item) =>
                    item.id === employeeId,
            );

        if (!selectedEmployee) {
            resetEmployeeDetails();
            return;
        }

        /*
         * Keep the selected employee ID in the form.
         */
        setValue(
            "searchEmployee",
            selectedEmployee.id,
            {
                shouldValidate: false,
                shouldDirty: true,
            },
        );

        /*
         * Directly populate Section 2.
         *
         * NO handleSearch()
         * NO API call
         * NO mock data
         */
        setEmployee(selectedEmployee);
        setEmployeeFound(true);

        /*
         * Reset only the promotion/increment fields
         * because a different employee has been selected.
         */
        setProposedDesignation("Manager");
        setNewGrade("M-4");

        setIncrementType("percentage");
        setIncrementPercent(12);
        setIncrementAmount(0);

        setEffectiveFrom("2025-06-01");
        setReason("");
    };

    /* =========================================================
       AUTOMATIC INCREMENT CALCULATION
    ========================================================= */

    const calculatedIncrementAmount =
        useMemo(() => {
            if (!employee) {
                return 0;
            }

            if (
                incrementType ===
                "percentage"
            ) {
                return (
                    employee.basicSalary *
                    (Number(
                        incrementPercent,
                    ) / 100)
                );
            }

            return (
                Number(
                    incrementAmount,
                ) || 0
            );
        }, [
            employee,
            incrementType,
            incrementPercent,
            incrementAmount,
        ]);

    /* =========================================================
       NEW BASIC SALARY
    ========================================================= */

    const calculatedNewBasicSalary =
        useMemo(() => {
            if (!employee) {
                return 0;
            }

            return (
                employee.basicSalary +
                calculatedIncrementAmount
            );
        }, [
            employee,
            calculatedIncrementAmount,
        ]);

    /* =========================================================
       NEW GROSS SALARY
    ========================================================= */

    const calculatedNewGrossSalary =
        useMemo(() => {
            if (!employee) {
                return 0;
            }

            if (
                incrementType ===
                "percentage"
            ) {
                return (
                    employee.grossSalary +
                    employee.grossSalary *
                        (Number(
                            incrementPercent,
                        ) / 100)
                );
            }

            const ratio =
                employee.basicSalary > 0
                    ? calculatedIncrementAmount /
                      employee.basicSalary
                    : 0;

            return (
                employee.grossSalary *
                (1 + ratio)
            );
        }, [
            employee,
            incrementType,
            incrementPercent,
            calculatedIncrementAmount,
        ]);

    /* =========================================================
       ADD TO LIST
    ========================================================= */

    const handleAddToList = () => {
        if (!employee) {
            return;
        }

        if (!proposedDesignation) {
            return;
        }

        if (!newGrade) {
            return;
        }

        if (!effectiveFrom) {
            return;
        }

        if (!reason.trim()) {
            return;
        }

        const requestIncrementPercent =
            incrementType ===
            "percentage"
                ? Number(
                      incrementPercent,
                  )
                : employee.basicSalary > 0
                ? (calculatedIncrementAmount /
                      employee.basicSalary) *
                  100
                : 0;

        const newRequest: PromotionRequest =
            {
                employeeId:
                    employee.id,

                employeeName:
                    employee.employeeNameEnglish,

                department:
                    employee.department,

                currentDesignation:
                    employee.designation,

                proposedDesignation,

                currentGrade:
                    employee.grade,

                newGrade,

                currentBasicSalary:
                    employee.basicSalary,

                currentGrossSalary:
                    employee.grossSalary,

                incrementPercent:
                    requestIncrementPercent,

                incrementAmount:
                    calculatedIncrementAmount,

                newBasicSalary:
                    calculatedNewBasicSalary,

                newGrossSalary:
                    calculatedNewGrossSalary,

                effectiveFrom,

                reason:
                    reason.trim(),
            };

        setRequests((prev) => [
            ...prev,
            newRequest,
        ]);

        /*
         * Clear only the reason after adding.
         */
        setReason("");
    };

    /* =========================================================
       REMOVE REQUEST
    ========================================================= */

    const handleRemove = (
        index: number,
    ) => {
        setRequests((prev) =>
            prev.filter(
                (_, i) =>
                    i !== index,
            ),
        );
    };

    /* =========================================================
       SUMMARY CALCULATIONS
    ========================================================= */

    const totalIncrementAmount =
        useMemo(
            () =>
                requests.reduce(
                    (
                        sum,
                        item,
                    ) =>
                        sum +
                        item.incrementAmount,
                    0,
                ),
            [requests],
        );

    const totalNewBasicSalary =
        useMemo(
            () =>
                requests.reduce(
                    (
                        sum,
                        item,
                    ) =>
                        sum +
                        item.newBasicSalary,
                    0,
                ),
            [requests],
        );

    const totalGrossSalary =
        useMemo(
            () =>
                requests.reduce(
                    (
                        sum,
                        item,
                    ) =>
                        sum +
                        item.newGrossSalary,
                    0,
                ),
            [requests],
        );

    const averageIncrement =
        requests.length > 0
            ? requests.reduce(
                  (
                      sum,
                      item,
                  ) =>
                      sum +
                      item.incrementPercent,
                  0,
              ) / requests.length
            : 0;

    /* =========================================================
       FORMAT CURRENCY
    ========================================================= */

    const formatCurrency = (
        value: number,
    ) =>
        value?.toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            },
        );

    /* =========================================================
       SUBMIT
    ========================================================= */

    const handleForward = () => {
        console.log(
            "Promotion + Increment Requests:",
            requests,
        );

        /*
         * API call here.
         */
    };

    return (
        <div className="min-h-screen bg-white text-[#101b4b]">

            {/* =====================================================
                TOP BAR
            ===================================================== */}

            <header className="h-[60px] bg-[#00194f] px-7 text-white">
                <div className="flex h-full items-center justify-between">

                    <div className="flex h-full items-center">

                        <div className="flex items-center gap-3 pr-6">

                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white">
                                <span className="text-[28px] font-extrabold text-[#00194f]">
                                    S
                                </span>
                            </div>

                            <div>
                                <div className="text-[21px] font-extrabold leading-none tracking-wide">
                                    SYNEXIS
                                </div>

                                <div className="mt-[2px] text-[8px] text-[#00c8ef]">
                                    Creating Enterprise Synergy
                                </div>
                            </div>

                        </div>

                        <div className="h-[40px] w-px bg-[#52709e]" />

                        <div className="pl-5">

                            <h1 className="text-[15px] font-bold tracking-wide">
                                PRODUCTION FLOOR – PROMOTION + INCREMENT REQUEST
                            </h1>

                            <div className="mt-[2px] text-[9px] text-white/90">
                                Dashboard
                                <span className="mx-2 text-[#7d91b8]">
                                    &gt;
                                </span>
                                Production Floor
                                <span className="mx-2 text-[#7d91b8]">
                                    &gt;
                                </span>
                                Employee Increment / Promotion
                                <span className="mx-2 text-[#7d91b8]">
                                    &gt;
                                </span>
                                Promotion + Increment
                            </div>

                        </div>

                    </div>

                    <div className="flex h-full items-center gap-5">

                        <div className="flex items-center gap-3 rounded-md bg-white px-4 py-2 text-[11px] font-semibold text-[#17244e]">

                            <CalendarDays size={16} />

                            <span>
                                {formattedDate}
                            </span>

                            <span className="text-gray-300">
                                |
                            </span>

                            <span>
                                {dayName}
                            </span>

                        </div>

                        <div className="h-[38px] w-px bg-[#52709e]" />

                        <div className="flex items-center gap-2">

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#00194f]">
                                <UserRound size={20} />
                            </div>

                            <div className="leading-tight">

                                <div className="text-[10px] font-semibold">
                                    Production Incharge
                                </div>

                                <div className="mt-1 text-[9px] text-white">
                                    Spinning Department
                                    <span className="ml-1">
                                        ⌄
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </header>

            {/* =====================================================
                MAIN
            ===================================================== */}

            <main className="px-7 pb-5 pt-3">

                <section>

                    <h2 className="text-[17px] font-bold text-[#06168b]">
                        PROMOTION + INCREMENT REQUEST
                    </h2>

                    <p className="mt-1 text-[11px] text-[#19245b]">
                        Search employee, input proposed promotion
                        and increment details and add to list for
                        approval.
                    </p>

                </section>

                {/* =================================================
                    SECTION 1 + SECTION 2 + HELP
                ================================================= */}

                <section className="mt-3 grid grid-cols-[245px_1fr_215px] gap-3">

                    {/* SEARCH */}

                    <div className="rounded-md border border-[#e2e7f0] p-3">

                        <h3 className="text-[11px] font-extrabold text-[#3217c7]">
                            1. SEARCH EMPLOYEE
                        </h3>

                        <div className="mt-4">

                            <CommonInputField
                                label="Search by"
                                name="searchEmployee"
                                register={
                                    register as UseFormRegister<any>
                                }
                                control={
                                    control as Control<any>
                                }
                                errors={
                                    {} as FieldErrors<any>
                                }
                                type="searchable-dropdown"
                                options={
                                    employeeOptions
                                }
                                placeholder="Search employee"
                                onSearchChange={
                                    handleEmployeeSearch
                                }
                                onOptionSelect={
                                    handleEmployeeSelect
                                }
                            />

                        </div>

                    </div>

                    {/* EMPLOYEE INFORMATION */}

                    <div className="rounded-md border border-[#e2e7f0] p-3">

                        <div className="flex items-center justify-between">

                            <h3 className="text-[11px] font-extrabold text-[#3217c7]">
                                2. EMPLOYEE INFORMATION
                            </h3>

                            {employeeFound && (
                                <span className="rounded bg-[#effaf2] px-2 py-1 text-[9px] font-bold text-[#13863b]">
                                    ✓ Employee Found
                                </span>
                            )}

                        </div>

                        {employee ? (

                            <div className="mt-3 grid grid-cols-[75px_1fr_1fr] gap-4">

                                <div className="flex h-[75px] w-[75px] items-center justify-center overflow-hidden rounded-md bg-[#edf1f7]">

                                    <UserRound
                                        size={50}
                                        className="text-[#9aa7ba]"
                                    />

                                </div>

                                <div className="space-y-[6px] text-[9px]">

                                    <div>
                                        <span>
                                            Employee ID
                                        </span>

                                        <strong className="ml-5">
                                            {
                                                employee.employeeCode
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Name
                                        </span>

                                        <strong className="ml-8">
                                            {
                                                employee.employeeNameEnglish
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Employee Type
                                        </span>

                                        <strong className="ml-2">
                                            {
                                                employee.employeeType
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Department
                                        </span>

                                        <strong className="ml-5">
                                            {
                                                employee.department
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Section
                                        </span>

                                        <strong className="ml-10">
                                            {
                                                employee.section
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Designation
                                        </span>

                                        <strong className="ml-4">
                                            {
                                                employee.designation
                                            }
                                        </strong>
                                    </div>

                                </div>

                                <div className="space-y-[6px] text-[9px]">

                                    <div className="font-bold text-[#3217c7]">
                                        Current Salary Details
                                    </div>

                                    <div>
                                        Current Basic Salary

                                        <strong className="float-right">
                                            {formatCurrency(
                                                employee.basicSalary,
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        Current Gross Salary

                                        <strong className="float-right">
                                            {formatCurrency(
                                                employee.grossSalary,
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        Current Grade

                                        <strong className="float-right">
                                            {
                                                employee.grade
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        Current Designation

                                        <strong className="float-right">
                                            {
                                                employee.designation
                                            }
                                        </strong>
                                    </div>

                                </div>

                            </div>

                        ) : (

                            <div className="flex h-[100px] items-center justify-center text-[10px] text-gray-400">
                                Search an employee to view information
                            </div>

                        )}

                    </div>

                    {/* HELP */}

                    <div className="rounded-md border border-[#dce5f4] bg-[#f8fbff] p-3">

                        <h3 className="text-[11px] font-extrabold text-[#173dd1]">

                            <Info
                                size={14}
                                className="mr-1 inline"
                            />

                            HELP & INSTRUCTION

                        </h3>

                        <ul className="mt-3 space-y-2 pl-3 text-[9px] leading-4 text-[#19245b]">

                            <li>
                                • Enter proposed promotion and
                                increment % or amount.
                            </li>

                            <li>
                                • Provide reason / justification.
                            </li>

                            <li>
                                • Click "Add to List" to include
                                the request.
                            </li>

                            <li>
                                • After completing the list, click
                                "Forward to Director".
                            </li>

                        </ul>

                    </div>

                </section>

                {/* =================================================
                    SECTION 3 + SUMMARY
                ================================================= */}

                <section className="mt-3 grid grid-cols-[1fr_215px] gap-3">

                    {/* FORM */}

                    <div className="rounded-md border border-[#e2e7f0] p-3">

                        <h3 className="text-[11px] font-extrabold text-[#3217c7]">
                            3. PROPOSED PROMOTION & INCREMENT DETAILS
                        </h3>

                        <div className="mt-3 grid grid-cols-3 gap-3">

                            {/* PROMOTION */}

                            <div className="rounded-md border border-[#e3e7ef] p-3">

                                <div className="text-[10px] font-bold">
                                    Proposed Promotion
                                </div>

                                <label className="mt-3 flex items-center gap-2 text-[9px]">

                                    <input
                                        type="checkbox"
                                        className="accent-[#3217c7]"
                                    />

                                    No Promotion

                                </label>

                                <label className="mt-3 block text-[9px] font-semibold">
                                    New Designation *
                                </label>

                                <select
                                    value={
                                        proposedDesignation
                                    }
                                    onChange={(e) =>
                                        setProposedDesignation(
                                            e.target.value,
                                        )
                                    }
                                    className="mt-1 h-[31px] w-full rounded border border-gray-300 px-2 text-[10px]"
                                >
                                    <option>
                                        Manager
                                    </option>
                                    <option>
                                        Senior Manager
                                    </option>
                                    <option>
                                        Deputy Manager
                                    </option>
                                    <option>
                                        Assistant Manager
                                    </option>
                                </select>

                                <label className="mt-2 block text-[9px] font-semibold">
                                    New Grade *
                                </label>

                                <select
                                    value={
                                        newGrade
                                    }
                                    onChange={(e) =>
                                        setNewGrade(
                                            e.target.value,
                                        )
                                    }
                                    className="mt-1 h-[31px] w-full rounded border border-gray-300 px-2 text-[10px]"
                                >
                                    <option>
                                        M-4
                                    </option>
                                    <option>
                                        M-5
                                    </option>
                                    <option>
                                        M-6
                                    </option>
                                    <option>
                                        E-2
                                    </option>
                                </select>

                                <label className="mt-2 block text-[9px] font-semibold">
                                    Effective From Date *
                                </label>

                                <input
                                    type="date"
                                    value={
                                        effectiveFrom
                                    }
                                    onChange={(e) =>
                                        setEffectiveFrom(
                                            e.target.value,
                                        )
                                    }
                                    className="mt-1 h-[31px] w-full rounded border border-gray-300 px-2 text-[10px]"
                                />

                            </div>

                            {/* INCREMENT */}

                            <div className="rounded-md border border-[#e3e7ef] p-3">

                                <div className="text-[10px] font-bold">
                                    Increment Details
                                </div>

                                <div className="mt-3 flex gap-4 text-[9px]">

                                    <label className="flex items-center gap-1">

                                        <input
                                            type="radio"
                                            checked={
                                                incrementType ===
                                                "percentage"
                                            }
                                            onChange={() =>
                                                setIncrementType(
                                                    "percentage",
                                                )
                                            }
                                            className="accent-[#3217c7]"
                                        />

                                        Percentage

                                    </label>

                                    <label className="flex items-center gap-1">

                                        <input
                                            type="radio"
                                            checked={
                                                incrementType ===
                                                "amount"
                                            }
                                            onChange={() =>
                                                setIncrementType(
                                                    "amount",
                                                )
                                            }
                                            className="accent-[#3217c7]"
                                        />

                                        Amount

                                    </label>

                                </div>

                                <label className="mt-4 block text-[9px] font-semibold">
                                    Increment %
                                </label>

                                <div className="mt-1 flex h-[31px] overflow-hidden rounded border border-gray-300">

                                    <input
                                        type="number"
                                        value={
                                            incrementPercent
                                        }
                                        disabled={
                                            incrementType !==
                                            "percentage"
                                        }
                                        onChange={(e) =>
                                            setIncrementPercent(
                                                Number(
                                                    e.target.value,
                                                ),
                                            )
                                        }
                                        className="w-full px-2 text-[10px] outline-none"
                                    />

                                    <span className="flex w-8 items-center justify-center border-l bg-gray-50 text-[10px]">
                                        %
                                    </span>

                                </div>

                                <label className="mt-3 block text-[9px] font-semibold">
                                    Increment Amount
                                </label>

                                <div className="mt-1 flex h-[31px] overflow-hidden rounded border border-gray-300">

                                    <input
                                        type="number"
                                        value={
                                            incrementType ===
                                            "percentage"
                                                ? calculatedIncrementAmount.toFixed(
                                                      2,
                                                  )
                                                : incrementAmount
                                        }
                                        disabled={
                                            incrementType !==
                                            "amount"
                                        }
                                        onChange={(e) =>
                                            setIncrementAmount(
                                                Number(
                                                    e.target.value,
                                                ),
                                            )
                                        }
                                        className="w-full px-2 text-[10px] outline-none"
                                    />

                                    <span className="flex w-10 items-center justify-center border-l bg-gray-50 text-[9px]">
                                        BDT
                                    </span>

                                </div>

                            </div>

                            {/* PREVIEW */}

                            <div className="rounded-md border border-[#e3e7ef] p-3">

                                <div className="text-[10px] font-bold">
                                    New Salary After Approval
                                    (Preview)
                                </div>

                                <div className="mt-4 space-y-3 text-[9px]">

                                    <div>
                                        New Basic Salary

                                        <strong className="float-right text-[#168557]">
                                            {formatCurrency(
                                                calculatedNewBasicSalary,
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        New Gross Salary

                                        <strong className="float-right text-[#168557]">
                                            {formatCurrency(
                                                calculatedNewGrossSalary,
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        Total Increase

                                        <strong className="float-right text-[#168557]">

                                            {formatCurrency(
                                                calculatedIncrementAmount,
                                            )}

                                            {" ("}

                                            {incrementType ===
                                            "percentage"
                                                ? incrementPercent
                                                : employee &&
                                                  employee.basicSalary >
                                                      0
                                                ? (
                                                      (calculatedIncrementAmount /
                                                          employee.basicSalary) *
                                                      100
                                                  ).toFixed(
                                                      2,
                                                  )
                                                : "0.00"}

                                            {"%)"}

                                        </strong>
                                    </div>

                                </div>

                                <label className="mt-4 block text-[9px] font-semibold">
                                    Reason / Justification *
                                </label>

                                <textarea
                                    value={
                                        reason
                                    }
                                    onChange={(e) =>
                                        setReason(
                                            e.target.value,
                                        )
                                    }
                                    rows={3}
                                    placeholder="Enter reason / justification..."
                                    className="mt-1 w-full resize-none rounded border border-gray-300 p-2 text-[9px] outline-none focus:border-[#3217c7]"
                                />

                                <button
                                    type="button"
                                    disabled={
                                        !employee
                                    }
                                    onClick={
                                        handleAddToList
                                    }
                                    className="mt-2 flex h-[32px] w-full items-center justify-center gap-2 rounded-md bg-[#3217c7] text-[10px] font-bold text-white hover:bg-[#2813a5] disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    <Plus
                                        size={15}
                                    />

                                    Add to List

                                </button>

                            </div>

                        </div>

                    </div>

                    {/* SUMMARY */}

                    <div className="rounded-md border border-[#e2e7f0] p-3">

                        <h3 className="text-[11px] font-extrabold text-[#3217c7]">
                            REQUEST SUMMARY
                        </h3>

                        <div className="mt-4 space-y-4 text-[9px]">

                            <div className="flex justify-between gap-2">
                                <span>
                                    Total Employees Added
                                </span>

                                <strong>
                                    {
                                        requests.length
                                    }
                                </strong>
                            </div>

                            <div className="flex justify-between gap-2">
                                <span>
                                    Total Increment Amount
                                </span>

                                <strong>
                                    {formatCurrency(
                                        totalIncrementAmount,
                                    )}{" "}
                                    BDT
                                </strong>
                            </div>

                            <div className="flex justify-between gap-2">
                                <span>
                                    Total New Basic Salary
                                </span>

                                <strong>
                                    {formatCurrency(
                                        totalNewBasicSalary,
                                    )}{" "}
                                    BDT
                                </strong>
                            </div>

                            <div className="flex justify-between gap-2">
                                <span>
                                    Total New Gross Salary
                                </span>

                                <strong>
                                    {formatCurrency(
                                        totalGrossSalary,
                                    )}{" "}
                                    BDT
                                </strong>
                            </div>

                            <div className="flex justify-between gap-2">
                                <span>
                                    Average Increment %
                                </span>

                                <strong>
                                    {averageIncrement.toFixed(
                                        2,
                                    )}
                                    %
                                </strong>
                            </div>

                        </div>

                    </div>

                </section>

                {/* =================================================
                    SECTION 4
                ================================================= */}

                <section className="mt-3 rounded-md border border-[#e2e7f0]">

                    <div className="border-b border-[#e2e7f0] px-3 py-3">

                        <h3 className="text-[11px] font-extrabold text-[#3217c7]">
                            4. PROMOTION + INCREMENT REQUEST LIST
                        </h3>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full border-collapse text-[9px]">

                            <thead>

                                <tr className="bg-[#00194f] text-white">

                                    <th className="px-2 py-2">
                                        #
                                    </th>

                                    <th className="px-2 py-2">
                                        Emp ID
                                    </th>

                                    <th className="px-2 py-2">
                                        Employee Name
                                    </th>

                                    <th className="px-2 py-2">
                                        Department
                                    </th>

                                    <th className="px-2 py-2">
                                        Current
                                        <br />
                                        Designation
                                    </th>

                                    <th className="px-2 py-2">
                                        Proposed
                                        <br />
                                        Designation
                                    </th>

                                    <th className="px-2 py-2">
                                        Current
                                        <br />
                                        Grade
                                    </th>

                                    <th className="px-2 py-2">
                                        New
                                        <br />
                                        Grade
                                    </th>

                                    <th className="px-2 py-2">
                                        Current Gross
                                        <br />
                                        Salary
                                    </th>

                                    <th className="px-2 py-2">
                                        Increment
                                        <br />
                                        %
                                    </th>

                                    <th className="px-2 py-2">
                                        Increment
                                        <br />
                                        Amount
                                    </th>

                                    <th className="px-2 py-2">
                                        New Gross
                                        <br />
                                        Salary
                                    </th>

                                    <th className="px-2 py-2">
                                        Effective
                                        <br />
                                        From
                                    </th>

                                    <th className="px-2 py-2">
                                        Reason
                                    </th>

                                    <th className="px-2 py-2">
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {requests.length ===
                                0 ? (

                                    <tr>

                                        <td
                                            colSpan={
                                                15
                                            }
                                            className="py-8 text-center text-gray-400"
                                        >
                                            No promotion requests
                                            added yet.
                                        </td>

                                    </tr>

                                ) : (

                                    requests.map(
                                        (
                                            item,
                                            index,
                                        ) => (

                                            <tr
                                                key={`${item.employeeId}-${index}`}
                                                className="border-b border-gray-100 text-center"
                                            >

                                                <td className="px-2 py-2">
                                                    {
                                                        index +
                                                        1
                                                    }
                                                </td>

                                                <td className="px-2 py-2 font-semibold text-[#164bd7]">
                                                    {
                                                        item.employeeId
                                                    }
                                                </td>

                                                <td className="px-2 py-2">
                                                    {
                                                        item.employeeName
                                                    }
                                                </td>

                                                <td className="px-2 py-2">
                                                    {
                                                        item.department
                                                    }
                                                </td>

                                                <td className="px-2 py-2">
                                                    {
                                                        item.currentDesignation
                                                    }
                                                </td>

                                                <td className="px-2 py-2">
                                                    {
                                                        item.proposedDesignation
                                                    }
                                                </td>

                                                <td className="px-2 py-2">
                                                    {
                                                        item.currentGrade
                                                    }
                                                </td>

                                                <td className="px-2 py-2">
                                                    {
                                                        item.newGrade
                                                    }
                                                </td>

                                                <td className="px-2 py-2">
                                                    {formatCurrency(
                                                        item.currentGrossSalary,
                                                    )}
                                                </td>

                                                <td className="px-2 py-2">
                                                    {item.incrementPercent.toFixed(
                                                        2,
                                                    )}
                                                    %
                                                </td>

                                                <td className="px-2 py-2">
                                                    {formatCurrency(
                                                        item.incrementAmount,
                                                    )}
                                                </td>

                                                <td className="px-2 py-2 font-semibold">
                                                    {formatCurrency(
                                                        item.newGrossSalary,
                                                    )}
                                                </td>

                                                <td className="px-2 py-2">
                                                    {
                                                        item.effectiveFrom
                                                    }
                                                </td>

                                                <td className="max-w-[150px] px-2 py-2 text-left">
                                                    {
                                                        item.reason
                                                    }
                                                </td>

                                                <td className="px-2 py-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemove(
                                                                index,
                                                            )
                                                        }
                                                        className="text-red-500 hover:text-red-700"
                                                    >

                                                        <Trash2
                                                            size={
                                                                14
                                                            }
                                                        />

                                                    </button>

                                                </td>

                                            </tr>

                                        ),
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                    <div className="px-3 py-2 text-[9px] text-gray-500">

                        Showing 1 to{" "}
                        {
                            requests.length
                        }{" "}
                        of{" "}
                        {
                            requests.length
                        }{" "}
                        entries

                    </div>

                </section>

                {/* =================================================
                    SECTION 5 / FORWARDING
                ================================================= */}

                <section className="mt-3 flex items-center gap-5">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/employee-increment",
                            )
                        }
                        className="flex h-[36px] items-center gap-2 rounded-md border border-[#7655f3] px-4 text-[10px] font-bold text-[#3217c7] hover:bg-[#f7f4ff]"
                    >

                        <ArrowLeft
                            size={15}
                        />

                        Back to Request Type

                    </button>

                    <div className="flex-1 rounded-md border border-[#e2e7f0] px-4 py-3">

                        <RequestForwardingFlow />

                    </div>

                    <button
                        type="button"
                        disabled={
                            requests.length ===
                            0
                        }
                        onClick={
                            handleForward
                        }
                        className="flex h-[38px] items-center gap-2 rounded-md bg-[#3217c7] px-5 text-[10px] font-bold text-white hover:bg-[#2813a5] disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        <Send
                            size={14}
                        />

                        Forward to Director

                    </button>

                </section>

            </main>

        </div>
    );
};

export default PromotionIncrementRequest;