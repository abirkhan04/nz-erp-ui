import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import CommonInputField from "./../../components/CommonInputFields";

import type { EmployeeFormValues } from "./EmployeeFormValues";

const AddressDetailsForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<EmployeeFormValues>();

  const watchSameAsPresent = watch(
    "sameAsPresentAddress"
  );

  const presentAddressValues = watch();

  useEffect(() => {
    if (watchSameAsPresent) {
      setValue(
        "permanentVillageRoadHouse",
        presentAddressValues.presentVillageRoadHouse || ""
      );

      setValue(
        "permanentPostOffice",
        presentAddressValues.presentPostOffice || ""
      );

      setValue(
        "permanentThanaUpazila",
        presentAddressValues.presentThanaUpazila || ""
      );

      setValue(
        "permanentDistrict",
        presentAddressValues.presentDistrict || ""
      );

      setValue(
        "permanentDivision",
        presentAddressValues.presentDivision || ""
      );

      setValue(
        "permanentAddressBangla",
        presentAddressValues.presentAddressBangla || ""
      );

      setValue(
        "permanentPostOfficeBangla",
        presentAddressValues.presentPostOfficeBangla || ""
      );

      setValue(
        "permanentThanaUpazilaBangla",
        presentAddressValues.presentThanaUpazilaBangla || ""
      );

      setValue(
        "permanentDistrictBangla",
        presentAddressValues.presentDistrictBangla || ""
      );

      setValue(
        "permanentDivisionBangla",
        presentAddressValues.presentDivisionBangla || ""
      );
    }
  }, [
    watchSameAsPresent,
    presentAddressValues,
    setValue,
  ]);

  const onSubmit = (
    data: EmployeeFormValues
  ) => {
    console.log("Address Details:", data);
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  const disabledInputClass =
    "w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-sm";

  const presentAddressFields = [
    {
      label: "Village / Road / House *",
      name: "presentVillageRoadHouse",
      type: "text",
      rules: {
        required:
          "Present address is required",
      },
    },

    {
      label: "Post Office *",
      name: "presentPostOffice",
      type: "text",
    },

    {
      label: "Thana / Upazila *",
      name: "presentThanaUpazila",
      type: "text",
    },

    {
      label: "District *",
      name: "presentDistrict",
      type: "dropdown",
      options: [
        {
          label: "Dhaka",
          value: "Dhaka",
        },

        {
          label: "Narayanganj",
          value: "Narayanganj",
        },
      ],
    },

    {
      label: "Division *",
      name: "presentDivision",
      type: "dropdown",
      options: [
        {
          label: "Dhaka",
          value: "Dhaka",
        },

        {
          label: "Chittagong",
          value: "Chittagong",
        },
      ],
    },

    {
      label: "Post Office (Bangla)",
      name: "presentPostOfficeBangla",
      type: "text",
    },

    {
      label: "Thana / Upazila (Bangla)",
      name: "presentThanaUpazilaBangla",
      type: "text",
    },

    {
      label: "District (Bangla)",
      name: "presentDistrictBangla",
      type: "text",
    },

    {
      label: "Division (Bangla)",
      name: "presentDivisionBangla",
      type: "text",
    },
  ];

  const permanentAddressFields: any[] = [
    {
      label: "Village / Road / House *",
      name: "permanentVillageRoadHouse",
      type: "text",
    },

    {
      label: "Post Office *",
      name: "permanentPostOffice",
      type: "text",
    },

    {
      label: "Thana / Upazila *",
      name: "permanentThanaUpazila",
      type: "text",
    },

    {
      label: "District *",
      name: "permanentDistrict",
      type: "dropdown",
      options: [
        {
          label: "Dhaka",
          value: "Dhaka",
        },

        {
          label: "Narayanganj",
          value: "Narayanganj",
        },
      ],
    },

    {
      label: "Division *",
      name: "permanentDivision",
      type: "dropdown",
      options: [
        {
          label: "Dhaka",
          value: "Dhaka",
        },

        {
          label: "Chittagong",
          value: "Chittagong",
        },
      ],
    },

    {
      label: "Post Office (Bangla)",
      name: "permanentPostOfficeBangla",
      type: "text",
    },

    {
      label:
        "Thana / Upazila (Bangla)",
      name: "permanentThanaUpazilaBangla",
      type: "text",
    },

    {
      label: "District (Bangla)",
      name: "permanentDistrictBangla",
      type: "text",
    },

    {
      label: "Division (Bangla)",
      name: "permanentDivisionBangla",
      type: "text",
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        {/* PRESENT ADDRESS */}
        <div className="bg-white border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-blue-700">
              Present Address (Current
              Address)
            </h2>

            <div className="text-sm text-red-500">
              * Marked fields are mandatory
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {presentAddressFields.map(
              (field) => (
                <CommonInputField<EmployeeFormValues>
                  key={field.name}
                  label={field.label}
                  name={
                    field.name as keyof EmployeeFormValues
                  }
                  type={
                    field.type as
                      | "text"
                      | "number"
                      | "date"
                      | "email"
                      | "dropdown"
                  }
                  register={register}
                  errors={errors}
                  rules={field.rules}
                  options={field.options}
                />
              )
            )}

            {/* ADDRESS BANGLA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address (Bangla) *
              </label>

              <textarea
                {...register(
                  "presentAddressBangla"
                )}
                className={inputClass}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* PERMANENT ADDRESS */}
        <div className="bg-white border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-blue-700">
              Permanent Address
            </h2>

            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                {...register(
                  "sameAsPresentAddress"
                )}
              />

              Same as Present Address
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {permanentAddressFields.map(
              (field) => (
                <div key={field.name}>
                  <CommonInputField<EmployeeFormValues>
                    label={field.label}
                    name={
                      field.name as keyof EmployeeFormValues
                    }
                    type={
                      field.type as
                        | "text"
                        | "number"
                        | "date"
                        | "email"
                        | "dropdown"
                    }
                    register={register}
                    errors={errors}
                    rules={field.rules}
                    options={field.options}
                    className={
                      watchSameAsPresent
                        ? "opacity-70"
                        : ""
                    }
                  />

                  {watchSameAsPresent && (
                    <style>
                      {`
                        input,
                        select {
                          pointer-events: none;
                        }
                      `}
                    </style>
                  )}
                </div>
              )
            )}

            {/* ADDRESS BANGLA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address (Bangla) *
              </label>

              <textarea
                {...register(
                  "permanentAddressBangla"
                )}
                className={
                  watchSameAsPresent
                    ? disabledInputClass
                    : inputClass
                }
                rows={3}
                disabled={watchSameAsPresent}
              />
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="
              px-6 py-2
              border border-gray-300
              rounded-lg
              hover:bg-gray-50
            "
          >
            Save as Draft
          </button>

          <button
            type="submit"
            className="
              px-6 py-2
              bg-blue-600
              text-white
              rounded-lg
              hover:bg-blue-700
            "
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddressDetailsForm;