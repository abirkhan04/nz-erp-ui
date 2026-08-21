import React, { useMemo, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Clock3,
    Info,
    Plus,
    Search,
    Send,
    Trash2,
    Target,
    ShieldCheck,
    Settings2,
} from "lucide-react";

interface Employee {
    id: string;
    name: string;
    designation: string;
    department: string;
    otHours: string;
    previousShift: boolean;
}

const previousShiftEmployees: Employee[] = [
    {
        id: "10045",
        name: "JAHID HOSSAIN",
        designation: "Operator",
        department: "Weaving Section",
        otHours: "02:00",
        previousShift: true,
    },
    {
        id: "10087",
        name: "RIPON MIAH",
        designation: "Operator",
        department: "Weaving Section",
        otHours: "02:00",
        previousShift: true,
    },
    {
        id: "10123",
        name: "SAGOR ALI",
        designation: "Operator",
        department: "Weaving Section",
        otHours: "02:00",
        previousShift: true,
    },
    {
        id: "10098",
        name: "ASADUZZAMAN",
        designation: "Helper",
        department: "Weaving Section",
        otHours: "02:00",
        previousShift: true,
    },
    {
        id: "10065",
        name: "MONIR HOSSAIN",
        designation: "Operator",
        department: "Weaving Section",
        otHours: "02:00",
        previousShift: true,
    },
    {
        id: "10111",
        name: "NAZMA AKTER",
        designation: "Helper",
        department: "Weaving Section",
        otHours: "02:00",
        previousShift: true,
    },
    {
        id: "10043",
        name: "MAHMUDUL ISLAM",
        designation: "Operator",
        department: "Weaving Section",
        otHours: "01:30",
        previousShift: true,
    },
    {
        id: "10032",
        name: "IMRAN HOSSAIN",
        designation: "Operator",
        department: "Weaving Section",
        otHours: "02:00",
        previousShift: true,
    },
];

const additionalEmployees: Employee[] = [
    {
        id: "10156",
        name: "ABUL KASHEM",
        designation: "Operator",
        department: "Weaving Section",
        otHours: "02:00",
        previousShift: false,
    },
    {
        id: "10172",
        name: "RAHIM UDDIN",
        designation: "Helper",
        department: "Weaving Section",
        otHours: "01:30",
        previousShift: false,
    },
    {
        id: "10184",
        name: "KAMAL HOSSAIN",
        designation: "Operator",
        department: "Weaving Section",
        otHours: "02:00",
        previousShift: false,
    },
];

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

const OTForwardingPage: React.FC = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>(
        previousShiftEmployees.slice(0, 5)
    );

    const [checkedEmployees, setCheckedEmployees] = useState<string[]>(
        previousShiftEmployees.slice(0, 5).map((employee) => employee.id)
    );

    const [searchPrevious, setSearchPrevious] = useState("");
    const [searchNew, setSearchNew] = useState("");

    const [newEmployeeId, setNewEmployeeId] = useState("");
    const [newEmployeeName, setNewEmployeeName] = useState("");
    const [newDesignation, setNewDesignation] = useState("");
    const [newDepartment, setNewDepartment] = useState("");
    const [newOTHours, setNewOTHours] = useState("02:00");

    const [newlyAddedEmployees, setNewlyAddedEmployees] = useState<Employee[]>(
        []
    );

    const [reason, setReason] = useState("Production Requirement");

    const filteredPreviousEmployees = useMemo(() => {
        return previousShiftEmployees.filter(
            (employee) =>
                employee.id.toLowerCase().includes(searchPrevious.toLowerCase()) ||
                employee.name.toLowerCase().includes(searchPrevious.toLowerCase())
        );
    }, [searchPrevious]);

    const totalPages = Math.ceil(
        filteredPreviousEmployees.length / ITEMS_PER_PAGE
    );

    const paginatedPreviousEmployees = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

        return filteredPreviousEmployees.slice(
            startIndex,
            startIndex + ITEMS_PER_PAGE
        );
    }, [filteredPreviousEmployees, currentPage]);

    const totalOTMinutes = useMemo(() => {
        return selectedEmployees.reduce((total, employee) => {
            const [hours, minutes] = employee.otHours.split(":").map(Number);
            return total + hours * 60 + minutes;
        }, 0);
    }, [selectedEmployees]);

    const totalOT = `${String(Math.floor(totalOTMinutes / 60)).padStart(
        2,
        "0"
    )}:${String(totalOTMinutes % 60).padStart(2, "0")}`;

    const toggleEmployee = (employee: Employee) => {
        setCheckedEmployees((current) => {
            if (current.includes(employee.id)) {
                return current.filter((id) => id !== employee.id);
            }

            return [...current, employee.id];
        });
    };

    const addSelectedEmployees = () => {
        const employeesToAdd = previousShiftEmployees.filter((employee) =>
            checkedEmployees.includes(employee.id)
        );

        setSelectedEmployees((current) => {
            const existingIds = new Set(current.map((employee) => employee.id));

            return [
                ...current,
                ...employeesToAdd.filter((employee) => !existingIds.has(employee.id)),
            ];
        });
    };

    const removeEmployee = (id: string) => {
        setSelectedEmployees((current) =>
            current.filter((employee) => employee.id !== id)
        );

        setCheckedEmployees((current) => current.filter((item) => item !== id));
    };

    const updateOTHours = (id: string, value: string) => {
        setSelectedEmployees((current) =>
            current.map((employee) =>
                employee.id === id
                    ? {
                        ...employee,
                        otHours: value,
                    }
                    : employee
            )
        );
    };

    const handleSearchEmployee = () => {
        const employee = additionalEmployees.find(
            (item) => item.id === newEmployeeId
        );

        if (!employee) {
            alert("Employee not found in mock data.");
            return;
        }

        setNewEmployeeName(employee.name);
        setNewDesignation(employee.designation);
        setNewDepartment(employee.department);
    };

    const addNewEmployee = () => {
        if (!newEmployeeId || !newEmployeeName) return;

        const employee: Employee = {
            id: newEmployeeId,
            name: newEmployeeName,
            designation: newDesignation,
            department: newDepartment,
            otHours: newOTHours,
            previousShift: false,
        };

        setNewlyAddedEmployees((current) => [...current, employee]);

        setSelectedEmployees((current) => [...current, employee]);

        setNewEmployeeId("");
        setNewEmployeeName("");
        setNewDesignation("");
        setNewDepartment("");
        setNewOTHours("02:00");
    };

    const removeNewEmployee = (id: string) => {
        setNewlyAddedEmployees((current) =>
            current.filter((employee) => employee.id !== id)
        );

        setSelectedEmployees((current) =>
            current.filter((employee) => employee.id !== id)
        );
    };

    const clearAll = () => {
        setSelectedEmployees([]);
        setCheckedEmployees([]);
        setNewlyAddedEmployees([]);
    };

    return (
        <div className="min-h-screen bg-[#f5f7fb] p-1 sm:p-2">
            <div className="mx-auto flex min-h-[calc(100vh-8px)] max-w-[1400px] flex-col overflow-hidden bg-white">

                {/* ================= HEADER ================= */}
                <header className="bg-[#03153f] text-white">
                    <div className="flex min-h-[64px] items-center justify-between px-5">

                        {/* Brand */}
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

                        {/* User */}
                        <div className="flex items-center gap-4">
                            <div className="hidden items-center gap-2 sm:flex">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white">
                                    <div className="h-5 w-5 rounded-full border-2 border-black bg-white" />
                                </div>

                                <div>
                                    <div className="text-xs font-bold">
                                        JAHID HOSSAIN
                                    </div>
                                    <div className="text-[10px] text-cyan-400">
                                        Weaving Section - A Shift
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
                            <span>15 May 2024</span>
                            <span className="mx-1 text-slate-300">|</span>
                            <span>Thursday</span>
                        </div>
                    </div>

                    {/* ================= FORM ================= */}
                    <section className="mb-3 rounded-md border border-slate-200 bg-white p-3">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">

                            <Field label="Current Shift" required>
                                <div className="select-field">
                                    A Shift (06:00 AM - 02:00 PM)
                                    <ChevronDown size={15} />
                                </div>
                            </Field>

                            <Field label="OT Date" required>
                                <div className="select-field">
                                    15 May 2024
                                    <CalendarDays size={15} />
                                </div>
                            </Field>

                            <Field label="Department" required>
                                <div className="select-field">
                                    Weaving
                                    <ChevronDown size={15} />
                                </div>
                            </Field>

                            <Field label="Reason" required>
                                <input
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
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
                                        (C Shift - 06:00 PM TO 02:00 AM)
                                    </p>
                                </div>

                                <span className="text-[10px] font-semibold text-slate-600">
                                    Total: {previousShiftEmployees.length}
                                </span>
                            </div>

                            {/* Search */}
                            <div className="relative mb-2">
                                <Search
                                    size={15}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    value={searchPrevious}
                                    onChange={(e) => {
                                        setSearchPrevious(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    placeholder="Search by ID or Name"
                                    className="h-9 w-full rounded border border-slate-200 pl-3 pr-9 text-[10px] outline-none focus:border-blue-400"
                                />
                            </div>

                            {/* Table */}
                            <div className="overflow-hidden rounded border border-slate-200">
                                <table className="w-full border-collapse text-[9px]">
                                    <thead className="bg-slate-50 text-slate-700">
                                        <tr>
                                            <th className="w-8 border-b px-1 py-2">
                                                <input type="checkbox" />
                                            </th>
                                            <th className="border-b px-1 py-2">#</th>
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
                                        {paginatedPreviousEmployees.map((employee, index) => (
                                            <tr
                                                key={employee.id}
                                                className="border-b last:border-0 hover:bg-blue-50"
                                            >
                                                <td className="px-1 py-2 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={checkedEmployees.includes(employee.id)}
                                                        onChange={() => toggleEmployee(employee)}
                                                    />
                                                </td>

                                                <td className="px-1 py-2 text-center">
                                                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                                </td>

                                                <td className="px-1 py-2">
                                                    {employee.id}
                                                </td>

                                                <td className="px-1 py-2 font-medium">
                                                    {employee.name}
                                                </td>

                                                <td className="px-1 py-2">
                                                    {employee.designation}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="mt-3 flex items-center justify-center gap-1">
                                <button
                                    type="button"
                                    disabled={currentPage === 1}
                                    onClick={() =>
                                        setCurrentPage((page) => Math.max(page - 1, 1))
                                    }
                                    className="pagination-btn disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronLeft size={14} />
                                </button>

                                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                                    (page) => (
                                        <button
                                            key={page}
                                            type="button"
                                            onClick={() => setCurrentPage(page)}
                                            className={`pagination-btn ${currentPage === page
                                                    ? "bg-blue-600 text-white"
                                                    : ""
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}

                                <button
                                    type="button"
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    onClick={() =>
                                        setCurrentPage((page) =>
                                            Math.min(page + 1, totalPages)
                                        )
                                    }
                                    className="pagination-btn disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>

                        {/* ================= ADD / REMOVE CONTROLS ================= */}
                        <div className="hidden items-center justify-center xl:flex">
                            <div className="flex flex-col gap-2">

                                <button
                                    type="button"
                                    onClick={addSelectedEmployees}
                                    className="group flex h-12 w-12 flex-col items-center justify-center rounded border border-slate-300 bg-white text-blue-700 shadow-sm transition hover:border-blue-400 hover:bg-blue-50"
                                    title="Add selected employees"
                                >
                                    <ArrowRight
                                        size={20}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                    <span className="text-[8px] font-semibold">Add</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        const selectedIds = new Set(checkedEmployees);

                                        setSelectedEmployees((current) =>
                                            current.filter(
                                                (employee) => !selectedIds.has(employee.id)
                                            )
                                        );
                                    }}
                                    className="group flex h-12 w-12 flex-col items-center justify-center rounded border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
                                    title="Remove selected employees"
                                >
                                    <ArrowLeft
                                        size={20}
                                        className="transition-transform group-hover:-translate-x-1"
                                    />
                                    <span className="text-[8px] font-semibold">Remove</span>
                                </button>

                            </div>
                        </div>

                        {/* ================= SELECTED ================= */}
                        <div className="rounded-md border border-slate-200 bg-white p-3">
                            <div className="mb-2 flex items-center justify-between">
                                <h3 className="text-[11px] font-bold text-emerald-700">
                                    2. SELECTED EMPLOYEES FOR OT
                                </h3>

                                <span className="text-[10px] font-semibold">
                                    Total: {selectedEmployees.length}
                                </span>
                            </div>

                            <div className="overflow-hidden rounded border border-slate-200">
                                <table className="w-full border-collapse text-[9px]">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="border-b px-1 py-2">#</th>
                                            <th className="border-b px-1 py-2">Emp ID</th>
                                            <th className="border-b px-1 py-2 text-left">
                                                Employee Name
                                            </th>
                                            <th className="border-b px-1 py-2">
                                                OT Hours
                                                <br />
                                                <span className="text-[7px]">(HH:MM)</span>
                                            </th>
                                            <th className="border-b px-1 py-2">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {selectedEmployees.map((employee, index) => (
                                            <tr
                                                key={employee.id}
                                                className="border-b last:border-0"
                                            >
                                                <td className="px-1 py-2 text-center">
                                                    {index + 1}
                                                </td>

                                                <td className="px-1 py-2">
                                                    {employee.id}
                                                </td>

                                                <td className="px-1 py-2 font-medium">
                                                    {employee.name}
                                                </td>

                                                <td className="px-1 py-2">
                                                    <input
                                                        value={employee.otHours}
                                                        onChange={(e) =>
                                                            updateOTHours(
                                                                employee.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="h-7 w-full rounded border border-slate-200 text-center text-[9px] outline-none focus:border-blue-400"
                                                    />
                                                </td>

                                                <td className="px-1 py-2 text-center">
                                                    <button
                                                        onClick={() =>
                                                            removeEmployee(employee.id)
                                                        }
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Total */}
                            <div className="mt-5 rounded border border-emerald-200 bg-emerald-50 py-2 text-center text-[10px] font-bold text-emerald-700">
                                Total OT Hours: {totalOT}
                            </div>
                        </div>

                        {/* ================= ADD NEW ================= */}
                        <div className="rounded-md border border-slate-200 bg-white p-3">
                            <div className="mb-2">
                                <h3 className="text-[11px] font-bold text-indigo-700">
                                    3. ADD NEW EMPLOYEE{" "}
                                    <span className="text-[8px] font-normal">
                                        (NOT IN PREVIOUS SHIFT)
                                    </span>
                                </h3>
                            </div>

                            {/* Search */}
                            <div className="relative mb-2">
                                <Search
                                    size={15}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    value={searchNew}
                                    onChange={(e) => setSearchNew(e.target.value)}
                                    placeholder="Search by ID or Name"
                                    className="h-9 w-full rounded border border-slate-200 pl-3 pr-9 text-[10px] outline-none"
                                />
                            </div>

                            <div className="space-y-2">

                                {/* Employee ID */}
                                <Field label="Employee ID" required>
                                    <div className="flex gap-2">
                                        <input
                                            value={newEmployeeId}
                                            onChange={(e) =>
                                                setNewEmployeeId(e.target.value)
                                            }
                                            placeholder="Enter employee ID"
                                            className="input-field flex-1"
                                        />

                                        <button
                                            onClick={handleSearchEmployee}
                                            className="rounded bg-blue-600 px-4 text-[10px] font-semibold text-white hover:bg-blue-700"
                                        >
                                            Search
                                        </button>
                                    </div>
                                </Field>

                                <Field label="Employee Name">
                                    <input
                                        value={newEmployeeName}
                                        onChange={(e) =>
                                            setNewEmployeeName(e.target.value)
                                        }
                                        className="input-field"
                                    />
                                </Field>

                                <Field label="Designation">
                                    <input
                                        value={newDesignation}
                                        onChange={(e) =>
                                            setNewDesignation(e.target.value)
                                        }
                                        className="input-field"
                                    />
                                </Field>

                                <Field label="Dept / Section">
                                    <input
                                        value={newDepartment}
                                        onChange={(e) =>
                                            setNewDepartment(e.target.value)
                                        }
                                        className="input-field"
                                    />
                                </Field>

                                <div className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <Field label="OT Hours (HH:MM)" required>
                                            <input
                                                value={newOTHours}
                                                onChange={(e) =>
                                                    setNewOTHours(e.target.value)
                                                }
                                                className="input-field"
                                            />
                                        </Field>
                                    </div>

                                    <button
                                        onClick={addNewEmployee}
                                        className="mb-0 flex h-8 items-center gap-1 rounded bg-[#6246c7] px-3 text-[10px] font-semibold text-white hover:bg-[#5236b0]"
                                    >
                                        <Plus size={13} />
                                        Add to List
                                    </button>
                                </div>
                            </div>

                            {/* Newly added */}
                            <div className="mt-3 overflow-hidden rounded border border-slate-200">
                                <div className="bg-indigo-50 px-2 py-2 text-[9px] font-semibold text-indigo-700">
                                    Newly Added Employees
                                </div>

                                {newlyAddedEmployees.length === 0 ? (
                                    <div className="px-2 py-4 text-center text-[9px] text-slate-400">
                                        No newly added employees
                                    </div>
                                ) : (
                                    newlyAddedEmployees.map((employee, index) => (
                                        <div
                                            key={employee.id}
                                            className="grid grid-cols-[20px_55px_1fr_55px_25px] items-center border-t px-2 py-2 text-[9px]"
                                        >
                                            <span>{index + 1}</span>
                                            <span>{employee.id}</span>
                                            <span className="font-medium">
                                                {employee.name}
                                            </span>
                                            <span>{employee.otHours}</span>

                                            <button
                                                onClick={() =>
                                                    removeNewEmployee(employee.id)
                                                }
                                                className="text-red-500"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>

                    {/* ================= NOTE / ACTIONS ================= */}
                    <section className="mt-3 flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-3 lg:flex-row lg:items-center">

                        <div className="flex flex-1 items-center gap-2 text-[9px] text-slate-500">
                            <Info
                                size={22}
                                className="shrink-0 text-blue-600"
                            />

                            <span>
                                <strong className="text-slate-700">Note:</strong>{" "}
                                Employees from previous shift are shown on the left.
                                You can select from this list or add new employees not
                                in the previous shift.
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
                                onClick={() =>
                                    console.log("Forwarded OT:", selectedEmployees)
                                }
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
                            {footerItems.map((item, index) => {
                                const Icon = item.icon;

                                return (
                                    <React.Fragment key={item.title}>
                                        <div className="flex items-center gap-2">
                                            <Icon
                                                size={24}
                                                strokeWidth={1.5}
                                                className="text-cyan-400"
                                            />

                                            <div>
                                                <div className="text-[10px] font-bold">
                                                    {item.title}
                                                </div>
                                                <div className="text-[8px] text-white/70">
                                                    {item.subtitle}
                                                </div>
                                            </div>
                                        </div>

                                        {index < footerItems.length - 1 && (
                                            <div className="hidden h-7 w-px bg-cyan-500/30 sm:block" />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        <div className="text-right">
                            <span className="text-[9px] text-white/60">
                                Powered by
                            </span>{" "}
                            <span className="text-lg font-bold">
                                SYNEXIS
                                <span className="text-cyan-400"> ERP</span>
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
                {required && <span className="text-red-500">*</span>}
            </label>

            {children}
        </div>
    );
};

export default OTForwardingPage;