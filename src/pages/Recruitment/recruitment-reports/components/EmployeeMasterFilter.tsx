import { Search, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import CommonInputField from "../../../../components/CommonInputFields";
import type { EmployeeMasterFilterModel, Unit } from "../../../../types/interfaces";
import { API_ROUTES } from "../../../../api/routes";
import { useGet } from "../../../../hooks/useGet";
import { EmployeeNature } from "../../../EmployeeInformation/types";

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



    useEffect(() => {
        resetField("subUnitId");
    }, [unitId]);


    useEffect(() => {
        resetField("sectionId");
    }, [departmentId]);


    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues);
        }
    }, [defaultValues, reset]);

    const handleReset = () => {
        reset({
            unitId: undefined,
            subUnitId: undefined,
            departmentId: undefined,
            sectionId: undefined,
            cellId: undefined,
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

                <CommonInputField
                    label="Unit"
                    name="unitId"
                    type="dropdown"
                    register={register}
                    control={control}
                    errors={errors}
                    options={units.map((unit) => ({
                        label: unit.unitName,
                        value: unit.id,
                    }))}
                />

                <CommonInputField
                    label="Sub Unit"
                    name="subUnitId"
                    type="dropdown"
                    register={register}
                    control={control}
                    errors={errors}
                    options={subUnits.map((subUnit) => ({
                        label: subUnit.subunitName,
                        value: subUnit.id,
                    }))}
                />

                <CommonInputField
                    label="Department"
                    name="departmentId"
                    type="dropdown"
                    register={register}
                    control={control}
                    errors={errors}
                    options={departments.map((department) => ({
                        label: department.departmentName,
                        value: department.departmentId,
                    }))}
                />

                <CommonInputField
                    label="Section"
                    name="sectionId"
                    type="dropdown"
                    register={register}
                    control={control}
                    errors={errors}
                    options={sections.map((section) => ({
                        label: section.sectionName,
                        value: section.id,
                    }))}
                />

                <CommonInputField
                    label="Cell"
                    name="cellId"
                    type="dropdown"
                    register={register}
                    control={control}
                    errors={errors}
                    options={cells.map((cell) => ({
                        label: cell.cellName,
                        value: cell.id,
                    }))}
                />

                <CommonInputField
                    label="Employee Type"
                    name="employeeNatureId"
                    type="dropdown"
                    register={register}
                    control={control}
                    errors={errors}
                    options={Object.entries(EmployeeNature).map(([label, value]) => ({
                        label,
                        value
                    }))}
                />

                {/* Joining From */}

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Joining From
                    </label>

                    <input
                        type="date"
                        {...register("joiningFromDate")}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Joining To */}

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Joining To
                    </label>

                    <input
                        type="date"
                        {...register("joiningToDate")}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

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
