import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { api } from "../../api/client";
import { API_ROUTES } from "../../api/routes";
import type { Option } from "../../components/CommonInputFields";
import CommonInputField from "../../components/CommonInputFields";

export interface NewEmployee {
    employeeId: string;
    employeeName: string;
    employeeCode: string;
    designationId: string | null;
    designationName: string;
    departmentId: string;
    departmentName: string;
}

interface AddNewEmployeeProps {
    departmentId?: string;
    onAdd: (employee: NewEmployee, otHours: string) => void;
    addedEmployees: NewEmployee[];
    onRemove: (employeeId: string) => void;
}

interface EmployeeFormValues {
    /*
     * Only used by the searchable dropdown (typed text / picked option).
     * It is never sent anywhere.
     */
    searchEmployee: string;

    /*
     * Filled automatically when an employee is selected.
     */
    employeeId: string;
    employeeCode: string;
    employeeName: string;
    designationName: string;
    departmentName: string;
    otHours: string;
}

const emptyValues: EmployeeFormValues = {
    searchEmployee: "",
    employeeId: "",
    employeeCode: "",
    employeeName: "",
    designationName: "",
    departmentName: "",
    otHours: "",
};

const AddNewEmployee: React.FC<AddNewEmployeeProps> = ({
    departmentId,
    onAdd,
    addedEmployees,
    onRemove,
}) => {
    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<EmployeeFormValues>({
        defaultValues: emptyValues,
    });

    const [employeeOptions, setEmployeeOptions] = useState<Option[]>([]);
    const [searchedEmployees, setSearchedEmployees] = useState<any[]>([]);

    /*
     * Changing this key remounts the search dropdown,
     * which clears any text the user typed into it.
     */
    const [searchKey, setSearchKey] = useState(0);

    /* ---------------------------------------------------------------------- */
    /* SEARCH                                                                 */
    /* ---------------------------------------------------------------------- */

    const handleEmployeeSearch = async (searchText: string) => {
        if (!searchText.trim()) {
            setEmployeeOptions([]);
            setSearchedEmployees([]);
            return;
        }

        try {
            const response = await api.get<any[]>(
                `${API_ROUTES.EMPLOYEES}/search?searchText=${encodeURIComponent(
                    searchText.trim()
                )}`
            );

            const data = response.data ?? [];

            setSearchedEmployees(data);

            setEmployeeOptions(
                data.map((employee) => ({
                    label: `${employee.employeeCode} - ${employee.employeeNameEnglish}`,
                    value: employee.id,
                }))
            );
        } catch (error) {
            console.error("Failed to search employees:", error);

            setEmployeeOptions([]);
            setSearchedEmployees([]);
        }
    };

    /* ---------------------------------------------------------------------- */
    /* SELECT                                                                 */
    /* ---------------------------------------------------------------------- */

    const handleEmployeeSelect = (option: Option) => {
        const employee = searchedEmployees.find(
            (item) => String(item.id) === String(option.value)
        );

        if (!employee) {
            console.error("Employee not found:", option);
            return;
        }

        const alreadyAdded = addedEmployees.some(
            (item) => String(item.employeeId) === String(employee.id)
        );

        if (alreadyAdded) {
            toast.error("Employee already added.");
            return;
        }

        setValue("employeeId", String(employee.id), {
            shouldValidate: true,
        });
        setValue("employeeCode", employee.employeeCode ?? "");
        setValue("employeeName", employee.employeeNameEnglish ?? "", {
            shouldValidate: true,
        });
        setValue("designationName", employee.designationName ?? "");
        setValue("departmentName", employee.departmentName ?? "");

        // Close the dropdown list; the details are now in the form below.
        setEmployeeOptions([]);
        setSearchedEmployees([]);
    };

    /* ---------------------------------------------------------------------- */
    /* SUBMIT                                                                 */
    /* ---------------------------------------------------------------------- */

    const onSubmit = (data: EmployeeFormValues) => {
        const employee: NewEmployee = {
            employeeId: data.employeeId,
            employeeName: data.employeeName,
            employeeCode: data.employeeCode,
            designationId: null,
            designationName: data.designationName,
            departmentId: departmentId || "",
            departmentName: data.departmentName,
        };

        onAdd(employee, data.otHours);

        reset(emptyValues);
        setEmployeeOptions([]);
        setSearchedEmployees([]);
        setSearchKey((key) => key + 1);
    };

    return (
        <div className="rounded-md border border-slate-200 bg-white p-3">
            <div className="mb-2">
                <h3 className="text-[11px] font-bold text-indigo-700">
                    3. ADD NEW EMPLOYEE{" "}
                    <span className="text-[8px] font-normal">
                        (NOT IN PREVIOUS SHIFT)
                    </span>
                </h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                    {/* Search */}
                    <CommonInputField
                        key={searchKey}
                        label="Search Employee"
                        name="searchEmployee"
                        register={register}
                        control={control}
                        errors={errors}
                        type="searchable-dropdown"
                        options={employeeOptions}
                        placeholder="Search by Employee ID or Name"
                        onSearchChange={handleEmployeeSearch}
                        onOptionSelect={handleEmployeeSelect}
                    />

                    {/*
                     * Hidden field that holds the selected employee's id.
                     * Validation here forces the user to pick from the dropdown.
                     */}
                    <input
                        type="hidden"
                        {...register("employeeId", {
                            required: "Please search and select an employee",
                        })}
                    />

                    {errors.employeeId && (
                        <p className="text-[9px] text-red-500">
                            {errors.employeeId.message}
                        </p>
                    )}

                    {/* Employee Code */}
                    <div>
                        <label className="mb-1 block text-[9px] font-semibold text-[#17254c]">
                            Employee Code
                        </label>

                        <input
                            {...register("employeeCode")}
                            readOnly
                            className="input-field bg-slate-50"
                        />
                    </div>

                    {/* Employee Name */}
                    <div>
                        <label className="mb-1 block text-[9px] font-semibold text-[#17254c]">
                            Employee Name{" "}
                            <span className="text-red-500">*</span>
                        </label>

                        <input
                            {...register("employeeName", {
                                required: "Employee name is required",
                            })}
                            readOnly
                            className="input-field bg-slate-50"
                        />

                        {errors.employeeName && (
                            <p className="mt-1 text-[9px] text-red-500">
                                {errors.employeeName.message}
                            </p>
                        )}
                    </div>

                    {/* Designation */}
                    <div>
                        <label className="mb-1 block text-[9px] font-semibold text-[#17254c]">
                            Designation
                        </label>

                        <input
                            {...register("designationName")}
                            readOnly
                            className="input-field bg-slate-50"
                        />
                    </div>

                    {/* Department */}
                    <div>
                        <label className="mb-1 block text-[9px] font-semibold text-[#17254c]">
                            Dept / Section
                        </label>

                        <input
                            {...register("departmentName")}
                            readOnly
                            className="input-field bg-slate-50"
                        />
                    </div>

                    {/* OT Hours */}
                    <div>
                        <label className="mb-1 block text-[9px] font-semibold text-[#17254c]">
                            OT Hours <span className="text-red-500">*</span>
                        </label>

                        <input
                            {...register("otHours", {
                                required: "OT hours are required",
                                pattern: {
                                    value: /^(?:[01]\d|2[0-3]):[0-5]\d$/,
                                    message: "Use HH:mm format, e.g. 01:00",
                                },
                            })}
                            placeholder="HH:mm"
                            className="input-field"
                        />

                        {errors.otHours && (
                            <p className="mt-1 text-[9px] text-red-500">
                                {errors.otHours.message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="flex h-8 items-center gap-1 rounded bg-[#6246c7] px-3 text-[10px] font-semibold text-white hover:bg-[#5236b0]"
                        >
                            <Plus size={13} />
                            Add to List
                        </button>
                    </div>
                </div>
            </form>

            {/* Newly Added Employees */}
            <div className="mt-3 overflow-hidden rounded border border-slate-200">
                <div className="bg-indigo-50 px-2 py-2 text-[9px] font-semibold text-indigo-700">
                    Newly Added Employees
                </div>

                {addedEmployees.length === 0 ? (
                    <div className="px-2 py-4 text-center text-[9px] text-slate-400">
                        No newly added employees
                    </div>
                ) : (
                    addedEmployees.map((employee, index) => (
                        <div
                            key={employee.employeeId}
                            className="grid grid-cols-[20px_70px_1fr_25px] items-center border-t px-2 py-2 text-[9px]"
                        >
                            <span>{index + 1}</span>

                            <span>{employee.employeeCode}</span>

                            <span className="font-medium">
                                {employee.employeeName}
                            </span>

                            <button
                                type="button"
                                onClick={() => onRemove(employee.employeeId)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <Trash2 size={13} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AddNewEmployee;