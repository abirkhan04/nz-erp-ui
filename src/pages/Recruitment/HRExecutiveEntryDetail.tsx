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
import toast from "react-hot-toast";
import { api } from "../../api/client";
import { EmployeeCategory, EmployeeNature, WeekOffDayMap } from "../EmployeeInformation/types";

interface HRExecutiveEntryForm {
  name?: string;
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

  educationCertificate: File | null;
  nationalId: File | null;
  policeClearance: File | null;
  experienceCertificate: File | null;
  passportPhoto: File | null;
  chairmanCertificate: File | null;
  signature: File | null;
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
    setError,
    clearErrors,
    formState: { errors },
  } =
    useForm<HRExecutiveEntryForm>(
      {
        defaultValues: {
          paymentMode:
            "BANK",
          employeeId: "",
          educationCertificate: null,
          nationalId: null,
          policeClearance: null,
          experienceCertificate: null,
          passportPhoto: null,
          chairmanCertificate: null,
          signature: null,
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

  const paymentMode =
    watch("paymentMode");

  const values = watch();

  useEffect(() => {
    const timer = setTimeout(() => {

      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify(values)
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


  const handleSaveDraft = () => {
    const values = watch();

    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify(values)
    );

    toast.success("Draft saved successfully.");
  };

  const onSubmit = async (data: HRExecutiveEntryForm) => {
    console.log("data here", data);

    const payload = new FormData();

    payload.append("employeeId", data.employeeId ?? "");
    payload.append("employeeName", data.employeeName ?? "");
    payload.append("fatherName", data.fatherName ?? "");
    payload.append("motherName", data.motherName ?? "");
    payload.append("employeeCode", data.employeeCode ?? "");
    payload.append("mobileNumber", data.mobileNumber ?? "");
    payload.append("nomineeName", data.nomineeName ?? "");
    payload.append("nomineeID", data.nomineeNID ?? "");
    payload.append("nomineeRelation", data.nomineeRelation ?? "");
    payload.append("nomineeMobileNumber", data.nomineeMobileNumber ?? "");
    payload.append("employeeEnrollmentId", data.employeeEnrollmentId ?? "");

    payload.append("unitId", String(data.company));
    payload.append("subunitId", String(data.subUnit));
    payload.append("departmentId", String(data.department));
    payload.append("sectionId", String(data.section));

    payload.append("cellId", data.cell ? String(data.cell) : "");
    payload.append("designationId", data.designation ? String(data.designation) : "");
    payload.append("gradeId", data.grade ? String(data.grade) : "");

    payload.append(
      "employeeTypeId",
      data.employeeCategory != null ? String(data.employeeCategory) : ""
    );

    payload.append("shiftId", String(data.shift));

    payload.append(
      "employeeNature",
      data.employeeNature == null || data.employeeNature === ""
        ? ""
        : String(Number(data.employeeNature))
    );

    payload.append(
      "holiday",
      String(Number(data.weekday) || 0)
    );

    payload.append("joiningDate", data.joiningDate);
    payload.append("confirmationDate", data.joiningDate);

    payload.append(
      "proposedMonthlySalary",
      String(Number(data.proposedSalary))
    );

    payload.append(
      "bankPortion",
      String(
        data.paymentMode === "BANK"
          ? Number(data.proposedSalary)
          : 0
      )
    );

    payload.append(
      "cashPortion",
      String(
        data.paymentMode === "CASH"
          ? Number(data.proposedSalary)
          : 0
      )
    );

    payload.append("otherAllowance", JSON.stringify({}));

    payload.append("salaryAccountId", "");

    payload.append("tax", "0");

    payload.append("paymentMethod", data.paymentMode || "BANK");

    payload.append(
      "bankingId",
      data.bankName ? String(data.bankName) : ""
    );

    payload.append("accountName", "");
    payload.append("accountNo", data.accountNumber ?? "");
    payload.append("routingNo", "");
    payload.append("branchName", data.branchName ?? "");

    payload.append(
      "salaryAccountFlag",
      String(data.paymentMode === "BANK")
    );

    payload.append("tinNumber", "");

    payload.append(
      "probationPeriod",
      String(Number(data.probationPeriod))
    );

    payload.append(
      "reportingTo",
      data.reportingTo ? String(data.reportingTo) : ""
    );

    payload.append("processingGroupId", "");

    payload.append(
      "grossSalary",
      String(Number(data.proposedSalary))
    );

    if (data.educationCertificate) {
      payload.append(
        "educationCertificate",
        data.educationCertificate
      );
    }

    if (data.nationalId) {
      payload.append(
        "nationalId",
        data.nationalId
      );
    }

    if (data.policeClearance) {
      payload.append(
        "policeClearance",
        data.policeClearance
      );
    }

    if (data.experienceCertificate) {
      payload.append(
        "experienceCertificate",
        data.experienceCertificate
      );
    }

    if (data.passportPhoto) {
      payload.append(
        "passportPhoto",
        data.passportPhoto
      );
    }

    if (data.chairmanCertificate) {
      payload.append(
        "chairmanCertificate",
        data.chairmanCertificate
      );
    }

    if (data.signature) {
      payload.append(
        "signature",
        data.signature
      );
    }

    try {
      const response = await api.post(
        API_ROUTES.HRExecutiveEntry,
        payload
      );

      toast.success(
        `Entry entered successfully ${response.data.id}`
      );

      localStorage.removeItem(DRAFT_KEY);

      reset();
      navigate("/recruitment/hr-executive-entry")
    }
    catch (error: any) {
      toast.error(
        `Entry failed ${error?.message}`
      );
    }

    // mutate(payload);
  };

  const documentFields = [
    { label: "Education Certificate", name: "educationCertificate" },
    { label: "National ID", name: "nationalId" },
    { label: "Police Clearance", name: "policeClearance" },
    { label: "Experience Certificate", name: "experienceCertificate" },
    { label: "Passport Photo", name: "passportPhoto" },
    { label: "Chairman Certificate", name: "chairmanCertificate" },
    { label: "Signature", name: "signature" },
  ];

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
      type: "text",
      name: "nomineeName",
    },
    {
      label: "Nominee NID",
      type: "text",
      name: "nomineeNID"
    },
    {
      label: "Nominee Relation",
      type: "dropdown",
      name: "nomineeRelation",
      options: [
        { label: "Father", value: "father" },
        { label: "Mother", value: "mother" },
        { label: "Husband", value: "husband" },
        { label: "Wife", value: "wife" },
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
      options: Object.entries(EmployeeCategory).map(([label, value]) => ({
        label,
        value
      }))
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

          <div className="grid grid-cols-7 gap-4 p-4">
            {documentFields.map((doc) => (
              <div className="flex flex-col">
                <div
                  key={doc.name}
                  className="border rounded-xl p-5 bg-slate-50 hover:border-blue-400 transition"
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {doc.label}
                  </label>

                  <label
                    htmlFor={doc.name}
                    className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
                  >
                    <UploadCloud className="w-8 h-8 text-blue-500 mb-2" />

                    <span className="text-sm font-medium text-gray-700">
                      Click to upload
                    </span>

                    <span className="text-xs text-gray-500 mt-1">
                      PDF, JPG, PNG supported
                    </span>

                    {(watch(doc.name as keyof HRExecutiveEntryForm) as File | null)?.name && (
                      <span className="mt-3 text-sm text-green-600 font-medium text-center px-2 break-all max-w-full">
                        {(watch(doc.name as keyof HRExecutiveEntryForm) as File).name}
                      </span>
                    )}
                  </label>

                  <input
                    id={doc.name}
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (!file) return;

                      const allowedTypes = [
                        "application/pdf",
                        "image/png",
                        "image/jpeg",
                      ];

                      if (!allowedTypes.includes(file.type)) {
                        setError(doc.name as keyof HRExecutiveEntryForm, {
                          type: "manual",
                          message: "Only PDF, PNG, JPG and JPEG files are allowed.",
                        });

                        e.target.value = "";
                        setValue(doc.name as keyof HRExecutiveEntryForm, null);

                        return;
                      }

                      clearErrors(doc.name as keyof HRExecutiveEntryForm);

                      setValue(
                        doc.name as keyof HRExecutiveEntryForm,
                        file,
                        { shouldValidate: true }
                      );
                    }}
                  />
                </div>
                {errors[doc.name as keyof HRExecutiveEntryForm] && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors[doc.name as keyof HRExecutiveEntryForm]?.message}
                  </p>
                )}
              </div>
            ))}
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