import React, { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Info,
    Send,
    Trash2,
    Target,
    ShieldCheck,
    Settings2,
} from "lucide-react";
import { useGet } from "../../hooks/useGet";
import { API_ROUTES } from "../../api/routes";
import AddNewEmployee from "./AddNewEmployee";
import type { NewEmployee } from "./AddNewEmployee";
import { usePost } from "../../hooks/usePost";
import toast from "react-hot-toast";

interface PreviousShiftEmployee {
    employeeId: string;
    employeeName: string;
    employeeCode: string;
    designationId: string | null;
    designationName: string;
    departmentId: string;
    departmentName: string;
}

const footerItems = [
    {
        title: "ACCURATE",
        subtitle: "Ensure accurate data",
        icon: Target,
    },
    {
        title: "RELIABLE",
        subtitle: "Ensure reliability",
        icon: ShieldCheck,
    },
    {
        title: "INTEGRATED",
        subtitle: "Ensure integration",
        icon: Settings2,
    },
];

const ITEMS_PER_PAGE = 5;

const OTForwardingPage: React.FC = () => {
    const { data: shifts = [] } = useGet<any[]>({
        key: ["shifts"],
        url: `${API_ROUTES.SHIFTS}?includeInactive=false`,
    });

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const selectedId = user.employeeId;

    const { data: employee = {} } = useGet<any>({
        key: ["activationSummary", selectedId],
        url: `${API_ROUTES.EMPLOYEES}/employee-detail/${selectedId}`,
        enabled: !!selectedId,
    });

    const { mutate: ForwardToTimeCell } = usePost(API_ROUTES.OVERTIME_REQUESTS);

    const rosterShifts = shifts?.filter(
        (shift) => shift.shiftType === "Roster" && shift.isActive
    );

    const getCurrentShift = () => {
        const now = new Date();

        const currentMinutes =
            now.getHours() * 60 + now.getMinutes();

        return rosterShifts?.find((shift) => {
            const [startHour, startMinute] = shift.startTime
                .split(":")
                .map(Number);

            const [endHour, endMinute] = shift.endTime
                .split(":")
                .map(Number);

            const startMinutes =
                startHour * 60 + startMinute;

            let endMinutes =
                endHour * 60 + endMinute;

            if (endMinutes <= startMinutes) {
                endMinutes += 24 * 60;
            }

            let current = currentMinutes;

            if (
                current < startMinutes &&
                endMinutes > 24 * 60
            ) {
                current += 24 * 60;
            }

            return (
                current >= startMinutes &&
                current < endMinutes
            );
        });
    };

    const currentShift = getCurrentShift();

    const shiftId = currentShift?.id;
    const departmentId = employee.departmentId;

    const {
        data: previousShiftEmployees = [],
    } = useGet<PreviousShiftEmployee[]>({
        key: [
            "previouseShiftEmployees",
            shiftId,
            departmentId,
        ],
        url: `${API_ROUTES.OVERTIME_REQUESTS}/employees/shift/${shiftId}/department/${departmentId}`,
        enabled: !!shiftId && !!departmentId,
    });

    const [currentPage, setCurrentPage] = useState(1);

    const [
        selectedEmployees,
        setSelectedEmployees,
    ] = useState<PreviousShiftEmployee[]>([]);

    const [
        newlyAddedEmployees,
        setNewlyAddedEmployees,
    ] = useState<NewEmployee[]>([]);

    const [
        checkedEmployees,
        setCheckedEmployees,
    ] = useState<string[]>([]);

    /*
     * OT hours are UI-only data.
     *
     * We deliberately don't modify the API employee object.
     */
    const [otHours, setOtHours] = useState<
        Record<string, string>
    >({});

    const [searchPrevious, setSearchPrevious] =
        useState("");

    const [reason, setReason] = useState(
        "Production Requirement"
    );

    /*
     * Initially select first page of previous-shift employees.
     */
    useEffect(() => {
        if (previousShiftEmployees.length === 0) {
            setSelectedEmployees([]);
            setCheckedEmployees([]);
            setOtHours({});
            return;
        }

        const initialEmployees =
            previousShiftEmployees.slice(
                0,
                ITEMS_PER_PAGE
            );

        setSelectedEmployees(initialEmployees);

        setCheckedEmployees(
            initialEmployees.map(
                (employee) => employee.employeeId
            )
        );

        /*
         * Default OT hours for selected employees.
         * This is separate from the API employee object.
         */
        const initialOTHours: Record<string, string> = {};

        initialEmployees.forEach((employee) => {
            initialOTHours[employee.employeeId] = "";
        });

        setOtHours(initialOTHours);

        setCurrentPage(1);
    }, [previousShiftEmployees]);

    const filteredPreviousEmployees = useMemo(() => {
        const search =
            searchPrevious.toLowerCase().trim();

        if (!search) {
            return previousShiftEmployees;
        }

        return previousShiftEmployees.filter(
            (employee) =>
                employee.employeeId
                    .toLowerCase()
                    .includes(search) ||
                employee.employeeName
                    .toLowerCase()
                    .includes(search) ||
                employee.employeeCode
                    .toLowerCase()
                    .includes(search)
        );
    }, [
        previousShiftEmployees,
        searchPrevious,
    ]);

    const totalPages = Math.ceil(
        filteredPreviousEmployees.length /
        ITEMS_PER_PAGE
    );

    const paginatedPreviousEmployees =
        useMemo(() => {
            const startIndex =
                (currentPage - 1) *
                ITEMS_PER_PAGE;

            return filteredPreviousEmployees.slice(
                startIndex,
                startIndex + ITEMS_PER_PAGE
            );
        }, [
            filteredPreviousEmployees,
            currentPage,
        ]);

    const toggleEmployee = (
        employee: PreviousShiftEmployee
    ) => {
        setCheckedEmployees((current) => {
            if (
                current.includes(employee.employeeId)
            ) {
                return current.filter(
                    (id) =>
                        id !== employee.employeeId
                );
            }

            return [
                ...current,
                employee.employeeId,
            ];
        });
    };

    const addSelectedEmployees = () => {
        const employeesToAdd =
            previousShiftEmployees.filter(
                (employee) =>
                    checkedEmployees.includes(
                        employee.employeeId
                    )
            );

        setSelectedEmployees((current) => {
            const existingIds = new Set(
                current.map(
                    (employee) =>
                        employee.employeeId
                )
            );

            return [
                ...current,
                ...employeesToAdd.filter(
                    (employee) =>
                        !existingIds.has(
                            employee.employeeId
                        )
                ),
            ];
        });

        setOtHours((current) => {
            const updated = {
                ...current,
            };

            employeesToAdd.forEach((employee) => {
                if (
                    updated[employee.employeeId] ===
                    undefined
                ) {
                    updated[employee.employeeId] = "";
                }
            });

            return updated;
        });
    };

    const removeEmployee = (
        employeeId: string
    ) => {
        setSelectedEmployees((current) =>
            current.filter(
                (employee) =>
                    employee.employeeId !==
                    employeeId
            )
        );

        setCheckedEmployees((current) =>
            current.filter(
                (id) => id !== employeeId
            )
        );

        setOtHours((current) => {
            const updated = {
                ...current,
            };

            delete updated[employeeId];

            return updated;
        });

        setNewlyAddedEmployees((current) =>
            current.filter(
                (employee) =>
                    employee.employeeId !==
                    employeeId
            )
        );
    };

    const addNewEmployee = (
        employee: NewEmployee,
        hours: string
    ) => {
        const alreadyExists = selectedEmployees.some(
            (item) => item.employeeId === employee.employeeId
        );

        if (alreadyExists) {
            return;
        }

        setNewlyAddedEmployees((current) => [
            ...current,
            employee,
        ]);

        setSelectedEmployees((current) => [
            ...current,
            employee,
        ]);

        setOtHours((current) => ({
            ...current,
            [employee.employeeId]: hours,
        }));
    };

    const removeNewEmployee = (
        employeeId: string
    ) => {
        setNewlyAddedEmployees((current) =>
            current.filter(
                (employee) =>
                    employee.employeeId !==
                    employeeId
            )
        );

        setSelectedEmployees((current) =>
            current.filter(
                (employee) =>
                    employee.employeeId !==
                    employeeId
            )
        );

        setOtHours((current) => {
            const updated = {
                ...current,
            };

            delete updated[employeeId];

            return updated;
        });
    };

    const updateOTHours = (
        employeeId: string,
        value: string
    ) => {
        /*
         * Accept HH:mm format.
         */
        if (value !== "" && !/^\d{0,2}:?\d{0,2}$/.test(value)) {
            return;
        }

        setOtHours((current) => ({
            ...current,
            [employeeId]: value,
        }));
    };

    const clearAll = () => {
        setSelectedEmployees([]);
        setCheckedEmployees([]);
        setNewlyAddedEmployees([]);
        setOtHours({});
    };

    const isValidOTHours = (value: string) => {
        return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
    };

    const handleForward = () => {

        if (!currentShift?.id) {
            toast.error("Current shift is not available.");
            return;
        }

        if (!departmentId) {
            toast.error("Department is not available.");
            return;
        }

        if (selectedEmployees.length === 0) {
            toast.error("Please select at least one employee.");
            return;
        }

        const invalidEmployee = selectedEmployees.find(
            (employee) =>
                !isValidOTHours(
                    otHours[employee.employeeId] || ""
                )
        );

        if (invalidEmployee) {
            toast.error(
                `Invalid OT hours for ${invalidEmployee.employeeName}. Use HH:mm format, e.g. 01:00.`
            );
            return;
        }
        const payload = {
            currentShiftId: currentShift.id,
            otDate: new Date().toISOString(),
            departmentId,
            reason,
            employees: selectedEmployees.map((employee) => ({
                employeeId: employee.employeeId,
                employeeCode: employee.employeeCode,
                employeeName: employee.employeeName,
                otHours: otHours[employee.employeeId] || "",
                status: "Pending",
                itemId: "",
                submittedBy: user.employeeId,
            })),
        };


        ForwardToTimeCell(payload, {
            onSuccess: (response) => {
                toast.success(response.message || "Review submitted to IT successfully!");
                clearAll();
            },
            onError: (error) => {
                toast.error(error.message || "Failed to submit review.");
            },
        });
    };

    const totalOTMinutes = selectedEmployees.reduce((total, employee) => {
        const value = otHours[employee.employeeId] || "00:00";

        if (!/^\d{2}:\d{2}$/.test(value)) {
            return total;
        }

        const [hours, minutes] = value.split(":").map(Number);

        return total + hours * 60 + minutes;
    }, 0);

    const totalOTHours = `${String(
        Math.floor(totalOTMinutes / 60)
    ).padStart(2, "0")}:${String(
        totalOTMinutes % 60
    ).padStart(2, "0")}`;

    return (
        <div className="min-h-screen bg-[#f5f7fb] p-1 sm:p-2">
            <div className="mx-auto flex min-h-[calc(100vh-8px)] max-w-[1400px] flex-col overflow-hidden bg-white">

                {/* ================= HEADER ================= */}

                <header className="bg-[#03153f] text-white">
                    <div className="flex min-h-[64px] items-center justify-between px-5">

                        <div className="flex items-center gap-3">
                            <div className="relative flex h-10 w-10 items-center justify-center">
                                <div className="absolute h-9 w-9 -rotate-12 rounded-full bg-gradient-to-br from-cyan-300 to-blue-600" />

                                <div className="absolute h-5 w-9 rotate-12 rounded-full bg-[#03153f]" />
                            </div>

                            <div>
                                <div className="text-[24px] font-bold leading-none">
                                    SYNEXIS
                                </div>

                                <div className="text-[9px] font-medium text-cyan-400">
                                    Creating Enterprise Synergy
                                </div>
                            </div>

                            <div className="ml-4 hidden h-9 w-px bg-cyan-500/40 sm:block" />

                            <div className="hidden sm:block">
                                <div className="text-xl font-bold">
                                    OT FORWARDING
                                </div>

                                <div className="text-sm font-medium text-cyan-400">
                                    Forward OT Request to Time Cell
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden items-center gap-2 sm:flex">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white">
                                    <div className="h-5 w-5 rounded-full border-2 border-black bg-white" />
                                </div>

                                <div>
                                    <div className="text-xs font-bold">
                                        {employee.employeeName ||
                                            "USER"}
                                    </div>

                                    <div className="text-[10px] text-cyan-400">
                                        {employee.departmentName ||
                                            ""}
                                    </div>
                                </div>
                            </div>

                            <div className="hidden h-8 w-px bg-cyan-500/40 sm:block" />

                            <button className="text-xs hover:text-cyan-400">
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                {/* ================= MAIN ================= */}

                <main className="flex flex-1 flex-col px-4 py-4 sm:px-5">

                    {/* Top navigation */}

                    <div className="mb-3 flex items-center justify-between">
                        <button
                            type="button"
                            className="flex items-center gap-2 text-xs font-medium text-blue-700 hover:text-blue-900"
                        >
                            <ArrowLeft size={17} />
                            Back to Dashboard
                        </button>

                        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700">
                            <CalendarDays size={16} />

                            <span>
                                {new Date().toLocaleDateString(
                                    "en-GB",
                                    {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    }
                                )}
                            </span>

                            <span className="mx-1 text-slate-300">
                                |
                            </span>

                            <span>
                                {new Date().toLocaleDateString(
                                    "en-US",
                                    {
                                        weekday:
                                            "long",
                                    }
                                )}
                            </span>
                        </div>
                    </div>

                    {/* ================= FORM ================= */}

                    <section className="mb-3 rounded-md border border-slate-200 bg-white p-3">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">

                            <Field
                                label="Current Shift"
                                required
                            >
                                <div className="select-field">
                                    {currentShift ? (
                                        <>
                                            {currentShift.shiftName.replace(
                                                "-",
                                                " Shift ("
                                            )}
                                            {") "}
                                            {currentShift.startTime.slice(
                                                0,
                                                5
                                            )}{" "}
                                            -{" "}
                                            {currentShift.endTime.slice(
                                                0,
                                                5
                                            )}
                                        </>
                                    ) : (
                                        "No active roster shift"
                                    )}

                                    <ChevronDown
                                        size={15}
                                    />
                                </div>
                            </Field>

                            <Field
                                label="OT Date"
                                required
                            >
                                <div className="select-field">
                                    {new Date().toLocaleDateString(
                                        "en-GB",
                                        {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                        }
                                    )}
                                </div>
                            </Field>

                            <Field
                                label="Department"
                                required
                            >
                                <div className="select-field">
                                    {employee.departmentName ||
                                        ""}

                                    <ChevronDown
                                        size={15}
                                    />
                                </div>
                            </Field>

                            <Field
                                label="Reason"
                                required
                            >
                                <input
                                    value={reason}
                                    onChange={(e) =>
                                        setReason(
                                            e.target
                                                .value
                                        )
                                    }
                                    className="input-field"
                                />
                            </Field>
                        </div>
                    </section>

                    {/* ================= THREE COLUMNS ================= */}

                    <section className="grid flex-1 grid-cols-1 gap-3 xl:grid-cols-[300px_48px_1fr_300px]">

                        {/* ================= PREVIOUS SHIFT ================= */}

                        <div className="rounded-md border border-slate-200 bg-white p-3">
                            <div className="mb-2 flex items-start justify-between">
                                <div>
                                    <h3 className="text-[11px] font-bold text-blue-700">
                                        1. EMPLOYEES FROM PREVIOUS SHIFT
                                    </h3>

                                    <p className="text-[9px] text-blue-600">
                                        Previous Shift Employees
                                    </p>
                                </div>

                                <span className="text-[10px] font-semibold text-slate-600">
                                    Total:{" "}
                                    {
                                        previousShiftEmployees.length
                                    }
                                </span>
                            </div>

                            <div className="relative mb-2">
                                <svg
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <circle
                                        cx="11"
                                        cy="11"
                                        r="8"
                                    />
                                    <path d="m21 21-4.3-4.3" />
                                </svg>

                                <input
                                    value={
                                        searchPrevious
                                    }
                                    onChange={(e) => {
                                        setSearchPrevious(
                                            e.target
                                                .value
                                        );
                                        setCurrentPage(
                                            1
                                        );
                                    }}
                                    placeholder="Search by ID, Code or Name"
                                    className="h-9 w-full rounded border border-slate-200 pl-3 pr-9 text-[10px] outline-none focus:border-blue-400"
                                />
                            </div>

                            <div className="overflow-hidden rounded border border-slate-200">
                                <table className="w-full border-collapse text-[9px]">
                                    <thead className="bg-slate-50 text-slate-700">
                                        <tr>
                                            <th className="w-8 border-b px-1 py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        paginatedPreviousEmployees.length >
                                                        0 &&
                                                        paginatedPreviousEmployees.every(
                                                            (
                                                                employee
                                                            ) =>
                                                                checkedEmployees.includes(
                                                                    employee.employeeId
                                                                )
                                                        )
                                                    }
                                                    onChange={() => {
                                                        const pageIds =
                                                            paginatedPreviousEmployees.map(
                                                                (
                                                                    employee
                                                                ) =>
                                                                    employee.employeeId
                                                            );

                                                        const allSelected =
                                                            pageIds.every(
                                                                (
                                                                    id
                                                                ) =>
                                                                    checkedEmployees.includes(
                                                                        id
                                                                    )
                                                            );

                                                        if (
                                                            allSelected
                                                        ) {
                                                            setCheckedEmployees(
                                                                (
                                                                    current
                                                                ) =>
                                                                    current.filter(
                                                                        (
                                                                            id
                                                                        ) =>
                                                                            !pageIds.includes(
                                                                                id
                                                                            )
                                                                    )
                                                            );
                                                        } else {
                                                            setCheckedEmployees(
                                                                (
                                                                    current
                                                                ) =>
                                                                    Array.from(
                                                                        new Set(
                                                                            [
                                                                                ...current,
                                                                                ...pageIds,
                                                                            ]
                                                                        )
                                                                    )
                                                            );
                                                        }
                                                    }}
                                                />
                                            </th>

                                            <th className="border-b px-1 py-2">
                                                #
                                            </th>

                                            <th className="border-b px-1 py-2 text-left">
                                                Emp ID
                                            </th>

                                            <th className="border-b px-1 py-2 text-left">
                                                Employee Name
                                            </th>

                                            <th className="border-b px-1 py-2 text-left">
                                                Designation
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {paginatedPreviousEmployees.map(
                                            (
                                                employee,
                                                index
                                            ) => (
                                                <tr
                                                    key={
                                                        employee.employeeId
                                                    }
                                                    className="border-b last:border-0 hover:bg-blue-50"
                                                >
                                                    <td className="px-1 py-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={checkedEmployees.includes(
                                                                employee.employeeId
                                                            )}
                                                            onChange={() =>
                                                                toggleEmployee(
                                                                    employee
                                                                )
                                                            }
                                                        />
                                                    </td>

                                                    <td className="px-1 py-2 text-center">
                                                        {(currentPage -
                                                            1) *
                                                            ITEMS_PER_PAGE +
                                                            index +
                                                            1}
                                                    </td>

                                                    <td className="px-1 py-2">
                                                        {
                                                            employee.employeeId
                                                        }
                                                    </td>

                                                    <td className="px-1 py-2 font-medium">
                                                        {
                                                            employee.employeeName
                                                        }
                                                    </td>

                                                    <td className="px-1 py-2">
                                                        {employee.designationName ||
                                                            "-"}
                                                    </td>
                                                </tr>
                                            )
                                        )}

                                        {paginatedPreviousEmployees.length ===
                                            0 && (
                                                <tr>
                                                    <td
                                                        colSpan={
                                                            5
                                                        }
                                                        className="px-2 py-5 text-center text-slate-400"
                                                    >
                                                        No employees
                                                        found
                                                    </td>
                                                </tr>
                                            )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-3 flex items-center justify-center gap-1">
                                <button
                                    type="button"
                                    disabled={
                                        currentPage ===
                                        1
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (page) =>
                                                Math.max(
                                                    page -
                                                    1,
                                                    1
                                                )
                                        )
                                    }
                                    className="pagination-btn disabled:cursor-not-allowed disabled:opacity-40"
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
                                        index + 1
                                ).map((page) => (
                                    <button
                                        key={page}
                                        type="button"
                                        onClick={() =>
                                            setCurrentPage(
                                                page
                                            )
                                        }
                                        className={`pagination-btn ${currentPage ===
                                            page
                                            ? "bg-blue-600 text-white"
                                            : ""
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    type="button"
                                    disabled={
                                        currentPage ===
                                        totalPages ||
                                        totalPages ===
                                        0
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (page) =>
                                                Math.min(
                                                    page +
                                                    1,
                                                    totalPages
                                                )
                                        )
                                    }
                                    className="pagination-btn disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronRight
                                        size={14}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* ================= ADD / REMOVE ================= */}

                        <div className="hidden items-center justify-center xl:flex">
                            <div className="flex flex-col gap-2">
                                <button
                                    type="button"
                                    onClick={
                                        addSelectedEmployees
                                    }
                                    className="group flex h-12 w-12 flex-col items-center justify-center rounded border border-slate-300 bg-white text-blue-700 shadow-sm transition hover:border-blue-400 hover:bg-blue-50"
                                >
                                    <ArrowRight
                                        size={20}
                                    />

                                    <span className="text-[8px] font-semibold">
                                        Add
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedEmployees(
                                            (
                                                current
                                            ) =>
                                                current.filter(
                                                    (
                                                        employee
                                                    ) =>
                                                        !checkedEmployees.includes(
                                                            employee.employeeId
                                                        )
                                                )
                                        );

                                        setOtHours(
                                            (
                                                current
                                            ) => {
                                                const updated =
                                                {
                                                    ...current,
                                                };

                                                checkedEmployees.forEach(
                                                    (
                                                        id
                                                    ) => {
                                                        delete updated[
                                                            id
                                                        ];
                                                    }
                                                );

                                                return updated;
                                            }
                                        );
                                    }}
                                    className="group flex h-12 w-12 flex-col items-center justify-center rounded border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
                                >
                                    <ArrowLeft
                                        size={20}
                                    />

                                    <span className="text-[8px] font-semibold">
                                        Remove
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* ================= SELECTED ================= */}

                        <div className="rounded-md border border-slate-200 bg-white p-3">
                            <div className="mb-2 flex items-center justify-between">
                                <div>
                                    <h3 className="text-[11px] font-bold text-emerald-700">
                                        2. SELECTED EMPLOYEES FOR OT
                                    </h3>

                                    <p className="text-[9px] text-emerald-600">
                                        Enter OT hours for each employee
                                    </p>
                                </div>

                                <span className="text-[10px] font-semibold">
                                    Total:{" "}
                                    {
                                        selectedEmployees.length
                                    }
                                </span>
                            </div>

                            <div className="overflow-hidden rounded border border-slate-200">
                                <table className="w-full border-collapse text-[9px]">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="border-b px-1 py-2">
                                                #
                                            </th>

                                            <th className="border-b px-1 py-2">
                                                Emp ID
                                            </th>

                                            <th className="border-b px-1 py-2 text-left">
                                                Employee Name
                                            </th>

                                            <th className="border-b px-1 py-2 text-left">
                                                Designation
                                            </th>

                                            <th className="w-[90px] border-b px-1 py-2">
                                                OT Hours
                                            </th>

                                            <th className="border-b px-1 py-2">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {selectedEmployees.map(
                                            (
                                                employee,
                                                index
                                            ) => (
                                                <tr
                                                    key={
                                                        employee.employeeId
                                                    }
                                                    className="border-b last:border-0"
                                                >
                                                    <td className="px-1 py-2 text-center">
                                                        {index +
                                                            1}
                                                    </td>

                                                    <td className="px-1 py-2">
                                                        {
                                                            employee.employeeId
                                                        }
                                                    </td>

                                                    <td className="px-1 py-2 font-medium">
                                                        {
                                                            employee.employeeName
                                                        }
                                                    </td>

                                                    <td className="px-1 py-2">
                                                        {employee.designationName ||
                                                            "-"}
                                                    </td>

                                                    <td className="px-1 py-2">
                                                        <input
                                                            type="text"
                                                            value={
                                                                otHours[
                                                                employee
                                                                    .employeeId
                                                                ] ||
                                                                ""
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                updateOTHours(
                                                                    employee.employeeId,
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="HH:mm"
                                                            className="h-7 w-full rounded border border-slate-300 px-2 text-center text-[9px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                                        />
                                                    </td>

                                                    <td className="px-1 py-2 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeEmployee(
                                                                    employee.employeeId
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
                                            )
                                        )}

                                        {selectedEmployees.length > 0 && (
                                            <tr className="bg-slate-50 font-bold">
                                                <td
                                                    colSpan={4}
                                                    className="px-2 py-2 text-right text-slate-700"
                                                >
                                                    Total OT Hours
                                                </td>

                                                <td className="px-1 py-2 text-center text-emerald-700">
                                                    {totalOTHours}
                                                </td>

                                                <td />
                                            </tr>
                                        )}

                                        {selectedEmployees.length ===
                                            0 && (
                                                <tr>
                                                    <td
                                                        colSpan={
                                                            6
                                                        }
                                                        className="px-2 py-5 text-center text-slate-400"
                                                    >
                                                        No employees
                                                        selected
                                                    </td>
                                                </tr>
                                            )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ================= ADD NEW EMPLOYEE ================= */}

                        <AddNewEmployee
                            departmentId={
                                departmentId
                            }
                            addedEmployees={
                                newlyAddedEmployees
                            }
                            onAdd={
                                addNewEmployee
                            }
                            onRemove={
                                removeNewEmployee
                            }
                        />
                    </section>

                    {/* ================= NOTE / ACTIONS ================= */}

                    <section className="mt-3 flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-3 lg:flex-row lg:items-center">

                        <div className="flex flex-1 items-center gap-2 text-[9px] text-slate-500">
                            <Info
                                size={22}
                                className="shrink-0 text-blue-600"
                            />

                            <span>
                                <strong className="text-slate-700">
                                    Note:
                                </strong>{" "}
                                Employees from previous shift are
                                shown on the left. You can select
                                from this list or add new
                                employees not in the previous
                                shift. Enter OT hours for each
                                selected employee.
                            </span>
                        </div>

                        <div className="flex items-center justify-end gap-2">
                            <button
                                onClick={clearAll}
                                className="flex h-8 items-center gap-1 rounded border border-red-300 px-4 text-[10px] font-semibold text-red-500 hover:bg-red-50"
                            >
                                <Trash2 size={13} />
                                Clear All
                            </button>

                            <button
                                onClick={handleForward}
                                className="flex h-8 items-center gap-2 rounded bg-emerald-600 px-5 text-[10px] font-bold text-white shadow-sm hover:bg-emerald-700"
                            >
                                <Send size={14} />
                                Forward to Time Cell
                            </button>
                        </div>
                    </section>
                </main>

                {/* ================= FOOTER ================= */}

                <footer className="bg-[#03153f] px-6 py-3 text-white">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div className="flex flex-wrap items-center gap-5">
                            {footerItems.map(
                                (item, index) => {
                                    const Icon =
                                        item.icon;

                                    return (
                                        <React.Fragment
                                            key={
                                                item.title
                                            }
                                        >
                                            <div className="flex items-center gap-2">
                                                <Icon
                                                    size={
                                                        24
                                                    }
                                                    strokeWidth={
                                                        1.5
                                                    }
                                                    className="text-cyan-400"
                                                />

                                                <div>
                                                    <div className="text-[10px] font-bold">
                                                        {
                                                            item.title
                                                        }
                                                    </div>

                                                    <div className="text-[8px] text-white/70">
                                                        {
                                                            item.subtitle
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            {index <
                                                footerItems.length -
                                                1 && (
                                                    <div className="hidden h-7 w-px bg-cyan-500/30 sm:block" />
                                                )}
                                        </React.Fragment>
                                    );
                                }
                            )}
                        </div>

                        <div className="text-right">
                            <span className="text-[9px] text-white/60">
                                Powered by
                            </span>{" "}

                            <span className="text-lg font-bold">
                                SYNEXIS
                                <span className="text-cyan-400">
                                    {" "}
                                    ERP
                                </span>
                            </span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

/* ================= REUSABLE FIELD ================= */

interface FieldProps {
    label: string;
    required?: boolean;
    children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({
    label,
    required,
    children,
}) => {
    return (
        <div>
            <label className="mb-1 block text-[9px] font-semibold text-[#17254c]">
                {label}{" "}
                {required && (
                    <span className="text-red-500">
                        *
                    </span>
                )}
            </label>

            {children}
        </div>
    );
};

export default OTForwardingPage;