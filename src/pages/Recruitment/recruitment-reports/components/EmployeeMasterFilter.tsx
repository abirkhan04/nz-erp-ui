import { Search, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import CommonInputField from "../../../../components/CommonInputFields";
import type {
    EmployeeMasterFilterModel,
    Unit,
} from "../../../../types/interfaces";
import { API_ROUTES } from "../../../../api/routes";
import { useGet } from "../../../../hooks/useGet";
import {
    EmployeeNature,
    genderMapFromNumber,
    religionMap,
} from "../../../EmployeeInformation/types";

type Props = {
    defaultValues?: EmployeeMasterFilterModel;

    loading?: boolean;

    onSearch: (data: EmployeeMasterFilterModel) => void;
    onReset: () => void;
};

export default function EmployeeMasterFilter({
    defaultValues,
    loading = false,
    onSearch,
    onReset,
}: Props) {

    const {
        register,
        control,
        handleSubmit,
        reset,
        resetField,
        watch,
        formState: { errors },
    } = useForm<EmployeeMasterFilterModel>({
        defaultValues,
    });

    const { data: units = [] } = useGet<Unit[]>({
        key: ["units"],
        url: API_ROUTES.UNITS,
    });

    const unitId = watch("unitId");

    const { data: subUnits = [] } = useGet<any[]>({
        key: ["subUnits", unitId],
        url: `${API_ROUTES.SUB_UNITS}/Unit/${unitId}`,
        enabled: !!unitId,
    });

    const { data: departments = [] } = useGet<any[]>({
        key: ["departments"],
        url: API_ROUTES.DEPARTMENT,
    });

    const departmentId = watch("departmentId");

    const { data: sections = [] } = useGet<any[]>({
        key: ["sections", departmentId],
        url: `${API_ROUTES.SECTION}/by-department/${departmentId}?includeInactive=false`,
        enabled: !!departmentId,
    });

    const { data: cells = [] } = useGet<any[]>({
        key: ["cells"],
        url: API_ROUTES.CELL,
    });

    const { data: grades = [] } = useGet<any[]>({
        key: ["grades"],
        url: API_ROUTES.GRADE,
    });

    const { data: shifts = [] } = useGet<any[]>({
        key: ["shifts"],
        url: API_ROUTES.SHIFT,
    });

    const { data: divisions = [] } = useGet<any[]>({
        key: ["divisions"],
        url: API_ROUTES.DIVISIONS,
    });

    type FilterField = {
        label: string;
        name: keyof EmployeeMasterFilterModel;
        placeholder?: string;
        type: "text" | "dropdown" | "date";
        options?: {
            label: string;
            value: string | number;
        }[];
    };

    const filterFields: FilterField[] = [
        {
            label: "Employee ID",
            name: "employeeCode",
            placeholder: "Employee ID",
            type: "text",
        },
        {
            label: "Mobile Number",
            placeholder: "Mobile Number",
            name: "employeeMobile",
            type: "text",
        },
        {
            label: "NID Number",
            name: "employeeNID",
            placeholder: "NID Number",
            type: "text",
        },
        {
            label: "Unit",
            name: "unitId",
            type: "dropdown",
            options: units.map(unit => ({
                label: unit.unitName,
                value: unit.id,
            })),
        },
        {
            label: "Sub Unit",
            name: "subUnitId",
            type: "dropdown",
            options: subUnits.map(subUnit => ({
                label: subUnit.subunitName,
                value: subUnit.id,
            })),
        },
        {
            label: "Department",
            name: "departmentId",
            type: "dropdown",
            options: departments.map(department => ({
                label: department.departmentName,
                value: department.departmentId,
            })),
        },
        {
            label: "Section",
            name: "sectionId",
            type: "dropdown",
            options: sections.map(section => ({
                label: section.sectionName,
                value: section.id,
            })),
        },
        {
            label: "Cell",
            name: "cellId",
            type: "dropdown",
            options: cells.map(cell => ({
                label: cell.cellName,
                value: cell.id,
            })),
        },
        {
            label: "Grade",
            name: "grade",
            type: "dropdown",
            options: grades.map(grade => ({
                label: grade.gradeName,
                value: grade.id,
            })),
        },
        {
            label: "Shift",
            name: "shiftId",
            type: "dropdown",
            options: shifts.map(shift => ({
                label: shift.shiftName,
                value: shift.id,
            })),
        },
        {
            label: "Division",
            name: "divisions",
            type: "dropdown",
            options: divisions.map(division => ({
                label: division.divisionName,
                value: division.id,
            })),
        },
        {
            label: "Religion",
            name: "religion",
            type: "dropdown",
            options: Object.entries(religionMap).map(([label, value]) => ({
                label,
                value,
            })),
        },
        {
            label: "Gender",
            name: "gender",
            type: "dropdown",
            options: Object.entries(genderMapFromNumber).map(([value, label]) => ({
                label,
                value,
            })),
        },
        {
            label: "Employee Type",
            name: "employeeNatureId",
            type: "dropdown",
            options: Object.entries(EmployeeNature).map(([label, value]) => ({
                label,
                value,
            })),
        },
        {
            label: "Employee Type",
            name: "employeeNatureId",
            type: "dropdown",
            options: Object.entries(EmployeeNature).map(([label, value]) => ({
                label,
                value,
            })),
        },
        {
            label: "Joining From",
            name: "joiningFromDate",
            type: "date",
        },
        {
            label: "Joining To",
            name: "joiningToDate",
            type: "date",
        },
    ];
    useEffect(() => {
        resetField("subUnitId");
    }, [unitId, resetField]);

    useEffect(() => {
        resetField("sectionId");
    }, [departmentId, resetField]);

    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues);
        }
    }, [defaultValues, reset]);

    const handleReset = () => {
        reset({
            employeeCode: "",
            employeeMobile: "",
            employeeNID: "",

            unitId: undefined,
            subUnitId: undefined,
            departmentId: undefined,
            sectionId: undefined,
            cellId: undefined,

            grade: undefined,
            divisions: undefined,
            shiftId: undefined,

            religion: undefined,
            gender: undefined,
            employeeNatureId: undefined,

            joiningFromDate: "",
            joiningToDate: "",
        });

        onReset();
    };

    return (
        <form
            onSubmit={handleSubmit(onSearch)}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {filterFields.map((field) => (
                    <CommonInputField
                        key={field.name}
                        label={field.label}
                        placeholder={field.placeholder}
                        name={field.name}
                        type={field.type}
                        register={register}
                        control={control}
                        errors={errors}
                        options={field.options}
                    />
                ))}
            </div>

            <div className="mt-8 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
                >
                    <RotateCcw size={16} />
                    Reset
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    <Search size={16} />
                    Search
                </button>
            </div>
        </form>
    );
}
