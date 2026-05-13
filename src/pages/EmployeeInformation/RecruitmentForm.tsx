import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import toast from "react-hot-toast";

import CommonInputField from "../../components/CommonInputFields";

import { useGet } from "../../hooks/useGet";
import { API_ROUTES } from "../../api/routes";
import { usePost } from "../../hooks/usePost";

import type {
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


const RecruitmentForm: React.FC<Props>  = ({
  setActiveStep,
  setEmployeeId
  }) => {
  
  const { mutate: EmployeeRecruitmentPost } =
    usePost<{ message: string }, any>(
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

  const { data: locations = [] } = useGet<Location[]>({
    key: ["location"],
    url: API_ROUTES.LOCATION,
  });

  const { data: departments = [] } = useGet<Department[]>({
    key: ["department"],
    url: API_ROUTES.DEPARTMENT,
  });

  const { data: sections = [] } = useGet<Section[]>({
    key: ["section"],
    url: API_ROUTES.SECTION,
  });

  const { data: cells = [] } = useGet<Section[]>({
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

  // =========================
  // FIELD CONFIGS
  // =========================

  const jobFields = [
    {
      label: "কোম্পানি নাম",
      name: "companyName",
      type: "dropdown",
      options: companyOptions,
      placeholder: "কোম্পানি নাম",
      rules: {
        required: "কোম্পানি নির্বাচন করুন",
      },
    },

    {
      label: "লোকেশন / সাব ইউনিট",
      name: "companyLocation",
      type: "dropdown",
      placeholder: "লোকেশন / সাব ইউনিট",
      options: locationOptions,
      rules: {
        required: "লোকেশন নির্বাচন করুন",
      },
    },

    {
      label: "ডিপার্টমেন্ট",
      name: "department",
      type: "dropdown",
      placeholder: "ডিপার্টমেন্ট",
      options: departmentOptions,
      rules: {
        required: "ডিপার্টমেন্ট নির্বাচন করুন",
      },
    },

    {
      label: "সেকশন",
      name: "section",
      type: "dropdown",
      placeholder: "সেকশন",
      options: sectionOptions,
      rules: {
        required: "সেকশন নির্বাচন করুন",
      },
    },

    {
      label: "সেল",
      name: "cell",
      type: "dropdown",
      placeholder: "সেল",
      options: [
        {
          label: "Recruitment",
          value: "Recruitment",
        },
        {
          label: "House Keeping",
          value: "House Keeping",
        },
      ],
    },

    {
      label: "প্রস্তাবিত বেতন (মাসিক)",
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
        required: "যোগদানের তারিখ নির্বাচন করুন",
      },
    },
  ] as const;

  const personalFields = [
    {
      label: "এনরোলমেন্ট আইডি",
      name: "enrollmentId",
      type: "text",
      placeholder: "NZ-ERP-AUTO",
      rules: {
        required: "Employee ID is required",
      },
      readOnly: true,
    },

    {
      label: "প্রার্থীর পূর্ণ নাম",
      name: "employeeNameEnglish",
      type: "text",
      placeholder: "NID অনুযায়ী লিখুন",
      rules: {
        required: "Employee name is required",
      },
    },

    {
      label: "পরিচয়পত্র নম্বর",
      name: "idNumber",
      type: "text",
      placeholder: "তথ্যটি লিখুন",
    },

    {
      label: "জন্ম তারিখ",
      name: "dateOfBirth",
      type: "date",
      rules: {
        required: "Date of birth is required",
      }
    },

    {
      label: "পিতা/স্বামীর নাম",
      name: "fatherNameEnglish",
      type: "text",
      placeholder: "তথ্যটি লিখুন",
    },

    {
      label: "মাতার নাম",
      name: "motherNameEnglish",
      type: "text",
      placeholder: "তথ্যটি লিখুন",
    },
  ] as const;

  const presentAddressFields = [
    {
      label: "বর্তমান ঠিকানা",
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
      label: "জেলা / বিভাগ",
      name: "presentDistrict",
      type: "text",
      placeholder: "জেলা / বিভাগ",
    },
  ] as const;

  const permanentAddressFields = [
    {
      label: "স্থায়ী ঠিকানা",
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
      label: "জেলা / বিভাগ",
      name: "permanentDistrict",
      type: "text",
      placeholder: "জেলা / বিভাগ",
    },
  ] as const;

  const referenceFields = [
    {
      label: "রেফারেন্স ব্যক্তির নাম",
      name: "employeeReference",
      type: "text",
      placeholder: "তথ্যটি লিখুন",
    },
  
    {
      label: "রেফারেন্স ব্যক্তির আইডি (Ref ID)",
      name: "documentNumber",
      type: "text",
      placeholder: "তথ্যটি লিখুন",
    },
  ] as const;
  
  const approvalFields = [
    {
      label: "প্রধান গেট - সিকিউরিটি ক্লিয়ারেন্স",
      name: "securityClearance",
      type: "text",
      placeholder: "স্বাক্ষর ও তারিখ",
    },
  
    {
      label: "এনরোলমেন্ট বাই",
      name: "enrollmentBy",
      type: "text",
      placeholder: "আইডি ও স্বাক্ষর",
    },
  
    {
      label: "বায়োমেট্রিক এনরোল্ড বাই",
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
      employeeEnrollmentId: data.enrollmentId || "",
  
      // API field says Bangla but form has English field
      employeeNameBangla: data.employeeNameEnglish || "",
  
      employeeType:
        employeeTypeMap[data.employeeType] || 0,
  
      companyId: data.companyName || "",
  
      departmentId: data.department || "",
  
      locationId: data.companyLocation || "",
  
      sectionId: data.section || "",
  
      cellId: data.cell || null,
  
      proposedMonthlySalary: Number(
        data.grossSalary || 0
      ),
  
      joiningDate: data.joiningDate
        ? new Date(data.joiningDate).toISOString()
        : null,
  
      confirmationDate: null,
  
      dateOfBirth: data.dateOfBirth
        ? new Date(data.dateOfBirth).toISOString()
        : null,
  
      gender: genderMap[data.gender] || 0,
  
      bloodGroup:
        bloodGroupMap[data.bloodGroup] || 0,
  
      idType: idTypeMap[data.idType] || 0,
  
      idNumber: data.idNumber || "",
  
      guardianType:
        guardianTypeMap[data.guardianType || ""] || 0,
  
      guardianName: data.fatherNameEnglish || "",
  
      motherNameBangla:
        data.motherNameEnglish || "",
  
      employeeReference:
        data.employeeReference || "",
  
      referencePersonId:
        data.documentNumber || "",
  
      permanentVillageAreaRoad:
        data.permanentVillageRoadHouse || "",
  
      permanentPostOffice:
        data.permanentPostOffice || "",
  
      permanentThana:
        data.permanentThanaUpazila || "",
  
      permanentDistrict:
        data.permanentDistrict || "",
  
      permanentDivision: "",
  
      presentVillageAreaRoad:
        data.presentVillageRoadHouse || "",
  
      presentPostOffice:
        data.presentPostOffice || "",
  
      presentThana:
        data.presentThanaUpazila || "",
  
      presentDistrict:
        data.presentDistrict || "",
  
      presentDivision: "",
  
      securityClearanceBy:
        data.securityClearance || "",
  
      securityClearanceDate:
        new Date().toISOString(),
  
      enrolledBy: data.enrollmentBy || "",
  
      enrolledDate: new Date().toISOString(),
  
      biometricEnrolledBy:
        data.biometricEnrolledBy || "",
  
      biometricEnrolledDate:
        new Date().toISOString(),
    };
  
    console.log(
      "employeeRecruitmentPost -->",
      employeeRecruitmentPost
    );
  
    EmployeeRecruitmentPost(employeeRecruitmentPost,  {
      onSuccess: (response) => {
        toast.success(response.message);
        setActiveStep(2);
        setEmployeeId(response.id);
      },
    });
  };

  // =========================
  // RENDER
  // =========================

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-8"
    >
      <div
        className="
          w-full
          max-w-[1200px]
          mx-auto
          overflow-x-hidden
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-x-2
          gap-y-5
          px-2
        "
      >
        {/* ========================= */}
        {/* JOB INFO */}
        {/* ========================= */}

        <div className="lg:col-span-2 min-w-0">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">
            ০১. চাকরির তথ্য
          </h2>
        </div>

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

        {/* ========================= */}
        {/* PERSONAL INFO */}
        {/* ========================= */}

        <div className="lg:col-span-2 mt-4 min-w-0">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">
            ০২. প্রার্থীর ব্যক্তিগত তথ্য
          </h2>
        </div>

        {personalFields.map((field) => (
          <CommonInputField<EmployeeFormValues>
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type as any}
            placeholder={field.placeholder}
            rules={field.rules}
            register={register}
            errors={errors}
          />
        ))}

        {/* Employee Type */}

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
          ]}
          register={register}
          errors={errors}
        />

        {/* Gender */}

        <CommonInputField<EmployeeFormValues>
          label="জেন্ডার / লিঙ্গ"
          name="gender"
          type="dropdown"
          placeholder="জেন্ডার / লিঙ্গ"
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

        {/* Blood Group */}

        <CommonInputField<EmployeeFormValues>
          label="রক্তের গ্রুপ"
          name="bloodGroup"
          type="dropdown"
          placeholder="রক্তের গ্রুপ"
          options={[
            { label: "এ পজিটিভ (A+)", value: "A+" },
            { label: "এ নেগেটিভ (A-)", value: "A-" },
            { label: "বি পজিটিভ (B+)", value: "B+" },
            { label: "বি নেগেটিভ (B-)", value: "B-" },
            { label: "এবি পজিটিভ (AB+)", value: "AB+" },
            { label: "এবি নেগেটিভ (AB-)", value: "AB-" },
            { label: "ও পজিটিভ (O+)", value: "O+" },
            { label: "ও নেগেটিভ (O-)", value: "O-" },
          ]}
          register={register}
          errors={errors}
        />

        {/* ID Type */}

        <CommonInputField<EmployeeFormValues>
          label="পরিচয়পত্রের ধরন"
          name="idType"
          type="dropdown"
          placeholder="পরিচয়পত্রের ধরন"
          options={[
            { label: "এনআইডি", value: "NID" },
            {
              label: "জন্ম নিবন্ধন",
              value: "Birth Certificate",
            },
            {
              label: "পাসপোর্ট",
              value: "Passport",
            },
          ]}
          register={register}
          errors={errors}
        />

        {/* Guardian Type */}

        <div className="min-w-0">
          <label className="block text-sm font-medium mb-2">
            অভিভাবকের ধরন
          </label>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="father"
                {...register("guardianType")}
              />
              <span>পিতা</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="husband"
                {...register("guardianType")}
              />
              <span>স্বামী</span>
            </label>
          </div>
        </div>

        {/* ========================= */}
        {/* ADDRESS */}
        {/* ========================= */}

        <div className="lg:col-span-2 mt-4 min-w-0">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">
            ০৩. প্রার্থীর ঠিকানা
          </h2>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-md font-semibold mb-2">
            বর্তমান ঠিকানা
          </h3>
        </div>

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

        {/* Permanent */}

        <div className="lg:col-span-2 flex items-center justify-between mt-6">
          <h3 className="text-md font-semibold">
            স্থায়ী ঠিকানা
          </h3>

          <label className="flex items-center gap-2 text-sm">
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

            বর্তমান ও স্থায়ী ঠিকানা একই
          </label>
        </div>

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

      {/* ========================= */}
      {/* REFERENCE */}
      {/* ========================= */}

      <div className="lg:col-span-2 mt-4 min-w-0">
        <h2 className="text-lg font-semibold border-b pb-2 mb-4">
          ০৪. রেফারেন্স বিবরণ
        </h2>
      </div>

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

      {/* ========================= */}
      {/* APPROVAL & VERIFICATION */}
      {/* ========================= */}

      <div className="lg:col-span-2 mt-4 min-w-0">
        <h2 className="text-lg font-semibold border-b pb-2 mb-4">
          ০৫. অনুমোদন ও যাচাইকরণ
        </h2>
      </div>

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
      </div>

      {/* ACTIONS */}

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

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save & Next
        </button>
      </div>
    </form>
  );
};

export default RecruitmentForm;