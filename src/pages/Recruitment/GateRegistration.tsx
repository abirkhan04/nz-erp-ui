import { useForm } from "react-hook-form";
import CommonInputField from "../../components/CommonInputFields";
import { usePost } from "../../hooks/usePost";
import { API_ROUTES } from "../../api/routes";
import toast from "react-hot-toast";
import { useGet } from "../../hooks/useGet";
import { useEffect } from "react";
import type { Enrollment, Unit } from "../../types/interfaces";
import { useNavigate } from "react-router-dom";

export interface GateRegistrationForm {
  temporaryId: string;

  fullName: string;
  fatherName: string;
  motherName: string;

  nidType: string;
  nidNumber: string;

  dateOfBirth: string;
  gender: string;
  religion: string;
  bloodGroup: string;

  mobileNumber: string;

  presentVillageArea: string;
  presentPostOffice: string;
  presentPoliceStation: string;
  presentDistrict: string;
  presentDivision: string;

  sameAsPresent: boolean;
  permanentVillageArea: string;
  permanentPostOffice: string;
  permanentPoliceStation: string;
  permanentDistrict: string;
  permanentDivision: string;

  company: string;
  designation: string;
  joiningDate: string;

  referenceName: string;
  referenceMobile: string;
}

type SectionField = {
  label: string;
  name: keyof GateRegistrationForm;
  type?:
  | "text"
  | "date"
  | "dropdown"
  | "radio";

  options?: {
    label: string;
    value: string;
  }[];

  rules?: any;
};

const personalInformationFields: SectionField[] =
  [
    {
      label: "অস্থায়ী আইডি",
      name: "temporaryId",
    },
    {
      label: "পূর্ণ নাম",
      name: "fullName",
      rules: {
        required: "পূর্ণ নাম আবশ্যক",
      },
    },
    {
      label: "পিতার নাম",
      name: "fatherName",
      rules: {
        required: "পিতার নাম আবশ্যক",
      },
    },
    {
      label: "মাতার নাম",
      name: "motherName",
      rules: {
        required: "মাতার নাম আবশ্যক",
      },
    },
    {
      label: "পরিচয়পত্রের ধরন",
      name: "nidType",
      type: "dropdown",
      options: [
        {
          label: "জাতীয় পরিচয়পত্র",
          value: "NID",
        },
        {
          label: "জন্ম নিবন্ধন",
          value: "BIRTH",
        },
      ],
    },
    {
      label: "পরিচয়পত্র নম্বর",
      name: "nidNumber",
      rules: {
        required: "নম্বর আবশ্যক",
      },
    },
    {
      label: "জন্ম তারিখ",
      name: "dateOfBirth",
      type: "date",
      rules: {
        required: "জন্ম তারিখ আবশ্যক",
      }
    },
    {
      label: "মোবাইল নম্বর",
      name: "mobileNumber",
      rules: {
        required: "মোবাইল নম্বর আবশ্যক",
      },
    },
    {
      label: "লিঙ্গ",
      name: "gender",
      type: "dropdown",
      options: [
        {
          label: "পুরুষ",
          value: "Male",
        },
        {
          label: "মহিলা",
          value: "Female",
        },
      ],
    },
    {
      label: "ধর্ম",
      name: "religion",
      type: "dropdown",
      options: [
        {
          label: "ইসলাম",
          value: "Islam",
        },
        {
          label: "হিন্দু",
          value: "Hindu",
        },
      ],
    },
    {
      label: "রক্তের গ্রুপ",
      name: "bloodGroup",
      type: "dropdown",
      options: [
        {
          label: "A+",
          value: "A+",
        },
        {
          label: "B+",
          value: "B+",
        },
        {
          label: "O+",
          value: "O+",
        },
      ],
    },
  ];

const addressInformationFields: SectionField[] = [
  // Present Address
  {
    label: "গ্রাম / এলাকা",
    name: "presentVillageArea",
    rules: {
      required: "গ্রাম / এলাকা আবশ্যক",
    },
  },
  {
    label: "পোস্ট অফিস",
    name: "presentPostOffice",
    rules: {
      required: "পোস্ট অফিস আবশ্যক",
    },
  },
  {
    label: "থানা / উপজেলা",
    name: "presentPoliceStation",
    rules: {
      required: "থানা / উপজেলা আবশ্যক",
    },
  },
  {
    label: "জেলা",
    name: "presentDistrict",
    type: "text",
    rules: {
      required: "জেলা আবশ্যক",
    },
  },
  {
    label: "বিভাগ",
    name: "presentDivision",
    type: "text",
    rules: {
      required: "বিভাগ আবশ্যক",
    },
  },

  // Permanent Address
  {
    label: "গ্রাম / এলাকা",
    name: "permanentVillageArea",
    rules: {
      required: "গ্রাম / এলাকা আবশ্যক",
    },
  },
  {
    label: "পোস্ট অফিস",
    name: "permanentPostOffice",
    rules: {
      required: "পোস্ট অফিস আবশ্যক",
    },
  },
  {
    label: "থানা / উপজেলা",
    name: "permanentPoliceStation",
    rules: {
      required: "থানা / উপজেলা আবশ্যক",
    },
  },
  {
    label: "জেলা",
    name: "permanentDistrict",
    type: "text",
    rules: {
      required: "জেলা আবশ্যক",
    },
  },
  {
    label: "বিভাগ",
    name: "permanentDivision",
    type: "text",
    rules: {
      required: "বিভাগ আবশ্যক",
    },
  }
];



const referenceInformationFields: SectionField[] = [
  {
    label: "রেফারেন্স ব্যক্তির নাম",
    name: "referenceName",
  },
  {
    label: "রেফারেন্স মোবাইল",
    name: "referenceMobile",
  },
];

const formSections = [
  {
    title: "১. ব্যক্তিগত তথ্য",
    columns: "grid-cols-4",
    fields: personalInformationFields,
  },
  {
    title: "২. ঠিকানা তথ্য",
    columns: "grid-cols-2",
    fields: addressInformationFields,
  },
];

const GateRegistration = () => {

  const { data: units = [] } = useGet<Unit[]>({
    key: ["units"],
    url: API_ROUTES.UNITS,
  });

  const { data: temporaryId } = useGet<Enrollment>({
    key: ["temporaryId"],
    url: API_ROUTES.ENROLLMENTID,
  });

  const serviceInformationFields: SectionField[] = [
    {
      label: "কোম্পানি",
      name: "company",
      type: "dropdown",
      options: units.map((unit) => ({
        label: unit.unitName,
        value: unit.id,
      })),
      rules: {
        required: "কোম্পানি নির্বাচন করুন",
      },
    },
    {
      label: "পদবী",
      name: "designation",
      rules: {
        required: "পদবী আবশ্যক",
      },
    },
    {
      label: "যোগদানের তারিখ",
      name: "joiningDate",
      type: "date",
      rules: {
        required: "যোগদানের তারিখ আবশ্যক",
      },
    },
  ];

  const { mutate: GateRegistrationPost } =
    usePost<{ message: string; id: string }, any>(
      API_ROUTES.GATE_REGISTRATION
    );



  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GateRegistrationForm>({
    mode: "onTouched",
    defaultValues: {
      temporaryId: "",
      sameAsPresent: false,
      joiningDate: new Date()
        .toISOString()
        .split("T")[0],
    },
  });

  const sameAsPresent = watch("sameAsPresent");

  const getDraftKey = (temporaryId: string) =>
    `gateRegistrationDraft_${temporaryId}`;

  const handleSaveDraft = () => {
    const values = getValues();

    if (!values.temporaryId) {
      toast.error("Temporary ID পাওয়া যায়নি");
      return;
    }

    localStorage.setItem(
      getDraftKey(values.temporaryId),
      JSON.stringify(values)
    );

    toast.success("ফর্মটি সফলভাবে সংরক্ষণ করা হয়েছে");
  };

  useEffect(() => {
    if (!sameAsPresent) return;

    setValue(
      "permanentVillageArea",
      watch("presentVillageArea")
    );
    setValue(
      "permanentPostOffice",
      watch("presentPostOffice")
    );
    setValue(
      "permanentPoliceStation",
      watch("presentPoliceStation")
    );
    setValue(
      "permanentDistrict",
      watch("presentDistrict")
    );
    setValue(
      "permanentDivision",
      watch("presentDivision")
    );
  }, [
    sameAsPresent,
    watch("presentVillageArea"),
    watch("presentPostOffice"),
    watch("presentPoliceStation"),
    watch("presentDistrict"),
    watch("presentDivision"),
    setValue,
  ]);

  const handleReset = () => {
    const currentTemporaryId = getValues("temporaryId");

    localStorage.removeItem(getDraftKey(currentTemporaryId));

    reset({
      temporaryId: currentTemporaryId,
      joiningDate: new Date().toISOString().split("T")[0],

      fullName: "",
      fatherName: "",
      motherName: "",
      nidType: "",
      nidNumber: "",
      dateOfBirth: "",
      gender: "",
      religion: "",
      bloodGroup: "",
      mobileNumber: "",
      presentVillageArea: "",
      presentPostOffice: "",
      presentPoliceStation: "",
      presentDistrict: "",
      permanentVillageArea: "",
      permanentPostOffice: "",
      permanentPoliceStation: "",
      permanentDistrict: "",
      company: "",
      designation: "",
      referenceName: "",
      referenceMobile: "",
    });
  };

  useEffect(() => {
    if (!temporaryId?.enrollmentId) return;

    const key = getDraftKey(temporaryId.enrollmentId);
    const draft = localStorage.getItem(key);

    if (draft) {
      reset(JSON.parse(draft));
    } else {
      reset({
        temporaryId: temporaryId.enrollmentId,
        joiningDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [temporaryId, reset]);

  const onSubmit = (
    data: GateRegistrationForm
  ) => {
    const payload = {
      employeeEnrollmentId: data.temporaryId,
      employeeNameBangla: data.fullName,

      // TODO: Replace these IDs from dropdown selections
      employeeType: 1,
      unitId: data.company,
      departmentId: "",
      locationId: "",
      sectionId: "",
      cellId: "",

      proposedMonthlySalary: 0,

      joiningDate: data.joiningDate,
      confirmationDate: data.joiningDate,

      dateOfBirth: data.dateOfBirth,

      // TODO: Convert from dropdown value
      gender:
        data.gender === "Male"
          ? 1
          : data.gender === "Female"
            ? 2
            : 3,

      religion: 0,

      bloodGroup: 0,

      idType:
        data.nidType === "NID"
          ? 1
          : data.nidType === "Birth Certificate"
            ? 2
            : 3,

      idNumber: data.nidNumber,

      mobileNumber: data.mobileNumber,

      guardianType: 1,
      guardianName: data.fatherName,

      motherNameBangla: data.motherName,

      referenceType: 1,

      employeeReference:
        data.referenceName,

      referencePersonId: "",

      referenceMobileNumber:
        data.referenceMobile,

      relationship: 0,

      // Permanent Address
      permanentVillageAreaRoad:
        data.permanentVillageArea,
      permanentPostOffice: data.permanentPostOffice,
      permanentThana: data.permanentPoliceStation,
      permanentDistrict: data.permanentDistrict,

      // Present Address
      presentVillageAreaRoad:
        data.presentVillageArea,
      presentPostOffice: data.presentPostOffice,
      presentThana: data.presentPoliceStation,
      presentDistrict: data.presentDistrict,

      securityClearanceBy: "",
      securityClearanceDate:
        new Date()
          .toISOString()
          .split("T")[0],

      enrolledBy: "",
      enrolledDate:
        new Date()
          .toISOString()
          .split("T")[0],

      biometricEnrolledBy: "",
      biometricEnrolledDate:
        new Date()
          .toISOString()
          .split("T")[0],
    };

    GateRegistrationPost(payload, {
      onSuccess: (response) => {
        toast.success(
          `গেট রেজিস্ট্রেশন সফল হয়েছে। আইডি: ${response.id}`
        );

        localStorage.removeItem(
          getDraftKey(data.temporaryId)
        );

        reset();
      },

      onError: (error) => {
        toast.error(
          `গেট রেজিস্ট্রেশন ব্যর্থ হয়েছে। ত্রুটি: ${error.message}`
        );
      },
    });
  };

  const navigate = useNavigate();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen bg-slate-100 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-end mb-6">
          <button
            type="button"
            className="flex items-center gap-2 border border-blue-300 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50"
            onClick={() => navigate("/recruitment")}
          >
            Back to Main Menu
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-blue-900">
            গেট রেজিস্ট্রেশন
          </h1>

          <p className="text-sm text-gray-500">
            Recruitment Management System
          </p>
        </div>

        {formSections.map((section) => {
          if (section.title === "২. ঠিকানা তথ্য") {
            return (
              <div
                key={section.title}
                className="bg-white rounded-xl shadow-sm p-5"
              >
                <div className="border-b pb-3 mb-6">
                  <h2 className="text-lg font-semibold text-blue-700">
                    {section.title}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  {/* Present Address */}
                  <div>
                    <h3 className="mb-4 text-base font-semibold text-slate-700 border-b pb-2">
                      বর্তমান ঠিকানা
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                      {addressInformationFields
                        .filter((field) =>
                          field.name.startsWith("present")
                        )
                        .map((field) => (
                          <CommonInputField
                            key={field.name}
                            label={field.label}
                            name={field.name as any}
                            type={field.type}
                            options={field.options}
                            rules={field.rules}
                            register={register}
                            errors={errors}
                            control={control}
                          />
                        ))}
                    </div>
                  </div>

                  {/* Permanent Address */}
                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <input
                        id="sameAsPresent"
                        type="checkbox"
                        {...register("sameAsPresent")}
                        className="h-4 w-4"
                      />
                      <label
                        htmlFor="sameAsPresent"
                        className="text-sm font-medium text-slate-700"
                      >
                        বর্তমান ঠিকানার মতো
                      </label>
                    </div>
                    <h3 className="mb-4 text-base font-semibold text-slate-700 border-b pb-2">
                      স্থায়ী ঠিকানা
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                      {addressInformationFields
                        .filter((field) =>
                          field.name.startsWith("permanent")
                        )
                        .map((field) => (
                          <CommonInputField
                            key={field.name}
                            disabled={sameAsPresent}
                            label={field.label}
                            name={field.name as any}
                            type={field.type}
                            options={field.options}
                            rules={field.rules}
                            register={register}
                            errors={errors}
                            control={control}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={section.title}
              className="bg-white rounded-xl shadow-sm p-5"
            >
              <div className="border-b pb-3 mb-5">
                <h2 className="text-lg font-semibold text-blue-700">
                  {section.title}
                </h2>
              </div>

              <div className={`grid ${section.columns} gap-4`}>
                {section.fields.map((field) => (
                  <CommonInputField
                    key={field.name}
                    label={field.label}
                    name={field.name as any}
                    type={field.type}
                    options={field.options}
                    rules={field.rules}
                    register={register}
                    errors={errors}
                    control={control}
                    disabled={field.name === "temporaryId"}
                  />
                ))}
              </div>
            </div>
          );
        })}

        <div className="grid grid-cols-2 gap-6">

          {/* Service Information */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="border-b pb-3 mb-5">
              <h2 className="text-lg font-semibold text-blue-700">
                ৩. চাকরির তথ্য
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {serviceInformationFields.map((field) => (
                <CommonInputField
                  key={field.name}
                  label={field.label}
                  name={field.name as any}
                  type={field.type}
                  options={field.options}
                  rules={field.rules}
                  register={register}
                  errors={errors}
                  control={control}
                />
              ))}
            </div>
          </div>

          {/* Reference Information */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="border-b pb-3 mb-5">
              <h2 className="text-lg font-semibold text-blue-700">
                ৪. রেফারেন্স তথ্য
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {referenceInformationFields.map((field) => (
                <CommonInputField
                  key={field.name}
                  label={field.label}
                  name={field.name as any}
                  type={field.type}
                  options={field.options}
                  rules={field.rules}
                  register={register}
                  errors={errors}
                  control={control}
                />
              ))}
            </div>
          </div>

        </div>
        <div className="bg-white rounded-xl border shadow-sm p-5">
          <div className="flex justify-end gap-4">

            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2 border border-gray-300 rounded-lg"
            >
              রিসেট
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              সংরক্ষণ
            </button>

            <button
              type="button"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              অস্থায়ী আইডি প্রিন্ট
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              মেডিকেল পরীক্ষায় প্রেরণ
            </button>

          </div>
        </div>
      </div>
    </form>
  );

}

export default GateRegistration;