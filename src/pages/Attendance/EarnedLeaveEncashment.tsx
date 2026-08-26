import { useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    CircleUserRound,
    Info,
    LogOut,
    Send,
    Trash2,
} from "lucide-react";
import {
    useFieldArray,
    useForm,
} from "react-hook-form";

import type { Option } from "../../components/CommonInputFields";
import CommonInputField from "../../components/CommonInputFields";
import { api } from "../../api/client";
import { API_ROUTES } from "../../api/routes";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCurrentShift } from "./utls/getCurrentShifts";
import { usePost } from "../../hooks/usePost";
import toast from "react-hot-toast";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface Employee {
    id: string | number;
    employeeNameEnglish: string;
    employeeCode: string;
    designationName: string;
    departmentName: string;

    earnedLeaveBalance?: number;
    earnedLeaveAccruedThisYear?: number;
}

interface EncashmentRow {
    employeeId: string | number;
    employeeName: string;
    employeeCode: string;
    designationName: string;
    departmentName: string;

    earnedLeaveBalance: number;
    earnedLeaveAccruedThisYear: number;
    maximumEncashable: number;

    daysToBeEncashed: number;
    reason: string;
}

interface EarnedLeaveEncashmentForm {
    employeeId: string;
    requests: EncashmentRow[];
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

const EarnedLeaveEncashment = () => {
    const navigate = useNavigate();

    const { user } = useAuth();
    const { currentShift } = useCurrentShift();

    const [employeeOptions, setEmployeeOptions] =
        useState<Option[]>([]);

    const [searchedEmployees, setSearchedEmployees] =
        useState<Employee[]>([]);

    const [selectedEmployee, setSelectedEmployee] =
        useState<Employee | null>(null);

    const { mutate: ForwardToAttendanceCell } =
        usePost(API_ROUTES.LEAVE);

    /* ---------------------------------------------------------------------- */
    /* REACT HOOK FORM                                                        */
    /* ---------------------------------------------------------------------- */

    const {
        control,
        register,
        handleSubmit,
        setValue,
        reset,
    } = useForm<EarnedLeaveEncashmentForm>({
        defaultValues: {
            employeeId: "",
            requests: [],
        },
    });

    /* ---------------------------------------------------------------------- */
    /* FIELD ARRAY                                                            */
    /* ---------------------------------------------------------------------- */

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: "requests",
    });

    /* ---------------------------------------------------------------------- */
    /* SEARCH EMPLOYEE                                                        */
    /* Same pattern as ForwardLeaveRequest                                    */
    /* ---------------------------------------------------------------------- */

    const handleEmployeeSearch = async (
        searchText: string,
    ) => {
        if (!searchText.trim()) {
            setEmployeeOptions([]);
            setSearchedEmployees([]);
            return;
        }

        try {
            const response = await api.get<Employee[]>(
                `${API_ROUTES.EMPLOYEES}/search?searchText=${encodeURIComponent(
                    searchText.trim(),
                )}`,
            );

            const data = response.data ?? [];

            setSearchedEmployees(data);

            setEmployeeOptions(
                data.map((employee) => ({
                    label: `${employee.employeeCode} - ${employee.employeeNameEnglish}`,
                    value: employee.id,
                })),
            );
        } catch (error) {
            console.error(
                "Failed to search employees:",
                error,
            );

            setEmployeeOptions([]);
            setSearchedEmployees([]);
        }
    };

    /* ---------------------------------------------------------------------- */
    /* SELECT EMPLOYEE                                                        */
    /* ---------------------------------------------------------------------- */

    const handleEmployeeSelect = (
        option: Option,
    ) => {
        const employee = searchedEmployees.find(
            (item) =>
                String(item.id) ===
                String(option.value),
        );

        if (!employee) {
            return;
        }

        setSelectedEmployee(employee);
        setValue(
            "employeeId",
            String(employee.id),
        );
    };

    /* ---------------------------------------------------------------------- */
    /* ADD EMPLOYEE                                                           */
    /* ---------------------------------------------------------------------- */

    const handleAddEmployee = () => {
        if (!selectedEmployee) {
            return;
        }

        const alreadyExists = fields.some(
            (field) =>
                String(field.employeeId) ===
                String(selectedEmployee.id),
        );

        if (alreadyExists) {
            toast.error(
                "Employee already exists in the list.",
            );
            return;
        }

        const earnedLeaveBalance =
            selectedEmployee.earnedLeaveBalance ?? 0;

        const earnedLeaveAccruedThisYear =
            selectedEmployee.earnedLeaveAccruedThisYear ?? 0;

        /*
         * Maximum encashable = 50% of accrued earned leave.
         */
        const maximumEncashable =
            earnedLeaveAccruedThisYear / 2;

        append({
            employeeId: selectedEmployee.id,
            employeeName:
                selectedEmployee.employeeNameEnglish ?? "",
            employeeCode:
                selectedEmployee.employeeCode ?? "",
            designationName:
                selectedEmployee.designationName ?? "",
            departmentName:
                selectedEmployee.departmentName ?? "",

            earnedLeaveBalance,
            earnedLeaveAccruedThisYear,
            maximumEncashable,

            daysToBeEncashed: 0,
            reason: "",
        });

        /* Clear search */
        setValue("employeeId", "");
        setSelectedEmployee(null);
        setEmployeeOptions([]);
        setSearchedEmployees([]);
    };

    /* ---------------------------------------------------------------------- */
    /* CLEAR ALL                                                              */
    /* ---------------------------------------------------------------------- */

    const handleClearAll = () => {
        reset({
            employeeId: "",
            requests: [],
        });

        setSelectedEmployee(null);
        setEmployeeOptions([]);
        setSearchedEmployees([]);
    };

    /* ---------------------------------------------------------------------- */
    /* SUBMIT                                                                 */
    /* ---------------------------------------------------------------------- */

    const onSubmit = async (
        data: EarnedLeaveEncashmentForm,
    ) => {
        const payload = {
            requests: data.requests.map(
                (request) => ({
                    employeeId: String(
                        request.employeeId,
                    ),
                    employeeName:
                        request.employeeName,
                    earnedLeaveBalance:
                        request.earnedLeaveBalance,
                    earnedLeaveAccruedThisYear:
                        request.earnedLeaveAccruedThisYear,
                    maximumEncashable:
                        request.maximumEncashable,
                    daysToBeEncashed:
                        request.daysToBeEncashed,
                    reason: request.reason,
                    forwardedBy:
                        user?.userName,
                    forwardedDate: new Date()
                        .toISOString()
                        .split("T")[0],
                }),
            ),

            createdBy: user?.userName,
        };

        console.log(
            "Earned Leave Encashment Payload:",
            payload,
        );

        ForwardToAttendanceCell(payload, {
            onSuccess: (response) => {
                toast.success(
                    response.message ||
                        "Leave encashment forwarded successfully!",
                );

                handleClearAll();
            },

            onError: (error) => {
                toast.error(
                    error.message ||
                        "Failed to forward leave encashment.",
                );
            },
        });
    };

    /* ---------------------------------------------------------------------- */
    /* DATE                                                                    */
    /* ---------------------------------------------------------------------- */

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

    /* ---------------------------------------------------------------------- */
    /* LOGOUT                                                                  */
    /* ---------------------------------------------------------------------- */

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    /* ---------------------------------------------------------------------- */
    /* RENDER                                                                  */
    /* ---------------------------------------------------------------------- */

    return (
        <div className="min-h-screen bg-[#f8faff] text-[#172554]">

            {/* ================================================================== */}
            {/* HEADER                                                              */}
            {/* ================================================================== */}

            <header className="flex h-[74px] items-center justify-between bg-[#001744] px-8 text-white">

                <div className="flex items-center gap-5">

                    {/* Logo */}
                    <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center">
                            <div className="text-4xl font-bold text-[#00a9e8]">
                                S
                            </div>
                        </div>

                        <div>
                            <h1 className="text-[25px] font-bold leading-none tracking-wide">
                                SYNEXIS
                            </h1>

                            <p className="mt-1 text-[11px] font-medium text-[#00c6ed]">
                                Creating Enterprise Synergy
                            </p>
                        </div>

                    </div>

                    <div className="h-12 w-px bg-[#12618b]" />

                    {/* Page title */}
                    <div>
                        <h2 className="text-[20px] font-bold tracking-wide">
                            LEAVE ENCASHMENT
                        </h2>

                        <p className="text-sm font-medium text-[#00c9ed]">
                            Forward Earned Leave Encashment to Attendance Cell
                        </p>
                    </div>

                </div>

                {/* User */}
                <div className="flex items-center gap-4">

                    <CircleUserRound
                        size={43}
                        strokeWidth={1.5}
                    />

                    <div>
                        <p className="text-sm font-bold">
                            {user?.userName}
                        </p>

                        <p className="text-xs text-[#00c9ed]">
                            Weaving Section -{" "}
                            {currentShift?.shiftName
                                ?.split("-")[0]}{" "}
                            Shift
                        </p>
                    </div>

                    <div className="mx-2 h-10 w-px bg-[#12618b]" />

                    <button
                        type="button"
                        className="flex cursor-pointer flex-col items-center gap-1 text-xs"
                        onClick={handleLogout}
                    >
                        <LogOut
                            size={20}
                            className="text-[#00c9ed]"
                        />

                        <span>Logout</span>
                    </button>

                </div>

            </header>

            {/* ================================================================== */}
            {/* MAIN                                                                */}
            {/* ================================================================== */}

            <main className="px-9 py-4">

                {/* Back / Date */}
                <div className="mb-3 flex items-center justify-between">

                    <button
                        type="button"
                        className="flex items-center gap-2 text-sm font-semibold text-[#1554d1]"
                        onClick={() =>
                            navigate("/leave-encashment")
                        }
                    >
                        <ArrowLeft size={20} />

                        Back to Leave Encashment
                    </button>

                    <div className="flex items-center gap-3 rounded-md border border-[#dce3f0] bg-white px-5 py-2 text-sm font-semibold">

                        <CalendarDays size={18} />

                        <span>
                            {formattedDate}
                        </span>

                        <span className="text-gray-400">
                            |
                        </span>

                        <span>
                            {dayName}
                        </span>

                    </div>

                </div>

                {/* ================================================================== */}
                {/* MAIN CARD                                                          */}
                {/* ================================================================== */}

                <div className="rounded-md border border-[#dfe5ef] bg-white shadow-sm">

                    {/* ============================================================= */}
                    {/* ADD EMPLOYEE                                                    */}
                    {/* ============================================================= */}

                    <section className="border-b border-[#e5e9f1] px-4 py-3">

                        <h3 className="mb-3 text-sm font-bold text-[#16244d]">
                            ADD EMPLOYEE FOR LEAVE ENCASHMENT
                        </h3>

                        <div className="flex items-end gap-5">

                            <div className="w-[307px]">

                                <CommonInputField
                                    label="Search Employee by ID or Name"
                                    name="employeeId"
                                    register={register}
                                    control={control}
                                    errors={{}}
                                    type="searchable-dropdown"
                                    options={employeeOptions}
                                    placeholder="Enter Employee ID or Name"
                                    onSearchChange={
                                        handleEmployeeSearch
                                    }
                                    onOptionSelect={
                                        handleEmployeeSelect
                                    }
                                />

                            </div>

                            <button
                                type="button"
                                onClick={handleAddEmployee}
                                disabled={!selectedEmployee}
                                className="mb-[1px] flex h-[35px] min-w-[118px] items-center justify-center rounded-md bg-[#0752d8] px-5 text-xs font-semibold text-white transition hover:bg-[#0646b9] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Add to List
                            </button>

                        </div>

                    </section>

                    {/* ============================================================= */}
                    {/* TABLE FORM                                                      */}
                    {/* ============================================================= */}

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                    >

                        <section className="px-4 pb-3 pt-3">

                            <h3 className="mb-2 text-sm font-bold text-[#078d79]">
                                LEAVE ENCASHMENT REQUEST LIST
                            </h3>

                            <div className="overflow-hidden rounded-md border border-[#e1e6ef]">

                                <table className="w-full border-collapse text-xs">

                                    {/* TABLE HEADER */}
                                    <thead>
                                        <tr className="bg-[#001c49] text-white">

                                            <th className="w-[42px] px-2 py-3 text-center">
                                                #
                                            </th>

                                            <th className="w-[85px] px-2 py-3 text-left">
                                                Emp ID
                                            </th>

                                            <th className="w-[150px] px-2 py-3 text-left">
                                                Employee Name
                                            </th>

                                            <th className="w-[125px] px-2 py-3 text-center">
                                                Total Earned
                                                <br />
                                                Leave Balance
                                                <Info
                                                    size={13}
                                                    className="ml-1 inline"
                                                />
                                            </th>

                                            <th className="w-[135px] px-2 py-3 text-center">
                                                Earned Leave
                                                <br />
                                                Accrued This Year
                                                <br />
                                                (2024)
                                                <Info
                                                    size={13}
                                                    className="ml-1 inline"
                                                />
                                            </th>

                                            <th className="w-[145px] px-2 py-3 text-center">
                                                Maximum Encashable
                                                <br />
                                                (50% of Accrued)
                                                <Info
                                                    size={13}
                                                    className="ml-1 inline"
                                                />
                                            </th>

                                            <th className="w-[120px] px-2 py-3 text-center">
                                                Days to be
                                                <br />
                                                Encash
                                                <Info
                                                    size={13}
                                                    className="ml-1 inline"
                                                />
                                            </th>

                                            <th className="w-[150px] px-2 py-3 text-left">
                                                Reason
                                            </th>

                                            <th className="w-[60px] px-2 py-3 text-center">
                                                Action
                                            </th>

                                        </tr>
                                    </thead>

                                    {/* TABLE BODY */}
                                    <tbody>

                                        {fields.length === 0 ? (

                                            <tr>
                                                <td
                                                    colSpan={9}
                                                    className="py-12 text-center text-sm text-gray-400"
                                                >
                                                    Search and select an employee
                                                    to add to the encashment list.
                                                </td>
                                            </tr>

                                        ) : (

                                            fields.map(
                                                (field, index) => (
                                                    <tr
                                                        key={field.id}
                                                        className="border-b border-[#e6eaf1] last:border-b-0"
                                                    >

                                                        {/* # */}
                                                        <td className="px-2 py-2 text-center font-medium">
                                                            {index + 1}
                                                        </td>

                                                        {/* EMP ID */}
                                                        <td className="px-2 py-2 font-semibold text-[#1554d1]">
                                                            {field.employeeCode}

                                                            <input
                                                                type="hidden"
                                                                {...register(
                                                                    `requests.${index}.employeeId`,
                                                                )}
                                                            />
                                                        </td>

                                                        {/* EMPLOYEE NAME */}
                                                        <td className="px-2 py-2">
                                                            <span className="font-medium">
                                                                {
                                                                    field.employeeName
                                                                }
                                                            </span>

                                                            <input
                                                                type="hidden"
                                                                {...register(
                                                                    `requests.${index}.employeeName`,
                                                                )}
                                                            />

                                                            <input
                                                                type="hidden"
                                                                {...register(
                                                                    `requests.${index}.employeeCode`,
                                                                )}
                                                            />

                                                            <input
                                                                type="hidden"
                                                                {...register(
                                                                    `requests.${index}.designationName`,
                                                                )}
                                                            />

                                                            <input
                                                                type="hidden"
                                                                {...register(
                                                                    `requests.${index}.departmentName`,
                                                                )}
                                                            />

                                                        </td>

                                                        {/* TOTAL EARNED LEAVE BALANCE */}
                                                        <td className="px-2 py-2 text-center font-semibold text-[#078d72]">
                                                            {
                                                                field.earnedLeaveBalance
                                                            }

                                                            <input
                                                                type="hidden"
                                                                {...register(
                                                                    `requests.${index}.earnedLeaveBalance`,
                                                                    {
                                                                        valueAsNumber: true,
                                                                    },
                                                                )}
                                                            />
                                                        </td>

                                                        {/* ACCRUED THIS YEAR */}
                                                        <td className="px-2 py-2 text-center font-semibold text-[#1554d1]">
                                                            {
                                                                field.earnedLeaveAccruedThisYear
                                                            }

                                                            <input
                                                                type="hidden"
                                                                {...register(
                                                                    `requests.${index}.earnedLeaveAccruedThisYear`,
                                                                    {
                                                                        valueAsNumber: true,
                                                                    },
                                                                )}
                                                            />
                                                        </td>

                                                        {/* MAXIMUM ENCASHABLE */}
                                                        <td className="px-2 py-2 text-center font-semibold text-[#1554d1]">
                                                            {
                                                                field.maximumEncashable
                                                            }

                                                            <input
                                                                type="hidden"
                                                                {...register(
                                                                    `requests.${index}.maximumEncashable`,
                                                                    {
                                                                        valueAsNumber: true,
                                                                    },
                                                                )}
                                                            />
                                                        </td>

                                                        {/* DAYS TO BE ENCASHED */}
                                                        <td className="px-2 py-2">

                                                            <input
                                                                type="number"
                                                                min={0}
                                                                max={
                                                                    field.maximumEncashable
                                                                }
                                                                step="0.5"
                                                                {...register(
                                                                    `requests.${index}.daysToBeEncashed`,
                                                                    {
                                                                        valueAsNumber: true,
                                                                    },
                                                                )}
                                                                className="h-[32px] w-full rounded-md border border-[#d6deeb] px-3 text-center text-xs outline-none focus:border-[#2862d3]"
                                                            />

                                                        </td>

                                                        {/* REASON */}
                                                        <td className="px-2 py-2">

                                                            <input
                                                                type="text"
                                                                {...register(
                                                                    `requests.${index}.reason`,
                                                                )}
                                                                placeholder="Enter reason"
                                                                className="h-[32px] w-full rounded-md border border-[#d6deeb] px-3 text-xs outline-none focus:border-[#2862d3]"
                                                            />

                                                        </td>

                                                        {/* ACTION */}
                                                        <td className="px-2 py-2 text-center">

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    remove(
                                                                        index,
                                                                    )
                                                                }
                                                                className="text-red-500 transition hover:text-red-700"
                                                                title="Remove"
                                                            >
                                                                <Trash2
                                                                    size={18}
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

                        </section>

                        {/* ============================================================= */}
                        {/* FOOTER ACTIONS                                                  */}
                        {/* ============================================================= */}

                        <section className="flex items-center justify-between gap-5 px-4 pb-4">

                            <div className="flex flex-1 items-center gap-3 rounded-md border border-[#dce4f1] bg-[#f8faff] px-4 py-2">

                                <Info
                                    size={21}
                                    className="shrink-0 text-[#155bd1]"
                                />

                                <div>

                                    <p className="text-xs font-bold text-[#1554d1]">
                                        Note:
                                    </p>

                                    <ul className="mt-0.5 list-disc pl-4 text-[11px] text-[#53678f]">
                                        <li>
                                            Leave can be encashed only once in a year.
                                        </li>
                                        <li>
                                            Maximum encashment is 50% of Earned Leave Accrued in the current year.
                                        </li>
                                        <li>
                                            Days to be encashed cannot exceed the Maximum Encashable limit.
                                        </li>
                                    </ul>

                                </div>

                            </div>

                            <div className="flex flex-col items-end gap-2">

                                <div className="text-xs font-semibold">
                                    Total Employees:
                                    <span className="ml-2 font-bold text-[#008c72]">
                                        {fields.length}
                                    </span>
                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={handleClearAll}
                                className="flex h-[42px] items-center gap-2 rounded-md border border-red-400 bg-white px-7 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                            >
                                <Trash2 size={16} />
                                Clear All
                            </button>

                            <button
                                type="submit"
                                disabled={fields.length === 0}
                                className="flex h-[42px] min-w-[260px] items-center justify-center gap-2 rounded-md bg-[#008c72] px-7 text-xs font-semibold text-white transition hover:bg-[#007960] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Send size={17} />
                                Forward to Attendance Cell
                            </button>

                        </section>

                    </form>

                </div>

            </main>
        </div>
    );
};

export default EarnedLeaveEncashment;
