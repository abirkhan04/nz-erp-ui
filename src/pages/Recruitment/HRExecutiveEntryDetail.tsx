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
import { api } from "../../api/client";
import React from "react";
import { EmployeeNature, WeekOffDayMap } from "../EmployeeInformation/types";

interface HRExecutiveEntryForm {
  employeeId: string;
  employeeEnrollmentId: string;
  employeeName: string;
  fatherName: string;
  motherName: string;
  nomineeName: string;
  nomineeNID: string;
  nomineeRelation: string;
  nomineeMobileNumber: string;

  company: string | null;
  subUnit: string | null;
  department: string | null;
  section: string | null;
  cell: string | null;

  designation: string | null;
  grade: string | null;
  shift: string | null;
  weekday: string | null;
  employeeNature: string | null;

  proposedSalary: string;
  joiningDate: string;
  probationPeriod: string;
  employmentType: string;
  payBasis: string;

  reportingTo: string | null;
  employeeCategory: string | null;
  workLocation: string;
  remarks: string;
  mobileNumber: string;
  employeeCode: string;

  paymentMode: string;
  mobileBankingProvider: string;

  bankName: string | null;
  branchName: string;
  accountNumber: string;

  bkashNumber: string;

  grossSalary: string;
  cashPortion: string;
  bankPortion: string;

  educationCertificate: boolean;
  nationalId: boolean;
  policeClearance: boolean;
  experienceCertificate: boolean;
  passportPhoto: boolean;
  chairmanCertificate: boolean;
  signature: boolean;

  files: File[];
}


const HRExecutiveEntryDetails = () => {


  const { data: banks = [] } = useGet({
    key: ["banks"],
    url: `${API_ROUTES.BANKS}?includeInactive=false`
  })

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

  const [uploading, setUploading] = React.useState(false);

  const navigate =
    useNavigate();

  const { candidateId, enrollmentId } =
    useParams();

  const { data: employeeOnGate = {} } = useGet<any>({
    key: ["employeeOnGate", candidateId],
    url: `${API_ROUTES.EMPLOYEES}/employee-detail/${candidateId}`,
    enabled: !!candidateId
  });

  const didRestoreRef = useRef(false);
  const restoredSubUnitRef = useRef(false);
  const restoredSectionRef = useRef(false);
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

  const [documents, setDocuments] = React.useState<any[]>([]);


  const { mutate: HRExecutiveEntryPost } = usePost(API_ROUTES.HRExecutiveEntry);

  const paymentMode =
    watch("paymentMode");

  const values = watch();

  const UploadFiles = async () => {
    try {
      setUploading(true);
      const files = watch("files");

      if (!files?.length) {
        toast.error("Please select file(s) first.");
        return;
      }

      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file); // or "file" depending on API
      });

      const response = await api.post(
        `${API_ROUTES.EMPLOYEE_UPLOAD_FILES}?employeeEnrollmentId=${enrollmentId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setDocuments(response.data.fileNames);

      toast.success("Files uploaded successfully.");
    } catch (error: any) {
      toast.error(error?.message ?? "File upload failed.");
    } finally {
      setUploading(false);
    }
  };

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
    if (!employeeOnGate?.id) return;
    if (didRestoreRef.current) return;
    didRestoreRef.current = true;

    const defaultValues = {
      employeeId: employeeOnGate.id,
      employeeEnrollmentId: employeeOnGate.enrollmentId,

      mobileNumber: employeeOnGate.mobile ?? "",
      company: employeeOnGate.unitId ?? null,
      subUnit: employeeOnGate.subUnitId ?? null,
      department: employeeOnGate.departmentId ?? null,
      section: employeeOnGate.sectionId ?? null,
      cell: employeeOnGate.cellId ?? null,

      designation: employeeOnGate.designationId ?? null,
      grade: employeeOnGate.gradeId ?? null,
      shift: employeeOnGate.shiftId ?? null,

      weekday: employeeOnGate.weekOffDay?.toString() ?? null,
      employeeNature: '0',

      proposedSalary:
        employeeOnGate.proposedMonthlySalary?.toString() ?? "",

      joiningDate: employeeOnGate.joiningDate ?? "",
      probationPeriod:
        employeeOnGate.probationPeriod?.toString() ?? "",
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
  }, [employeeOnGate,
    candidateId,
    enrollmentId,
    reset,
    DRAFT_KEY]);

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
      if (parsed.employeeNature != null) setValue("employeeNature", parsed.employeeNature);
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
    console.log("documents here", documents);
    const payload = {
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      fatherName: data.fatherName,
      motherName: data.motherName,
      employeeCode: data.employeeCode,
      mobileNumber: data.mobileNumber,
      nomineeName: data.nomineeName,
      nomineeNID: data.nomineeNID,
      nomineeRelation: data.nomineeRelation,
      nomineeMobileNumber: data.nomineeMobileNumber,
      employeeEnrollmentId: data.employeeEnrollmentId,
      unitId: data.company,
      subunitId: data.subUnit,
      departmentId: data.department,
      sectionId: data.section,
      cellId: data.cell || null,
      designationId: data.designation || null,
      gradeId: data.grade || null,

      // employeeType: 0, // Set according to your enum
      employeeTypeId: data.employeeCategory || null,

      shiftId: data.shift,
      employeeNatureId:
        data.employeeNature == null || data.employeeNature === ""
          ? null
          : Number(data.employeeNature),

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

      // documents: [
      //   ...(data.educationCertificate
      //     ? [
      //       {
      //         employeeId: data.employeeId,
      //         documentType: "EducationCertificate",
      //         documentNo: null,
      //         issueDate: null,
      //         expiryDate: null,
      //         fileName: null,
      //         filePath: null,
      //       },
      //     ]
      //     : []),

      //   ...(data.nationalId
      //     ? [
      //       {
      //         employeeId: data.employeeId,
      //         documentType: "NationalId",
      //         documentNo: null,
      //         issueDate: null,
      //         expiryDate: null,
      //         fileName: null,
      //         filePath: null,
      //       },
      //     ]
      //     : []),

      //   ...(data.policeClearance
      //     ? [
      //       {
      //         employeeId: data.employeeId,
      //         documentType: "PoliceClearance",
      //         documentNo: null,
      //         issueDate: null,
      //         expiryDate: null,
      //         fileName: null,
      //         filePath: null,
      //       },
      //     ]
      //     : []),

      //   ...(data.experienceCertificate
      //     ? [
      //       {
      //         employeeId: data.employeeId,
      //         documentType: "ExperienceCertificate",
      //         documentNo: null,
      //         issueDate: null,
      //         expiryDate: null,
      //         fileName: null,
      //         filePath: null,
      //       },
      //     ]
      //     : []),

      //   ...(data.passportPhoto
      //     ? [
      //       {
      //         employeeId: data.employeeId,
      //         documentType: "PassportPhoto",
      //         documentNo: null,
      //         issueDate: null,
      //         expiryDate: null,
      //         fileName: null,
      //         filePath: null,
      //       },
      //     ]
      //     : []),
      // ],
      documents: documents.map(i => ({ fileName: i.item1, filePath: i.item2 })),

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

  const employeeInformationFields = [
    {
      label: "Employee Name",
      name: "employeeName",
      type: "text",
      rules: {
        required: "Employee Name is required"
      }
    },
    {
      label: "Father Name",
      name: "fatherName",
      type: "text"
    },
    {
      label: "Mother Name",
      name: "motherName",
      type: "text"
    },
    {
      label: "Nominee Name",
      name: "nomineeName",
      type: "text"
    },
    {
      label: "Nominee NID",
      name: "nomineeNID",
      type: "text"
    },
    {
      label: "Nominee Relation",
      name: "nomineeRelation",
      type: "dropdown",
      options: [
        { label: "Father", value: "father" },
        { label: "Mother", value: "mother" },
        { label: "Spouse", value: "spouse" },
        { label: "Son", value: "son" },
        { label: "Daughter", value: "daughter" },
        { label: "Brother", value: "brother" },
        { label: "Sister", value: "sister" }
      ]
    },
    {
      label: "Nominee Mobile Number",
      name: "nomineeMobileNumber",
      type: "text"
    }
  ];

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
      label: "Weekly holiday",
      name: "weekday",
      type: "dropdown",
      options: Object.entries(WeekOffDayMap).map(([value, label]) => ({
        label,
        value
      }))
    },
    {
      label: "Employee Nature",
      name: "employeeNature",
      type: "dropdown",
      options: Object.entries(EmployeeNature).map(([label, value]) => ({
        label,
        value
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
      label: "Employee Category",
      name: "employeeCategory",
      type: "dropdown",
      options: [{ label: "Permanent", value: "123" }, { label: "Temporary", value: "124" }, { label: "Provisional", value: "125" }]
    },
    {
      label: "Employee Code",
      name: "employeeCode",
      type: "text",
      rules: {
        required: "Employee Code is required"
      }
    },
    {
      label: "Mobile Number",
      name: "mobileNumber",
      type: "text",
      rules: {
        required: "Mobile Number is required"
      }
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
            Employee Information
          </div>

          <div className="grid grid-cols-5 gap-4 p-4">

            {employeeInformationFields.map(
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
                  options={field.options}
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
              { label: "BANK", value: "BANK" },
              { label: "MOBILE BANKING", value: "MOBILE_BANKING" }, // was "BKASH"
              { label: "CASH", value: "CASH" },
            ].map((mode) => (
              <button
                key={mode.value}
                type="button"
                onClick={() => setValue("paymentMode", mode.value)}
                className={`px-6 py-2 border rounded-lg ${paymentMode === mode.value ? "bg-blue-50 border-blue-500" : ""
                  }`}
              >
                {mode.label}
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
                      banks.filter((i: any) => !i.mobileBankingFlag).map((i: any) => ({
                        label: i.bankingName,
                        value: i.id
                      }))
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
                    type="text"
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

                </div>
              )}

            {paymentMode === "MOBILE_BANKING" && (  // was "BKASH"
              <div className="grid grid-cols-2 gap-4">

                <CommonInputField
                  label="Mobile Banking Provider"
                  name="mobileBankingProvider"
                  type="dropdown"
                  options={banks.filter((i: any) => i.mobileBankingFlag).map((i: any) => ({
                    label: i.bankingName,
                    value: i.id
                  }))}
                  register={register}
                  control={control}
                  errors={errors}
                />

                <CommonInputField
                  label="Mobile Number"
                  name="bkashNumber"
                  register={register}
                  errors={errors}
                />

                {/* ❌ Account Holder field removed */}
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
            <label>
              <input
                type="checkbox"
                {...register(
                  "chairmanCertificate"
                )}
              />
              Chairman Certificate
            </label>
            <label>
              <input
                type="checkbox"
                {...register(
                  "signature"
                )}
              />
              Signature
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
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={UploadFiles}
              disabled={uploading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Upload
            </button>
          </div>
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