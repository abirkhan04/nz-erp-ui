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
  GraduationCap,
  IdCard,
  ShieldCheck,
  Briefcase,
  Image,
  BadgeCheck,
  PenLine,
  FileText
} from "lucide-react";

import {
  useForm,
  type Path,
  type RegisterOptions,
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
import { EmployeeCategory, EmployeeNature, relationshipTypeEn, WeekOffDayMap } from "../EmployeeInformation/types";
import GateRegistration from "./GateRegistration";
import BanglaInputField from "../../components/BanglaInputField";
import { useSearchParams } from "react-router-dom";

export const banglaOnlyValidation: RegisterOptions<HRExecutiveEntryForm> = {
  validate: (value) => {
    const text = String(value ?? "").trim();

    if (!text) return true;

    return /^[ঀ-৿\s.,\-()/:'"]+$/u.test(text) &&
      !/[০-৯0-9]/.test(text)
      ? true
      : "শুধুমাত্র বাংলা অক্ষরে লিখুন";
  },
};

interface HRExecutiveEntryForm {
  name?: string;
  employeeId: string;
  employeeEnrollmentId: string;
  employeeName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  nomineeName: string;
  nomineeNameBangla: string;
  nomineeNID: string;
  nomineeRelation: string;
  nomineeMobileNumber: string;
  referenceName: string;
  referenceMobile: string;

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

  permanentVillageAreaRoad: string;
  permanentPostOffice: string;

  sameAsPermanent: boolean;

  presentVillageAreaRoad: string;
  presentPostOffice: string;
  permanentDivision: string | null;
  permanentDistrict: string | null;
  permanentPoliceStation: string | null;

  presentDivision: string | null;
  presentDistrict: string | null;
  presentPoliceStation: string | null;

  educationCertificate: File | null;
  nationalId: File | null;
  policeClearance: File | null;
  experienceCertificate: File | null;
  passportPhoto: File | null;
  chairmanCertificate: File | null;
  signature: File | null;
  appliedCV: File | null;
}


const HRExecutiveEntryDetails = () => {


  const [searchParams] = useSearchParams();
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
          permanentVillageAreaRoad: "",
          permanentPostOffice: "",

          sameAsPermanent: false,

          presentVillageAreaRoad: "",
          presentPostOffice: "",
          permanentDivision: null,
          permanentDistrict: null,
          permanentPoliceStation: null,

          presentDivision: null,
          presentDistrict: null,
          presentPoliceStation: null,
        },
      }
    );

  const sameAsPermanent = watch("sameAsPermanent");

  const { data: divisions = [] } = useGet<any[]>({
    key: ["divisions"],
    url: API_ROUTES.DIVISIONS,
  });

  const { data: permanentDistricts = [] } = useGet<any[]>({
    key: ["permanentDistricts", watch("permanentDivision")],
    url: `${API_ROUTES.DIVISIONS}/${watch("permanentDivision")}/districts`,
    enabled: !!watch("permanentDivision"),
  });

  const { data: permanentThanas = [] } = useGet<any[]>({
    key: ["permanentThanas", watch("permanentDistrict")],
    url: `${API_ROUTES.DISTRICTS}/${watch("permanentDistrict")}/thanas`,
    enabled: !!watch("permanentDistrict"),
  });

  const { data: presentDistricts = [] } = useGet<any[]>({
    key: ["presentDistricts", watch("presentDivision")],
    url: `${API_ROUTES.DIVISIONS}/${watch("presentDivision")}/districts`,
    enabled: !!watch("presentDivision"),
  });

  const { data: presentThanas = [] } = useGet<any[]>({
    key: ["presentThanas", watch("presentDistrict")],
    url: `${API_ROUTES.DISTRICTS}/${watch("presentDistrict")}/thanas`,
    enabled: !!watch("presentDistrict"),
  });

  const permanentDivision = watch("permanentDivision");
  const permanentDistrict = watch("permanentDistrict");
  const permanentPoliceStation = watch("permanentPoliceStation");

  const permanentVillageAreaRoad = watch("permanentVillageAreaRoad");
  const permanentPostOffice = watch("permanentPostOffice");


  useEffect(() => {
    if (!sameAsPermanent) return;

    setValue("presentVillageAreaRoad", permanentVillageAreaRoad ?? "");
    setValue("presentPostOffice", permanentPostOffice ?? "");

    clearErrors([
      "presentVillageAreaRoad",
      "presentPostOffice",
    ]);
  }, [
    sameAsPermanent,
    permanentVillageAreaRoad,
    permanentPostOffice,
  ]);

  useEffect(() => {
    if (!sameAsPermanent) return;

    setValue("presentDivision", permanentDivision);

    clearErrors([
      "presentDivision",
      "presentDistrict",
      "presentPoliceStation",
    ]);
  }, [sameAsPermanent, permanentDivision]);

  useEffect(() => {
    if (!sameAsPermanent) return;
    if (!presentDistricts.length) return;

    const match = presentDistricts.find(
      d => String(d.id) === String(permanentDistrict)
    );

    if (match) {
      setValue("presentDistrict", match.id);
    }
  }, [
    sameAsPermanent,
    presentDistricts,
    permanentDistrict,
  ]);

  useEffect(() => {
    if (!sameAsPermanent) return;
    if (!presentThanas.length) return;

    const match = presentThanas.find(
      t => String(t.id) === String(permanentPoliceStation)
    );

    if (match) {
      setValue("presentPoliceStation", match.id);
    }
  }, [
    sameAsPermanent,
    presentThanas,
    permanentPoliceStation,
  ]);


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

  const section = watch("section");

  const employeeNature = watch("employeeNature");
  const grade = watch("grade");

  const { data: cells = [] } = useGet<any[]>({
    key: ["cells", section],
    url: `${API_ROUTES.CELL}?includeInactive=false&sectionId=${section}`,
    enabled: !!section
  });

  const { data: designations = [] } = useGet<any[]>({
    key: ["designations", grade],
    url: `${API_ROUTES.DESIGNATION}?gradeId=${grade}`,
    enabled: !!grade
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
  console.log("employee on gate-->", employeeOnGate);

  const { data: candidateOnGate } = useGet<any>({
    key: ["appointment_letter", candidateId],
    url: `${API_ROUTES.EMPLOYEE_REPORTS}/candidate-entry/${candidateId}`,
    enabled: !!candidateId
  })

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

  const draftId = searchParams.get("draftId")

  const DRAFT_KEY =
    candidateId && enrollmentId
      ? `HR_EXECUTIVE_DRAFT_${candidateId}_${enrollmentId}`
      : `HR_EXECUTIVE_DRAFT_NEW_${draftId}`;

  const paymentMode =
    watch("paymentMode");

  const values = watch();

  useEffect(() => {
    if (!candidateId && !searchParams.get("draftId")) {
      const id = crypto.randomUUID();

      navigate(
        `${location.pathname}?draftId=${id}`,
        { replace: true }
      );
    }
  }, [candidateId, navigate, searchParams]);

  useEffect(() => {
    if (candidateId) return;
    if (!draftId) return;

    const draft = localStorage.getItem(DRAFT_KEY);

    if (draft) {
      reset(JSON.parse(draft));
    }
  }, [candidateId, draftId, DRAFT_KEY]);

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
      employeeNature: "0",

      proposedSalary:
        employeeOnGate.proposedMonthlySalary?.toString() ?? "",

      joiningDate: employeeOnGate.joiningDate ?? "",
      probationPeriod:
        employeeOnGate.probationPeriod?.toString() ?? "",

      permanentDivision: employeeOnGate.permanentDivisionId ?? null,
      permanentDistrict: employeeOnGate.permanentDistrictId ?? null,
      permanentPoliceStation: employeeOnGate.permanentUpazilaId
        ?? null,

      presentDivision: employeeOnGate.presentDivisionId ?? null,
      presentDistrict: employeeOnGate.presentDistrictId ?? null,
      presentPoliceStation: employeeOnGate.presentUpazilaId
        ?? null,
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
    if (restoredDesignationRef.current) return;
    if (!grade) return;
    if (designations.length === 0) return;

    const availableDesignations = designations;

    if (availableDesignations.length === 0) return;

    const draft = localStorage.getItem(DRAFT_KEY);

    if (draft) {
      const parsed = JSON.parse(draft);

      if (
        parsed.designation != null &&
        availableDesignations.some(d => d.id === parsed.designation)
      ) {
        setValue("designation", parsed.designation);
      }
    } else if (
      employeeOnGate?.designationId != null &&
      availableDesignations.some(d => d.id === employeeOnGate.designationId)
    ) {
      setValue("designation", employeeOnGate.designationId);
    }

    restoredDesignationRef.current = true;
  }, [
    employeeNature,
    designations,
    employeeOnGate,
    DRAFT_KEY,
    setValue,
  ]);

  useEffect(() => {
    if (!employeeNature) return;

    setValue("grade", null);
    setValue("designation", null);

    restoredGradeRef.current = false;
    restoredDesignationRef.current = false;
  }, [employeeNature]);

  useEffect(() => {
    if (!grade) return;

    setValue("designation", null);

    restoredDesignationRef.current = false;
  }, [grade]);

  useEffect(() => {
    if (restoredGradeRef.current) return;
    if (!employeeNature) return;
    if (grades.length === 0) return;

    const availableGrades = grades.filter(
      g => g.employeeNature === Number(employeeNature)
    );

    const draft = localStorage.getItem(DRAFT_KEY);

    if (draft) {
      const parsed = JSON.parse(draft);

      if (
        parsed.grade != null &&
        availableGrades.some(g => g.id === parsed.grade)
      ) {
        setValue("grade", parsed.grade);
      }
    } else if (
      employeeOnGate?.gradeId != null &&
      availableGrades.some(g => g.id === employeeOnGate.gradeId)
    ) {
      setValue("grade", employeeOnGate.gradeId);
    }

    restoredGradeRef.current = true;
  }, [
    employeeNature,
    grades,
    employeeOnGate,
    DRAFT_KEY,
    setValue,
  ]);

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
    const draft = localStorage.getItem(DRAFT_KEY);
    if (!draft) return;
    if (!divisions.length) return;

    const parsed = JSON.parse(draft);

    setValue("presentDivision", parsed.presentDivision);
    setValue("permanentDivision", parsed.permanentDivision);
  }, [divisions]);

  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (!draft) return;
    if (!presentDistricts.length) return;

    const parsed = JSON.parse(draft);

    setValue("presentDistrict", parsed.presentDistrict);
  }, [presentDistricts]);

  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (!draft) return;
    if (!permanentDistricts.length) return;

    const parsed = JSON.parse(draft);

    setValue("permanentDistrict", parsed.permanentDistrict);
  }, [permanentDistricts]);


  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (!draft) return;
    if (!presentThanas.length) return;

    const parsed = JSON.parse(draft);

    setValue("presentPoliceStation", parsed.presentPoliceStation);
  }, [presentThanas]);

  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (!draft) return;
    if (!permanentThanas.length) return;

    const parsed = JSON.parse(draft);

    setValue("permanentPoliceStation", parsed.permanentPoliceStation);
  }, [permanentThanas]);

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

    payload.append("employeeId", employeeOnGate.id ?? "");
    payload.append("employeeName", data.employeeName ?? "");
    payload.append("fatherName", data.fatherName ?? "");
    payload.append("motherName", data.motherName ?? "");
    payload.append("dateOfBirth", data.dateOfBirth ?? "");
    payload.append("employeeCode", data.employeeCode ?? "");
    payload.append("mobileNumber", data.mobileNumber ?? "");
    payload.append("nomineeName", data.nomineeName ?? "");
    payload.append("nomineeID", data.nomineeNID ?? "");
    payload.append("nomineeRelation", data.nomineeRelation ?? "");
    payload.append("nomineeMobileNumber", data.nomineeMobileNumber ?? "");
    payload.append("nomineeNameBangla", data.nomineeNameBangla ?? "");
    payload.append("employeeReference", data.referenceName ?? "");
    payload.append("referenceMobileNumber", data.referenceMobile ?? "");
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
      String(
        data.employeeNature === undefined ||
          data.employeeNature === null ||
          data.employeeNature === ""
          ? 0
          : data.employeeNature
      )
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

    payload.append(
      "permanentVillageAreaRoad",
      data.permanentVillageAreaRoad ?? ""
    );

    payload.append(
      "permanentPostOffice",
      data.permanentPostOffice ?? ""
    );

    payload.append(
      "presentVillageAreaRoad",
      data.presentVillageAreaRoad ?? ""
    );

    payload.append(
      "presentPostOffice",
      data.presentPostOffice ?? ""
    );

    if (data.permanentDivision != null)
      payload.append("permanentDivisionId", String(data.permanentDivision));

    if (data.permanentDistrict != null)
      payload.append("permanentDistrictId", String(data.permanentDistrict));

    if (data.permanentPoliceStation != null)
      payload.append("permanentThanaId", String(data.permanentPoliceStation));

    if (data.presentDivision != null)
      payload.append("presentDivisionId", String(data.presentDivision));

    if (data.presentDistrict != null)
      payload.append("presentDistrictId", String(data.presentDistrict));

    if (data.presentPoliceStation != null)
      payload.append("presentThanaId", String(data.presentPoliceStation));

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

    if (data.appliedCV) {
      payload.append("appliedCV", data.appliedCV);
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
    {
      label: "Education Certificate",
      name: "educationCertificate",
      icon: GraduationCap,
      iconBg: "bg-green-100",
      iconColor: "text-green-500",
    },
    {
      label: "National ID",
      name: "nationalId",
      icon: IdCard,
      iconBg: "bg-green-100",
      iconColor: "text-green-500",
    },
    {
      label: "Police Clearance",
      name: "policeClearance",
      icon: ShieldCheck,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-500",
    },
    {
      label: "Experience Certificate",
      name: "experienceCertificate",
      icon: Briefcase,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
    },
    {
      label: "Curriculam Vitae",
      name: "appliedCV",
      icon: FileText,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-500",
    },
    {
      label: "Passport Photo",
      name: "passportPhoto",
      icon: Image,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
    },
    {
      label: "Chairman Certificate",
      name: "chairmanCertificate",
      icon: BadgeCheck,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-500",
    },
    {
      label: "Signature",
      name: "signature",
      icon: PenLine,
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-500",
    },
  ];

  const mobileNumberValidation = {
    required: "Mobile Number is required",
    pattern: {
      value: /^01\d{9}$/,
      message: "Mobile Number must be 11 digits and start with 01",
    },
  };

  const nameValidation = {
    pattern: {
      value: /^[A-Za-z\u0980-\u09FF\s.'-]+$/u,
      message: "Numbers are not allowed in name",
    },
  };

  type FormField = {
    label: string;
    name: Path<HRExecutiveEntryForm>;
    type:
    | "text"
    | "number"
    | "date"
    | "email"
    | "dropdown"
    | "searchable-dropdown"
    | "radio";
    bangla?: boolean;
    options?: {
      label: string;
      value: any;
    }[];
    rules?: RegisterOptions<HRExecutiveEntryForm, Path<HRExecutiveEntryForm>>;
  };

  const dateOfBirthField: FormField = {
    label: "Date of Birth",
    name: "dateOfBirth",
    type: "date",
    rules: {
      required: "জন্ম তারিখ আবশ্যক",
    },
  };


  const employeeInformationFields: FormField[] = [
    {
      label: "Employee Name",
      name: "employeeName",
      type: "text",
      rules: {
        required: "Employee Name is required",
        ...nameValidation
      }
    },
    {
      label: "Father Name",
      name: "fatherName",
      type: "text",
      rules: {
        required: "Father name is required",
        ...nameValidation
      },

    },
    {
      label: "Mother Name",
      name: "motherName",
      type: "text",
      rules: nameValidation
    },
    ...(!candidateId ? [dateOfBirthField] : []),
    {
      label: "Nominee Name",
      type: "text",
      name: "nomineeName",
      rules: {
        required: "Nominee name is required",
        ...nameValidation
      }
    },
    {
      label: "Nominee Name(Bangla)",
      type: "text",
      name: "nomineeNameBangla",
      bangla: true,
      rules: {
        ...banglaOnlyValidation
      }
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
      options: Object.entries(relationshipTypeEn).map(([value, label]) => ({ label, value: Number(value) }))
    },
    {
      label: "Nominee Mobile Number",
      name: "nomineeMobileNumber",
      type: "text",
      rules: mobileNumberValidation
    },
    {
      label: "Refeerence Name",
      type: "text",
      name: "referenceName",
      rules: {
        ...nameValidation
      }
    },
    {
      label: "Reference Mobile Number",
      name: "referenceMobile",
      rules: mobileNumberValidation,
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
    ...(!candidateId ? [{
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
    }] : []),
    {
      label: "Grade",
      name: "grade",
      type: "dropdown",
      options: grades.filter(e => e.employeeNature === Number(employeeNature)).map((grade) => ({
        label: grade.gradeName,
        value: grade.id,
      })),
      rules: {
        required: "Select Grade",
      }
    },
    {
      label: "Designation",
      name: "designation",
      type: "dropdown",
      rules: {
        required: "Designation is required"
      },
      options: designations.map((designation) => ({
        label: designation.designationName,
        value: designation.id,
      }))
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
      })),
      rules: {
        required: "Select Weekly Holiday",
      }
    },
    {
      label: "Proposed Gross Salary",
      name: "proposedSalary",
      type: "number",
      rules: {
        required: "Salary is required",
      }
    },
    {
      label: "Joining Date",
      name: "joiningDate",
      type: "date",
      rules: {
        required: "Joining Date is required",
      }
    },
    {
      label: "Probation Period(month)",
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
      })),
      rules: {
        required: "Select Employee Category"
      }
    },
    {
      label: "Employee Code",
      name: "employeeCode",
      type: "text",
      rules: {
        required: "Employee Code is required",
        validate: async (
          value: string | boolean | File | null | undefined
        ) => {
          if (typeof value !== "string" || !value) {
            return true;
          }

          const { data } = await api.get(
            `${API_ROUTES.EMPLOYEE_VERIFICATION}?employeeCode=${value}`
          );

          return data.isUnique || data.message;
        }
      },
    },
    {
      label: "Mobile Number",
      name: "mobileNumber",
      type: "text",
      rules: mobileNumberValidation
    },
    {
      label: "Remarks",
      name: "remarks",
      type: "text",
    }
  ];

  // const employeeCode = watch("employeeCode");

  // useEffect(() => {
  //   if (!employeeCode?.trim()) {
  //     clearErrors("employeeCode");
  //     return;
  //   }

  //   const timer = setTimeout(async () => {
  //     try {
  //       const { data } = await api.get(
  //         `${API_ROUTES.EMPLOYEE_VERIFICATION}?employeeCode=${employeeCode}`
  //       );

  //       if (data.isUnique) {
  //         clearErrors("employeeCode");
  //       } else {
  //         setError("employeeCode", {
  //           type: "manual",
  //           message: data.message,
  //         });
  //       }
  //     } catch {
  //       // Optionally show a toast or ignore
  //     }
  //   }, 800);

  //   return () => clearTimeout(timer);
  // }, [employeeCode, clearErrors, setError]);



  useEffect(() => {
    if (!sameAsPermanent) return;

    (async () => {
      setValue("presentDivision", permanentDivision);

      await new Promise(r => setTimeout(r, 250));

      setValue("presentDistrict", permanentDistrict);

      await new Promise(r => setTimeout(r, 500));

      setValue("presentPoliceStation", permanentPoliceStation);
    })();
  }, [sameAsPermanent]);

  const refreshGateData = async () => {
    const { data } = await api.get(
      `${API_ROUTES.EMPLOYEES}/employee-detail/${candidateId}`
    );

    // Load draft
    const draft = localStorage.getItem(DRAFT_KEY);
    const draftData = draft ? JSON.parse(draft) : {};

    // Reset form with draft values

    reset(draftData);
    localStorage.removeItem(DRAFT_KEY);
    // Now override the fields you want
    setValue("company", data.unitId ?? null);
    setValue("designation", data.designationId ?? null);
    setValue("mobileNumber", data.mobile ?? null);

    setValue("permanentDivision", data.permanentDivisionId ?? null);
    setValue("permanentDistrict", data.permanentDistrictId ?? null);
    setValue("permanentPoliceStation", data.permanentUpazilaId ?? null);

    setValue("presentDivision", data.presentDivisionId ?? null);
    setValue("presentDistrict", data.presentDistrictId ?? null);
    setValue("presentPoliceStation", data.presentUpazilaId ?? null);

    // Remove draft if you no longer need it
  };

  return (<>

    {
      candidateOnGate && (
        <details className="border border-gray-300 rounded-lg overflow-hidden bg-white">
          <summary className="cursor-pointer px-4 py-3 font-semibold bg-gray-100 hover:bg-gray-200 select-none">
            Gate Registration - {candidateOnGate.name}
          </summary>

          <div className="p-4">
            <GateRegistration candidate={candidateOnGate} onUpdated={refreshGateData} />
          </div>
        </details>
      )
    }
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

          {candidateId && <div className="font-semibold">
            Candidate :
            {" "}
            {
              candidateId
            }
          </div>}

          <div>
            Entry Date :
            {" "}
            {
              new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            }
          </div>

        </div>

        <div className="bg-white rounded-xl mb-6">
          <div className="border-b px-4 py-3 font-semibold text-blue-700">
            Employee Information
          </div>

          <div className="grid grid-cols-5 gap-4 p-4">

            {employeeInformationFields.map(
              (field) => (field.bangla ? (
                <BanglaInputField
                  key={field.name}
                  label={field.label}
                  name={field.name as any}
                  rules={field.rules}
                  errors={errors}
                  control={control}
                />
              ) :
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
        <div className="border-b px-4 py-3 font-semibold text-blue-700">
          Address Information
        </div>

        <div className="grid grid-cols-2 gap-8 p-4">

          {/* Permanent Address */}
          <div>
            <h3 className="mt-10 mb-4 text-base font-semibold text-slate-700 border-b pb-2">
              Permanent Address
            </h3>

            <div className="grid grid-cols-1 gap-4">

              <CommonInputField
                label="Division"
                name="permanentDivision"
                type="dropdown"
                options={divisions.map((i) => ({
                  label: i.divisionName,
                  value: i.id,
                }))}
                register={register}
                control={control}
                errors={errors}
              />

              <CommonInputField
                label="District"
                name="permanentDistrict"
                type="dropdown"
                options={permanentDistricts.map((i) => ({
                  label: i.districtName,
                  value: i.id,
                }))}
                register={register}
                control={control}
                errors={errors}
              />

              <CommonInputField
                label="Thana / Upazila"
                name="permanentPoliceStation"
                type="dropdown"
                options={permanentThanas.map((i) => ({
                  label: i.thanaName,
                  value: i.id,
                }))}
                register={register}
                control={control}
                errors={errors}
              />

              <CommonInputField
                label="Permanent Post Office"
                name="permanentPostOffice"
                register={register}
                control={control}
                errors={errors}
              />

              <CommonInputField
                label="Permanent Village / Area / Road"
                name="permanentVillageAreaRoad"
                register={register}
                control={control}
                errors={errors}
              />

            </div>
          </div>

          {/* Present Address */}
          <div>

            <div className="mb-4 flex items-center gap-2">
              <input
                type="checkbox"
                {...register("sameAsPermanent")}
              />
              <label>Same as Permanent Address</label>
            </div>

            <h3 className="mb-4 text-base font-semibold text-slate-700 border-b pb-2">
              Present Address
            </h3>

            <div className="grid grid-cols-1 gap-4">

              <CommonInputField
                label="Division"
                name="presentDivision"
                type="dropdown"
                disabled={sameAsPermanent}
                options={divisions.map((i) => ({
                  label: i.divisionName,
                  value: i.id,
                }))}
                register={register}
                control={control}
                errors={errors}
              />

              <CommonInputField
                label="District"
                name="presentDistrict"
                type="dropdown"
                disabled={sameAsPermanent}
                options={(sameAsPermanent ? permanentDistricts : presentDistricts).map((i) => ({
                  label: i.districtName,
                  value: i.id,
                }))}
                register={register}
                control={control}
                errors={errors}
              />

              <CommonInputField
                label="Thana / Upazila"
                name="presentPoliceStation"
                type="dropdown"
                disabled={sameAsPermanent}
                options={(sameAsPermanent ? permanentThanas : presentThanas).map((i) => ({
                  label: i.thanaName,
                  value: i.id,
                }))}
                register={register}
                control={control}
                errors={errors}
              />

              <CommonInputField
                label="Present Post Office"
                name="presentPostOffice"
                disabled={sameAsPermanent}
                register={register}
                control={control}
                errors={errors}
              />

              <CommonInputField
                label="Present Village / Area / Road"
                name="presentVillageAreaRoad"
                disabled={sameAsPermanent}
                register={register}
                control={control}
                errors={errors}
              />

            </div>
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

          <div className="grid grid-cols-8 gap-2 p-2">
            {documentFields.map((doc) => {
              const Icon = doc.icon;

              return (
                <div className="flex flex-col" key={doc.name}>
                  <div className="border rounded-xl p-5 bg-slate-50 hover:border-blue-400 transition">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${doc.iconBg}`}
                      >
                        <Icon className={`w-5 h-5 ${doc.iconColor}`} />
                      </div>

                      <label className="text-sm font-semibold text-gray-700">
                        {doc.label}
                      </label>
                    </div>

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

                      {(() => {
                        const file = watch(doc.name as keyof HRExecutiveEntryForm) as File | null;

                        return (
                          file && (
                            <div className="mt-3 flex flex-col items-center gap-2">
                              <span className="text-sm text-green-600 font-medium text-center px-2 break-all">
                                {file.name}
                              </span>

                              <button
                                type="button"
                                className="text-xs text-red-600 hover:text-red-700 underline"
                                onClick={(e) => {
                                  e.preventDefault();

                                  setValue(
                                    doc.name as keyof HRExecutiveEntryForm,
                                    null,
                                    { shouldValidate: true }
                                  );

                                  clearErrors(doc.name as keyof HRExecutiveEntryForm);

                                  const input = document.getElementById(
                                    doc.name
                                  ) as HTMLInputElement | null;

                                  if (input) {
                                    input.value = "";
                                  }
                                }}
                              >
                                Remove File
                              </button>
                            </div>
                          )
                        );
                      })()}
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
                            message:
                              "Only PDF, PNG, JPG and JPEG files are allowed.",
                          });

                          e.target.value = "";
                          setValue(
                            doc.name as keyof HRExecutiveEntryForm,
                            null
                          );

                          return;
                        }

                        clearErrors(
                          doc.name as keyof HRExecutiveEntryForm
                        );

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
                      {
                        errors[
                          doc.name as keyof HRExecutiveEntryForm
                        ]?.message
                      }
                    </p>
                  )}
                </div>
              );
            })}
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
            // disabled={!employeeOnGate?.id}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Send size={16} />
            Submit To Biometric
          </button>

        </div>

      </div>
    </form>
  </>
  );
};

export default HRExecutiveEntryDetails;