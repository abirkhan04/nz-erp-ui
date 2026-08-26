import React, { useMemo, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    Check,
    CircleDollarSign,
    Info,
    Plus,
    Search,
    Trash2,
    UserRound,
} from "lucide-react";
import {useForm} from "react-hook-form";
import type {
    Control,
    FieldErrors,
    UseFormRegister,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";

import CommonInputField from "../../components/CommonInputFields";
import type { Option } from "../../components/CommonInputFields";

import RequestForwardingFlow from "./shared/RequestForwardingFlow";
import { api } from "../../api/client";
import { API_ROUTES } from "../../api/routes";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface Employee {
    id: string | number;
    employeeCode: string;
    employeeNameEnglish: string;
    designationName: string;
    departmentName: string;
    sectionName: string;
    grade: string;
    currentBasicSalary: number;
    currentGrossSalary: number;
    shiftName: string;
    dateOfJoining: string;
}

interface PerformanceIncrementRequest {
    employeeId: string;
    employeeName: string;
    departmentSection: string;

    fivePercentEffectiveDate: string;
    fivePercentBasicSalary: number;
    fivePercentIncrementAmount: number;
    fivePercentNewBasicSalary: number;

    lastPerformanceDate: string;
    lastPerformanceIncrementPercentage: number;
    lastPerformanceIncrementAmount: number;
    lastPerformanceNewBasicSalary: number;

    currentIncrementPercentage: number;
    currentIncrementAmount: number;
    currentNewBasicSalary: number;
}

interface PerformanceIncrementForm {
    searchEmployee: string;

    currentIncrementPercentage: number;

    requests: PerformanceIncrementRequest[];
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);

const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

const PerformanceIncrementRequest: React.FC = () => {
    const navigate = useNavigate();

    const [employeeOptions, setEmployeeOptions] =
        useState<Option[]>([]);

    const [searchedEmployees, setSearchedEmployees] =
        useState<Employee[]>([]);

    const [selectedEmployee, setSelectedEmployee] =
        useState<Employee | null>(null);

    const [employeeFound, setEmployeeFound] =
        useState(false);

    const [incrementPercentage, setIncrementPercentage] =
        useState<number>(7);

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
    } = useForm<PerformanceIncrementForm>({
        defaultValues: {
            searchEmployee: "",
            currentIncrementPercentage: 7,
            requests: [],
        },
    });

    const requests = watch("requests");

    /* ====================================================================== */
    /* EMPLOYEE SEARCH                                                        */
    /* ====================================================================== */

    const handleEmployeeSearch = async (
        searchText: string,
    ) => {
        if (!searchText.trim()) {
            setEmployeeOptions([]);
            setSearchedEmployees([]);
            setEmployeeFound(false);
            return;
        }

        try {
            /*
             * Replace this URL with the same employee-search API
             * used by ForwardLeaveRequest.
             */
            const response = await api.get(
                `${API_ROUTES.EMPLOYEES}/search?searchText=${encodeURIComponent(
                    searchText.trim(),
                )}`,
            );

            const data: Employee[] =
                await response.data;

            setSearchedEmployees(data);

            setEmployeeOptions(
                data.map((employee) => ({
                    label: `${employee.employeeCode} - ${employee.employeeNameEnglish}`,
                    value: employee.id,
                })),
            );

        } catch (error) {
            console.error(
                "Employee search failed:",
                error,
            );

            setEmployeeOptions([]);
            setSearchedEmployees([]);
            setEmployeeFound(false);
        }
    };

    /* ====================================================================== */
    /* EMPLOYEE SELECT                                                        */
    /* ====================================================================== */

    const handleEmployeeSelect = (
        option: Option,
    ) => {
        const employee = searchedEmployees.find(
            (item) =>
                String(item.id) ===
                String(option.value),
        );

        if (!employee) return;

        setSelectedEmployee(employee);
        setEmployeeFound(true);

        setValue(
            "searchEmployee",
            String(employee.id),
        );

        /*
         * Default performance increment.
         * Screenshot uses 7%.
         */
        setIncrementPercentage(7);

        setValue(
            "currentIncrementPercentage",
            7,
        );
    };

    /* ====================================================================== */
    /* CALCULATIONS                                                           */
    /* ====================================================================== */

    const calculatedIncrement = useMemo(() => {
        if (!selectedEmployee) {
            return {
                fivePercentAmount: 0,
                fivePercentNewBasic: 0,
                currentIncrementAmount: 0,
                currentNewBasic: 0,
            };
        }

        const basicSalary =
            selectedEmployee.currentBasicSalary;

        const fivePercentAmount =
            basicSalary * 0.05;

        const fivePercentNewBasic =
            basicSalary + fivePercentAmount;

        /*
         * Performance increment is calculated
         * over the 5% annual increment.
         */
        const currentIncrementAmount =
            fivePercentNewBasic *
            (incrementPercentage / 100);

        const currentNewBasic =
            fivePercentNewBasic +
            currentIncrementAmount;

        return {
            fivePercentAmount,
            fivePercentNewBasic,
            currentIncrementAmount,
            currentNewBasic,
        };
    }, [
        selectedEmployee,
        incrementPercentage,
    ]);

    /* ====================================================================== */
    /* ADD TO LIST                                                            */
    /* ====================================================================== */

    const handleAddToList = () => {
        if (!selectedEmployee) {
            return;
        }

        if (incrementPercentage <= 5) {
            return;
        }

        const alreadyAdded = requests.some(
            (request) =>
                String(request.employeeId) ===
                String(selectedEmployee.id),
        );

        if (alreadyAdded) {
            return;
        }

        const request: PerformanceIncrementRequest = {
            employeeId:
                String(selectedEmployee.employeeCode),

            employeeName:
                selectedEmployee.employeeNameEnglish,

            departmentSection: `${selectedEmployee.departmentName} / ${selectedEmployee.sectionName}`,

            fivePercentEffectiveDate:
                selectedEmployee.dateOfJoining,

            fivePercentBasicSalary:
                selectedEmployee.currentBasicSalary,

            fivePercentIncrementAmount:
                calculatedIncrement.fivePercentAmount,

            fivePercentNewBasicSalary:
                calculatedIncrement.fivePercentNewBasic,

            lastPerformanceDate:
                "2024-01-20",

            lastPerformanceIncrementPercentage:
                5,

            lastPerformanceIncrementAmount:
                500,

            lastPerformanceNewBasicSalary:
                selectedEmployee.currentBasicSalary,

            currentIncrementPercentage:
                incrementPercentage,

            currentIncrementAmount:
                calculatedIncrement.currentIncrementAmount,

            currentNewBasicSalary:
                calculatedIncrement.currentNewBasic,
        };

        const currentRequests =
            requests ?? [];

        setValue("requests", [
            ...currentRequests,
            request,
        ]);

        /*
         * Clear employee search after adding.
         */
        setSelectedEmployee(null);
        setEmployeeFound(false);
        setEmployeeOptions([]);
        setSearchedEmployees([]);

        setValue("searchEmployee", "");
    };

    /* ====================================================================== */
    /* REMOVE FROM LIST                                                       */
    /* ====================================================================== */

    const handleRemove = (index: number) => {
        setValue(
            "requests",
            requests.filter(
                (_, requestIndex) =>
                    requestIndex !== index,
            ),
        );
    };

    /* ====================================================================== */
    /* CLEAR ALL                                                              */
    /* ====================================================================== */

    const handleClearAll = () => {
        reset({
            searchEmployee: "",
            currentIncrementPercentage: 7,
            requests: [],
        });

        setSelectedEmployee(null);
        setEmployeeOptions([]);
        setSearchedEmployees([]);
        setEmployeeFound(false);
        setIncrementPercentage(7);
    };

    /* ====================================================================== */
    /* SUBMIT                                                                 */
    /* ====================================================================== */

    const onSubmit = (
        data: PerformanceIncrementForm,
    ) => {
        console.log(
            "Performance Increment Request:",
            data,
        );

        /*
         * API call goes here.
         */
    };

    /* ====================================================================== */
    /* SUMMARY                                                                */
    /* ====================================================================== */

    const totalEmployees =
        requests.length;

    const totalIncrementAmount =
        requests.reduce(
            (total, request) =>
                total +
                request.currentIncrementAmount,
            0,
        );

    const averageIncrement =
        totalEmployees === 0
            ? 0
            : requests.reduce(
                  (total, request) =>
                      total +
                      request.currentIncrementPercentage,
                  0,
              ) / totalEmployees;

    /* ====================================================================== */
    /* WORKFLOW                                                               */
    /* ====================================================================== */

    const workflow: WorkflowItem[] = [
        {
            number: "1.",
            title: "PRODUCTION FLOOR",
            subtitle: "(You)",
            description: <>Create Request</>,
            icon: UserRound,
            iconClass: "text-[#1764e8]",
            circleClass:
                "bg-[#edf4ff] border-[#cbdcff]",
            titleClass: "text-[#174bd4]",
        },
        {
            number: "2.",
            title: "DIRECTOR",
            subtitle: "",
            description: (
                <>
                    Review & Approve
                    <br />
                    Request
                </>
            ),
            icon: UserRound,
            iconClass: "text-[#f27b00]",
            circleClass:
                "bg-[#fff5e8] border-[#ffe0bb]",
            titleClass: "text-[#ed6b00]",
        },
        {
            number: "3.",
            title: "EMPLOYEE MOVEMENT CELL",
            subtitle: "",
            description: (
                <>
                    Review & Forward to
                    <br />
                    HR Branch Manager
                </>
            ),
            icon: UserRound,
            iconClass: "text-[#00974d]",
            circleClass:
                "bg-[#eefaf3] border-[#ccebd9]",
            titleClass: "text-[#008f43]",
        },
        {
            number: "4.",
            title: "HR BRANCH MANAGER",
            subtitle: "",
            description: (
                <>
                    Review & Forward to
                    <br />
                    CEO
                </>
            ),
            icon: UserRound,
            iconClass: "text-[#175de0]",
            circleClass:
                "bg-[#edf4ff] border-[#cbdcff]",
            titleClass: "text-[#174bd4]",
        },
        {
            number: "5.",
            title: "CEO",
            subtitle: "",
            description: <>Final Approval</>,
            icon: UserRound,
            iconClass: "text-[#5914d9]",
            circleClass:
                "bg-[#f7f0ff] border-[#dfceff]",
            titleClass: "text-[#5914d9]",
        },
    ];

    /* ====================================================================== */
    /* DATE                                                                   */
    /* ====================================================================== */

    const today = new Date();

    const formattedToday =
        today.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    const dayName =
        today.toLocaleDateString("en-US", {
            weekday: "long",
        });

    /* ====================================================================== */
    /* RENDER                                                                 */
    /* ====================================================================== */

    return (
        <div className="min-h-screen bg-white text-[#101b4b]">

            {/* ================================================================ */}
            {/* HEADER                                                           */}
            {/* ================================================================ */}

            <header className="h-[60px] bg-[#00194f] px-7 text-white">

                <div className="flex h-full items-center justify-between">

                    <div className="flex h-full items-center">

                        {/* Logo */}
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
                                PRODUCTION FLOOR – PERFORMANCE INCREMENT REQUEST
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
                                Employee Increment / Promotion Request
                                <span className="mx-2 text-[#7d91b8]">
                                    &gt;
                                </span>
                                Performance Increment
                            </div>

                        </div>

                    </div>

                    {/* Right */}
                    <div className="flex h-full items-center gap-5">

                        <div className="flex items-center gap-3 rounded-md bg-white px-4 py-2 text-[11px] font-semibold text-[#17244e]">

                            <CalendarDays size={16} />

                            <span>
                                {formattedToday}
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

                                <div className="mt-1 text-[9px]">
                                    Spinning Department
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </header>

            {/* ================================================================ */}
            {/* BACK                                                             */}
            {/* ================================================================ */}

            <div className="px-7 pt-3">

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/employee-increment",
                        )
                    }
                    className="flex items-center gap-2 text-[11px] font-semibold text-[#1554d1]"
                >
                    <ArrowLeft size={17} />

                    Back to Request Type
                </button>

            </div>

            {/* ================================================================ */}
            {/* MAIN                                                             */}
            {/* ================================================================ */}

            <main className="px-7 pb-6 pt-2">

                {/* PAGE TITLE */}
                <section>

                    <h2 className="text-[17px] font-bold text-[#3711a7]">
                        PERFORMANCE INCREMENT REQUEST
                    </h2>

                    <p className="mt-1 text-[10px] text-[#19245b]">
                        Search employee, review increment history and
                        add performance increment to the list for
                        approval workflow.
                    </p>

                </section>

                {/* ============================================================ */}
                {/* SECTION 1 + SECTION 2 + INSTRUCTION                         */}
                {/* ============================================================ */}

                <section className="mt-3 grid grid-cols-[275px_1fr_215px] gap-3">

                    {/* SECTION 1 */}
                    <div className="rounded-md border border-[#e0e5ef] bg-white p-3">

                        <h3 className="text-[10px] font-extrabold text-[#3211a4]">
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
                                options={employeeOptions}
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

                    {/* SECTION 2 */}
                    <div className="rounded-md border border-[#e0e5ef] bg-white p-3">

                        <div className="flex items-center justify-between">

                            <h3 className="text-[10px] font-extrabold text-[#3211a4]">
                                2. EMPLOYEE INFORMATION
                            </h3>

                            {employeeFound && (
                                <span className="flex items-center gap-1 rounded-md bg-[#eafaf1] px-2 py-1 text-[9px] font-semibold text-[#00965a]">
                                    <Check size={12} />
                                    Employee Found
                                </span>
                            )}

                        </div>

                        {selectedEmployee ? (

                            <div className="mt-3 grid grid-cols-[55px_1fr_1fr] gap-3">

                                {/* PHOTO */}
                                <div className="flex h-[55px] w-[55px] items-center justify-center rounded-md bg-[#eef2f8]">
                                    <UserRound
                                        size={38}
                                        className="text-[#b5bfd2]"
                                    />
                                </div>

                                {/* LEFT INFO */}
                                <div className="space-y-1 text-[9px]">

                                    <InfoRow
                                        label="Employee ID"
                                        value={
                                            selectedEmployee.employeeCode
                                        }
                                    />

                                    <InfoRow
                                        label="Employee Name"
                                        value={
                                            selectedEmployee.employeeNameEnglish
                                        }
                                    />

                                    <InfoRow
                                        label="Employee Type"
                                        value="Worker"
                                    />

                                    <InfoRow
                                        label="Department"
                                        value={
                                            selectedEmployee.departmentName
                                        }
                                    />

                                    <InfoRow
                                        label="Section"
                                        value={
                                            selectedEmployee.sectionName
                                        }
                                    />

                                    <InfoRow
                                        label="Date of Joining"
                                        value={formatDate(
                                            selectedEmployee.dateOfJoining,
                                        )}
                                    />

                                </div>

                                {/* RIGHT INFO */}
                                <div className="border-l border-[#e6eaf1] pl-3 text-[9px]">

                                    <p className="mb-2 text-[9px] font-bold text-[#17244e]">
                                        CURRENT POSITION &amp; SALARY
                                    </p>

                                    <InfoRow
                                        label="Designation"
                                        value={
                                            selectedEmployee.designationName
                                        }
                                    />

                                    <InfoRow
                                        label="Grade"
                                        value={
                                            selectedEmployee.grade
                                        }
                                    />

                                    <InfoRow
                                        label="Current Basic Salary"
                                        value={`${formatCurrency(
                                            selectedEmployee.currentBasicSalary,
                                        )} BDT`}
                                    />

                                    <InfoRow
                                        label="Current Gross Salary"
                                        value={`${formatCurrency(
                                            selectedEmployee.currentGrossSalary,
                                        )} BDT`}
                                    />

                                    <InfoRow
                                        label="Shift"
                                        value={
                                            selectedEmployee.shiftName
                                        }
                                    />

                                </div>

                            </div>

                        ) : (

                            <div className="flex h-[105px] items-center justify-center text-[10px] text-gray-400">
                                Search and select an employee to view information.
                            </div>

                        )}

                    </div>

                    {/* INSTRUCTION */}
                    <div className="rounded-md border border-[#cbdcff] bg-[#f8fbff] p-3">

                        <h3 className="flex items-center gap-2 text-[10px] font-extrabold text-[#174bd4]">

                            <Info size={14} />

                            INSTRUCTION

                        </h3>

                        <ul className="mt-3 list-disc space-y-2 pl-4 text-[9px] leading-4 text-[#24315d]">

                            <li>
                                5% annual increment is added automatically
                                by the system.
                            </li>

                            <li>
                                Enter performance increment (over and above
                                5%).
                            </li>

                            <li>
                                Click "Add to List" to include in the request
                                list.
                            </li>

                            <li>
                                Review the list and click "Forward to Director"
                                to submit.
                            </li>

                        </ul>

                    </div>

                </section>

                {/* ============================================================ */}
                {/* SECTION 3                                                      */}
                {/* ============================================================ */}

                <section className="mt-3 rounded-md border border-[#e0e5ef] bg-white p-3">

                    <h3 className="text-[10px] font-extrabold text-[#3211a4]">
                        3. INCREMENT DETAILS
                    </h3>

                    <div className="mt-3 grid grid-cols-[1fr_1fr_1.2fr_115px] gap-3">

                        {/* 5% AUTO */}
                        <div className="rounded-md border border-[#e4e8ef] p-3">

                            <p className="text-[9px] font-bold text-[#3c15a7]">
                                <CalendarDays
                                    size={12}
                                    className="mr-1 inline"
                                />
                                5% Annual Increment (Auto)
                            </p>

                            <div className="mt-3 space-y-2 text-[9px]">

                                <InfoRow
                                    label="Effective Date"
                                    value={
                                        selectedEmployee
                                            ? formatDate(
                                                  selectedEmployee.dateOfJoining,
                                              )
                                            : "-"
                                    }
                                />

                                <InfoRow
                                    label="Old Basic Salary"
                                    value={
                                        selectedEmployee
                                            ? `${formatCurrency(
                                                  selectedEmployee.currentBasicSalary,
                                              )}`
                                            : "-"
                                    }
                                />

                                <InfoRow
                                    label="5% Increment Amount"
                                    value={
                                        selectedEmployee
                                            ? `${formatCurrency(
                                                  calculatedIncrement.fivePercentAmount,
                                              )}`
                                            : "-"
                                    }
                                    valueClass="text-[#00965a]"
                                />

                                <InfoRow
                                    label="New Basic Salary"
                                    value={
                                        selectedEmployee
                                            ? `${formatCurrency(
                                                  calculatedIncrement.fivePercentNewBasic,
                                              )}`
                                            : "-"
                                    }
                                    valueClass="text-[#00965a]"
                                />

                            </div>

                        </div>

                        {/* LAST PERFORMANCE */}
                        <div className="rounded-md border border-[#e4e8ef] p-3">

                            <p className="text-[9px] font-bold text-[#3211a4]">
                                Last Performance Increment
                            </p>

                            <div className="mt-3 space-y-2 text-[9px]">

                                <InfoRow
                                    label="Effective Date"
                                    value={
                                        selectedEmployee
                                            ? "20-Jan-2024"
                                            : "-"
                                    }
                                />

                                <InfoRow
                                    label="Increment %"
                                    value={
                                        selectedEmployee
                                            ? "5.00%"
                                            : "-"
                                    }
                                />

                                <InfoRow
                                    label="Increment Amount"
                                    value={
                                        selectedEmployee
                                            ? "500.00"
                                            : "-"
                                    }
                                    valueClass="text-[#00965a]"
                                />

                                <InfoRow
                                    label="New Basic Salary"
                                    value={
                                        selectedEmployee
                                            ? "10,000.00"
                                            : "-"
                                    }
                                    valueClass="text-[#00965a]"
                                />

                            </div>

                        </div>

                        {/* CURRENT PERFORMANCE */}
                        <div className="rounded-md border border-[#e4e8ef] p-3">

                            <p className="text-[9px] font-bold text-[#3211a4]">
                                This Year Performance Increment
                                (Over &amp; Above 5%)
                            </p>

                            <div className="mt-3 space-y-3">

                                <div className="flex items-center justify-between gap-3">

                                    <label className="text-[9px] font-semibold">
                                        Increment %
                                    </label>

                                    <div className="flex h-[28px] w-[120px] overflow-hidden rounded border border-[#d8dfea]">

                                        <input
                                            type="number"
                                            min={5.01}
                                            step={0.01}
                                            value={
                                                incrementPercentage
                                            }
                                            disabled={
                                                !selectedEmployee
                                            }
                                            onChange={(event) => {
                                                const value =
                                                    Number(
                                                        event
                                                            .target
                                                            .value,
                                                    );

                                                setIncrementPercentage(
                                                    value,
                                                );

                                                setValue(
                                                    "currentIncrementPercentage",
                                                    value,
                                                );
                                            }}
                                            className="w-full px-2 text-[9px] outline-none"
                                        />

                                        <span className="flex w-[28px] items-center justify-center border-l bg-[#f8fafc] text-[9px]">
                                            %
                                        </span>

                                    </div>

                                </div>

                                <InfoRow
                                    label="Increment Amount"
                                    value={
                                        selectedEmployee
                                            ? formatCurrency(
                                                  calculatedIncrement.currentIncrementAmount,
                                              )
                                            : "-"
                                    }
                                    valueClass="text-[#00965a]"
                                />

                                <InfoRow
                                    label="New Basic Salary (After This Increment)"
                                    value={
                                        selectedEmployee
                                            ? formatCurrency(
                                                  calculatedIncrement.currentNewBasic,
                                              )
                                            : "-"
                                    }
                                    valueClass="text-[#00965a]"
                                />

                            </div>

                        </div>

                        {/* ADD */}
                        <div className="flex items-center justify-center">

                            <button
                                type="button"
                                disabled={
                                    !selectedEmployee ||
                                    incrementPercentage <= 5
                                }
                                onClick={
                                    handleAddToList
                                }
                                className="flex items-center gap-2 rounded-md bg-[#5013d4] px-5 py-2.5 text-[10px] font-bold text-white transition hover:bg-[#4210b5] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Plus size={15} />

                                Add to List
                            </button>

                        </div>

                    </div>

                </section>

                {/* ============================================================ */}
                {/* SECTION 4 + SUMMARY                                          */}
                {/* ============================================================ */}

                <section className="mt-3 grid grid-cols-[1fr_215px] gap-3">

                    {/* TABLE */}
                    <div className="overflow-hidden rounded-md border border-[#e0e5ef]">

                        <div className="border-b border-[#e0e5ef] px-3 py-2">

                            <h3 className="text-[10px] font-extrabold text-[#3211a4]">
                                4. PERFORMANCE INCREMENT REQUEST LIST
                            </h3>

                        </div>

                        <div className="overflow-x-auto">

                            <table className="w-full border-collapse text-[8px]">

                                <thead>

                                    <tr className="bg-[#00194f] text-white">

                                        <th className="px-2 py-2">
                                            #
                                        </th>

                                        <th className="px-2 py-2">
                                            Employee ID
                                        </th>

                                        <th className="px-2 py-2">
                                            Employee Name
                                        </th>

                                        <th className="px-2 py-2">
                                            Department / Section
                                        </th>

                                        <th className="px-2 py-2">
                                            5% Auto Inc. Date
                                        </th>

                                        <th className="px-2 py-2">
                                            Last Perf. Inc. Date
                                        </th>

                                        <th className="px-2 py-2">
                                            Last Perf. Inc. %
                                        </th>

                                        <th className="px-2 py-2">
                                            Last Perf. Inc. Amount
                                        </th>

                                        <th className="px-2 py-2">
                                            This Year Inc. %
                                            <br />
                                            (Over &amp; Above 5%)
                                        </th>

                                        <th className="px-2 py-2">
                                            This Year Inc. Amount
                                        </th>

                                        <th className="px-2 py-2">
                                            New Basic Salary
                                            <br />
                                            (After This Increment)
                                        </th>

                                        <th className="px-2 py-2">
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {requests.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan={12}
                                                className="py-8 text-center text-gray-400"
                                            >
                                                No employees added yet.
                                            </td>

                                        </tr>

                                    ) : (

                                        requests.map(
                                            (request, index) => (
                                                <tr
                                                    key={`${request.employeeId}-${index}`}
                                                    className="border-b border-[#e8ebf1] text-center last:border-0"
                                                >

                                                    <td className="px-2 py-2">
                                                        {index + 1}
                                                    </td>

                                                    <td className="px-2 py-2 font-semibold text-[#174bd4]">
                                                        {
                                                            request.employeeId
                                                        }
                                                    </td>

                                                    <td className="px-2 py-2 text-left">
                                                        {
                                                            request.employeeName
                                                        }
                                                    </td>

                                                    <td className="px-2 py-2">
                                                        {
                                                            request.departmentSection
                                                        }
                                                    </td>

                                                    <td className="px-2 py-2">
                                                        {
                                                            request.fivePercentEffectiveDate
                                                        }
                                                    </td>

                                                    <td className="px-2 py-2">
                                                        {
                                                            request.lastPerformanceDate
                                                        }
                                                    </td>

                                                    <td className="px-2 py-2">
                                                        {
                                                            request.lastPerformanceIncrementPercentage.toFixed(
                                                                2,
                                                            ) + "%"
                                                        }
                                                    </td>

                                                    <td className="px-2 py-2">
                                                        {
                                                            formatCurrency(
                                                                request.lastPerformanceIncrementAmount,
                                                            )
                                                        }
                                                    </td>

                                                    <td className="px-2 py-2 font-semibold text-[#3511a4]">
                                                        {
                                                            request.currentIncrementPercentage.toFixed(
                                                                2,
                                                            )
                                                        }
                                                        %
                                                    </td>

                                                    <td className="px-2 py-2 font-semibold text-[#00965a]">
                                                        {
                                                            formatCurrency(
                                                                request.currentIncrementAmount,
                                                            )
                                                        }
                                                    </td>

                                                    <td className="px-2 py-2 font-semibold text-[#00965a]">
                                                        {
                                                            formatCurrency(
                                                                request.currentNewBasicSalary,
                                                            )
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
                                                                size={14}
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

                        {requests.length > 0 && (
                            <p className="px-3 py-2 text-[8px] text-gray-500">
                                * Click on trash icon to remove record
                                from list.
                            </p>
                        )}

                    </div>

                    {/* REQUEST SUMMARY */}
                    <aside className="rounded-md border border-[#e0e5ef] bg-white p-3">

                        <h3 className="text-[10px] font-extrabold text-[#3211a4]">
                            REQUEST SUMMARY
                        </h3>

                        <div className="mt-4 space-y-4 text-[9px]">

                            <SummaryRow
                                label="Total Employees Added"
                                value={totalEmployees}
                            />

                            <SummaryRow
                                label="Total Increment Amount"
                                value={`${formatCurrency(
                                    totalIncrementAmount,
                                )} BDT`}
                            />

                            <SummaryRow
                                label="Total Increment % (Avg.)"
                                value={`${averageIncrement.toFixed(
                                    2,
                                )} %`}
                            />

                        </div>

                        <div className="mt-5 rounded-md border border-[#ffe0a3] bg-[#fffaf0] px-3 py-2 text-[8px] leading-4 text-[#775300]">

                            <Info
                                size={13}
                                className="mr-1 inline"
                            />

                            Please review the list before
                            forwarding to Director.

                        </div>

                    </aside>

                </section>

                {/* ============================================================ */}
                {/* SECTION 5                                                      */}
                {/* ============================================================ */}

                <section className="mt-3 grid grid-cols-[175px_1fr_175px] items-center gap-3">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/employee-increment",
                            )
                        }
                        className="flex h-[35px] items-center justify-center gap-2 rounded-md border border-[#a98bea] bg-white px-4 text-[9px] font-bold text-[#5013d4]"
                    >
                        <ArrowLeft size={14} />

                        Back to Request Type
                    </button>

                    <RequestForwardingFlow/>

                    <button
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        disabled={
                            requests.length === 0
                        }
                        className="flex h-[35px] items-center justify-center gap-2 rounded-md bg-[#5013d4] px-4 text-[9px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Forward to Director
                    </button>
                </section>
            </main>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/* SMALL COMPONENTS                                                           */
/* -------------------------------------------------------------------------- */

interface InfoRowProps {
    label: string;
    value: React.ReactNode;
    valueClass?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({
    label,
    value,
    valueClass = "font-semibold text-[#17244e]",
}) => {
    return (
        <div className="flex items-start justify-between gap-2">

            <span className="text-[#39466d]">
                {label}
            </span>

            <span
                className={`text-right ${valueClass}`}
            >
                {value}
            </span>

        </div>
    );
};

interface SummaryRowProps {
    label: string;
    value: React.ReactNode;
}

const SummaryRow: React.FC<SummaryRowProps> = ({
    label,
    value,
}) => {
    return (
        <div className="flex items-center justify-between gap-2">

            <span className="text-[#53617e]">
                {label}
            </span>

            <span className="font-bold text-[#17244e]">
                {value}
            </span>

        </div>
    );
};

export default PerformanceIncrementRequest;