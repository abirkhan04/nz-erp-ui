import React from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { api } from "../../api/client";
import { API_ROUTES } from "../../api/routes";

export interface NewEmployee {
    employeeId: string;
    employeeName: string;
    employeeCode: string;
    designationId: string | null;
    designationName: string;
    departmentId: string;
    departmentName: string;
   //  otHours: string;
}

interface AddNewEmployeeProps {
    departmentId?: string;
    onAdd: (employee: NewEmployee, otHours: string) => void;
    addedEmployees: NewEmployee[];
    onRemove: (employeeId: string) => void;
}

interface EmployeeFormValues {
    employeeId: string;
    employeeCode: string;
    employeeName: string;
    designationName: string;
    departmentName: string;
    otHours: string;
}

const AddNewEmployee: React.FC<AddNewEmployeeProps> = ({
    departmentId,
    onAdd,
    addedEmployees,
    onRemove,
}) => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<EmployeeFormValues>({
        defaultValues: {
            employeeId: "",
            employeeCode: "",
            employeeName: "",
            designationName: "",
            departmentName: "",
            otHours: "",
        },
    });

    const handleSearchEmployee = async () => {
        const employeeId = getValues("employeeId");

        if (!employeeId.trim()) {
            return;
        }


        const response = await api.get<any>(`${API_ROUTES.EMPLOYEES}/search?searchText=${employeeId}`);
        const data = response.data[0];
        /*
          * TODO:
          * Replace this with employee search API when available.
          *
          * Example:
          *   */
        
        setValue("employeeId", data.id);
        setValue("employeeName", data.employeeNameEnglish);
        setValue("employeeCode", data.employeeCode);
        setValue("designationName", data.designationName);
        setValue("departmentName", data.departmentName);

    };

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

        reset();
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

            {/* Search */}
            <div className="relative mb-2">
                <Search
                    size={15}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                    {...register("employeeId", {
                        required: "Employee ID is required",
                    })}
                    placeholder="Search by Employee ID"
                    className="h-9 w-full rounded border border-slate-200 pl-3 pr-9 text-[10px] outline-none focus:border-blue-400"
                />
            </div>

            {errors.employeeId && (
                <p className="mb-2 text-[9px] text-red-500">
                    {errors.employeeId.message}
                </p>
            )}

            <button
                type="button"
                onClick={handleSearchEmployee}
                className="mb-3 flex h-8 w-full items-center justify-center gap-1 rounded bg-blue-600 text-[10px] font-semibold text-white hover:bg-blue-700"
            >
                <Search size={13} />
                Search Employee
            </button>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                    {/* Employee Code */}
                    <div>
                        <label className="mb-1 block text-[9px] font-semibold text-[#17254c]">
                            Employee Code
                        </label>

                        <input
                            {...register("employeeCode")}
                            className="input-field"
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
                            className="input-field"
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
                            className="input-field"
                        />
                    </div>

                    {/* Department */}
                    <div>
                        <label className="mb-1 block text-[9px] font-semibold text-[#17254c]">
                            Dept / Section
                        </label>

                        <input
                            {...register("departmentName")}
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-[9px] font-semibold text-[#17254c]">
                            OT Hours <span className="text-red-500">*</span>
                        </label>

                        <input
                            {...register("otHours", {
                                required: "OT hours are required",
                                pattern: {
                                    value: /^\d{1,3}:\d{2}$/,
                                    message: "Use HH:mm format",
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
                                onClick={() =>
                                    onRemove(employee.employeeId)
                                }
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