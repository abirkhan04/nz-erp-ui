import {
  useEffect,
  useRef
} from "react";

import {
  ArrowLeft,
  Save,
  Send,
  UploadCloud,
} from "lucide-react";

import {
  useForm,
} from "react-hook-form";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import CommonInputField from "../../components/CommonInputFields";
import { API_ROUTES } from "../../api/routes";
import type { Unit } from "../../types/interfaces";
import { useGet } from "../../hooks/useGet";
import { usePost } from "../../hooks/usePost";
import toast from "react-hot-toast";

interface HRExecutiveEntryForm {
  employeeId: string;
  employeeEnrollmentId: string;

  company: string | null;
  subUnit: string | null;
  department: string | null;
  section: string | null;
  cell: string | null;

  designation: string | null;
  grade: string | null;
  shift: string | null;
  weekday: string | null;
  workerType: string | null;

  proposedSalary: string;
  joiningDate: string;
  probationPeriod: string;
  employmentType: string;
  payBasis: string;

  reportingTo: string | null;
  employeeCategory: string | null;
  workLocation: string;
  remarks: string;

  paymentMode: string;

  bankName: string | null;
  branchName: string;
  accountNumber: string;
  accountType: string;

  bkashNumber: string;
  accountHolderName: string;

  grossSalary: string;
  cashPortion: string;
  bankPortion: string;

  educationCertificate: boolean;
  nationalId: boolean;
  policeClearance: boolean;
  experienceCertificate: boolean;
  passportPhoto: boolean;

  files: File[];
}



const dropdownOptions = [
  {
    label: "Option 1",
    value: "1",
  },
  {
    label: "Option 2",
    value: "2",
  },
];

const HRExecutiveEntryDetails = () => {

  const {
    register,
    control,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } =
    useForm<HRExecutiveEntryForm>(
      {
        defaultValues: {
          paymentMode:
            "BANK",
          files: [],
          employeeId: "",
        },
      }
    );

  const { data: units = [] } = useGet<Unit[]>({
    key: ["units"],
    url: API_ROUTES.UNITS,
  });

  const { data: subUnits = [] } = useGet<any[]>({
    key: ["subUnits", watch("company")],
    url: `${API_ROUTES.SUB_UNITS}/Unit/${watch("company")}`,
    enabled: !!watch("company"),
  });

  const { data: departments = [] } = useGet<any[]>({
    key: ["departments"],
    url: API_ROUTES.DEPARTMENT,
  });

  const { data: sections = [] } = useGet<any[]>({
    key: ["sections", watch("department")],
    url: `${API_ROUTES.SECTION}/by-department/${watch("department")}?includeInactive=false`,
    enabled: !!watch("department"),
  });

  const { data: cells = [] } = useGet<any[]>({
    key: ["cells"],
    url: API_ROUTES.CELL,
  });

  const { data: designations = [] } = useGet<any[]>({
    key: ["designations"],
    url: API_ROUTES.DESIGNATION,
  });

  const { data: grades = [] } = useGet<any[]>({
    key: ["grades"],
    url: API_ROUTES.GRADE,
  });

  const { data: shifts = [] } = useGet<any[]>({
    key: ["shifts"],
    url: API_ROUTES.SHIFT,
  });

  const { data: employeeNatures = [] } = useGet<any[]>({
    key: ["workerTypes"],
    url: API_ROUTES.EMPLOYEE_NATURES
  })

  const navigate =
    useNavigate();

  const { candidateId, enrollmentId } =
    useParams();

  const didRestoreRef = useRef(false);
  const restoredSubUnitRef = useRef(false);
  const restoredSectionRef = useRef(false);
  const restoredFieldsRef = useRef(false);
  const restoredCompanyRef = useRef(false);
  const restoredDepartmentRef = useRef(false);
  const restoredCellRef = useRef(false);
  const restoredDesignationRef = useRef(false);
  const restoredGradeRef = useRef(false);
  const restoredShiftRef = useRef(false);
  const restoredWorkerTypeRef = useRef(false);

  useEffect(() => {
    didRestoreRef.current = false;
    restoredSubUnitRef.current = false;
    restoredSectionRef.current = false;
    restoredCompanyRef.current = false;
    restoredDepartmentRef.current = false;
    restoredCellRef.current = false;
    restoredDesignationRef.current = false;
    restoredGradeRef.current = false;
    restoredShiftRef.current = false;
    restoredWorkerTypeRef.current = false;
  }, [candidateId, enrollmentId]);

  const DRAFT_KEY = `HR_EXECUTIVE_DRAFT_${candidateId}_${enrollmentId}`;




  const { mutate: HRExecutiveEntryPost } = usePost(API_ROUTES.HRExecutiveEntry);

  const paymentMode =
    watch("paymentMode");

  const values = watch();

  useEffect(() => {
    const timer = setTimeout(() => {
      const { files, ...rest } = values;

      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify(rest)
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [values, DRAFT_KEY]);

  useEffect(() => {
    if (didRestoreRef.current) return;
    didRestoreRef.current = true;

    const defaultValues: any = {
      employeeId: candidateId ?? "",
      employeeEnrollmentId: enrollmentId ?? "",
      company: null,
      subUnit: null,
      department: null,
      section: null,
      cell: null,
      bankName: null,
      designation: null,
      grade: null,
      shift: null,
      weekday: null,
      workerType: null,
      proposedSalary: "13000",
      joiningDate: "2025-06-01",
      probationPeriod: "3",
      employmentType: "Regular",
      payBasis: "Monthly",
      reportingTo: null,
      employeeCategory: null,
      workLocation: "1",
      remarks: "",
      paymentMode: "BANK",
      files: [],
    };

    const draft = localStorage.getItem(DRAFT_KEY);

    if (draft) {
      const parsed = JSON.parse(draft);
      reset({
        ...defaultValues,
        ...parsed,
        files: [],
      });
    } else {
      reset(defaultValues);
    }
  }, [candidateId, enrollmentId, reset]);

  useEffect(() => {
    if (restoredSubUnitRef.current || subUnits.length === 0) return;
    const draft = localStorage.getItem(DRAFT_KEY);
    if (!draft) return;
    const parsed = JSON.parse(draft);
    if (parsed.subUnit != null) setValue("subUnit", parsed.subUnit);
    restoredSubUnitRef.current = true;
  }, [subUnits]);

  useEffect(() => {
    if (restoredSectionRef.current || sections.length === 0) return;
    const draft = localStorage.getItem(DRAFT_KEY);
    if (!draft) return;
    const parsed = JSON.parse(draft);
    if (parsed.section != null) setValue("section", parsed.section);
    restoredSectionRef.current = true;
  }, [sections]);

  useEffect(() => {
    if (restoredCompanyRef.current || units.length === 0) return;
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      const parsed = JSON.parse(draft);
      if (parsed.company != null) setValue("company", parsed.company);
    }
    restoredCompanyRef.current = true;
  }, [units]);

  useEffect(() => {
    if (restoredDepartmentRef.current || departments.length === 0) return;
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      const parsed = JSON.parse(draft);
      if (parsed.department != null) setValue("department", parsed.department);
    }
    restoredDepartmentRef.current = true;
  }, [departments]);

  useEffect(() => {
    if (restoredCellRef.current || cells.length === 0) return;
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      const parsed = JSON.parse(draft);
      if (parsed.cell != null) setValue("cell", parsed.cell);
    }
    restoredCellRef.current = true;
  }, [cells]);

  useEffect(() => {
    if (restoredDesignationRef.current || designations.length === 0) return;
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      const parsed = JSON.parse(draft);
      if (parsed.designation != null) setValue("designation", parsed.designation);
    }
    restoredDesignationRef.current = true;
  }, [designations]);

  useEffect(() => {
    if (restoredGradeRef.current || grades.length === 0) return;
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      const parsed = JSON.parse(draft);
      if (parsed.grade != null) setValue("grade", parsed.grade);
    }
    restoredGradeRef.current = true;
  }, [grades]);

  useEffect(() => {
    if (restoredShiftRef.current || shifts.length === 0) return;
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      const parsed = JSON.parse(draft);
      if (parsed.shift != null) setValue("shift", parsed.shift);
    }
    restoredShiftRef.current = true;
  }, [shifts]);

  useEffect(() => {
    if (restoredWorkerTypeRef.current || employeeNatures.length === 0) return;
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      const parsed = JSON.parse(draft);
      if (parsed.workerType != null) setValue("workerType", parsed.workerType);
    }
    restoredWorkerTypeRef.current = true;
  }, [employeeNatures]);

  const handleSaveDraft = () => {
    const values = watch();

    // Remove files before saving
    const { files, ...rest } = values;

    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify(rest)
    );

    toast.success("Draft saved successfully.");
  };

  const uploadedFiles = watch("files");

  const onSubmit = (data: HRExecutiveEntryForm) => {
    console.log("data here", data);

    const payload = {
      employeeId: data.employeeId,
      employeeEnrollmentId: data.employeeEnrollmentId,
      unitId: data.company,
      subunitId: data.subUnit,
      departmentId: data.department,
      sectionId: data.section,
      cellId: data.cell || null,
      designationId: data.designation || null,
      gradeId: data.grade || null,

      employeeType: 0, // Set according to your enum
      employeeTypeId: data.employeeCategory,

      shiftId: data.shift,
      employeeNatureId: data.workerType || null,

      holiday: Number(data.weekday) || 0,

      joiningDate: data.joiningDate,
      confirmationDate: data.joiningDate, // Calculate if required

      proposedMonthlySalary: Number(data.proposedSalary),
      bankPortion: data.paymentMode === "BANK" ? Number(data.proposedSalary) : 0,
      cashPortion: data.paymentMode === "CASH" ? Number(data.proposedSalary) : 0,

      otherAllowance: {},

      salaryAccountId: null,

      tax: 0,

      paymentMethod: data.paymentMode,

      bankingId: data.bankName || null,
      accountName: "",
      accountNo: data.accountNumber,
      routingNo: "",
      branchName: data.branchName,

      salaryAccountFlag: data.paymentMode === "BANK",

      accountType: data.accountType,

      // documents: [
      //   ...(data.educationCertificate
      //     ? [
      //         {
      //           employeeId: data.employeeId,
      //           documentType: "EducationCertificate",
      //           documentNo: "",
      //           issueDate: "",
      //           expiryDate: "",
      //           fileName: "",
      //           filePath: "",
      //         },
      //       ]
      //     : []),

      //   ...(data.nationalId
      //     ? [
      //         {
      //           employeeId: data.employeeId,
      //           documentType: "NationalId",
      //           documentNo: "",
      //           issueDate: "",
      //           expiryDate: "",
      //           fileName: "",
      //           filePath: "",
      //         },
      //       ]
      //     : []),

      //   ...(data.policeClearance
      //     ? [
      //         {
      //           employeeId: data.employeeId,
      //           documentType: "PoliceClearance",
      //           documentNo: "",
      //           issueDate: "",
      //           expiryDate: "",
      //           fileName: "",
      //           filePath: "",
      //         },
      //       ]
      //     : []),

      //   ...(data.experienceCertificate
      //     ? [
      //         {
      //           employeeId: data.employeeId,
      //           documentType: "ExperienceCertificate",
      //           documentNo: "",
      //           issueDate: "",
      //           expiryDate: "",
      //           fileName: "",
      //           filePath: "",
      //         },
      //       ]
      //     : []),

      //   ...(data.passportPhoto
      //     ? [
      //         {
      //           employeeId: data.employeeId,
      //           documentType: "PassportPhoto",
      //           documentNo: "",
      //           issueDate: "",
      //           expiryDate: "",
      //           fileName: "",
      //           filePath: "",
      //         },
      //       ]
      //     : []),
      // ],
      documents: null,

      tinNumber: "",

      probationPeriod: Number(data.probationPeriod),

      reportingTo: data.reportingTo,

      processingGroupId: null,

      grossSalary: Number(data.proposedSalary),
    };

    console.log(payload);

    HRExecutiveEntryPost(payload, {
      onSuccess: (response) => {
        toast.success(
          `Entry entered successfully ${response.id}`
        );
        localStorage.removeItem(DRAFT_KEY);
        reset();
      },

      onError: (error) => {
        toast.error(
          `Entry failed ${error.message}`
        );
      },
    });

    // mutate(payload);
  };

  const serviceInformationFields = [
    {
      label: "Company",
      name: "company",
      type: "dropdown",
      options: units.map((unit) => ({
        label: unit.unitName,
        value: unit.id,
      })),
      rules: {
        required: "Select Company",
      },
    },
    {
      label: "Sub Unit / Shed",
      name: "subUnit",
      type: "dropdown",
      options: subUnits.map((subUnit) => ({
        label: subUnit.subunitName,
        value: subUnit.id,
      })),
      rules: {
        required: "Select Sub Unit / Shed",
      },
    },
    {
      label: "Department",
      name: "department",
      type: "dropdown",
      options: departments.map((department) => ({
        label: department.departmentName,
        value: department.departmentId,
      })),
      rules: {
        required: "Select Department",
      },
    },
    {
      label: "Section",
      name: "section",
      type: "dropdown",
      options: sections.map((section) => ({
        label: section.sectionName,
        value: section.id,
      })),
      rules: {
        required: "Select Section",
      },
    },
    {
      label: "Cell",
      name: "cell",
      type: "dropdown",
      options: cells.map((cell) => ({
        label: cell.cellName,
        value: cell.id,
      })),
    },
    {
      label: "Designation",
      name: "designation",
      type: "dropdown",
      options: designations.map((designation) => ({
        label: designation.designationName,
        value: designation.id,
      }))
    },
    {
      label: "Grade",
      name: "grade",
      type: "dropdown",
      options: grades.map((grade) => ({
        label: grade.gradeName,
        value: grade.id,
      })),
    },
    {
      label: "Shift",
      name: "shift",
      type: "dropdown",
      options: shifts.map((shift) => ({
        label: shift.shiftName,
        value: shift.id,
      })),
      rules: {
        required: "Select Shift",
      },
    },
    {
      label: "Weekday",
      name: "weekday",
      type: "dropdown",
    },
    {
      label: "Worker Type",
      name: "workerType",
      type: "dropdown",
      options: employeeNatures.map((i) => ({
        label: i.natureName,
        value: i.id
      })),
      rules: {
        required: "Select worker type",
      },
    },
    {
      label: "Salary",
      name: "proposedSalary",
      type: "number",
    },
    {
      label: "Joining Date",
      name: "joiningDate",
      type: "date",
    },
    {
      label: "Probation Period",
      name:
        "probationPeriod",
      type: "number",
    },
    {
      label: "Employment Type",
      name:
        "employmentType",
      type: "text",
    },
    {
      label: "Pay Basis",
      name: "payBasis",
      type: "text",
    },
    {
      label: "Reporting To",
      name: "reportingTo",
      type: "dropdown",
    },
    {
      label: "Employee Category",
      name:
        "employeeCategory",
      type: "dropdown",
    },
    {
      label: "Work Location",
      name: "workLocation",
      type: "dropdown",
    },
    {
      label: "Remarks",
      name: "remarks",
      type: "text",
    }
  ];

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
      className="min-h-screen bg-slate-50 p-6"
    >
      <div className="max-w-[1800px] mx-auto">

        <div className="flex items-center justify-between mb-6">

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="border rounded-lg px-4 py-2"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="font-semibold">
            Candidate :
            {" "}
            {
              candidateId
            }
          </div>

          <div>
            Entry Date :
            {" "}
            {
              new Date().toLocaleDateString()
            }
          </div>

        </div>

        <div className="bg-white rounded-xl mb-6">

          <div className="border-b px-4 py-3 font-semibold text-blue-700">
            Service Information
          </div>

          <div className="grid grid-cols-5 gap-4 p-4">

            {serviceInformationFields.map(
              (field) => (
                <CommonInputField
                  key={field.name}
                  placeholder={`Enter ${field.label}`}
                  label={
                    field.label
                  }
                  name={
                    field.name as any
                  }
                  type={
                    field.type as any
                  }
                  options={
                    field.options
                  }
                  register={
                    register
                  }
                  control={
                    control
                  }
                  rules={field.rules}
                  errors={
                    errors
                  }
                />
              )
            )}

          </div>
        </div>
        <div className="bg-white rounded-xl mb-6">

          <div className="border-b px-4 py-3 font-semibold text-blue-700">
            Payment Information
          </div>

          <div className="flex gap-4 p-4">

            {[
              "BANK",
              "BKASH",
              "CASH",
              "MIXED",
            ].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() =>
                  setValue(
                    "paymentMode",
                    mode
                  )
                }
                className={`px-6 py-2 border rounded-lg ${paymentMode ===
                  mode
                  ? "bg-blue-50 border-blue-500"
                  : ""
                  }`}
              >
                {mode}
              </button>
            ))}

          </div>

          <div className="p-4">

            {paymentMode ===
              "BANK" && (
                <div className="grid grid-cols-4 gap-4">

                  <CommonInputField
                    label="Bank Name"
                    name="bankName"
                    type="dropdown"
                    options={
                      dropdownOptions
                    }
                    register={
                      register
                    }
                    control={
                      control
                    }
                    errors={
                      errors
                    }
                  />

                  <CommonInputField
                    label="Branch"
                    name="branchName"
                    type="dropdown"
                    options={
                      dropdownOptions
                    }
                    register={
                      register
                    }
                    control={
                      control
                    }
                    errors={
                      errors
                    }
                  />

                  <CommonInputField
                    label="Account Number"
                    name="accountNumber"
                    register={
                      register
                    }
                    errors={
                      errors
                    }
                  />

                  <CommonInputField
                    label="Account Type"
                    name="accountType"
                    type="dropdown"
                    options={
                      dropdownOptions
                    }
                    register={
                      register
                    }
                    control={
                      control
                    }
                    errors={
                      errors
                    }
                  />

                </div>
              )}

            {paymentMode ===
              "BKASH" && (
                <div className="grid grid-cols-2 gap-4">

                  <CommonInputField
                    label="Bkash Number"
                    name="bkashNumber"
                    register={
                      register
                    }
                    errors={
                      errors
                    }
                  />

                  <CommonInputField
                    label="Account Holder"
                    name="accountHolderName"
                    register={
                      register
                    }
                    errors={
                      errors
                    }
                  />

                </div>
              )}

            {paymentMode ===
              "MIXED" && (
                <div className="grid grid-cols-3 gap-4">

                  <CommonInputField
                    label="Gross Salary"
                    name="grossSalary"
                    type="number"
                    register={
                      register
                    }
                    errors={
                      errors
                    }
                  />

                  <CommonInputField
                    label="Cash Portion"
                    name="cashPortion"
                    type="number"
                    register={
                      register
                    }
                    errors={
                      errors
                    }
                  />

                  <CommonInputField
                    label="Bank Portion"
                    name="bankPortion"
                    type="number"
                    register={
                      register
                    }
                    errors={
                      errors
                    }
                  />

                </div>
              )}

          </div>
        </div>

        <div className="bg-white rounded-xl mb-6">
          <div className="border-b px-4 py-3 font-semibold text-blue-700">
            Documents Collected
          </div>

          <div className="grid grid-cols-2 gap-4 p-4">

            <label>
              <input
                type="checkbox"
                {...register(
                  "educationCertificate"
                )}
              />
              Education
              Certificate
            </label>

            <label>
              <input
                type="checkbox"
                {...register(
                  "nationalId"
                )}
              />
              National ID
            </label>

            <label>
              <input
                type="checkbox"
                {...register(
                  "policeClearance"
                )}
              />
              Police Clearance
            </label>

            <label>
              <input
                type="checkbox"
                {...register(
                  "experienceCertificate"
                )}
              />
              Experience
              Certificate
            </label>

            <label>
              <input
                type="checkbox"
                {...register(
                  "passportPhoto"
                )}
              />
              Passport Photo
            </label>

          </div>

        </div>

        <div className="bg-white rounded-xl border-2 border-dashed p-8 mb-6">

          <label className="flex flex-col items-center justify-center cursor-pointer">

            <UploadCloud
              size={40}
              className="mb-3 text-blue-600"
            />

            <p className="font-medium">
              Click or Drag & Drop Files
            </p>

            <p className="text-sm text-gray-500">
              Multiple files are supported
            </p>

            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                setValue("files", files);
              }}
            />
          </label>

          {uploadedFiles?.length > 0 && (
            <div className="mt-6 border rounded-lg">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center px-4 py-2 border-b last:border-b-0"
                >
                  <span>{file.name}</span>

                  <button
                    type="button"
                    className="text-red-500"
                    onClick={() => {
                      setValue(
                        "files",
                        uploadedFiles.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>

        <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem(DRAFT_KEY);
              reset();
            }}
            className="border px-6 py-3 rounded-lg"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Save size={16} />
            Save Draft
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Send size={16} />
            Submit To Biometric
          </button>

        </div>

      </div>
    </form>
  );
};

export default HRExecutiveEntryDetails;