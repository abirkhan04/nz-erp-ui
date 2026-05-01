import React from "react";
import { useGet } from "../../hooks/useGet";
import {
  useFormContext,
} from "react-hook-form";

import type { EmployeeFormValues } from "./EmployeeFormValues";

import { API_ROUTES } from "../../api/routes";
import type { Department } from "../../types/interfaces";


const EmployeeForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useFormContext<EmployeeFormValues>();

  const {
    data: departments = [],
    isLoading,
    error,
  } = useGet<Department[]>({
    key: ["department"],
    url: API_ROUTES.DEPARTMENT,
  });


  const onSubmit = (data: EmployeeFormValues) => {
    console.log("Form Data:", data);
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-8"
      >
        {/* BASIC EMPLOYMENT INFO */}
        <div>
          <h2 className="text-xl font-semibold text-blue-700 mb-6">
            Basic Employment Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className={labelClass}>Employee ID *</label>
              <input
                {...register("employeeId", {
                  required: "Employee ID is required",
                })}
                className={inputClass}
              />
              {errors.employeeId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.employeeId.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Employee Name (English) *</label>
              <input
                {...register("employeeNameEnglish", {
                  required: "Employee name is required",
                })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Employee Name (Bangla) *</label>
              <input
                {...register("employeeNameBangla")}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Company Name *</label>
              <select {...register("companyName")} className={inputClass}>
                <option>NZ Textile Ltd.</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Department *</label>
              <select {...register("department")} className={inputClass}>
                <option>Weaving</option>
                <option>Knitting</option>
                <option>Dyeing</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Section *</label>
              <select {...register("section")} className={inputClass}>
                <option>Loom Operation</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Grade *</label>
              <select {...register("grade")} className={inputClass}>
                <option>Grade 1</option>
                <option>Grade 2</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Employee Type *</label>
              <select {...register("employeeType")} className={inputClass}>
                <option>Worker</option>
                <option>Staff</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Shift *</label>
              <select {...register("shift")} className={inputClass}>
                <option>Day Shift</option>
                <option>Night Shift</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Employee Nature *</label>
              <select {...register("employeeNature")} className={inputClass}>
                <option>Provision</option>
                <option>Permanent</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Holiday *</label>
              <select {...register("holiday")} className={inputClass}>
                <option>Friday</option>
                <option>Saturday</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Joining Date *</label>
              <input
                type="date"
                {...register("joiningDate")}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Confirmation Date</label>
              <input
                type="date"
                {...register("confirmationDate")}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* PERSONAL INFO */}
        <div>
          <h2 className="text-xl font-semibold text-blue-700 mb-6">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className={labelClass}>Date of Birth *</label>
              <input
                type="date"
                {...register("dateOfBirth")}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Gender *</label>
              <select {...register("gender")} className={inputClass}>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Marital Status *</label>
              <select {...register("maritalStatus")} className={inputClass}>
                <option>Unmarried</option>
                <option>Married</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Mobile Number *</label>
              <input
                {...register("mobileNumber")}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                {...register("emailAddress")}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Document Type *</label>
              <select {...register("documentType")} className={inputClass}>
                <option>NID</option>
                <option>Passport</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Document Number *</label>
              <input
                {...register("documentNumber")}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Blood Group</label>
              <select {...register("bloodGroup")} className={inputClass}>
                <option>B+</option>
                <option>A+</option>
                <option>O+</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Religion *</label>
              <select {...register("religion")} className={inputClass}>
                <option>Islam</option>
                <option>Hinduism</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Nationality *</label>
              <select {...register("nationality")} className={inputClass}>
                <option>Bangladeshi</option>
              </select>
            </div>
          </div>
        </div>

        {/* ADDITIONAL INFO */}
        <div>
          <h2 className="text-xl font-semibold text-blue-700 mb-6">
            Additional Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className={labelClass}>Father's Name (English)</label>
              <input
                {...register("fatherNameEnglish")}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Father's Name (Bangla)</label>
              <input
                {...register("fatherNameBangla")}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Mother's Name (English)</label>
              <input
                {...register("motherNameEnglish")}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Mother's Name (Bangla)</label>
              <input
                {...register("motherNameBangla")}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Spouse Name</label>
              <input
                {...register("spouseName")}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Spouse Mobile</label>
              <input
                {...register("spouseMobile")}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>TIN Number</label>
              <input
                {...register("tinNumber")}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Employee Reference</label>
              <input
                {...register("employeeReference")}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-wrap justify-between items-center pt-6 border-t">
          <div className="space-x-3">
            <button
              type="button"
              onClick={() => reset()}
              className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Clear
            </button>

            <button
              type="button"
              className="px-5 py-2 border border-red-300 text-red-500 rounded-lg hover:bg-red-50"
            >
              Cancel
            </button>
          </div>

          <div className="space-x-3">
            <button
              type="button"
              className="px-5 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50"
            >
              Validate Data
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save & Next
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;