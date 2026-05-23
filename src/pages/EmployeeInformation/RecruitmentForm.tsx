import { useMemo, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";

import CommonInputField from "../../components/CommonInputFields";

import { useGet } from "../../hooks/useGet";
import { API_ROUTES } from "../../api/routes";
import { usePost } from "../../hooks/usePost";

import type {
  Cell,
  Company,
  Department,
  Enrollment,
  Location,
  Section,
} from "../../types/interfaces";

import type { EmployeeFormValues } from "./EmployeeFormValues";

type Props = {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  setEmployeeId: React.Dispatch<React.SetStateAction<string>>;
};

const SectionCard = ({
  title,
  children,
  className = "",
  color = "blue",
}: any) => {

  const colorVariants: any = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-700",
      line: "bg-blue-600",
    },

    green: {
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-700",
      line: "bg-green-600",
    },

    orange: {
      bg: "bg-orange-50",
      border: "border-orange-100",
      text: "text-orange-700",
      line: "bg-orange-500",
    },

    purple: {
      bg: "bg-purple-50",
      border: "border-purple-100",
      text: "text-purple-700",
      line: "bg-purple-600",
    },
  };

  const selected = colorVariants[color];

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 shadow-sm ${className}`}
    >

      {/* Header */}

      <div
        className={`
          px-5
          py-4
          border-b
          rounded-t-2xl
          flex
          items-center
          gap-3
          ${selected.bg}
          ${selected.border}
        `}
      >

        {/* Title */}

        <h2
          className={`font-semibold text-[15px] ${selected.text}`}
        >
          {title}
        </h2>
      </div>

      {/* Body */}

      <div className="p-5">
        {children}
      </div>
    </div>
  );
};

const RecruitmentForm: React.FC<Props> = ({
  setActiveStep,
  setEmployeeId,
}) => {
  const { mutate: EmployeeRecruitmentPost } =
    usePost<{ message: string; id: string }, any>(
      API_ROUTES.EMPLOYEE_RECRUITMENT
    );

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useFormContext<EmployeeFormValues>();

  // =========================
  // API DATA
  // =========================

  const { data: companies = [] } = useGet<Company[]>({
    key: ["company"],
    url: API_ROUTES.COMPANY,
  });

  const selectedCompany = watch("companyName");

  const { data: locations = [] } = useGet<Location[]>({
    key: ["location", selectedCompany],
    url: `${API_ROUTES.LOCATION}/${selectedCompany}`,
  });

  const { data: departments = [] } = useGet<Department[]>({
    key: ["department"],
    url: API_ROUTES.DEPARTMENT,
  });

  const selectedDepartment = watch("department");

  const {
    data: sections = [],
  } = useGet<Section[]>({
    key: ["sections", selectedDepartment],
    url: `${API_ROUTES.SECTION}?includeInactive=true&departmentId=${selectedDepartment}`,
    enabled: !!selectedDepartment,
  });

  const { data: cells = [] } = useGet<Cell[]>({
    key: ["cell"],
    url: API_ROUTES.CELL,
  });

  const { data: enrollmentData } = useGet<Enrollment>({
    key: ["enrollment-id"],
    url: API_ROUTES.ENROLLMENTID,
  });

  useEffect(() => {
    if (enrollmentData?.enrollmentId) {
      setValue(
        "enrollmentId",
        enrollmentData.enrollmentId
      );
    }
  }, [enrollmentData, setValue]);

  // =========================
  // OPTIONS
  // =========================

  const companyOptions = useMemo(
    () =>
      companies.map((company) => ({
        label: company.companyName,
        value: company.id,
      })),
    [companies]
  );

  const locationOptions = useMemo(
    () =>
      locations.map((location) => ({
        label: location.locationName,
        value: location.id,
      })),
    [locations]
  );

  const departmentOptions = useMemo(
    () =>
      departments.map((department) => ({
        label: department.departmentName,
        value: department.id,
      })),
    [departments]
  );

  const sectionOptions = useMemo(
    () =>
      sections.map((section) => ({
        label: section.sectionName,
        value: section.id,
      })),
    [sections]
  );

  const cellOptions = useMemo(
    () =>
      cells.map((cell) => ({
        label: cell.nameEnglish,
        value: cell.id,
      })),
    [cells]
  );

  // =========================
  // FIELD CONFIGS
  // =========================

  const jobFields = [
    {
      label: "কোম্পানি / ইউনিট",
      name: "companyName",
      type: "dropdown",
      options: companyOptions,
      placeholder: "কোম্পানি নির্বাচন করুন",
      rules: {
        required: "কোম্পানি নির্বাচন করুন",
      },
    },

    {
      label: "সাব ইউনিট / শেড",
      name: "companyLocation",
      type: "dropdown",
      placeholder: "সাব ইউনিট নির্বাচন করুন",
      options: locationOptions,
      rules: {
        required: "লোকেশন নির্বাচন করুন",
      },
    },

    {
      label: "বিভাগ",
      name: "department",
      type: "dropdown",
      placeholder: "বিভাগ নির্বাচন করুন",
      options: departmentOptions,
      rules: {
        required: "ডিপার্টমেন্ট নির্বাচন করুন",
      },
    },

    {
      label: "সেকশন",
      name: "section",
      type: "dropdown",
      placeholder: "সেকশন নির্বাচন করুন",
      options: sectionOptions,
      rules: {
        required: "সেকশন নির্বাচন করুন",
      },
    },

    {
      label: "সেল",
      name: "cell",
      type: "dropdown",
      placeholder: "সেল নির্বাচন করুন",
      options: cellOptions,
    },

    {
      label: "প্রস্তাবিত বেতন",
      name: "grossSalary",
      type: "number",
      placeholder: "টাকা",
      rules: {
        required: "বেতন লিখুন",
      },
    },

    {
      label: "যোগদানের তারিখ",
      name: "joiningDate",
      type: "date",
      rules: {
        required: "তারিখ নির্বাচন করুন",
      },
    },
  ] as const;

  const personalFields = [
    {
      label: "অস্থায়ী প্রার্থী আইডি",
      name: "enrollmentId",
      type: "text",
      placeholder: "NZ-ERP-AUTO",
      readOnly: true,
    },

    {
      label: "প্রার্থীর নাম",
      name: "employeeNameBangla",
      type: "text",
      placeholder: "NID অনুযায়ী লিখুন",
      rules: {
        required: "নাম লিখুন",
      },
    },

    {
      label: "পরিচয়পত্রের ধরন",
      name: "idType",
      type: "dropdown",
      placeholder: "নির্বাচন করুন",
      options: [
        {
          label: "জাতীয় পরিচয়পত্র",
          value: "NID",
        },
        {
          label: "জন্ম নিবন্ধন",
          value:  "Birth Certificate",
        },
        {
          label: "পাসপোর্ট",
          value: "Passport",
        },
      ],
    },
    {
      label: "পরিচয়পত্র নম্বর",
      name: "idNumber",
      type: "text",
      placeholder: "তথ্য লিখুন",
    },
    {
      label: "অভিভাবকের ধরন",
      name: "guardianType",
      type: "radio",
      options: [
        {
          label: "পিতা",
          value: "father",
        },
        {
          label: "স্বামী",
          value: "husband",
        },
      ],
    },
    {
      label: "পিতা / স্বামীর নাম",
      name: "fatherNameEnglish",
      type: "text",
      placeholder: "তথ্য লিখুন",
    },
    {
      label: "জন্ম তারিখ",
      name: "dateOfBirth",
      type: "date",
      rules: {
        required: "তারিখ নির্বাচন করুন",
      },
    },
    {
      label: "মাতার নাম",
      name: "motherNameEnglish",
      type: "text",
      placeholder: "তথ্য লিখুন",
    },
  ] as const;

  const presentAddressFields = [
    {
      label: "ঠিকানা",
      name: "presentVillageRoadHouse",
      type: "text",
      placeholder: "গ্রাম / এলাকা / রাস্তা",
    },

    {
      label: "ডাকঘর",
      name: "presentPostOffice",
      type: "text",
      placeholder: "ডাকঘর",
    },

    {
      label: "থানা / উপজেলা",
      name: "presentThanaUpazila",
      type: "text",
      placeholder: "থানা / উপজেলা",
    },

    {
      label: "জেলা",
      name: "presentDistrict",
      type: "text",
      placeholder: "জেলা",
    },
  ] as const;

  const permanentAddressFields = [
    {
      label: "ঠিকানা",
      name: "permanentVillageRoadHouse",
      type: "text",
      placeholder: "গ্রাম / এলাকা / রাস্তা",
    },

    {
      label: "ডাকঘর",
      name: "permanentPostOffice",
      type: "text",
      placeholder: "ডাকঘর",
    },

    {
      label: "থানা / উপজেলা",
      name: "permanentThanaUpazila",
      type: "text",
      placeholder: "থানা / উপজেলা",
    },

    {
      label: "জেলা",
      name: "permanentDistrict",
      type: "text",
      placeholder: "জেলা",
    },
  ] as const;

  const referenceFields = [
    {
      label: "রেফারেন্স ব্যক্তির নাম",
      name: "employeeReference",
      type: "text",
      placeholder: "তথ্য লিখুন",
    },

    {
      label: "রেফারেন্স আইডি",
      name: "documentNumber",
      type: "text",
      placeholder: "তথ্য লিখুন",
    },
  ] as const;

  const approvalFields = [
    {
      label: "গেট সিকিউরিটি অনুমোদন",
      name: "securityClearance",
      type: "text",
      placeholder: "স্বাক্ষর / আইডি",
    },

    {
      label: "এনরোল করেছেন",
      name: "enrollmentBy",
      type: "text",
      placeholder: "আইডি ও স্বাক্ষর",
    },

    {
      label: "বায়োমেট্রিক সম্পন্ন করেছেন",
      name: "biometricEnrolledBy",
      type: "text",
      placeholder: "আইডি ও স্বাক্ষর",
    },
  ] as const;

  // =========================
  // SUBMIT
  // =========================

  const onSubmit = (data: EmployeeFormValues) => {
    console.log("recruitment data:-->", data);

    const employeeTypeMap: Record<string, number> = {
      Worker: 1,
      Staff: 2,
      Management: 3
    };
    
    const genderMap: Record<string, number> = {
      Male: 0,
      Female: 1,
      Other: 2,
    };
    
    const bloodGroupMap: Record<string, number> = {
      "A+": 1,
      "A-": 2,
      "B+": 3,
      "B-": 4,
      "AB+": 5,
      "AB-": 6,
      "O+": 7,
      "O-": 8,
    };
    
    const idTypeMap: Record<string, number> = {
      NID: 1,
      "Birth Certificate": 2,
      Passport: 3,
    };
    
    const guardianTypeMap: Record<string, number> = {
      father: 1,
      husband: 2,
    };
    
    const employeeRecruitmentPost = {
      // =========================
      // BASIC INFO
      // =========================
    
      employeeEnrollmentId:
        data.enrollmentId || "",
    
      employeeNameBangla:
        data.employeeNameBangla || "",
    
      employeeType:
        employeeTypeMap[data.employeeType] || 0,
    
      // =========================
      // JOB INFO
      // =========================
    
      companyId:
        data.companyName || "",
    
      departmentId:
        data.department || "",
    
      locationId:
        data.companyLocation || "",
    
      sectionId:
        data.section || "",
    
      cellId:
        data.cell || "",
    
      proposedMonthlySalary:
        Number(data.grossSalary || 0),
    
      joiningDate:
        data.joiningDate
          ? new Date(data.joiningDate).toISOString()
          : null,
    
      confirmationDate: null,
    
      // =========================
      // PERSONAL INFO
      // =========================
    
      dateOfBirth:
        data.dateOfBirth
          ? new Date(data.dateOfBirth).toISOString()
          : null,
    
      gender:
        genderMap[data.gender] || 0,
    
      bloodGroup:
        bloodGroupMap[data.bloodGroup] || 0,
    
      idType:
        idTypeMap[data.idType] || 0,
    
      idNumber:
        data.idNumber || "",
    
      guardianType:
        guardianTypeMap[data.guardianType] || 0,
    
      guardianName:
        data.fatherNameEnglish || "",
    
      motherNameBangla:
        data.motherNameEnglish || "",
    
      // =========================
      // REFERENCE INFO
      // =========================
    
      employeeReference:
        data.employeeReference || "",
    
      referencePersonId:
        data.documentNumber || "",
    
      // =========================
      // PERMANENT ADDRESS
      // =========================
    
      permanentVillageAreaRoad:
        data.permanentVillageRoadHouse || "",
    
      permanentPostOffice:
        data.permanentPostOffice || "",
    
      permanentThana:
        data.permanentThanaUpazila || "",
    
      permanentDistrict:
        data.permanentDistrict || "",
    
      permanentDivision: "",
    
      // =========================
      // PRESENT ADDRESS
      // =========================
    
      presentVillageAreaRoad:
        data.presentVillageRoadHouse || "",
    
      presentPostOffice:
        data.presentPostOffice || "",
    
      presentThana:
        data.presentThanaUpazila || "",
    
      presentDistrict:
        data.presentDistrict || "",
    
      presentDivision: "",
    
      // =========================
      // HR / SECURITY
      // =========================
    
      securityClearanceBy:
        data.securityClearance || "",
    
      securityClearanceDate:
        new Date().toISOString(),
    
      enrolledBy:
        data.enrollmentBy || "",
    
      enrolledDate:
        new Date().toISOString(),
    
      biometricEnrolledBy:
        data.biometricEnrolledBy || "",
    
      biometricEnrolledDate:
        new Date().toISOString(),
    };

    EmployeeRecruitmentPost(employeeRecruitmentPost, {
      onSuccess: (response) => {
        toast.success(response.message);
        setActiveStep(2);
        setEmployeeId(response.id);
      },

      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  // =========================
  // RENDER
  // =========================

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-[1600px] mx-auto p-4 bg-[#f5f7fb] min-h-screen space-y-5"
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">

        {/* ========================= */}
        {/* PERSONAL INFO */}
        {/* ========================= */}

        <SectionCard
         title="১. ব্যক্তিগত তথ্য"
         color="blue"
         className="xl:col-span-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {personalFields.map((field) => (
              <CommonInputField<EmployeeFormValues>
                key={field.name}
                label={field.label}
                name={field.name}
                type={field.type as any}
                placeholder={field.placeholder}
                options={field.options}
                rules={field.rules}
                register={register}
                errors={errors}
              />
            ))}

            <CommonInputField<EmployeeFormValues>
              label="লিঙ্গ"
              name="gender"
              type="dropdown"
              placeholder="লিঙ্গ নির্বাচন করুন"
              options={[
                {
                  label: "পুরুষ",
                  value: "Male",
                },
                {
                  label: "মহিলা",
                  value: "Female",
                },
                {
                  label: "অন্যান্য",
                  value: "Other",
                },
              ]}
              register={register}
              errors={errors}
            />

            <CommonInputField<EmployeeFormValues>
              label="রক্তের গ্রুপ"
              name="bloodGroup"
              type="dropdown"
              placeholder="রক্তের গ্রুপ"
              options={[
                { label: "A+", value: "A+" },
                { label: "A-", value: "A-" },
                { label: "B+", value: "B+" },
                { label: "B-", value: "B-" },
                { label: "AB+", value: "AB+" },
                { label: "AB-", value: "AB-" },
                { label: "O+", value: "O+" },
                { label: "O-", value: "O-" },
              ]}
              register={register}
              errors={errors}
            />
          </div>
        </SectionCard>
                {/* ========================= */}
        {/* JOB INFO */}
        {/* ========================= */}

        <SectionCard
            title="২. চাকরির তথ্য"
            color="green"
            className="xl:col-span-3"
          >
          <div className="grid grid-cols-1 gap-4">

            {jobFields.map((field) => (
              <CommonInputField<EmployeeFormValues>
                key={field.name}
                label={field.label}
                name={field.name}
                type={field.type as any}
                options={field.options}
                placeholder={field.placeholder}
                rules={field.rules}
                register={register}
                errors={errors}
              />
            ))}


            <CommonInputField<EmployeeFormValues>
              label="প্রার্থীর ধরন"
              name="employeeType"
              type="dropdown"
              placeholder="প্রার্থীর ধরন"
              options={[
                {
                  label: "ওয়ার্কার",
                  value: "Worker",
                },
                {
                  label: "স্টাফ",
                  value: "Staff",
                },
                {
                  label: "ম্যানেজমেন্ট",
                  value: "Management"
                }
              ]}
              register={register}
              errors={errors}
            />


            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">
                অস্থায়ী প্রার্থী আইডি
              </p>

              <h3 className="text-xl font-bold text-green-700">
                {watch("enrollmentId")}
              </h3>
            </div>
          </div>
        </SectionCard>

        {/* ========================= */}
        {/* REFERENCE */}
        {/* ========================= */}

        <SectionCard
            title="৩. রেফারেন্স তথ্য"
            color="orange"
            className="xl:col-span-3"
          >
          <div className="grid grid-cols-1 gap-4">

            {referenceFields.map((field) => (
              <CommonInputField<EmployeeFormValues>
                key={field.name}
                label={field.label}
                name={field.name}
                type={field.type as any}
                placeholder={field.placeholder}
                register={register}
                errors={errors}
              />
            ))}

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
              রেফারেন্স তথ্য প্রদান বাধ্যতামূলক নয়
            </div>
          </div>
        </SectionCard>

        {/* ========================= */}
        {/* ADDRESS */}
        {/* ========================= */}

        <SectionCard
            title="৪. ঠিকানার তথ্য"
            color="blue"
            className="xl:col-span-8"
          >
          <div className="space-y-8">

            {/* Present Address */}

            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-4">
                বর্তমান ঠিকানা
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {presentAddressFields.map((field) => (
                  <CommonInputField<EmployeeFormValues>
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    type={field.type as any}
                    placeholder={field.placeholder}
                    register={register}
                    errors={errors}
                  />
                ))}
              </div>
            </div>

            {/* Permanent Address */}

            <div>
              <div className="flex items-center justify-between mb-4">

                <h3 className="font-semibold text-sm text-gray-700">
                  স্থায়ী ঠিকানা
                </h3>

                <label className="flex items-center gap-2 text-sm text-gray-600">

                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {

                        setValue(
                          "permanentVillageRoadHouse",
                          watch("presentVillageRoadHouse")
                        );

                        setValue(
                          "permanentPostOffice",
                          watch("presentPostOffice")
                        );

                        setValue(
                          "permanentThanaUpazila",
                          watch("presentThanaUpazila")
                        );

                        setValue(
                          "permanentDistrict",
                          watch("presentDistrict")
                        );
                      }
                    }}
                  />

                  উভয় ঠিকানা একই
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {permanentAddressFields.map((field) => (
                  <CommonInputField<EmployeeFormValues>
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    type={field.type as any}
                    placeholder={field.placeholder}
                    register={register}
                    errors={errors}
                  />
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ========================= */}
        {/* APPROVAL */}
        {/* ========================= */}

        <SectionCard
            title="৫. এইচআর যাচাইকরণ"
            color="purple"
            className="xl:col-span-4"
          >
          <div className="grid grid-cols-1 gap-4">

            {approvalFields.map((field) => (
              <CommonInputField<EmployeeFormValues>
                key={field.name}
                label={field.label}
                name={field.name as any}
                type={field.type as any}
                placeholder={field.placeholder}
                register={register}
                errors={errors}
              />
            ))}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-700 leading-6">
                তথ্য সংরক্ষণের পর প্রার্থী পরবর্তী ধাপে যাবে।
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ========================= */}
      {/* ACTION BUTTONS */}
      {/* ========================= */}

      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-wrap justify-between items-center gap-4">

        <div className="text-sm text-gray-500">
          সংরক্ষণের আগে সকল তথ্য যাচাই করুন
        </div>

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition-all"
          >
            রিসেট
          </button>

          <button
            type="button"
            className="px-5 py-2 rounded-xl border border-red-300 text-red-500 hover:bg-red-50 transition-all"
          >
            বাতিল
          </button>

          <button
            type="submit"
            className="px-7 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
          >
            তথ্য সংরক্ষণ
          </button>
        </div>
      </div>
    </form>
  );
};

export default RecruitmentForm;
