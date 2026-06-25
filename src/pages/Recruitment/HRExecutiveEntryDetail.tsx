import React, {
  useEffect,
  useMemo,
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

interface Candidate {
  candidateId: string;
  candidateName: string;
  status: string;
  entryDate: string;
}

interface HRExecutiveEntryForm {
  company: string;
  subUnit: string;
  department: string;
  section: string;
  cell: string;

  designation: string;
  grade: string;
  shift: string;
  weekday: string;
  workerType: string;

  proposedSalary: string;
  joiningDate: string;
  probationPeriod: string;
  employmentType: string;
  payBasis: string;

  reportingTo: string;
  employeeCategory: string;
  workLocation: string;
  remarks: string;

  paymentMode: string;

  bankName: string;
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
}

const MOCK_CANDIDATES: Candidate[] = [
  {
    candidateId: "CAN-25-00051",
    candidateName: "Ali Raza",
    status:
      "Selected by Production Manager",
    entryDate: "15-May-2025",
  },
  {
    candidateId: "CAN-25-00052",
    candidateName:
      "Muhammad Imran",
    status:
      "Selected by Production Manager",
    entryDate: "15-May-2025",
  },
];

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

const HRExecutiveEntryDetails =
  () => {
    const navigate =
      useNavigate();

    const { candidateId } =
      useParams();

    const candidate = useMemo(
      () =>
        MOCK_CANDIDATES.find(
          (item) =>
            item.candidateId ===
            candidateId
        ),
      [candidateId]
    );

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
          },
        }
      );

    const paymentMode =
      watch("paymentMode");

    useEffect(() => {
      reset({
        company: "1",
        subUnit: "1",
        department: "1",
        section: "1",
        cell: "1",
        designation: "1",
        grade: "1",
        shift: "1",
        weekday: "1",
        workerType: "1",
        proposedSalary:
          "13000",
        joiningDate:
          "2025-06-01",
        probationPeriod:
          "3",
        employmentType:
          "Regular",
        payBasis: "Monthly",
        reportingTo: "1",
        employeeCategory:
          "1",
        workLocation: "1",
        remarks: "",
        paymentMode:
          "BANK",
      });
    }, [reset]);

    const onSubmit = (
      data: HRExecutiveEntryForm
    ) => {
      console.log(data);
    };

    const serviceInformationFields = [
  {
    label: "Company",
    name: "company",
    type: "dropdown",
  },
  {
    label: "Sub Unit / Shed",
    name: "subUnit",
    type: "dropdown",
  },
  {
    label: "Department",
    name: "department",
    type: "dropdown",
  },
  {
    label: "Section",
    name: "section",
    type: "dropdown",
  },
  {
    label: "Cell",
    name: "cell",
    type: "dropdown",
  },
  {
    label: "Designation",
    name: "designation",
    type: "dropdown",
  },
  {
    label: "Grade",
    name: "grade",
    type: "dropdown",
  },
  {
    label: "Shift",
    name: "shift",
    type: "dropdown",
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
            candidate?.candidateId
          }
        </div>

        <div>
          Entry Date :
          {" "}
          {
            candidate?.entryDate
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
              className={`px-6 py-2 border rounded-lg ${
                paymentMode ===
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

      <div className="bg-white rounded-xl border-dashed border-2 p-10 text-center mb-6">

        <UploadCloud
          size={40}
          className="mx-auto mb-3"
        />

        <p>
          Drag & Drop
          Documents Here
        </p>

      </div>

      <div className="flex justify-end gap-3">

        <button
          type="button"
          onClick={() =>
            reset()
          }
          className="border px-6 py-3 rounded-lg"
        >
          Reset
        </button>

        <button
          type="button"
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
          Submit To Director
        </button>

      </div>

    </div>
  </form>
);
};

export default HRExecutiveEntryDetails;