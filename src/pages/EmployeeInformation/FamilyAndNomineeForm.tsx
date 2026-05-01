import React from "react";
import {
  useForm,
  useFieldArray,
} from "react-hook-form";
import { Trash2, Plus } from "lucide-react";

type FamilyMember = {
  familyMemberNameEnglish: string;
  familyMemberNameBangla: string;
  relation: string;
  dateOfBirth: string;
  occupation: string;
  mobileNumber: string;
};

type FamilyAndNomineeFormValues = {
  familyMembers: FamilyMember[];

  nomineeNameEnglish: string;
  nomineeNameBangla: string;
  relationWithEmployee: string;
  nomineeNidBirthRegNo: string;
  nomineeMobileNumber: string;

  nomineeAddressBangla: string;
  nomineePostOfficeBangla: string;
  nomineeThanaUpazilaBangla: string;
  nomineeDistrictBangla: string;
  nomineeDivisionBangla: string;
};

const FamilyAndNomineeForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FamilyAndNomineeFormValues>({
    defaultValues: {
      familyMembers: [
        {
          familyMemberNameEnglish: "",
          familyMemberNameBangla: "",
          relation: "",
          dateOfBirth: "",
          occupation: "",
          mobileNumber: "",
        },
      ],
    },
  });

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "familyMembers",
  });

  const onSubmit = (
    data: FamilyAndNomineeFormValues
  ) => {
    console.log(data);
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  const labelClass =
    "block text-sm font-medium text-gray-700 mb-1";

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
            <div>Family Member Name (English)</div>
            <div>Family Member Name (Bangla)</div>
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
                <div>
                  <input
                    {...register(
                      `familyMembers.${index}.familyMemberNameEnglish`,
                      {
                        required:
                          "English name is required",
                      }
                    )}
                    placeholder="Enter name"
                    className={inputClass}
                  />

                  {errors.familyMembers?.[index]
                    ?.familyMemberNameEnglish && (
                    <p className="text-red-500 text-xs mt-1">
                      {
                        errors.familyMembers[index]
                          ?.familyMemberNameEnglish
                          ?.message
                      }
                    </p>
                  )}
                </div>

                {/* NAME BANGLA */}
                <div>
                  <input
                    {...register(
                      `familyMembers.${index}.familyMemberNameBangla`,
                      {
                        required:
                          "Bangla name is required",
                      }
                    )}
                    placeholder="নাম লিখুন"
                    className={inputClass}
                  />
                </div>

                {/* RELATION */}
                <div>
                  <select
                    {...register(
                      `familyMembers.${index}.relation`,
                      {
                        required:
                          "Relation is required",
                      }
                    )}
                    className={inputClass}
                  >
                    <option value="">
                      Select Relation
                    </option>

                    <option value="Father">
                      Father
                    </option>

                    <option value="Mother">
                      Mother
                    </option>

                    <option value="Brother">
                      Brother
                    </option>

                    <option value="Sister">
                      Sister
                    </option>

                    <option value="Spouse">
                      Spouse
                    </option>

                    <option value="Son">
                      Son
                    </option>

                    <option value="Daughter">
                      Daughter
                    </option>
                  </select>
                </div>

                {/* DOB */}
                <div>
                  <input
                    type="date"
                    {...register(
                      `familyMembers.${index}.dateOfBirth`
                    )}
                    className={inputClass}
                  />
                </div>

                {/* OCCUPATION */}
                <div>
                  <input
                    {...register(
                      `familyMembers.${index}.occupation`
                    )}
                    placeholder="Enter occupation"
                    className={inputClass}
                  />
                </div>

                {/* MOBILE */}
                <div>
                  <input
                    {...register(
                      `familyMembers.${index}.mobileNumber`
                    )}
                    placeholder="Enter mobile"
                    className={inputClass}
                  />
                </div>

                {/* DELETE */}
                <div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
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
                familyMemberNameEnglish: "",
                familyMemberNameBangla: "",
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
              <div>
                <label className={labelClass}>
                  Nominee Name (English) *
                </label>

                <input
                  {...register(
                    "nomineeNameEnglish",
                    {
                      required:
                        "Nominee name is required",
                    }
                  )}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Nominee Name (Bangla) *
                </label>

                <input
                  {...register(
                    "nomineeNameBangla"
                  )}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Relation with Employee *
                </label>

                <select
                  {...register(
                    "relationWithEmployee"
                  )}
                  className={inputClass}
                >
                  <option value="">
                    Select Relation
                  </option>

                  <option value="Father">
                    Father
                  </option>

                  <option value="Mother">
                    Mother
                  </option>

                  <option value="Brother">
                    Brother
                  </option>

                  <option value="Sister">
                    Sister
                  </option>

                  <option value="Spouse">
                    Spouse
                  </option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Nominee NID / Birth Reg. No. *
                </label>

                <input
                  {...register(
                    "nomineeNidBirthRegNo"
                  )}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Nominee Mobile Number *
                </label>

                <input
                  {...register(
                    "nomineeMobileNumber"
                  )}
                  className={inputClass}
                />
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-5">
              <div>
                <label className={labelClass}>
                  Nominee Address (Bangla) *
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
                <div>
                  <label className={labelClass}>
                    Post Office (Bangla) *
                  </label>

                  <input
                    {...register(
                      "nomineePostOfficeBangla"
                    )}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Thana / Upazila (Bangla) *
                  </label>

                  <input
                    {...register(
                      "nomineeThanaUpazilaBangla"
                    )}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    District (Bangla) *
                  </label>

                  <select
                    {...register(
                      "nomineeDistrictBangla"
                    )}
                    className={inputClass}
                  >
                    <option value="">
                      Select District
                    </option>

                    <option value="নারায়ণগঞ্জ">
                      নারায়ণগঞ্জ
                    </option>

                    <option value="ঢাকা">
                      ঢাকা
                    </option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    Division (Bangla) *
                  </label>

                  <select
                    {...register(
                      "nomineeDivisionBangla"
                    )}
                    className={inputClass}
                  >
                    <option value="">
                      Select Division
                    </option>

                    <option value="ঢাকা">
                      ঢাকা
                    </option>

                    <option value="চট্টগ্রাম">
                      চট্টগ্রাম
                    </option>
                  </select>
                </div>
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