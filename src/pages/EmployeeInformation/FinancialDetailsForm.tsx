import React from "react";
import {
  Controller,
  useFormContext,
} from "react-hook-form";

import CommonInputField from "./../../components/CommonInputFields";

import type { EmployeeFormValues } from "./EmployeeFormValues";
import type { FieldConfig } from "../../types/interfaces";

const FinancialDetailsForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useFormContext<EmployeeFormValues>();

  const onSubmit = (data: EmployeeFormValues) => {
    console.log("Financial Details:", data);
  };

  const salarySummary = {
    basicSalary: watch("basicSalary") || 0,
    houseRentAllowance:
      watch("houseRentAllowance") || 0,
    medicalAllowance:
      watch("medicalAllowance") || 0,
    conveyanceAllowance:
      watch("conveyanceAllowance") || 0,
    otherAllowance: watch("otherAllowance") || 0,
    grossSalary: watch("grossSalary") || 0,
  };

  const labelClass =
    "block text-sm font-medium text-gray-700 mb-1";

  const salaryInformationFields : FieldConfig<EmployeeFormValues>[] = [
    {
      label: "Gross Salary (BDT) *",
      name: "grossSalary",
      type: "number",
      className:
        "bg-blue-50 font-semibold text-blue-700 rounded-lg",
    },

    {
      label: "Basic Salary *",
      name: "basicSalary",
      type: "number",
      rules: {
        required: "Basic salary is required",
      },
    },

    {
      label: "House Rent Allowance",
      name: "houseRentAllowance",
      type: "number",
    },

    {
      label: "Medical Allowance",
      name: "medicalAllowance",
      type: "number",
    },

    {
      label: "Conveyance Allowance",
      name: "conveyanceAllowance",
      type: "number",
    },

    {
      label: "Other Allowance",
      name: "otherAllowance",
      type: "number",
    },
  ];

  const paymentInformationFields: FieldConfig<EmployeeFormValues>[] = [
    {
      label: "Payment Method *",
      name: "paymentMethod",
      type: "dropdown",
      options: [
        {
          label: "Bank",
          value: "Bank",
        },
        {
          label: "Cash",
          value: "Cash",
        },
        {
          label: "Mobile Banking",
          value: "Mobile Banking",
        },
      ],
    },

    {
      label: "Bank Name *",
      name: "bankName",
      type: "dropdown",
      options: [
        {
          label:
            "Dutch-Bangla Bank Ltd.",
          value:
            "Dutch-Bangla Bank Ltd.",
        },

        {
          label: "BRAC Bank",
          value: "BRAC Bank",
        },

        {
          label: "City Bank",
          value: "City Bank",
        },
      ],
    },

    {
      label: "Bank Account No. *",
      name: "bankAccountNo",
      type: "text",
    },

    {
      label: "Account Type",
      name: "accountType",
      type: "dropdown",
      options: [
        {
          label: "Savings",
          value: "Savings",
        },

        {
          label: "Current",
          value: "Current",
        },
      ],
    },

    {
      label: "Branch",
      name: "branch",
      type: "text",
    },
  ];

  const taxInformationFields: FieldConfig<EmployeeFormValues>[] = [
    {
      label: "TIN Number",
      name: "tinNumber",
      type: "text",
    },

    {
      label: "Tax Exempted (If any)",
      name: "taxExempted",
      type: "dropdown",
      options: [
        {
          label: "Disabled",
          value: "Disabled",
        },

        {
          label: "Freedom Fighter",
          value: "Freedom Fighter",
        },
      ],
    },

    {
      label: "NID Number",
      name: "nidNumber",
      type: "text",
    },
  ];

  const otherFinancialFields: FieldConfig<EmployeeFormValues>[]  = [
    {
      label: "PF Account No.",
      name: "pfAccountNo",
      type: "text",
      placeholder: "Enter PF Account No.",
    },

    {
      label: "Salary Effective From *",
      name: "salaryEffectiveFrom",
      type: "date",
    },

    {
      label: "Remarks",
      name: "remarks",
      type: "text",
      placeholder:
        "Enter remarks (if any)",
      className: "md:col-span-3",
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT SECTION */}
        <div className="lg:col-span-3 space-y-6">
          {/* SALARY INFORMATION */}
          <div className="bg-white border rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-blue-700 mb-6">
              Salary Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {salaryInformationFields.map(
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
                    placeholder={
                      field.placeholder
                    }
                    className={
                      field.className
                    }
                  />
                )
              )}
            </div>
          </div>

          {/* PAYMENT INFORMATION */}
          <div className="bg-white border rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-blue-700 mb-6">
              Payment Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
              {paymentInformationFields.map(
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
                    placeholder={
                      field.placeholder
                    }
                  />
                )
              )}
            </div>
          </div>

          {/* TAX INFORMATION */}
          <div className="bg-white border rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-blue-700 mb-6">
              Tax & Statutory Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {taxInformationFields.map(
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
                    placeholder={
                      field.placeholder
                    }
                  />
                )
              )}

              {/* TAX STATUS */}
              <div>
                <label className={labelClass}>
                  Tax Status *
                </label>

                <Controller
                  control={control}
                  name="taxStatus"
                  render={({ field }) => (
                    <div className="flex gap-5 pt-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="Taxable"
                          checked={
                            field.value ===
                            "Taxable"
                          }
                          onChange={
                            field.onChange
                          }
                        />

                        Taxable
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="Non-Taxable"
                          checked={
                            field.value ===
                            "Non-Taxable"
                          }
                          onChange={
                            field.onChange
                          }
                        />

                        Non-Taxable
                      </label>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          {/* OTHER FINANCIAL INFORMATION */}
          <div className="bg-white border rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-blue-700 mb-6">
              Other Financial Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {/* PROVIDENT FUND */}
              <div>
                <label className={labelClass}>
                  Provident Fund (PF)
                  Applicable
                </label>

                <Controller
                  control={control}
                  name="providentFund"
                  render={({ field }) => (
                    <div className="flex gap-5 pt-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="Yes"
                          checked={
                            field.value ===
                            "Yes"
                          }
                          onChange={
                            field.onChange
                          }
                        />

                        Yes
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="No"
                          checked={
                            field.value ===
                            "No"
                          }
                          onChange={
                            field.onChange
                          }
                        />

                        No
                      </label>
                    </div>
                  )}
                />
              </div>

              {/* GRATUITY */}
              <div>
                <label className={labelClass}>
                  Gratuity Applicable
                </label>

                <Controller
                  control={control}
                  name="gratuityApplicable"
                  render={({ field }) => (
                    <div className="flex gap-5 pt-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="Yes"
                          checked={
                            field.value ===
                            "Yes"
                          }
                          onChange={
                            field.onChange
                          }
                        />

                        Yes
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="No"
                          checked={
                            field.value ===
                            "No"
                          }
                          onChange={
                            field.onChange
                          }
                        />

                        No
                      </label>
                    </div>
                  )}
                />
              </div>

              {/* ESI */}
              <div>
                <label className={labelClass}>
                  ESI Applicable
                </label>

                <Controller
                  control={control}
                  name="esiApplicable"
                  render={({ field }) => (
                    <div className="flex gap-5 pt-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="Yes"
                          checked={
                            field.value ===
                            "Yes"
                          }
                          onChange={
                            field.onChange
                          }
                        />

                        Yes
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="No"
                          checked={
                            field.value ===
                            "No"
                          }
                          onChange={
                            field.onChange
                          }
                        />

                        No
                      </label>
                    </div>
                  )}
                />
              </div>

              {otherFinancialFields.map(
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
                    placeholder={
                      field.placeholder
                    }
                    className={
                      field.className
                    }
                  />
                )
              )}
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

        {/* RIGHT SUMMARY PANEL */}
        <div className="bg-white border rounded-2xl p-5 h-fit">
          <h2 className="text-lg font-semibold text-blue-700 mb-6">
            Salary Summary
          </h2>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span>Basic Salary</span>

              <span className="font-medium">
                {salarySummary.basicSalary.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>
                House Rent Allowance
              </span>

              <span className="font-medium">
                {salarySummary.houseRentAllowance.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Medical Allowance</span>

              <span className="font-medium">
                {salarySummary.medicalAllowance.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>
                Conveyance Allowance
              </span>

              <span className="font-medium">
                {salarySummary.conveyanceAllowance.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Other Allowance</span>

              <span className="font-medium">
                {salarySummary.otherAllowance.toLocaleString()}
              </span>
            </div>

            <div className="border-t pt-4 flex justify-between text-blue-700 font-bold">
              <span>
                Gross Salary (BDT)
              </span>

              <span>
                {salarySummary.grossSalary.toLocaleString()}
              </span>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl text-xs text-gray-600 leading-5">
              This information will be used
              for salary processing and
              statutory compliance.
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default FinancialDetailsForm;