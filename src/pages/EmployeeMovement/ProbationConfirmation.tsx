import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { format, isValid, parse } from "date-fns";
import { Check, Info, Search } from "lucide-react";

import CommonInputField from "../../components/CommonInputFields";
import { api } from "../../api/client";
import { useGet } from "../../hooks/useGet";
import { API_ROUTES } from "../../api/routes";
/* ------------------------------------------------------------------ */
/* Config: change these to your real endpoints / query param names     */
/* ------------------------------------------------------------------ */
const LIST_ENDPOINT = "/Employees/probation-completion";
const CONFIRM_ENDPOINT = "/Employees/probation-confirmation";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
type ProbationItem = {
    employeeId: string;
    employeeCode: string;
    employeeName: string;
    department: string;
    section: string;
    dateOfJoining: string;
    probationEndDate: string;
    status: string;
    confirmationEligible: boolean;
};

type ProbationResponse = {
    total: number;
    items: ProbationItem[];
};

type ConfirmPayload = {
    employeeIds: string[];
};

type FilterForm = {
    department: string;
    section: string;
    probationEndDate: string; // yyyy-MM-dd
};

type Notice = { type: "success" | "error"; text: string } | null;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const formatDisplayDate = (value: string) => {
    const d = parse(value, "yyyy-MM-dd", new Date());
    return isValid(d) ? format(d, "dd-MMM-yyyy") : value;
};

const toLabel = (status: string) =>
    status ? status.charAt(0) + status.slice(1).toLowerCase() : "";

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
const ProbationConfirmation = () => {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        getValues,
        watch,
        setValue,
    } = useForm<FilterForm>({
        defaultValues: {
            department: "",
            section: "",
            probationEndDate: format(new Date(), "yyyy-MM-dd"),
        },
    });

    const [items, setItems] = useState<ProbationItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [confirmingId, setConfirmingId] = useState<string | null>(null);
    const [notice, setNotice] = useState<Notice>(null);


    const selectedDepartment = watch("department");

    const { data: departments = [] } = useGet({ key: ["departments"], url: `${API_ROUTES.DEPARTMENT}` });
    const departmentOptions = departments.map((i: any) => ({ label: i.departmentName, value: i.departmentId }))
    const {
        data: sections = [],
    } = useGet<any[]>({
        key: ["sections", selectedDepartment],
        url: `${API_ROUTES.SECTION}?includeInactive=false&departmentId=${selectedDepartment}`,
        enabled: !!selectedDepartment,
    });

    const sectionOptions = useMemo(
        () =>
            sections.map((section) => ({
                label: section.sectionName,
                value: section.id,
            })),
        [sections]
    );

    const fetchEmployees = useCallback(async (values: FilterForm) => {
        setLoading(true);
        setNotice(null);
        try {
            const res = await api.get<ProbationResponse>(LIST_ENDPOINT, {
                params: {
                    department: values.department || undefined,
                    section: values.section || undefined,
                    probationEndDate: values.probationEndDate || undefined,
                    pageNumber: 1,
                    pageSize: 10000,
                },
            });
            setItems(res.data.items ?? []);
            setTotal(res.data.total ?? 0);
            return res.data.items ?? [];
        } catch {
            setItems([]);
            setTotal(0);
            setNotice({ type: "error", text: "Could not load employees. Please try again." });
            return [];
        } finally {
            setLoading(false);
        }
    }, []);


    // Reset section when department changes and the old section no longer applies
    useEffect(() => {
        const current = getValues("section");
        if (current && !sectionOptions.some((o) => o.value === current)) {
            setValue("section", "");
        }
    }, [sectionOptions, getValues, setValue]);

    const onFilterSubmit = (values: FilterForm) => {
        fetchEmployees(values);
    };

    const handleConfirm = async (employee: ProbationItem) => {
        setConfirmingId(employee.employeeId);
        setNotice(null);

        const payload: ConfirmPayload = { employeeIds: [employee.employeeId] };

        try {
            await api.post(CONFIRM_ENDPOINT, payload);

            setItems((prev) => prev.filter((i) => i.employeeId !== employee.employeeId));
            setTotal((prev) => Math.max(prev - 1, 0));
            setNotice({
                type: "success",
                text: `${employee.employeeName} has been confirmed. A confirmation letter was generated.`,
            });
        } catch {
            setNotice({
                type: "error",
                text: `Could not confirm ${employee.employeeName}. Please try again.`,
            });
        } finally {
            setConfirmingId(null);
        }
    };

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
            {/* Title */}
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold uppercase tracking-wide text-purple-900">
                    Probation Confirmation
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    Identify &amp; confirm employees who have completed their probation period.
                </p>
            </div>

            {/* Filters */}
            <form
                onSubmit={handleSubmit(onFilterSubmit)}
                className="mb-6 grid grid-cols-1 items-end gap-4 md:grid-cols-[1fr_1fr_1fr_auto]"
            >
                <CommonInputField<FilterForm>
                    label="Department"
                    name="department"
                    type="dropdown"
                    register={register}
                    control={control}
                    errors={errors}
                    options={departmentOptions}
                    placeholder="All Departments"
                />

                <CommonInputField<FilterForm>
                    label="Section"
                    name="section"
                    type="dropdown"
                    register={register}
                    control={control}
                    errors={errors}
                    options={sectionOptions}
                    placeholder="All Sections"
                />

                <CommonInputField<FilterForm>
                    label="Probation End Date (up to)"
                    name="probationEndDate"
                    type="date"
                    register={register}
                    control={control}
                    errors={errors}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="flex h-[38px] items-center justify-center gap-2 rounded-lg bg-purple-900 px-6 text-sm font-semibold text-white hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Search size={16} />
                    Filter
                </button>
            </form>

            {/* Table card */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-purple-900">
                        Employees Eligible for Confirmation
                    </h2>
                    <span className="text-base font-semibold text-purple-900">Total: {total}</span>
                </div>

                {notice && (
                    <div
                        role="status"
                        className={`mb-4 rounded-lg px-4 py-2 text-sm ${notice.type === "success"
                                ? "bg-green-50 text-green-800"
                                : "bg-red-50 text-red-700"
                            }`}
                    >
                        {notice.text}
                    </div>
                )}

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full min-w-[900px] text-center text-sm">
                        <thead className="bg-purple-50 text-xs font-semibold text-purple-900">
                            <tr>
                                {[
                                    "SL No.",
                                    "Employee ID",
                                    "Employee Name",
                                    "Department",
                                    "Section",
                                    "Date of Joining",
                                    "Probation End Date",
                                    "Status",
                                    "Action",
                                ].map((h) => (
                                    <th key={h} className="border-r border-white px-3 py-3 last:border-r-0">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="text-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="py-10 text-gray-500">
                                        Loading employees...
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="py-10 text-gray-500">
                                        No employees are due for confirmation with these filters.
                                    </td>
                                </tr>
                            ) : (
                                items.map((emp, index) => {
                                    const isConfirming = confirmingId === emp.employeeId;
                                    return (
                                        <tr key={emp.employeeId} className="border-t border-gray-200">
                                            <td className="px-3 py-3">{index + 1}</td>
                                            <td className="px-3 py-3">{emp.employeeCode}</td>
                                            <td className="px-3 py-3">{emp.employeeName}</td>
                                            <td className="px-3 py-3">{emp.department}</td>
                                            <td className="px-3 py-3">{emp.section}</td>
                                            <td className="px-3 py-3">{formatDisplayDate(emp.dateOfJoining)}</td>
                                            <td className="px-3 py-3">{formatDisplayDate(emp.probationEndDate)}</td>
                                            <td className="px-3 py-3">
                                                <span className="inline-block rounded-full bg-green-50 px-4 py-1 text-xs font-semibold text-green-700">
                                                    {toLabel(emp.status)}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleConfirm(emp)}
                                                    disabled={!emp.confirmationEligible || confirmingId !== null}
                                                    className="inline-flex items-center gap-1.5 rounded-md bg-purple-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <Check size={14} />
                                                    {isConfirming ? "Confirming..." : "Confirm"}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Info bar */}
                <div className="mt-4 flex items-center gap-3 rounded-lg bg-purple-50 px-4 py-3 text-sm text-purple-900">
                    <Info size={20} className="shrink-0" />
                    <p>
                        After clicking Confirm, a Confirmation Letter will be automatically generated and
                        stored in the employee&apos;s personal file.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProbationConfirmation;