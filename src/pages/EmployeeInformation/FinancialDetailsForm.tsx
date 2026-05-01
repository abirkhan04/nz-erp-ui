import React from "react";
import {
  useFormContext,
  Controller
} from "react-hook-form";

import type { EmployeeFormValues } from "./EmployeeFormValues";

const FinancialDetailsForm: React.FC = () => {
const {
  register,
  handleSubmit,
  reset,
  watch,
  control,
  formState: { errors },
} = useFormContext<EmployeeFormValues>();


  const onSubmit = (data: EmployeeFormValues) => {
    console.log("Financial Details:", data);
  };

  const salarySummary = {
    basicSalary: watch("basicSalary") || 0,
    houseRentAllowance: watch("houseRentAllowance") || 0,
    medicalAllowance: watch("medicalAllowance") || 0,
    conveyanceAllowance: watch("conveyanceAllowance") || 0,
    otherAllowance: watch("otherAllowance") || 0,
    grossSalary: watch("grossSalary") || 0,
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  const labelClass =
    "block text-sm font-medium text-gray-700 mb-1";

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
              <div>
                <label className={labelClass}>
                  Basic Salary *
                </label>

                <input
                  type="number"
                  {...register("basicSalary", {
                    required: "Basic salary is required",
                  })}
                  className={inputClass}
                />

                {errors.basicSalary && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.basicSalary.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  House Rent Allowance
                </label>

                <input
                  type="number"
                  {...register("houseRentAllowance")}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Medical Allowance
                </label>

                <input
                  type="number"
                  {...register("medicalAllowance")}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Conveyance Allowance
                </label>

                <input
                  type="number"
                  {...register("conveyanceAllowance")}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Other Allowance
                </label>

                <input
                  type="number"
                  {...register("otherAllowance")}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Gross Salary (BDT) *
                </label>

                <input
                  type="number"
                  {...register("grossSalary")}
                  className={`${inputClass} bg-blue-50 font-semibold text-blue-700`}
                />
              </div>
            </div>
          </div>

          {/* PAYMENT INFORMATION */}
          <div className="bg-white border rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-blue-700 mb-6">
              Payment Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
              <div>
                <label className={labelClass}>
                  Payment Method *
                </label>

                <select
                  {...register("paymentMethod")}
                  className={inputClass}
                >
                  <option>Bank</option>
                  <option>Cash</option>
                  <option>Mobile Banking</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Bank Name *
                </label>

                <select
                  {...register("bankName")}
                  className={inputClass}
                >
                  <option>Dutch-Bangla Bank Ltd.</option>
                  <option>BRAC Bank</option>
                  <option>City Bank</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Bank Account No. *
                </label>

                <input
                  {...register("bankAccountNo")}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Account Type
                </label>

                <select
                  {...register("accountType")}
                  className={inputClass}
                >
                  <option>Savings</option>
                  <option>Current</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Branch
                </label>

                <input
                  {...register("branch")}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* TAX INFORMATION */}
          <div className="bg-white border rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-blue-700 mb-6">
              Tax & Statutory Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div>
                <label className={labelClass}>
                  TIN Number
                </label>

                <input
                  {...register("tinNumber")}
                  className={inputClass}
                />
              </div>

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
                          checked={field.value === "Taxable"}
                          onChange={field.onChange}
                        />
                        Taxable
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="Non-Taxable"
                          checked={
                            field.value === "Non-Taxable"
                          }
                          onChange={field.onChange}
                        />
                        Non-Taxable
                      </label>
                    </div>
                  )}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Tax Exempted (If any)
                </label>

                <select
                  {...register("taxExempted")}
                  className={inputClass}
                >
                  <option value="">
                    Select Exemption
                  </option>

                  <option>Disabled</option>
                  <option>Freedom Fighter</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  NID Number
                </label>

                <input
                  {...register("nidNumber")}
                  className={inputClass}
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
              {/* PF */}
              <div>
                <label className={labelClass}>
                  Provident Fund (PF) Applicable
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
                          checked={field.value === "Yes"}
                          onChange={field.onChange}
                        />
                        Yes
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="No"
                          checked={field.value === "No"}
                          onChange={field.onChange}
                        />
                        No
                      </label>
                    </div>
                  )}
                />
              </div>

              {/* PF ACCOUNT */}
              <div>
                <label className={labelClass}>
                  PF Account No.
                </label>

                <input
                  {...register("pfAccountNo")}
                  className={inputClass}
                  placeholder="Enter PF Account No."
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
                          checked={field.value === "Yes"}
                          onChange={field.onChange}
                        />
                        Yes
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="No"
                          checked={field.value === "No"}
                          onChange={field.onChange}
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
                          checked={field.value === "Yes"}
                          onChange={field.onChange}
                        />
                        Yes
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="No"
                          checked={field.value === "No"}
                          onChange={field.onChange}
                        />
                        No
                      </label>
                    </div>
                  )}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Salary Effective From *
                </label>

                <input
                  type="date"
                  {...register("salaryEffectiveFrom")}
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-3">
                <label className={labelClass}>
                  Remarks
                </label>

                <input
                  {...register("remarks")}
                  className={inputClass}
                  placeholder="Enter remarks (if any)"
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
              <span>House Rent Allowance</span>
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
              <span>Conveyance Allowance</span>
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
              <span>Gross Salary (BDT)</span>
              <span>
                {salarySummary.grossSalary.toLocaleString()}
              </span>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl text-xs text-gray-600 leading-5">
              This information will be used for salary
              processing and statutory compliance.
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default FinancialDetailsForm;