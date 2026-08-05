import { useForm, type RegisterOptions } from "react-hook-form";
import CommonInputField from "../../components/CommonInputFields";
import { usePost } from "../../hooks/usePost";
import { useState } from "react";
import { API_ROUTES } from "../../api/routes";
import toast from "react-hot-toast";
import { useGet } from "../../hooks/useGet";
import { useEffect } from "react";
import type { Unit } from "../../types/interfaces";
import { useNavigate } from "react-router-dom";
import { bloodGroupMapBangla, genderMapBengali, idTypeMapBangla, religionMapBangla } from "../EmployeeInformation/types";
import BanglaInputField from "../../components/BanglaInputField";
import { api } from "../../api/client";

export interface GateRegistrationForm {

  fullName: string;
  fatherName: string;
  motherName: string;

  nidType: string;
  nidNumber: string;

  dateOfBirth: string;
  gender: string;
  religion: string;
  bloodGroup: string;
  nomineeNameBangla: string;
  nomineeRelation: string;

  mobileNumber: string;

  presentVillageArea: string;
  presentPostOffice: string;
  presentPoliceStation: string;
  presentDistrict: string;
  presentDivision: string;

  sameAsPermanent: boolean;
  permanentVillageArea: string;
  permanentPostOffice: string;
  permanentPoliceStation: string;
  permanentDistrict: string;
  permanentDivision: string;

  company: string;
  grade: string;
  designation: string;
  joiningDate: string;

  referenceName: string;
  referenceMobile: string;
}

type SectionField = {
  label: string;
  bangla?: boolean;
  isPlaceholderVisible?: boolean;
  name: keyof GateRegistrationForm;
  type?:
  | "text"
  | "date"
  | "dropdown"
  | "radio";

  options?: {
    label: string;
    value: string | number;
  }[];

  rules?: any;
};

const mobileValidation = {
  required: "মোবাইল নম্বর আবশ্যক",
  pattern: {
    value: /^01[3-9]\d{8}$/,
    message: "সঠিক ১১ সংখ্যার মোবাইল নম্বর প্রদান করুন",
  },
};

export const banglaOnlyValidation: RegisterOptions<any> = {
  validate: (value?: string) => {
    if (!value?.trim()) return true;

    return /^[ঀ-৿\s.,\-()/:'"]+$/u.test(value) &&
      !/[০-৯0-9]/.test(value)
      ? true
      : "শুধুমাত্র বাংলা অক্ষরে লিখুন";
  },
};

export const banglaWithNumberValidation = {
  validate: (value?: string) => {
    if (!value?.trim()) return true;

    return /^[ঀ-৿০-৯0-9\s.,\-()/:'"]+$/u.test(value)
      ? true
      : "শুধুমাত্র বাংলা অক্ষর ও সংখ্যা ব্যবহার করুন";
  },
};






const GateRegistration = ({
  candidate, onUpdated
}: any) => {

  const [draftData, setDraftData] = useState<GateRegistrationForm | null>(null);
  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<GateRegistrationForm>({
    mode: "onTouched",
    defaultValues: {
      sameAsPermanent: false,
      joiningDate: new Date()
        .toISOString()
        .split("T")[0],
    },
  });

  // const nidType = Number(watch("nidType"));

  // useEffect(() => {
  //   if (nidType === 0 || nidType ===1 || nidType === 2) {
  //     trigger("nidNumber");
  //   }
  // }, [nidType, trigger]);


  const personalInformationFields: SectionField[] =
    [
      {
        label: "পূর্ণ নাম(বাংলা)",
        name: "fullName",
        bangla: true,
        rules: {
          required: "পূর্ণ নাম আবশ্যক",
          ...banglaOnlyValidation
        },
      },
      {
        label: "পিতার নাম(বাংলা)",
        name: "fatherName",
        bangla: true,
        rules: {
          required: "পিতার নাম আবশ্যক",
          ...banglaOnlyValidation
        },
      },
      {
        label: "মাতার নাম(বাংলা)",
        name: "motherName",
        bangla: true,
        rules: {
          required: "মাতার নাম আবশ্যক",
          ...banglaOnlyValidation
        },
      },
      {
        label: "পরিচয়পত্রের ধরন",
        name: "nidType",
        type: "dropdown",
        rules: {
          required: "পরিচয়পত্রের ধরন আবশ্যক"
        },
        options: Object.entries(idTypeMapBangla).map(([label, value]) => ({
          label,
          value
        })),
      },
      {
        label: "পরিচয়পত্র নম্বর",
        name: "nidNumber",
        type: "text",
        rules: {
          required: "নম্বর আবশ্যক",
          validate: (value: string) => {
            const nidType = Number(getValues("nidType"));

            // NID / Birth Certificate → numeric only
            if (nidType === 0 || nidType === 1) {
              return /^\d+$/.test(value)
                ? true
                : "শুধুমাত্র সংখ্যা প্রদান করুন";
            }

            // Passport → alphanumeric
            if (nidType === 2) {
              return /^[A-Za-z0-9]+$/.test(value)
                ? true
                : "শুধুমাত্র ইংরেজি অক্ষর ও সংখ্যা ব্যবহার করুন";
            }
            return true;
          }
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
        rules: mobileValidation,
      },
      {
        label: "লিঙ্গ",
        name: "gender",
        type: "dropdown",
        rules: {
          required: "লিঙ্গ আবশ্যক"
        },
        options: Object.entries(genderMapBengali).map(([value, label]) => ({
          label,
          value: Number(value),
        }))
      },
      {
        label: "ধর্ম",
        name: "religion",
        type: "dropdown",
        rules: {
          required: "ধর্ম আবশ্যক"
        },
        options: Object.entries(religionMapBangla).map(([label, value]) => ({ label, value })),
      },
      {
        label: "রক্তের গ্রুপ",
        name: "bloodGroup",
        type: "dropdown",
        rules: {
          required: "রক্তের গ্রুপ আবশ্যক"
        },
        options: Object.entries(bloodGroupMapBangla).map(([label, value]) => ({ label, value }))
      }
    ];

  const { data: divisions = [] } = useGet<any[]>({
    key: ["divisions"],
    url: API_ROUTES.DIVISIONS,
  });

  const { data: permanentDistricts = [] } = useGet<any[]>({
    key: ["permanentDistricts", watch("permanentDivision")],
    url: `${API_ROUTES.DIVISIONS}/${watch("permanentDivision")}/districts`,
    enabled: !!watch("permanentDivision")
  });

  const { data: permanentThanas = [] } = useGet<any[]>({
    key: ["permanentThanas", watch("permanentDistrict")],
    url: `${API_ROUTES.DISTRICTS}/${watch("permanentDistrict")}/thanas`,
    enabled: !!watch("permanentDistrict")
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

  const { data: units = [] } = useGet<Unit[]>({
    key: ["units"],
    url: API_ROUTES.UNITS,
  });

  const grade = watch("grade");

  const { data: designations = [] } = useGet<any[]>({
    key: ["designations", grade],
    url: `${API_ROUTES.DESIGNATION}?gradeId=${grade}`,
    enabled: !!grade
  });

  const { data: grades = [] } = useGet<any[]>({
    key: ["grades"],
    url: API_ROUTES.GRADE,
  });

  const sameAsPermanent = watch("sameAsPermanent");

  const addressInformationFields: SectionField[] = [
    // Present Address
    {
      label: "বিভাগ",
      name: "presentDivision",
      type: "dropdown",
      options: divisions.map((i) => ({
        label: i.divisionNameBangla,
        value: i.id
      })),
      rules: {
        required: "বিভাগ আবশ্যক",
      },
    },
    {
      label: "জেলা",
      name: "presentDistrict",
      type: "dropdown",
      options: (sameAsPermanent ? permanentDistricts : presentDistricts).map(i => ({
        label: i.districtNameBangla?.trim()
          ? i.districtNameBangla
          : i.districtName,
        value: i.id,
      })),
      rules: {
        required: "জেলা আবশ্যক",
      },
    },
    {
      label: "থানা / উপজেলা",
      name: "presentPoliceStation",
      type: "dropdown",
      options: (sameAsPermanent ? permanentThanas : presentThanas).map(i => ({
        label: i.thanaNameBangla?.trim()
          ? i.thanaNameBangla
          : i.thanaName,
        value: i.id,
      })),
      rules: {
        required: "থানা / উপজেলা আবশ্যক",
      },
    },
    {
      label: "পোস্ট অফিস",
      name: "presentPostOffice",
      bangla: true,
      rules: {
        required: "পোস্ট অফিস আবশ্যক",
        ...banglaWithNumberValidation
      },
    },
    {
      label: "গ্রাম / এলাকা",
      name: "presentVillageArea",
      bangla: true,
      rules: {
        required: "গ্রাম / এলাকা আবশ্যক",
        ...banglaWithNumberValidation
      },
    },

    // Permanent Address
    {
      label: "বিভাগ",
      name: "permanentDivision",
      type: "dropdown",
      options: divisions.map((i) => ({
        label: i.divisionNameBangla,
        value: i.id
      })),
      rules: {
        required: "বিভাগ আবশ্যক",
      },
    },
    {
      label: "জেলা",
      name: "permanentDistrict",
      type: "dropdown",
      options: permanentDistricts.map((i) => ({
        label: i.districtNameBangla?.trim()
          ? i.districtNameBangla
          : i.districtName,
        value: i.id,
      })),
      rules: {
        required: "জেলা আবশ্যক",
      },
    },
    {
      label: "থানা / উপজেলা",
      name: "permanentPoliceStation",
      type: "dropdown",
      options: permanentThanas.map(i => ({
        label: i.thanaNameBangla?.trim()
          ? i.thanaNameBangla
          : i.thanaName,
        value: i.id,
      })),
      rules: {
        required: "থানা / উপজেলা আবশ্যক",
      },
    },
    {
      label: "পোস্ট অফিস",
      name: "permanentPostOffice",
      bangla: true,
      rules: {
        required: "পোস্ট অফিস আবশ্যক",
        ...banglaWithNumberValidation
      },
    },
    {
      label: "গ্রাম / এলাকা",
      name: "permanentVillageArea",
      bangla: true,
      rules: {
        required: "গ্রাম / এলাকা আবশ্যক",
        ...banglaWithNumberValidation
      },
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

  const serviceInformationFields: SectionField[] = [
    {
      label: "কোম্পানি",
      name: "company",
      type: "dropdown",
      isPlaceholderVisible: false,
      options: units.map((unit) => ({
        label: unit.unitNameBangla || unit.unitName,
        value: unit.id,
      })),
      rules: {
        required: "কোম্পানি নির্বাচন করুন",
      },
    },
    {
      label: "গ্রেড",
      name: "grade",
      type: "dropdown",
      options: grades.filter(e => e.employeeNature === 0).map((grade) => ({
        label: grade.gradeName,
        value: grade.id,
      })),
      rules: {
        required: "Select Grade",
      }
    },
    {
      label: "পদবী",
      name: "designation",
      type: "dropdown",
      options: designations.filter(e => e.employeeNature === 0).map(i => ({
        label: i.designationNameBangla || i.designationName,
        value: i.id
      })),
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



  const DRAFT_KEY = "gateRegistrationDraft";

  const handleSaveDraft = () => {
    const values = getValues();

    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify(values)
    );

    toast.success("ফর্মটি সফলভাবে সংরক্ষণ করা হয়েছে");
  };

  const permanentDivision = watch("permanentDivision");
  const permanentDistrict = watch("permanentDistrict");
  const permanentPoliceStation = watch("permanentPoliceStation");
  const permanentVillageArea = watch("permanentVillageArea");
  const permanentPostOffice = watch("permanentPostOffice");

  // Step 1: when sameAsPermanent is checked, only copy the division (root of the chain)
  useEffect(() => {
    if (!sameAsPermanent) return;

    setValue("presentVillageArea", permanentVillageArea ?? "");
    setValue("presentPostOffice", permanentPostOffice ?? "");

    clearErrors([
      "presentVillageArea",
      "presentPostOffice",
    ]);
  }, [
    sameAsPermanent,
    permanentVillageArea,
    permanentPostOffice,
    setValue,
    clearErrors,
  ]);


  useEffect(() => {
    if (!sameAsPermanent) return;

    setValue("presentDivision", permanentDivision);

    clearErrors([
      "presentDivision",
      "presentDistrict",
      "presentPoliceStation",
    ]);
  }, [sameAsPermanent, permanentDivision, setValue, clearErrors]);


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
    setValue,
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
    setValue,
  ]);

  useEffect(() => {
    if (!candidate) return;
    if (!designations.length) return;

    setValue("designation", candidate.designationId);
  }, [candidate, designations, setValue]);

  const handleReset = () => {
    localStorage.removeItem(DRAFT_KEY);
    setDraftData(null);

    reset({
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
      nomineeNameBangla: "",
      nomineeRelation: "",
      mobileNumber: "",

      presentVillageArea: "",
      presentPostOffice: "",
      presentPoliceStation: "",
      presentDistrict: "",
      presentDivision: "",

      permanentVillageArea: "",
      permanentPostOffice: "",
      permanentPoliceStation: "",
      permanentDistrict: "",
      permanentDivision: "",

      company: "",
      designation: "",
      referenceName: "",
      referenceMobile: "",

      sameAsPermanent: false,
    });
  };

  useEffect(() => {
    if (!draftData) return;
    if (!units.length) return;

    setValue("company", draftData.company);
  }, [draftData, units]);

  useEffect(() => {
    if (!draftData) return;
    if (!designations.length) return;

    setValue("designation", draftData.designation);
  }, [draftData, designations]);

  useEffect(() => {
    if (!draftData) return;

    setValue("referenceName", draftData.referenceName);
    setValue("referenceMobile", draftData.referenceMobile);
  }, [draftData]);

  useEffect(() => {
    // Edit mode
    if (candidate) {
      reset({
        fullName: candidate.employeeNameBangla ?? "",
        fatherName: candidate.fatherNameBangla ?? "",
        motherName: candidate.motherNameBangla ?? "",

        nidType:
          candidate.idType,

        nidNumber: candidate.idNumber ?? "",
        dateOfBirth: candidate.dateOfBirth ?? "",

        gender:
          candidate.gender,

        religion:
          candidate.religion,

        bloodGroup:
          candidate.bloodGroup,

        nomineeNameBangla:
          candidate.nomineeNameBangla ?? "",

        nomineeRelation:
          candidate.nomineeRelationBangla ?? "",

        mobileNumber:
          candidate.mobileNumber ?? "",

        presentVillageArea:
          candidate.presentVillageAreaRoadBangla ?? "",

        presentPostOffice:
          candidate.presentPostOfficeBangla ?? "",


        permanentVillageArea:
          candidate.permanentVillageAreaRoadBangla ?? "",

        permanentPostOffice:
          candidate.permanentPostOfficeBangla ?? "",


        company: candidate.unitId ?? "",

        designation:
          candidate.designationId ?? "",

        joiningDate:
          candidate.joiningDate ?? "",

        referenceName:
          candidate.employeeReferenceBangla ?? "",

        referenceMobile:
          candidate.referenceMobileNumber ?? "",

        sameAsPermanent: false,
      });
      return;
    }

    // Create mode
    const draft = localStorage.getItem(DRAFT_KEY);

    if (draft) {
      const data = JSON.parse(draft);
      setDraftData(data);
      reset(data);
    } else {
      reset({
        joiningDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [candidate, reset]);

  useEffect(() => {
    if (!draftData) return;
    if (!presentDistricts.length) return;

    setValue("presentDistrict", draftData.presentDistrict);
  }, [draftData, presentDistricts]);

  useEffect(() => {
    if (!draftData) return;
    if (!permanentDistricts.length) return;

    setValue("permanentDistrict", draftData.permanentDistrict);
  }, [draftData, permanentDistricts]);

  useEffect(() => {
    if (!draftData) return;
    if (!presentThanas.length) return;

    setValue("presentPoliceStation", draftData.presentPoliceStation);
  }, [draftData, presentThanas]);

  useEffect(() => {
    if (!draftData) return;
    if (!permanentThanas.length) return;

    setValue("permanentPoliceStation", draftData.permanentPoliceStation);
  }, [draftData, permanentThanas])

  useEffect(() => {
    if (!draftData) return;
    if (!divisions.length) return;

    setValue("presentDivision", draftData.presentDivision);
  }, [draftData, divisions]);

  useEffect(() => {
    if (!draftData) return;
    if (!divisions.length) return;

    setValue("permanentDivision", draftData.permanentDivision);
  }, [draftData, divisions]);

  useEffect(() => {
    if (!candidate) return;
    if (!divisions.length) return;

    setValue("presentDivision", candidate.presentDivisionId);
    setValue("permanentDivision", candidate.permanentDivisionId);
  }, [candidate, divisions]);

  useEffect(() => {
    if (!candidate) return;
    if (!presentDistricts.length) return;

    setValue(
      "presentDistrict",
      candidate.presentDistrictId
    );
  }, [candidate, presentDistricts]);

  useEffect(() => {
    if (!candidate) return;
    if (!permanentDistricts.length) return;

    setValue(
      "permanentDistrict",
      candidate.permanentDistrictId
    );
  }, [candidate, permanentDistricts]);

  useEffect(() => {
    if (!candidate) return;
    if (!presentThanas.length) return;

    setValue(
      "presentPoliceStation",
      candidate.presentThanaId
    );
  }, [candidate, presentThanas]);

  useEffect(() => {
    if (!candidate) return;
    if (!permanentThanas.length) return;

    setValue(
      "permanentPoliceStation",
      candidate.permanentThanaId
    );
  }, [candidate, permanentThanas]);


  const onSubmit = async (
    data: GateRegistrationForm
  ) => {
    const payload = {
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

      gender:
        data.gender !== "" && data.gender !== undefined && data.gender !== null
          ? Number(data.gender)
          : null,

      religion:
        data.religion !== "" && data.religion !== undefined && data.religion !== null
          ? Number(data.religion)
          : null,

      bloodGroup:
        data.bloodGroup !== "" && data.bloodGroup !== undefined && data.bloodGroup !== null
          ? Number(data.bloodGroup)
          : null,

      idType:
        data.nidType !== "" && data.nidType !== undefined && data.nidType !== null
          ? Number(data.nidType)
          : null,

      idNumber: data.nidNumber,

      mobileNumber: data.mobileNumber,

      guardianType: 1,
      fatherNameBangla: data.fatherName,

      motherNameBangla: data.motherName,

      // Permanent Address
      permanentDivisionId: data.permanentDivision,
      permanentVillageAreaRoad:
        data.permanentVillageArea,
      permanentPostOffice: data.permanentPostOffice,
      permanentThanaId: data.permanentPoliceStation,
      permanentDistrictId: data.permanentDistrict,

      // Present Address
      presentDivisionId: data.presentDivision,
      presentVillageAreaRoad:
        data.presentVillageArea,
      presentPostOffice: data.presentPostOffice,
      presentThanaId: data.presentPoliceStation,
      presentDistrictId: data.presentDistrict,

      securityClearanceBy: "",
      securityClearanceDate:
        new Date()
          .toISOString()
          .split("T")[0],

      enrolledBy: "",
      designationId: data.designation,
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

    if (candidate) {
      try {
        await api.put(
          `${API_ROUTES.GATE_REGISTRATION}/${candidate.employeeId}`,
          payload
        );

        toast.success(
          "গেট রেজিস্ট্রেশন সফলভাবে আপডেট হয়েছে"
        );


        onUpdated?.();
      } catch (error: any) {
        toast.error(
          `আপডেট ব্যর্থ হয়েছে। ত্রুটি: ${error.message}`
        );
      }

      return;
    }

    GateRegistrationPost(payload, {
      onSuccess: (response) => {
        toast.success(
          `গেট রেজিস্ট্রেশন সফল হয়েছে। আইডি: ${response.id}`
        );

        localStorage.removeItem(
          DRAFT_KEY
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
            গেইট রেজিস্ট্রেশন
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
                  {/* Permanent Address */}
                  <div className="mt-9">
                    <h3 className="mb-4 text-base font-semibold text-slate-700 border-b pb-2">
                      স্থায়ী ঠিকানা
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                      {addressInformationFields
                        .filter((field) =>
                          field.name.startsWith("permanent")
                        )
                        .map((field) => (field.bangla ? (
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
                            // disabled={sameAsPermanent}
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

                  {/* Present Address */}
                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <input
                        id="sameAsPermanent"
                        type="checkbox"
                        {...register("sameAsPermanent")}
                        className="h-4 w-4"
                      />
                      <label
                        htmlFor="sameAsPermanent"
                        className="text-sm font-medium text-slate-700"
                      >
                        স্থায়ী ঠিকানার মতো
                      </label>
                    </div>
                    <h3 className="mb-4 text-base font-semibold text-slate-700 border-b pb-2">
                      বর্তমান ঠিকানা
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                      {addressInformationFields
                        .filter((field) =>
                          field.name.startsWith("present")
                        )
                        .map((field) => (field.bangla ? (
                          <BanglaInputField
                            key={field.name}
                            label={field.label}
                            name={field.name as any}
                            rules={field.rules}
                            errors={errors}
                            control={control}
                            disabled={sameAsPermanent}
                          />
                        ) :
                          <CommonInputField
                            key={field.name}
                            label={field.label}
                            disabled={sameAsPermanent}
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
                {section.fields.map((field) =>
                  field.bangla ? (
                    <BanglaInputField
                      key={field.name}
                      label={field.label}
                      name={field.name as any}
                      rules={field.rules}
                      errors={errors}
                      control={control}
                    />
                  ) : (
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
                  )
                )}
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
                  // isPlaceholderVisible = {field.isPlaceholderVisible}
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

            {/* <button
              type="button"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              অস্থায়ী আইডি প্রিন্ট
            </button> */}

            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              {candidate ? "তথ্য হালনাগাদ করুন" : "মেডিকেল পরীক্ষায় প্রেরণ"}
            </button>

          </div>
        </div>
      </div>
    </form>
  );

}

export default GateRegistration;