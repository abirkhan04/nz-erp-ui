import { useMemo, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    Info,
    LogOut,
    Send,
    Trash2,
} from "lucide-react";
import {
    useFieldArray,
    useForm,
    useWatch,
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

type LeaveType =
    | "Casual Leave"
    | "Earned Leave"
    | "Medical Leave";

interface Employee {
    id: string | number;
    employeeNameEnglish: string;
    employeeCode: string;
    designationName: string;
    departmentName: string;

    casualLeaveBalance?: number;
    earnedLeaveBalance?: number;
    medicalLeaveBalance?: number;
}

interface LeaveRequestRow {
    employeeId: string | number;
    employeeName: string;
    employeeCode: string;
    designationName: string;
    departmentName: string;

    leaveType: LeaveType;
    fromDate: string;
    toDate: string;

    leaveBalance: number;

    /*
     * Keep all balances in the row so changing
     * leave type does not depend on the search list.
     */
    casualLeaveBalance: number;
    earnedLeaveBalance: number;
    medicalLeaveBalance: number;

    reason: string;
}

interface ForwardLeaveForm {
    /*
     * This field is only used for employee searching.
     */
    employeeId: string;

    leaveRequests: LeaveRequestRow[];
}

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const leaveTypeOptions: Option[] = [
    {
        label: "Casual Leave",
        value: "Casual Leave",
    },
    {
        label: "Earned Leave",
        value: "Earned Leave",
    },
    {
        label: "Medical Leave",
        value: "Medical Leave",
    },
];

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const calculateDays = (
    fromDate?: string,
    toDate?: string,
) => {
    if (!fromDate || !toDate) {
        return 0;
    }

    const from = new Date(`${fromDate}T00:00:00`);
    const to = new Date(`${toDate}T00:00:00`);

    if (to < from) {
        return 0;
    }

    return (
        Math.floor(
            (to.getTime() - from.getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 1
    );
};

const getLeaveBalance = (
    employee: Employee,
    leaveType: LeaveType,
) => {
    switch (leaveType) {
        case "Casual Leave":
            return employee.casualLeaveBalance ?? 0;

        case "Earned Leave":
            return employee.earnedLeaveBalance ?? 0;

        case "Medical Leave":
            return employee.medicalLeaveBalance ?? 0;

        default:
            return 0;
    }
};

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

const ForwardLeaveRequest = () => {
    const [employeeOptions, setEmployeeOptions] =
        useState<Option[]>([]);

    const { mutate: ForwardToAttendanceCell } = usePost(API_ROUTES.LEAVE);

    const [searchedEmployees, setSearchedEmployees] =
        useState<Employee[]>([]);
    const { user } = useAuth();
    /* ------------------------------------------------------------------------ */
    /* REACT HOOK FORM                                                          */
    /* ------------------------------------------------------------------------ */

    const {
        control,
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<ForwardLeaveForm>({
        defaultValues: {
            employeeId: "",
            leaveRequests: [],
        },
    });

    /* ------------------------------------------------------------------------ */
    /* FIELD ARRAY                                                              */
    /* ------------------------------------------------------------------------ */

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: "leaveRequests",
    });

    /* ------------------------------------------------------------------------ */
    /* WATCH TABLE ROWS                                                         */
    /* ------------------------------------------------------------------------ */

    const leaveRequests =
        useWatch({
            control,
            name: "leaveRequests",
        }) ?? [];

    /* ------------------------------------------------------------------------ */
    /* SEARCH EMPLOYEE                                                          */
    /* ------------------------------------------------------------------------ */

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
                `${API_ROUTES.EMPLOYEE_MASTERS}/basic-information?searchText=${encodeURIComponent(
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

    /* ------------------------------------------------------------------------ */
    /* SELECT EMPLOYEE                                                          */
    /* ------------------------------------------------------------------------ */

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

        /* Prevent duplicate employees */

        const alreadyExists = fields.some(
            (field) =>
                String(field.employeeId) ===
                String(employee.id),
        );

        if (alreadyExists) {
            setValue("employeeId", "");
            setEmployeeOptions([]);
            setSearchedEmployees([]);
            return;
        }

        /* Add employee directly to table */

        append({
            employeeId: employee.id,

            employeeName:
                employee.employeeNameEnglish ?? "",

            employeeCode:
                employee.employeeCode ?? "",

            designationName:
                employee.designationName ?? "",

            departmentName:
                employee.departmentName ?? "",

            leaveType: "Casual Leave",

            fromDate: "",
            toDate: "",

            casualLeaveBalance:
                employee.casualLeaveBalance ?? 0,

            earnedLeaveBalance:
                employee.earnedLeaveBalance ?? 0,

            medicalLeaveBalance:
                employee.medicalLeaveBalance ?? 0,

            leaveBalance: getLeaveBalance(
                employee,
                "Casual Leave",
            ),

            reason: "",
        });

        /* Clear search field */

        setValue("employeeId", "");

        setEmployeeOptions([]);
        setSearchedEmployees([]);
    };

    /* ------------------------------------------------------------------------ */
    /* CHANGE LEAVE TYPE                                                        */
    /* ------------------------------------------------------------------------ */

    const handleLeaveTypeChange = (
        index: number,
        leaveType: LeaveType,
    ) => {
        const row = leaveRequests[index];

        if (!row) {
            return;
        }

        let balance = 0;

        switch (leaveType) {
            case "Casual Leave":
                balance = row.casualLeaveBalance ?? 0;
                break;

            case "Earned Leave":
                balance = row.earnedLeaveBalance ?? 0;
                break;

            case "Medical Leave":
                balance = row.medicalLeaveBalance ?? 0;
                break;

            default:
                balance = 0;
        }

        setValue(
            `leaveRequests.${index}.leaveType`,
            leaveType,
        );

        setValue(
            `leaveRequests.${index}.leaveBalance`,
            balance,
        );
    };

    /* ------------------------------------------------------------------------ */
    /* SUBMIT                                                                   */
    /* ------------------------------------------------------------------------ */

    const onSubmit = async (
        data: ForwardLeaveForm,
    ) => {
        const payload = {
            requests: data.leaveRequests.map((request) => ({
                employeeId: String(request.employeeId),
                employeeName: request.employeeName,
                leaveType: request.leaveType,
                fromDate: request.fromDate,
                toDate: request.toDate,
                reason: request.reason,
                forwardedBy: user?.userName,
                forwardedDate: new Date()
                    .toISOString()
                    .split("T")[0],
            })),

            createdBy: user?.userName,
        };

        console.log(
            "Forward Leave Request Payload:",
            payload,
        );
        ForwardToAttendanceCell(payload, {
            onSuccess: (response) => {
                toast.success(response.message || "Review submitted to IT successfully!");
                handleClearAll();
            },
            onError: (error) => {
                toast.error(error.message || "Failed to submit review.");
            },
        });
    };

    /* ------------------------------------------------------------------------ */
    /* CLEAR ALL                                                                */
    /* ------------------------------------------------------------------------ */

    const handleClearAll = () => {
        reset({
            employeeId: "",
            leaveRequests: [],
        });

        setEmployeeOptions([]);
        setSearchedEmployees([]);
    };

    /* ------------------------------------------------------------------------ */
    /* TOTAL DAYS                                                               */
    /* ------------------------------------------------------------------------ */

    const totalDays = useMemo(() => {
        return leaveRequests.reduce(
            (total, row) =>
                total +
                calculateDays(
                    row?.fromDate,
                    row?.toDate,
                ),
            0,
        );
    }, [leaveRequests]);

    /* ------------------------------------------------------------------------ */
    /* DATE                                                                     */
    /* ------------------------------------------------------------------------ */

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

    /* ------------------------------------------------------------------------ */
    /* RENDER                                                                   */
    /* ------------------------------------------------------------------------ */
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const { currentShift } = useCurrentShift();

    return (
        <div className="min-h-screen bg-[#f8faff] text-[#172554]">

            {/* ====================================================================
          HEADER
          ==================================================================== */}

            <header className="flex h-[74px] items-center justify-between bg-[#001744] px-8 text-white">

                <div className="flex items-center gap-5">

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

                    <div>
                        <h2 className="text-[20px] font-bold tracking-wide">
                            FORWARD LEAVE REQUEST
                        </h2>

                        <p className="text-sm font-medium text-[#00c9ed]">
                            Forward Leave Requests to Attendance Cell
                        </p>
                    </div>

                </div>

                <div className="flex items-center gap-4">

                    {/* <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#3d668e]">
                        <span className="text-lg font-semibold">
                            JH
                        </span>
                    </div> */}

                    <div>
                        <p className="text-sm font-bold">
                            {user?.userName}
                        </p>

                        <p className="text-xs text-[#00c9ed]">
                            Weaving Section - {currentShift?.shiftName.split("-")[0]} Shift
                        </p>
                    </div>

                    <div className="mx-2 h-10 w-px bg-[#12618b]" />

                    <button
                        type="button"
                        className="flex flex-col items-center gap-1 text-xs cursor-pointer"
                        onClick={() => handleLogout()}

                    >
                        <LogOut
                            size={20}
                            className="text-[#00c9ed]"
                        />

                        <span>Logout</span>
                    </button>

                </div>

            </header>

            {/* ====================================================================
          MAIN
          ==================================================================== */}

            <main className="px-9 py-4">

                {/* Back / Date */}

                <div className="mb-3 flex items-center justify-between">

                    <button
                        type="button"
                        className="flex items-center gap-2 text-sm font-semibold text-[#1554d1]"
                        onClick={() => navigate("/leave-portal")}
                    >
                        <ArrowLeft size={20} />

                        Back to Leave Portal
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

                {/* ==================================================================
            MAIN CARD
            ================================================================== */}

                <div className="rounded-md border border-[#dfe5ef] bg-white shadow-sm">

                    {/* ================================================================
              ADD EMPLOYEE
              ================================================================ */}

                    <section className="border-b border-[#e5e9f1] px-4 py-3">

                        <h3 className="mb-3 text-sm font-bold text-[#16244d]">
                            ADD EMPLOYEE LEAVE REQUEST
                        </h3>

                        <div className="flex items-end gap-4">

                            <div className="w-[360px]">

                                <CommonInputField
                                    label="Search Employee"
                                    name="employeeId"
                                    register={register}
                                    control={control}
                                    errors={errors}
                                    type="searchable-dropdown"
                                    options={employeeOptions}
                                    placeholder="Search by Employee ID or Name"
                                    onSearchChange={
                                        handleEmployeeSearch
                                    }
                                    onOptionSelect={
                                        handleEmployeeSelect
                                    }
                                />

                            </div>

                        </div>

                    </section>

                    {/* ================================================================
              TABLE FORM
              ================================================================ */}

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                    >

                        <section className="px-4 pb-3 pt-3">

                            <h3 className="mb-2 text-sm font-bold text-[#078d79]">
                                LEAVE REQUEST LIST
                            </h3>

                            <div className="overflow-hidden rounded-md border border-[#e1e6ef]">

                                <table className="w-full border-collapse text-xs">

                                    {/* ========================================================
                      TABLE HEADER
                      ======================================================== */}

                                    <thead>

                                        <tr className="bg-[#001c49] text-white">

                                            <th className="w-[45px] px-3 py-3 text-center">
                                                #
                                            </th>

                                            <th className="w-[90px] px-3 py-3 text-left">
                                                Emp ID
                                            </th>

                                            <th className="w-[180px] px-3 py-3 text-left">
                                                Employee Name
                                            </th>

                                            <th className="w-[160px] px-3 py-3 text-left">
                                                Leave Type
                                            </th>

                                            <th className="w-[140px] px-3 py-3 text-left">
                                                From Date
                                            </th>

                                            <th className="w-[140px] px-3 py-3 text-left">
                                                To Date
                                            </th>

                                            <th className="w-[120px] px-3 py-3 text-center">
                                                Leave Balance
                                            </th>

                                            <th className="w-[100px] px-3 py-3 text-center">
                                                Total Days
                                            </th>

                                            <th className="w-[160px] px-3 py-3 text-left">
                                                Reason
                                            </th>

                                            <th className="w-[60px] px-3 py-3 text-center">
                                                Action
                                            </th>

                                        </tr>

                                    </thead>

                                    {/* ========================================================
                      TABLE BODY
                      ======================================================== */}

                                    <tbody>

                                        {fields.length === 0 ? (

                                            <tr>

                                                <td
                                                    colSpan={10}
                                                    className="py-10 text-center text-sm text-gray-400"
                                                >
                                                    Search and select an employee
                                                    to add a leave request.
                                                </td>

                                            </tr>

                                        ) : (

                                            fields.map(
                                                (field, index) => {

                                                    const row =
                                                        leaveRequests[index];


                                                    const days =
                                                        calculateDays(
                                                            row?.fromDate,
                                                            row?.toDate,
                                                        );

                                                    return (

                                                        <tr
                                                            key={field.id}
                                                            className="border-b border-[#e6eaf1] last:border-b-0"
                                                        >

                                                            {/* # */}

                                                            <td className="px-3 py-2 text-center font-medium">
                                                                {index + 1}
                                                            </td>

                                                            {/* Employee ID */}

                                                            <td className="px-3 py-2 font-semibold text-[#1554d1]">

                                                                {field.employeeCode}

                                                                <input
                                                                    type="hidden"
                                                                    {...register(
                                                                        `leaveRequests.${index}.employeeId`,
                                                                    )}
                                                                />

                                                            </td>

                                                            {/* Employee Name */}

                                                            <td className="px-3 py-2">

                                                                <div className="font-medium">
                                                                    {field.employeeName}
                                                                </div>

                                                                <input
                                                                    type="hidden"
                                                                    {...register(
                                                                        `leaveRequests.${index}.employeeName`,
                                                                    )}
                                                                />

                                                                <input
                                                                    type="hidden"
                                                                    {...register(
                                                                        `leaveRequests.${index}.employeeCode`,
                                                                    )}
                                                                />

                                                                <input
                                                                    type="hidden"
                                                                    {...register(
                                                                        `leaveRequests.${index}.designationName`,
                                                                    )}
                                                                />

                                                                <input
                                                                    type="hidden"
                                                                    {...register(
                                                                        `leaveRequests.${index}.departmentName`,
                                                                    )}
                                                                />

                                                                <input
                                                                    type="hidden"
                                                                    {...register(
                                                                        `leaveRequests.${index}.casualLeaveBalance`,
                                                                        {
                                                                            valueAsNumber: true,
                                                                        },
                                                                    )}
                                                                />

                                                                <input
                                                                    type="hidden"
                                                                    {...register(
                                                                        `leaveRequests.${index}.earnedLeaveBalance`,
                                                                        {
                                                                            valueAsNumber: true,
                                                                        },
                                                                    )}
                                                                />

                                                                <input
                                                                    type="hidden"
                                                                    {...register(
                                                                        `leaveRequests.${index}.medicalLeaveBalance`,
                                                                        {
                                                                            valueAsNumber: true,
                                                                        },
                                                                    )}
                                                                />

                                                            </td>

                                                            {/* Leave Type */}

                                                            <td className="px-3 py-2">

                                                                <select
                                                                    {...register(
                                                                        `leaveRequests.${index}.leaveType`,
                                                                        {
                                                                            onChange: (
                                                                                event,
                                                                            ) => {
                                                                                handleLeaveTypeChange(
                                                                                    index,
                                                                                    event.target
                                                                                        .value as LeaveType,
                                                                                );
                                                                            },
                                                                        },
                                                                    )}
                                                                    className="h-[32px] w-full rounded-md border border-[#d6deeb] bg-white px-2 text-xs outline-none focus:border-[#2862d3]"
                                                                >

                                                                    {leaveTypeOptions.map(
                                                                        (option) => (
                                                                            <option
                                                                                key={
                                                                                    option.value
                                                                                }
                                                                                value={
                                                                                    option.value
                                                                                }
                                                                            >
                                                                                {option.label}
                                                                            </option>
                                                                        ),
                                                                    )}

                                                                </select>

                                                            </td>

                                                            {/* From Date */}

                                                            <td className="px-3 py-2">
                                                                <CommonInputField
                                                                    label=""
                                                                    name={`leaveRequests.${index}.fromDate`}
                                                                    register={register}
                                                                    control={control}
                                                                    errors={errors}
                                                                    type="date"
                                                                    className="w-full"
                                                                />
                                                            </td>

                                                            {/* To Date */}

                                                            <td className="px-3 py-2">
                                                                <CommonInputField
                                                                    label=""
                                                                    name={`leaveRequests.${index}.toDate`}
                                                                    register={register}
                                                                    control={control}
                                                                    errors={errors}
                                                                    type="date"
                                                                    className="w-full"
                                                                />
                                                            </td>

                                                            {/* Leave Balance */}

                                                            <td className="px-3 py-2">

                                                                <div className="flex h-[32px] items-center justify-center rounded-md border border-[#d6deeb] bg-[#f8faff] font-semibold text-[#078d72]">
                                                                    {row?.leaveBalance ?? 0}
                                                                </div>

                                                                <input
                                                                    type="hidden"
                                                                    {...register(
                                                                        `leaveRequests.${index}.leaveBalance`,
                                                                        {
                                                                            valueAsNumber: true,
                                                                        },
                                                                    )}
                                                                />

                                                            </td>

                                                            {/* Total Days */}

                                                            <td className="px-3 py-2">

                                                                <div className="flex h-[32px] items-center justify-center rounded-md border border-[#d6deeb] bg-[#f8faff] font-medium">
                                                                    {days}
                                                                </div>

                                                            </td>

                                                            {/* Reason */}

                                                            <td className="px-3 py-2">

                                                                <input
                                                                    type="text"
                                                                    {...register(
                                                                        `leaveRequests.${index}.reason`,
                                                                    )}
                                                                    placeholder="Enter reason"
                                                                    className="h-[32px] w-full rounded-md border border-[#d6deeb] px-3 text-xs outline-none focus:border-[#2862d3]"
                                                                />

                                                            </td>

                                                            {/* Action */}

                                                            <td className="px-3 py-2 text-center">

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        remove(index)
                                                                    }
                                                                    className="text-red-500 transition hover:text-red-700"
                                                                    title="Remove"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>

                                                            </td>

                                                        </tr>

                                                    );
                                                },
                                            )

                                        )}

                                    </tbody>

                                    {/* ========================================================
                      FOOTER
                      ======================================================== */}

                                    {fields.length > 0 && (

                                        <tfoot>

                                            <tr className="bg-[#f8faff]">

                                                <td
                                                    colSpan={7}
                                                    className="px-3 py-3 text-right font-semibold"
                                                >
                                                    Total Employees:

                                                    <span className="ml-2 font-bold text-[#008c72]">
                                                        {fields.length}
                                                    </span>
                                                </td>

                                                <td className="px-3 py-3 text-center font-semibold">

                                                    <span>
                                                        {totalDays}
                                                    </span>

                                                </td>

                                                <td colSpan={2} />

                                            </tr>

                                        </tfoot>

                                    )}

                                </table>

                            </div>

                        </section>

                        {/* ===============================================================
                FOOTER ACTIONS
                =============================================================== */}

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

                                    <p className="mt-0.5 text-[11px] text-[#53678f]">
                                        Please verify the details
                                        before forwarding to
                                        Attendance Cell.
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={handleClearAll}
                                className="flex h-[35px] items-center gap-2 rounded-md border border-red-400 bg-white px-6 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                            >
                                <Trash2 size={16} />

                                Clear All
                            </button>

                            <button
                                type="submit"
                                disabled={fields.length === 0}
                                className="flex h-[35px] min-w-[275px] items-center justify-center gap-2 rounded-md bg-[#008c72] px-7 text-xs font-semibold text-white transition hover:bg-[#007960] disabled:cursor-not-allowed disabled:opacity-50"
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

export default ForwardLeaveRequest;