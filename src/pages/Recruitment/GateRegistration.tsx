import { useForm } from "react-hook-form";
import CommonInputField from "../../components/CommonInputFields";

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

  presentAddress: string;
  permanentAddress: string;

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

const addressInformationFields: SectionField[] =
  [
    {
      label: "বর্তমান ঠিকানা",
      name: "presentAddress",
      rules: {
        required: "বর্তমান ঠিকানা আবশ্যক",
      },
    },
    {
      label: "স্থায়ী ঠিকানা",
      name: "permanentAddress",
      rules: {
        required: "স্থায়ী ঠিকানা আবশ্যক",
      },
    },
  ];

const serviceInformationFields: SectionField[] = [
  {
    label: "কোম্পানি",
    name: "company",
    type: "dropdown",
    options: [
      {
        label: "NZ Textile Limited",
        value: "NZ_TEXTILE",
      },
      {
        label: "NZ Fabrics Limited",
        value: "NZ_FABRICS",
      },
      {
        label: "NZ Denim Limited",
        value: "NZ_DENIM",
      },
    ],
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
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<GateRegistrationForm>({
    mode: "onTouched",
    defaultValues: {
      temporaryId: "TMP-250001",
      joiningDate: new Date()
        .toISOString()
        .split("T")[0],
    },
  });

  const onSubmit = (
    data: GateRegistrationForm
  ) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen bg-slate-100 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-blue-900">
            গেট রেজিস্ট্রেশন
          </h1>

          <p className="text-sm text-gray-500">
            Recruitment Management System
          </p>
        </div>

        {formSections.map((section) => (
          <div
            key={section.title}
            className="bg-white rounded-xl shadow-sm p-5"
          >
            <div className="border-b pb-3 mb-5">
              <h2 className="text-lg font-semibold text-blue-700">
                {section.title}
              </h2>
            </div>

            <div
              className={`grid ${section.columns} gap-4`}
            >
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
                  disabled={
                    field.name === "temporaryId"
                  }
                />
              ))}
            </div>
          </div>
        ))}

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
              onClick={() => reset()}
              className="px-6 py-2 border border-gray-300 rounded-lg"
            >
              রিসেট
            </button>

            <button
              type="submit"
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
              type="button"
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