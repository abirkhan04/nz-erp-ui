import React from "react";
import {
  useFormContext,
  useFieldArray,
} from "react-hook-form";

import { Trash2, Plus } from "lucide-react";

import CommonInputField from "../../components/CommonInputFields";

import type { EmployeeFormValues } from "./EmployeeFormValues";

const FamilyAndNomineeForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useFormContext<EmployeeFormValues>();

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "familyMembers",
  });

  const onSubmit = (
    data: EmployeeFormValues
  ) => {
    console.log(data);
  };

  const labelClass =
    "block text-sm font-medium text-gray-700 mb-1";

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  const relationOptions = [
    {
      label: "Father",
      value: "Father",
    },

    {
      label: "Mother",
      value: "Mother",
    },

    {
      label: "Brother",
      value: "Brother",
    },

    {
      label: "Sister",
      value: "Sister",
    },

    {
      label: "Spouse",
      value: "Spouse",
    },

    {
      label: "Son",
      value: "Son",
    },

    {
      label: "Daughter",
      value: "Daughter",
    },
  ];

  const nomineeFieldsLeft = [
    {
      label: "Nominee Name (English) *",
      name: "nomineeNameEnglish",
      type: "text",
      rules: {
        required:
          "Nominee name is required",
      },
    },

    {
      label: "Nominee Name (Bangla) *",
      name: "nomineeNameBangla",
      type: "text",
    },

    {
      label:
        "Relation with Employee *",
      name: "relationWithEmployee",
      type: "dropdown",
      options: relationOptions,
    },

    {
      label:
        "Nominee NID / Birth Reg. No. *",
      name: "nomineeNidBirthRegNo",
      type: "text",
    },

    {
      label:
        "Nominee Mobile Number *",
      name: "nomineeMobileNumber",
      type: "text",
    },
  ];

  const nomineeFieldsRight = [
    {
      label:
        "Post Office (Bangla) *",
      name: "nomineePostOfficeBangla",
      type: "text",
    },

    {
      label:
        "Thana / Upazila (Bangla) *",
      name:
        "nomineeThanaUpazilaBangla",
      type: "text",
    },

    {
      label: "District (Bangla) *",
      name: "nomineeDistrictBangla",
      type: "dropdown",
      options: [
        {
          label: "নারায়ণগঞ্জ",
          value: "নারায়ণগঞ্জ",
        },

        {
          label: "ঢাকা",
          value: "ঢাকা",
        },
      ],
    },

    {
      label: "Division (Bangla) *",
      name: "nomineeDivisionBangla",
      type: "dropdown",
      options: [
        {
          label: "ঢাকা",
          value: "ঢাকা",
        },

        {
          label: "চট্টগ্রাম",
          value: "চট্টগ্রাম",
        },
      ],
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        {/* FAMILY INFORMATION */}
        <div className="bg-white border rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-blue-700">
              Family Information
            </h2>

            <p className="text-sm text-red-500">
              * Marked fields are mandatory
            </p>
          </div>

          {/* TABLE HEADER */}
          <div className="grid grid-cols-8 gap-4 mb-3 text-sm font-semibold text-gray-600">
            <div>SL</div>

            <div>
              Family Member Name
              (English)
            </div>

            <div>
              Family Member Name
              (Bangla)
            </div>

            <div>Relation</div>

            <div>Date of Birth</div>

            <div>Occupation</div>

            <div>Mobile Number</div>

            <div>Action</div>
          </div>

          {/* FAMILY MEMBERS */}
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-8 gap-4 items-start"
              >
                {/* SL */}
                <div>
                  <input
                    value={index + 1}
                    disabled
                    className="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-sm"
                  />
                </div>

                {/* NAME ENGLISH */}
                <CommonInputField<EmployeeFormValues>
                  label=""
                  name={`familyMembers.${index}.familyMemberNameEnglish`}
                  type="text"
                  register={register}
                  errors={errors}
                  placeholder="Enter name"
                  rules={{
                    required:
                      "English name is required",
                  }}
                />

                {/* NAME BANGLA */}
                <CommonInputField<EmployeeFormValues>
                  label=""
                  name={`familyMembers.${index}.familyMemberNameBangla`}
                  type="text"
                  register={register}
                  errors={errors}
                  placeholder="নাম লিখুন"
                  rules={{
                    required:
                      "Bangla name is required",
                  }}
                />

                {/* RELATION */}
                <CommonInputField<EmployeeFormValues>
                  label=""
                  name={`familyMembers.${index}.relation`}
                  type="dropdown"
                  register={register}
                  errors={errors}
                  options={relationOptions}
                  rules={{
                    required:
                      "Relation is required",
                  }}
                />

                {/* DOB */}
                <CommonInputField<EmployeeFormValues>
                  label=""
                  name={`familyMembers.${index}.dateOfBirth`}
                  type="date"
                  register={register}
                  errors={errors}
                />

                {/* OCCUPATION */}
                <CommonInputField<EmployeeFormValues>
                  label=""
                  name={`familyMembers.${index}.occupation`}
                  type="text"
                  register={register}
                  errors={errors}
                  placeholder="Enter occupation"
                />

                {/* MOBILE */}
                <CommonInputField<EmployeeFormValues>
                  label=""
                  name={`familyMembers.${index}.mobileNumber`}
                  type="text"
                  register={register}
                  errors={errors}
                  placeholder="Enter mobile"
                />

                {/* DELETE */}
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      remove(index)
                    }
                    className="
                      border border-red-200
                      text-red-500
                      p-2
                      rounded-lg
                      hover:bg-red-50
                    "
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ADD MORE BUTTON */}
          <button
            type="button"
            onClick={() =>
              append({
                familyMemberNameEnglish:
                  "",

                familyMemberNameBangla:
                  "",

                relation: "",

                dateOfBirth: "",

                occupation: "",

                mobileNumber: "",
              })
            }
            className="
              mt-5
              flex items-center gap-2
              border border-blue-500
              text-blue-600
              px-4 py-2
              rounded-lg
              hover:bg-blue-50
            "
          >
            <Plus size={16} />
            Add More Family Member
          </button>
        </div>

        {/* NOMINEE INFORMATION */}
        <div className="bg-white border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-6">
            Nominee Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT SIDE */}
            <div className="space-y-5">
              {nomineeFieldsLeft.map(
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
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-5">
              {/* ADDRESS */}
              <div>
                <label className={labelClass}>
                  Nominee Address
                  (Bangla) *
                </label>

                <textarea
                  rows={4}
                  {...register(
                    "nomineeAddressBangla"
                  )}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                {nomineeFieldsRight.map(
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
                      options={
                        field.options
                      }
                    />
                  )
                )}
              </div>
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

export default FamilyAndNomineeForm;