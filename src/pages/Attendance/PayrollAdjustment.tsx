import React, { useMemo, useState } from "react";
import axios from "axios";
import CommonInputField, { type Option } from "../../components/CommonInputFields";
import { useForm } from "react-hook-form";
import { api } from "../../api/client";

/* ============================================================
   TYPES
============================================================ */

interface Employee {
    employeeCode: string;
    employeeName: string;
    company: string;
    departmentName: string;
    designationName: string;
}

interface PayrollAdjustmentRequest {
    requestId: string;
    employeeId: string;
    employeeName?: string;

    attendanceMonth: string;
    company?: string;
    department?: string;
    designation?: string;

    correctionType: string;
    reason: string;

    basicSalaryImpact: number;
    otImpact: number;
    nightAllowanceImpact: number;
    deductionImpact: number;

    supportingDocument?: string;
    remarks?: string;

    status?: string;
    submittedOn?: string;
}

interface PayrollAdjustmentPayload {
  employeeId: string;
  company: string;
  employeeName: string;
  attendanceMonth: string;
  department: string | null;
  designation: string | null;
  correctionType: string;
  reason: string;
  basicSalaryImpact: number;
  otImpact: number;
  nightAllowanceImpact: number;
  deductionImpact: number;
  supportingDocument: string;
  remarks: string;
}

interface AttendanceCellDashboardProps {
    pendingPayrollAdjustments?: number;
}

/* ============================================================
   API
============================================================ */

const PAYROLL_ADJUSTMENT_API = "PayrollAdjustments";

/* ============================================================
   INITIAL FORM
============================================================ */

const INITIAL_FORM: PayrollAdjustmentPayload = {
    employeeId: "",
    employeeName: "",

    attendanceMonth: "",
    department: "",
    designation: "",
    company: "",

    correctionType: "Missed Punch (Both)",

    reason: "",

    basicSalaryImpact: 0,
    otImpact: 0,
    nightAllowanceImpact: 0,
    deductionImpact: 0,

    supportingDocument: "",
    remarks: "",
};

/* ============================================================
   SMALL ICON COMPONENT
============================================================ */

const Icon: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className = "" }) => (
    <div className={className}>{children}</div>
);

/* ============================================================
   MAIN COMPONENT
============================================================ */

const AttendanceCellDashboard: React.FC<
    AttendanceCellDashboardProps
> = ({
    pendingPayrollAdjustments = 11,
}) => {
        /* ==========================================================
           MODAL STATES
        ========================================================== */

        const [exceptionModalOpen, setExceptionModalOpen] =
            useState(false);

        const [formModalOpen, setFormModalOpen] =
            useState(false);

        const [successModalOpen, setSuccessModalOpen] =
            useState(false);

        /* ==========================================================
           CRUD STATES
        ========================================================== */

        const [requests, setRequests] = useState<
            PayrollAdjustmentRequest[]
        >([]);

        const [editingRequest, setEditingRequest] =
            useState<PayrollAdjustmentRequest | null>(null);

        const [form, setForm] =
            useState<PayrollAdjustmentPayload>(
                INITIAL_FORM
            );


        const {
            register,
            control,
            handleSubmit,
            reset,
            setValue,
            watch,
            formState: {
                errors,
            },
        } = useForm<PayrollAdjustmentPayload>({
            defaultValues: INITIAL_FORM,
        });

        const [employees, setEmployees] =
            useState<Employee[]>([]);

        const [employeeSearchLoading, setEmployeeSearchLoading] =
            useState(false);

        /* ==========================================================
           LOADING / ERROR
        ========================================================== */

        const [loading, setLoading] = useState(false);

        const [saving, setSaving] = useState(false);

        const [error, setError] = useState("");

        /* ==========================================================
           SUCCESS DATA
        ========================================================== */

        const [submittedRequest, setSubmittedRequest] =
            useState<PayrollAdjustmentRequest | null>(
                null
            );

        const handleEmployeeSearch = async (
            searchText: string
        ) => {
            if (!searchText.trim()) {
                setEmployees([]);
                return;
            }

            try {
                setEmployeeSearchLoading(true);

                const response = await api.get(
                    "/employees/search-extention",
                    {
                        params: {
                            searchText: searchText,
                        },
                    }
                );

                const data =
                    response.data?.data ??
                    response.data ??
                    [];

                setEmployees(
                    Array.isArray(data) ? data : []
                );
            } catch (error) {
                console.error(
                    "Unable to search employees",
                    error
                );

                setEmployees([]);
            } finally {
                setEmployeeSearchLoading(false);
            }
        };

        const employeeOptions: Option[] =
            employees.map((employee) => ({
                label: `${employee.employeeCode} - ${employee.employeeName}`,
                value: employee.employeeCode,
            }));


        const handleEmployeeSelect = (
            option: Option
        ) => {
            const employee = employees.find(
                (item) =>
                    item.employeeCode ===
                    String(option.value)
            );

            if (!employee) {
                return;
            }

            setValue(
                "employeeId",
                employee.employeeCode,
                {
                    shouldValidate: true,
                    shouldDirty: true,
                }
            );

            setValue(
                "employeeName",
                employee.employeeName
            );

            setValue(
                "company",
                employee.company
            );

            setValue(
                "department",
                employee.departmentName
            );

            setValue(
                "designation",
                employee.designationName
            );
        };
        /* ==========================================================
           LOAD PAYROLL ADJUSTMENTS
        ========================================================== */

        const loadPayrollAdjustments = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    PAYROLL_ADJUSTMENT_API
                );

                const data =
                    response.data?.data ??
                    response.data ??
                    [];

                setRequests(
                    Array.isArray(data) ? data : []
                );
            } catch (err) {
                console.error(err);

                setError(
                    "Unable to load payroll adjustment requests."
                );
            } finally {
                setLoading(false);
            }
        };

        /* ==========================================================
           OPEN EXCEPTION MODAL
        ========================================================== */

        const openExceptionModal = async () => {
            setExceptionModalOpen(true);

            await loadPayrollAdjustments();
        };

        /* ==========================================================
           CREATE
        ========================================================== */

        const handleNewRequest = () => {
            setEditingRequest(null);
            setForm(INITIAL_FORM);
            setError("");
            setFormModalOpen(true);
        };

        /* ==========================================================
           EDIT
        ========================================================== */

        const handleEdit = (
            request: PayrollAdjustmentRequest
        ) => {
            setEditingRequest(request);

            setForm({
                employeeId: request.employeeId || "",
                employeeName: request.employeeName || "",

                attendanceMonth:
                    request.attendanceMonth || "",

                company: request.company || "",

                department:
                    request.department || "",

                designation:
                    request.designation || "",

                correctionType:
                    request.correctionType ||
                    "Missed Punch (Both)",

                reason: request.reason || "",

                basicSalaryImpact:
                    Number(
                        request.basicSalaryImpact || 0
                    ),

                otImpact:
                    Number(request.otImpact || 0),

                nightAllowanceImpact:
                    Number(
                        request.nightAllowanceImpact || 0
                    ),

                deductionImpact:
                    Number(
                        request.deductionImpact || 0
                    ),

                supportingDocument:
                    request.supportingDocument || "",

                remarks:
                    request.remarks || "",
            });

            setError("");
            setFormModalOpen(true);
        };

        /* ==========================================================
           FORM CHANGE
        ========================================================== */

        const handleChange = (
            event: React.ChangeEvent<
                HTMLInputElement |
                HTMLSelectElement |
                HTMLTextAreaElement
            >
        ) => {
            const {
                name,
                value,
            } = event.target;

            const numericFields = [
                "basicSalaryImpact",
                "otImpact",
                "nightAllowanceImpact",
                "deductionImpact",
            ];

            setForm((previous) => ({
                ...previous,
                [name]: numericFields.includes(name)
                    ? Number(value)
                    : value,
            }));
        };

        /* ==========================================================
           CREATE / UPDATE
        ========================================================== */

        const handlePayrollAdjustmentSubmit = async (
            data: PayrollAdjustmentPayload
        ) => {
            try {
                setSaving(true);
                setError("");
                data.attendanceMonth = data.attendanceMonth.substring(0,7);
                let response;

                if (editingRequest) {
                    response = await axios.put(
                        `${PAYROLL_ADJUSTMENT_API}/${editingRequest.requestId}`,
                        data
                    );
                } else {
                    response = await api.post(
                        PAYROLL_ADJUSTMENT_API,
                        data
                    );
                }

                const created =
                    response.data?.data ??
                    response.data;

                setSubmittedRequest(created);

                setFormModalOpen(false);

                await loadPayrollAdjustments();

                setSuccessModalOpen(true);
            } catch (err) {
                console.error(err);

                setError(
                    editingRequest
                        ? "Unable to update payroll adjustment."
                        : "Unable to create payroll adjustment."
                );
            } finally {
                setSaving(false);
            }
        };

        /* ==========================================================
           DELETE
        ========================================================== */

        const handleDelete = async (
            requestId: string
        ) => {
            const confirmed = window.confirm(
                "Are you sure you want to delete this payroll adjustment request?"
            );

            if (!confirmed) {
                return;
            }

            try {
                setLoading(true);
                setError("");

                await axios.delete(
                    `${PAYROLL_ADJUSTMENT_API}/${requestId}`
                );

                await loadPayrollAdjustments();
            } catch (err) {
                console.error(err);

                setError(
                    "Unable to delete payroll adjustment."
                );
            } finally {
                setLoading(false);
            }
        };

        /* ==========================================================
           CALCULATIONS
        ========================================================== */

        const totalAddition = useMemo(() => {
            return (
                Number(form.basicSalaryImpact || 0) +
                Number(form.otImpact || 0) +
                Number(form.nightAllowanceImpact || 0)
            );
        }, [
            form.basicSalaryImpact,
            form.otImpact,
            form.nightAllowanceImpact,
        ]);

        const netImpact = useMemo(() => {
            return (
                totalAddition -
                Number(form.deductionImpact || 0)
            );
        }, [
            totalAddition,
            form.deductionImpact,
        ]);

        /* ==========================================================
           CARD COMPONENT
        ========================================================== */

        const RequestCard = ({
            title,
            count,
            subtitle,
            color,
            icon,
            onClick,
        }: {
            title: string;
            count: string | number;
            subtitle: string;
            color: string;
            icon: React.ReactNode;
            onClick?: () => void;
        }) => {
            return (
                <div
                    className={`rounded-lg border bg-white p-4 shadow-sm ${color}`}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-50">
                                {icon}
                            </div>

                            <div>
                                <h3 className="text-xs font-bold uppercase leading-4 text-gray-700">
                                    {title}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3">
                        <div className="text-2xl font-bold text-gray-900">
                            {count}
                        </div>

                        <div className="mt-1 text-[10px] text-gray-500">
                            {subtitle}
                        </div>

                        <button
                            type="button"
                            onClick={onClick}
                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                            View Details
                            <span>→</span>
                        </button>
                    </div>
                </div>
            );
        };

        /* ==========================================================
           RENDER
        ========================================================== */

        return (
            <div className="min-h-screen bg-white text-gray-800">
                {/* =====================================================
          HEADER
      ===================================================== */}

                <header className="bg-[#06247a] text-white">
                    <div className="flex min-h-[62px] items-center justify-between px-5">
                        {/* Logo / Title */}
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-3xl font-bold text-[#06247a]">
                                S
                            </div>

                            <div>
                                <div className="text-sm font-bold uppercase tracking-wide">
                                    SYNEXIS
                                </div>

                                <div className="text-[8px] text-blue-200">
                                    Creating Enterprise Synergy
                                </div>
                            </div>

                            <div className="hidden h-8 w-px bg-blue-300 md:block" />

                            <div>
                                <div className="text-sm font-bold">
                                    PAYROLL & WORKFORCE MOVEMENT
                                    SECTION – ATTENDANCE CELL
                                </div>

                                <div className="text-[11px] text-blue-200">
                                    Dashboard &nbsp;›&nbsp; Attendance Cell
                                </div>
                            </div>
                        </div>

                        {/* Right Header */}
                        <div className="flex items-center gap-5">
                            <div className="hidden rounded-md bg-white px-4 py-2 text-[10px] font-semibold text-gray-700 shadow-sm lg:block">
                                📅 &nbsp; 15 May 2025 | Thursday
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg text-[#06247a]">
                                    ●
                                </div>

                                <div className="hidden md:block">
                                    <div className="text-xs font-semibold">
                                        Nusrat Jahan⌄
                                    </div>

                                    <div className="text-[10px] text-blue-200">
                                        Section Incharge
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* =====================================================
          MAIN
      ===================================================== */}

                <main className="mx-auto max-w-[1450px] p-4">
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_180px]">
                        {/* =================================================
              LEFT CONTENT
          ================================================= */}

                        <div className="min-w-0">
                            {/* Welcome */}
                            <section className="rounded-lg border border-blue-100 bg-white px-4 py-3 shadow-sm">
                                <div className="flex gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                        ℹ
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-bold text-blue-700">
                                            Welcome to Attendance Cell
                                        </h2>

                                        <p className="text-xs text-gray-500">
                                            View overall attendance summary and
                                            manage requests forwarded by
                                            Attendance Cell.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* =================================================
                SHIFT SUMMARY
            ================================================= */}

                            <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                                {/* Current Shift */}
                                <div className="rounded-lg border border-blue-100 bg-white p-4 shadow-sm">
                                    <div className="flex items-center justify-between border-b pb-3">
                                        <div className="text-xs font-bold text-blue-700">
                                            1. CURRENT SHIFT
                                            <span className="ml-1 text-[9px] text-gray-500">
                                                (INCOMING)
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-[9px]">
                                            <span className="rounded bg-green-600 px-2 py-1 font-semibold text-white">
                                                SHIFT A
                                            </span>

                                            <span className="font-semibold text-blue-700">
                                                06:00 AM - 02:00 PM
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 divide-x py-4">
                                        <div className="text-center">
                                            <div className="text-2xl text-green-600">
                                                👥
                                            </div>

                                            <div className="mt-1 text-[10px] font-semibold text-gray-500">
                                                PRESENT
                                            </div>

                                            <div className="text-xl font-bold text-green-600">
                                                1,256
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <div className="text-2xl text-red-600">
                                                👤
                                            </div>

                                            <div className="mt-1 text-[10px] font-semibold text-gray-500">
                                                ABSENT
                                            </div>

                                            <div className="text-xl font-bold text-red-600">
                                                87
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <div className="text-2xl text-orange-500">
                                                ◷
                                            </div>

                                            <div className="mt-1 text-[10px] font-semibold text-gray-500">
                                                PUNCH MISSING
                                            </div>

                                            <div className="text-xl font-bold text-orange-500">
                                                46
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-md bg-blue-50 px-3 py-2 text-[10px] text-blue-700">
                                        <span className="font-bold">
                                            ● &nbsp; Last Punch Time:
                                        </span>{" "}
                                        06:48 AM
                                    </div>
                                </div>

                                {/* Previous Shift */}
                                <div className="rounded-lg border border-blue-100 bg-white p-4 shadow-sm">
                                    <div className="flex items-center justify-between border-b pb-3">
                                        <div className="text-xs font-bold text-blue-700">
                                            2. PREVIOUS SHIFT
                                            <span className="ml-1 text-[9px] text-gray-500">
                                                (OUTGOING)
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-[9px]">
                                            <span className="rounded bg-blue-600 px-2 py-1 font-semibold text-white">
                                                SHIFT C
                                            </span>

                                            <span className="font-semibold text-blue-700">
                                                10:00 PM - 06:00 AM
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 divide-x py-4">
                                        <div className="text-center">
                                            <div className="text-2xl text-blue-600">
                                                ⇥
                                            </div>

                                            <div className="mt-1 text-[10px] font-semibold text-gray-500">
                                                OUT PUNCH DONE
                                            </div>

                                            <div className="text-xl font-bold text-blue-600">
                                                1,184
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <div className="text-2xl text-red-500">
                                                ◷
                                            </div>

                                            <div className="mt-1 text-[10px] font-semibold text-gray-500">
                                                MISSING OUT PUNCH
                                            </div>

                                            <div className="text-xl font-bold text-red-500">
                                                32
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-md bg-blue-50 px-3 py-2 text-[10px] text-blue-700">
                                        <span className="font-bold">
                                            ● &nbsp; Outgoing shift Out Punch entry
                                            must be completed before handover.
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {/* =================================================
                REQUESTS
            ================================================= */}

                            <section className="mt-4">
                                <h2 className="mb-3 text-xs font-bold uppercase text-blue-900">
                                    Requests & Actions Received From
                                    Attendance Cell
                                </h2>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                                    <RequestCard
                                        title="Leave Requests"
                                        count={18}
                                        subtitle="Pending Verification"
                                        color="border-blue-100"
                                        icon={
                                            <span className="text-2xl text-blue-600">
                                                ▣
                                            </span>
                                        }
                                    />

                                    <RequestCard
                                        title="Earned Leave Encashment Requests"
                                        count="06"
                                        subtitle="Pending Verification"
                                        color="border-green-100"
                                        icon={
                                            <span className="text-2xl text-green-600">
                                                ▣
                                            </span>
                                        }
                                    />

                                    <RequestCard
                                        title="Maternity Leave Encashment Requests"
                                        count="04"
                                        subtitle="Pending Verification"
                                        color="border-purple-100"
                                        icon={
                                            <span className="text-2xl text-purple-600">
                                                ♀
                                            </span>
                                        }
                                    />

                                    {/* IMPORTANT:
                    Attendance Exception opens the
                    Post-Lock CRUD popup.
                */}
                                    <RequestCard
                                        title="Attendance Exception Requests"
                                        count={pendingPayrollAdjustments}
                                        subtitle="Pending Verification"
                                        color="border-orange-200"
                                        icon={
                                            <span className="text-2xl text-orange-500">
                                                ⚠
                                            </span>
                                        }
                                        onClick={openExceptionModal}
                                    />

                                    <RequestCard
                                        title="Leave Without Pay Requests"
                                        count="09"
                                        subtitle="Pending Verification"
                                        color="border-cyan-100"
                                        icon={
                                            <span className="text-2xl text-cyan-600">
                                                ◎
                                            </span>
                                        }
                                    />
                                </div>
                            </section>

                            {/* =================================================
                IMPORTANT NOTICE
            ================================================= */}

                            <section className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                                <div className="flex gap-3">
                                    <span className="font-bold text-blue-600">
                                        ●
                                    </span>

                                    <div>
                                        <span className="mr-5 text-[10px] font-bold text-blue-800">
                                            IMPORTANT
                                        </span>

                                        <span className="text-[10px] text-blue-700">
                                            Please review all pending requests and
                                            take necessary action in a timely manner.
                                            Verified items will be forwarded to the
                                            next level for approval.
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {/* =================================================
                QUICK LINKS
            ================================================= */}

                            <section className="mt-4">
                                <h2 className="mb-2 text-xs font-bold uppercase text-blue-900">
                                    Quick Links
                                </h2>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                                    {[
                                        "Attendance Reports",
                                        "Daily Attendance Summary",
                                        "Shift Summary Report",
                                        "Exception Summary Report",
                                        "Punch Missing Report",
                                    ].map((item, index) => (
                                        <button
                                            type="button"
                                            key={item}
                                            className="flex items-center justify-between rounded-md border border-blue-100 bg-white px-3 py-3 text-left text-[10px] font-semibold text-blue-900 shadow-sm hover:bg-blue-50"
                                        >
                                            <span>
                                                <span className="mr-2 text-blue-600">
                                                    {["◷", "♟", "◷", "⚠", "◷"][index]}
                                                </span>

                                                {item}
                                            </span>

                                            <span>›</span>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* =================================================
                BACK
            ================================================= */}

                            <button
                                type="button"
                                className="mt-4 rounded-md border border-blue-200 bg-white px-4 py-2 text-[10px] font-semibold text-blue-700 hover:bg-blue-50"
                            >
                                ← &nbsp; Back to Section Dashboard
                            </button>
                        </div>

                        {/* =================================================
              RIGHT WORKFLOW SIDEBAR
          ================================================= */}

                        <aside className="hidden xl:block">
                            <div className="sticky top-4 rounded-lg border border-blue-100 bg-white shadow-sm">
                                <div className="rounded-t-lg bg-[#06247a] px-3 py-3 text-center text-[10px] font-bold text-white">
                                    PAYROLL ADJUSTMENT WORKFLOW
                                </div>

                                <div className="space-y-4 p-4">
                                    {[
                                        [
                                            "1",
                                            "Request Raised",
                                            "Factory / Time Office",
                                        ],
                                        [
                                            "2",
                                            "Verified & Submitted",
                                            "Attendance Cell",
                                        ],
                                        [
                                            "3",
                                            "Pending IT Approval",
                                            "Head Office IT",
                                        ],
                                        [
                                            "4",
                                            "Approved by IT",
                                            "Ready for Next Payroll",
                                        ],
                                        [
                                            "5",
                                            "Applied in Payroll",
                                            "Automatically in Next Payroll Processing",
                                        ],
                                        [
                                            "6",
                                            "Processed",
                                            "Adjustment Posted & Archived",
                                        ],
                                    ].map(
                                        ([number, title, subtitle]) => (
                                            <div
                                                key={number}
                                                className="relative flex gap-3"
                                            >
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                                    {number}
                                                </div>

                                                <div className="pt-1">
                                                    <div className="text-[10px] font-bold text-blue-900">
                                                        {title}
                                                    </div>

                                                    <div className="text-[9px] text-gray-600">
                                                        {subtitle}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Important Notes */}
                            <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                <h3 className="text-[10px] font-bold uppercase text-gray-800">
                                    Important Notes
                                </h3>

                                <ul className="mt-3 space-y-2 text-[9px] leading-4 text-gray-700">
                                    <li>
                                        • Only post-lock attendance issues will
                                        be submitted in this tab.
                                    </li>

                                    <li>
                                        • All financial impact will be added in
                                        the next payroll.
                                    </li>

                                    <li>
                                        • Approval from Head Office IT is mandatory
                                        before it is taken to payroll.
                                    </li>

                                    <li>
                                        • Complete audit trail will be maintained.
                                    </li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                </main>

                {/* =====================================================
          ATTENDANCE EXCEPTION / POST-LOCK LIST MODAL
      ===================================================== */}

                {exceptionModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b px-6 py-4">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Attendance Exception Requests
                                    </h2>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Payroll Adjustments (Post-Lock)
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setExceptionModalOpen(false)
                                    }
                                    className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="border-b px-6">
                                <div className="flex gap-5">
                                    <button
                                        type="button"
                                        className="border-b-2 border-transparent py-3 text-xs text-gray-500"
                                    >
                                        Normal Attendance Exceptions
                                    </button>

                                    <button
                                        type="button"
                                        className="border-b-2 border-blue-600 py-3 text-xs font-bold text-blue-600"
                                    >
                                        Payroll Adjustments (Post-Lock)
                                    </button>
                                </div>
                            </div>

                            {/* Toolbar */}
                            <div className="flex items-center justify-between border-b bg-gray-50 px-6 py-3">
                                <div className="text-xs text-gray-600">
                                    Total Requests:{" "}
                                    <span className="font-bold text-gray-900">
                                        {requests.length}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleNewRequest}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                                >
                                    + New Payroll Adjustment Request
                                </button>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="mx-6 mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-600">
                                    {error}
                                </div>
                            )}

                            {/* Table */}
                            <div className="flex-1 overflow-auto p-6">
                                {loading ? (
                                    <div className="py-10 text-center text-sm text-gray-500">
                                        Loading requests...
                                    </div>
                                ) : requests.length === 0 ? (
                                    <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center">
                                        <div className="text-sm text-gray-500">
                                            No Payroll Adjustment requests
                                            found.
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleNewRequest}
                                            className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
                                        >
                                            + Create New Request
                                        </button>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto rounded-lg border">
                                        <table className="min-w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600">
                                                        Request ID
                                                    </th>

                                                    <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600">
                                                        Attendance Month
                                                    </th>

                                                    <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600">
                                                        Company
                                                    </th>

                                                    <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600">
                                                        Pending
                                                    </th>

                                                    <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-600">
                                                        Total Amount
                                                    </th>

                                                    <th className="px-4 py-3 text-center text-[10px] font-bold text-gray-600">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="divide-y">
                                                {requests.map(
                                                    (request) => {
                                                        const addition =
                                                            Number(
                                                                request.basicSalaryImpact ||
                                                                0
                                                            ) +
                                                            Number(
                                                                request.otImpact || 0
                                                            ) +
                                                            Number(
                                                                request.nightAllowanceImpact ||
                                                                0
                                                            );

                                                        const total =
                                                            addition -
                                                            Number(
                                                                request.deductionImpact ||
                                                                0
                                                            );

                                                        return (
                                                            <tr
                                                                key={
                                                                    request.requestId
                                                                }
                                                                className="hover:bg-gray-50"
                                                            >
                                                                <td className="px-4 py-3 text-[10px] font-medium text-gray-800">
                                                                    {
                                                                        request.requestId
                                                                    }
                                                                </td>

                                                                <td className="px-4 py-3 text-[10px] text-gray-600">
                                                                    {
                                                                        request.attendanceMonth
                                                                    }
                                                                </td>

                                                                <td className="px-4 py-3 text-[10px] text-gray-600">
                                                                    {request.company}
                                                                </td>

                                                                <td className="px-4 py-3 text-center text-[10px] text-gray-600">
                                                                    1
                                                                </td>

                                                                <td className="px-4 py-3 text-right text-[10px] font-semibold text-gray-800">
                                                                    {total.toLocaleString(
                                                                        "en-US",
                                                                        {
                                                                            minimumFractionDigits: 2,
                                                                        }
                                                                    )}
                                                                </td>

                                                                <td className="px-4 py-3 text-center">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleEdit(
                                                                                request
                                                                            )
                                                                        }
                                                                        className="text-[10px] font-semibold text-blue-600 underline"
                                                                    >
                                                                        View
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end border-t bg-gray-50 px-6 py-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setExceptionModalOpen(false)
                                    }
                                    className="rounded-md border border-gray-300 bg-white px-5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

                {formModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
                        <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl">
                            {/* Header */}
                            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
                                <div>
                                    <h2 className="text-base font-bold text-gray-900">
                                        {editingRequest
                                            ? "Edit Payroll Adjustment Request"
                                            : "New Payroll Adjustment Request (Post-Lock)"}
                                    </h2>

                                    <p className="mt-1 text-[10px] text-gray-500">
                                        Attendance Exception → Payroll
                                        Adjustment
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormModalOpen(false)
                                    }
                                    className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                                >
                                    ✕
                                </button>
                            </div>

                            <form
                                onSubmit={handleSubmit(
                                    handlePayrollAdjustmentSubmit
                                )}
                                className="p-6"
                            >
                                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]">

                                    {/* =====================================================
        LEFT
    ====================================================== */}

                                    <div className="space-y-4">

                                        <h3 className="border-b pb-2 text-xs font-bold uppercase text-blue-900">
                                            Request Information
                                        </h3>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                            {/* Employee Search */}

                                            <CommonInputField<PayrollAdjustmentPayload>
                                                label="Employee"
                                                name="employeeId"
                                                register={register}
                                                errors={errors}
                                                control={control}
                                                type="searchable-dropdown"
                                                placeholder="Search employee"
                                                options={employeeOptions}
                                                onSearchChange={
                                                    handleEmployeeSearch
                                                }
                                                onOptionSelect={
                                                    handleEmployeeSelect
                                                }
                                                rules={{
                                                    required:
                                                        "Employee is required",
                                                }}
                                            />

                                            {/* Employee Name */}

                                            <CommonInputField<PayrollAdjustmentPayload>
                                                label="Employee Name"
                                                name="employeeName"
                                                register={register}
                                                errors={errors}
                                                control={control}
                                                disabled
                                                rules={{
                                                    required:
                                                        "Employee name is required",
                                                }}
                                            />

                                            {/* Company */}

                                            <CommonInputField<PayrollAdjustmentPayload>
                                                label="Company"
                                                name="company"
                                                register={register}
                                                errors={errors}
                                                control={control}
                                                disabled
                                                // rules={{
                                                //     required:
                                                //         "Company is required",
                                                // }}
                                            />

                                            {/* Department */}

                                            <CommonInputField<PayrollAdjustmentPayload>
                                                label="Department"
                                                name="department"
                                                register={register}
                                                errors={errors}
                                                control={control}
                                                disabled
                                            />

                                            {/* Designation */}

                                            <CommonInputField<PayrollAdjustmentPayload>
                                                label="Designation"
                                                name="designation"
                                                register={register}
                                                errors={errors}
                                                control={control}
                                                disabled
                                            />

                                            {/* Attendance Month */}

                                            <CommonInputField<PayrollAdjustmentPayload>
                                                label="Attendance Month"
                                                name="attendanceMonth"
                                                register={register}
                                                errors={errors}
                                                control={control}
                                                type="date"
                                                rules={{
                                                    required:
                                                        "Attendance month is required",
                                                }}
                                            />

                                            {/* Correction Type */}

                                            <CommonInputField<PayrollAdjustmentPayload>
                                                label="Correction Type"
                                                name="correctionType"
                                                register={register}
                                                errors={errors}
                                                control={control}
                                                type="dropdown"
                                                options={[
                                                    {
                                                        label:
                                                            "Missed Punch (Both)",
                                                        value:
                                                            "Missed Punch (Both)",
                                                    },
                                                    {
                                                        label:
                                                            "Missed In Punch",
                                                        value:
                                                            "Missed In Punch",
                                                    },
                                                    {
                                                        label:
                                                            "Missed Out Punch",
                                                        value:
                                                            "Missed Out Punch",
                                                    },
                                                    {
                                                        label:
                                                            "Attendance Correction",
                                                        value:
                                                            "Attendance Correction",
                                                    },
                                                    {
                                                        label: "Overtime",
                                                        value: "Overtime",
                                                    },
                                                    {
                                                        label:
                                                            "Night Allowance",
                                                        value:
                                                            "Night Allowance",
                                                    },
                                                    {
                                                        label: "Other",
                                                        value: "Other",
                                                    },
                                                ]}
                                                rules={{
                                                    required:
                                                        "Correction type is required",
                                                }}
                                            />
                                        </div>

                                        {/* Reason */}

                                        <div>
                                            <label className="mb-1 block text-[10px] font-semibold text-gray-700">
                                                Reason
                                                <span className="ml-1 text-red-500">
                                                    *
                                                </span>
                                            </label>

                                            <textarea
                                                {...register("reason", {
                                                    required:
                                                        "Reason is required",
                                                })}
                                                rows={4}
                                                placeholder="Enter reason for payroll adjustment..."
                                                className="
            w-full rounded-lg
            border border-gray-300
            px-3 py-2 text-sm
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
                                            />

                                            {errors.reason && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.reason.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Supporting Document */}

                                        <CommonInputField<PayrollAdjustmentPayload>
                                            label="Supporting Document / Evidence"
                                            name="supportingDocument"
                                            register={register}
                                            errors={errors}
                                            control={control}
                                            placeholder="Document reference / URL"
                                        />

                                        {/* Remarks */}

                                        <div>
                                            <label className="mb-1 block text-[10px] font-semibold text-gray-700">
                                                Remarks
                                            </label>

                                            <textarea
                                                {...register("remarks")}
                                                rows={3}
                                                placeholder="Verified and recommended for adjustment."
                                                className="
            w-full rounded-lg
            border border-gray-300
            px-3 py-2 text-sm
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
                                            />

                                            {errors.remarks && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.remarks.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>


                                    {/* =====================================================
        RIGHT - FINANCIAL IMPACT
    ====================================================== */}

                                    <div>
                                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">

                                            <h3 className="mb-4 text-xs font-bold text-blue-900">
                                                Financial Impact (Calculated)
                                            </h3>

                                            <div className="space-y-4">

                                                {/* Basic Salary */}

                                                <CommonInputField<PayrollAdjustmentPayload>
                                                    label="Basic Salary Impact"
                                                    name="basicSalaryImpact"
                                                    register={register}
                                                    errors={errors}
                                                    control={control}
                                                    type="number"
                                                    rules={{
                                                        valueAsNumber: true,
                                                    }}
                                                />

                                                {/* OT */}

                                                <CommonInputField<PayrollAdjustmentPayload>
                                                    label="OT Impact"
                                                    name="otImpact"
                                                    register={register}
                                                    errors={errors}
                                                    control={control}
                                                    type="number"
                                                    rules={{
                                                        valueAsNumber: true,
                                                    }}
                                                />

                                                {/* Night Allowance */}

                                                <CommonInputField<PayrollAdjustmentPayload>
                                                    label="Night Allowance Impact"
                                                    name="nightAllowanceImpact"
                                                    register={register}
                                                    errors={errors}
                                                    control={control}
                                                    type="number"
                                                    rules={{
                                                        valueAsNumber: true,
                                                    }}
                                                />

                                                {/* Total Addition */}

                                                <div className="flex items-center justify-between border-t pt-3">
                                                    <span className="text-[10px] font-medium text-gray-600">
                                                        Total Addition
                                                    </span>

                                                    <span className="text-sm font-bold text-green-600">
                                                        {totalAddition.toLocaleString(
                                                            "en-US",
                                                            {
                                                                minimumFractionDigits: 2,
                                                            }
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Deduction */}

                                                <CommonInputField<PayrollAdjustmentPayload>
                                                    label="Deduction Impact"
                                                    name="deductionImpact"
                                                    register={register}
                                                    errors={errors}
                                                    control={control}
                                                    type="number"
                                                    rules={{
                                                        valueAsNumber: true,
                                                    }}
                                                />

                                                {/* Net Impact */}

                                                <div className="rounded-md bg-green-50 p-3">
                                                    <div className="flex items-center justify-between">

                                                        <span className="text-[10px] font-bold text-gray-700">
                                                            Net Impact
                                                        </span>

                                                        <span className="text-base font-bold text-green-600">
                                                            {netImpact.toLocaleString(
                                                                "en-US",
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                }
                                                            )}
                                                        </span>

                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>


                                {/* =====================================================
      FOOTER
  ====================================================== */}

                                <div className="mt-6 flex justify-end gap-3 border-t pt-4">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFormModalOpen(false)
                                        }
                                        className="
        rounded-md
        border border-gray-300
        bg-white
        px-4 py-2
        text-xs font-semibold
        text-gray-700
        hover:bg-gray-50
      "
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="
        rounded-md
        bg-blue-600
        px-5 py-2
        text-xs font-semibold
        text-white
        hover:bg-blue-700
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
                                    >
                                        {saving
                                            ? "Saving..."
                                            : editingRequest
                                                ? "Update Request"
                                                : "Create Request"}
                                    </button>

                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* =====================================================
          SUCCESS MODAL
      ===================================================== */}

                {successModalOpen && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
                        <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
                            {/* Header */}
                            <div className="flex justify-end px-5 pt-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSuccessModalOpen(false)
                                    }
                                    className="rounded-md p-1 text-gray-400 hover:bg-gray-100"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Content */}
                            <div className="px-8 pb-8 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500 text-2xl font-bold text-white">
                                        ✓
                                    </div>
                                </div>

                                <h2 className="mt-4 text-base font-bold text-gray-900">
                                    Request Submitted Successfully
                                </h2>

                                <p className="mt-2 text-xs leading-5 text-gray-500">
                                    Payroll Adjustment Request has been
                                    forwarded to Head Office IT for approval.
                                </p>

                                {submittedRequest && (
                                    <div className="mt-5 rounded-lg bg-gray-50 p-4 text-left">
                                        <div className="grid grid-cols-2 gap-y-3 text-[10px]">
                                            <span className="font-semibold text-gray-600">
                                                Request ID
                                            </span>

                                            <span className="font-semibold text-gray-900">
                                                {
                                                    submittedRequest.requestId
                                                }
                                            </span>

                                            <span className="font-semibold text-gray-600">
                                                Employee ID
                                            </span>

                                            <span className="text-gray-900">
                                                {
                                                    submittedRequest.employeeId
                                                }
                                            </span>

                                            <span className="font-semibold text-gray-600">
                                                Attendance Month
                                            </span>

                                            <span className="text-gray-900">
                                                {
                                                    submittedRequest.attendanceMonth
                                                }
                                            </span>

                                            <span className="font-semibold text-gray-600">
                                                Status
                                            </span>

                                            <span className="font-semibold text-orange-500">
                                                Pending Head Office IT
                                                Approval
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSuccessModalOpen(false)
                                    }
                                    className="mt-6 w-full rounded-md bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* <PayrollAdjustmentPostLock/> */}
            </div>
        );
    };

export default AttendanceCellDashboard;