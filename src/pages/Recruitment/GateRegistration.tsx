import { useForm } from "react-hook-form";
import CommonInputField from "../../components/CommonInputFields";
import { usePost } from "../../hooks/usePost";
import { API_ROUTES } from "../../api/routes";
import toast from "react-hot-toast";
import { useGet } from "../../hooks/useGet";
import { useEffect } from "react";
import type { Unit } from "../../types/interfaces";
import { useNavigate } from "react-router-dom";
import { bloodGroupMapBangla, genderMapBengali, religionMapBangla } from "../EmployeeInformation/types";
import BanglaInputField from "../../components/BanglaInputField1";
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
  designation: string;
  joiningDate: string;

  referenceName: string;
  referenceMobile: string;
}

type SectionField = {
  label: string;
  bangla?: boolean;
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

const personalInformationFields: SectionField[] =
  [
    {
      label: "পূর্ণ নাম(বাংলা)",
      name: "fullName",
      bangla: true,
      rules: {
        required: "পূর্ণ নাম আবশ্যক",
      },
    },
    {
      label: "পিতার নাম(বাংলা)",
      name: "fatherName",
      bangla: true,
      rules: {
        required: "পিতার নাম আবশ্যক",
      },
    },
    {
      label: "মাতার নাম(বাংলা)",
      name: "motherName",
      bangla: true,
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
      options: Object.entries(genderMapBengali).map(([value, label]) => ({
        label,
        value: Number(value),
      }))
    },
    {
      label: "ধর্ম",
      name: "religion",
      type: "dropdown",
      options: Object.entries(religionMapBangla).map(([label, value]) => ({ label, value })),
    },
    {
      label: "রক্তের গ্রুপ",
      name: "bloodGroup",
      type: "dropdown",
      options: Object.entries(bloodGroupMapBangla).map(([label, value]) => ({ label, value }))
    },
    {
      label: "নমিনির নাম",
      name: "nomineeNameBangla",
      type: "text",
      bangla: true
    },
    {
      label: "নমিনির সাথে সম্পর্ক",
      name: "nomineeRelation",
      type: "dropdown",
      options: [
        { label: "পিতা", value: "পিতা" },
        { label: "মাতা", value: "মাতা" },
        { label: "স্বামী", value: "স্বামী" },
        { label: "স্ত্রী", value: "স্ত্রী" },
        { label: "পুত্র", value: "পুত্র" },
        { label: "কন্যা", value: "কন্যা" },
        { label: "ভাই", value: "ভাই" },
        { label: "বোন", value: "বোন" }
      ]
    },
  ];



const GateRegistration = ({
  candidate,
}: any) => {


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
      sameAsPermanent: false,
      joiningDate: new Date()
        .toISOString()
        .split("T")[0],
    },
  });


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

  const { data: designations = [] } = useGet<any[]>({
    key: ["designations"],
    url: API_ROUTES.DESIGNATION,
  });

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
      options: presentDistricts.map(i => ({
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
      options: presentThanas.map(i => ({
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
      rules: {
        required: "পোস্ট অফিস আবশ্যক",
      },
    },
    {
      label: "গ্রাম / এলাকা",
      name: "presentVillageArea",
      rules: {
        required: "গ্রাম / এলাকা আবশ্যক",
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
      rules: {
        required: "পোস্ট অফিস আবশ্যক",
      },
    },
    {
      label: "গ্রাম / এলাকা",
      name: "permanentVillageArea",
      rules: {
        required: "গ্রাম / এলাকা আবশ্যক",
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
      type: "dropdown",
      options: designations.map(i => ({
        label: i.designationName,
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



  const sameAsPermanent = watch("sameAsPermanent");

  const DRAFT_KEY = "gateRegistrationDraft";

  const handleSaveDraft = () => {
    const values = getValues();

    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify(values)
    );

    toast.success("ফর্মটি সফলভাবে সংরক্ষণ করা হয়েছে");
  };

  // Step 1: when sameAsPermanent is checked, only copy the division (root of the chain)
  useEffect(() => {
    if (!sameAsPermanent) return;
    setValue("presentDivision", watch("permanentDivision"));
    setValue("presentVillageArea", watch("permanentVillageArea"));
    setValue("presentPostOffice", watch("permanentPostOffice"));
  }, [sameAsPermanent, watch("permanentDivision")]);

  // Step 2: once presentDistricts has loaded for that division, copy the district
  useEffect(() => {
    if (!sameAsPermanent) return;
    if (!presentDistricts.length) return; // wait for options to actually exist
    const match = presentDistricts.find(
      (d) => String(d.id) === String(watch("permanentDistrict"))
    );
    if (match) setValue("presentDistrict", match.id);
  }, [sameAsPermanent, presentDistricts, watch("permanentDistrict")]);

  // Step 3: once presentThanas has loaded for that district, copy the thana
  useEffect(() => {
    if (!sameAsPermanent) return;
    if (!presentThanas.length) return;
    const match = presentThanas.find(
      (t) => String(t.id) === String(watch("permanentPoliceStation"))
    );
    if (match) setValue("presentPoliceStation", match.id);
  }, [sameAsPermanent, presentThanas, watch("permanentPoliceStation")]);

  const handleReset = () => {


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
    // Edit mode
    if (candidate) {
      const religionReverseMap = Object.fromEntries(
        Object.entries(religionMapBangla).map(([k, v]) => [k, String(v)])
      );

      const genderReverseMap = Object.fromEntries(
        Object.entries(genderMapBengali).map(([k, v]) => [v, k])
      );

      const bloodGroupReverseMap = Object.fromEntries(
        Object.entries(bloodGroupMapBangla).map(([k, v]) => [k, String(v)])
      );
      reset({
        fullName: candidate.employeeNameBangla ?? "",
        fatherName: candidate.fatherNameBangla ?? "",
        motherName: candidate.motherNameBangla ?? "",

        nidType:
          candidate.idType,

        nidNumber: candidate.idNumber ?? "",
        dateOfBirth: candidate.dateOfBirth ?? "",

        gender:
          genderReverseMap[candidate.gender] ?? "",

        religion:
          religionReverseMap[candidate.religion] ?? "",

        bloodGroup:
          bloodGroupReverseMap[candidate.bloodGroup] ?? "",

        nomineeNameBangla:
          candidate.nomineeNameBangla ?? "",

        nomineeRelation:
          candidate.nomineeRelationBangla ?? "",

        mobileNumber:
          candidate.mobileNumber ?? "",

        presentVillageArea:
          candidate.presentVillageAreaRoad ?? "",

        presentPostOffice:
          candidate.presentPostOffice ?? "",

        presentPoliceStation:
          candidate.presentThanaId ?? "",

        presentDistrict:
          candidate.presentDistrictId ?? "",

        presentDivision:
          candidate.presentDivisionId ?? "",

        permanentVillageArea:
          candidate.permanentVillageAreaRoad ?? "",

        permanentPostOffice:
          candidate.permanentPostOffice ?? "",

        permanentPoliceStation:
          candidate.permanentThanaId ?? "",

        permanentDistrict:
          candidate.permanentDistrictId ?? "",

        permanentDivision:
          candidate.permanentDivisionId ?? "",

        company: candidate.unitId ?? "",

        designation:
          candidate.designationId?? "",

        joiningDate:
          candidate.joiningDate ?? "",

        referenceName:
          candidate.employeeReference ?? "",

        referenceMobile:
          candidate.referenceMobileNumber ?? "",

        sameAsPermanent: false,
      });
      return;
    }

    // Create mode
    const draft = localStorage.getItem(DRAFT_KEY);

    if (draft) {
      reset(JSON.parse(draft));
    } else {
      reset({
        joiningDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [candidate, reset]);

  const onSubmit =async (
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

      // TODO: Convert from dropdown value
      gender:
        Number(data.gender),

      religion: Number(data.religion),

      bloodGroup: Number(data.bloodGroup),

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
      nomineeNameBangla: data.nomineeNameBangla,
      nomineeRelationBangla: data.nomineeRelation,

      employeeReference:
        data.referenceName,


      referenceMobileNumber:
        data.referenceMobile,


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
                        .map((field) => (
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
                        .map((field) => (
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
              মেডিকেল পরীক্ষায় প্রেরণ
            </button>

          </div>
        </div>
      </div>
    </form>
  );

}

export default GateRegistration;