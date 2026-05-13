import React , { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { useGet } from "../../hooks/useGet";
import { usePost } from "../../hooks/usePost";

import CommonInputField from "./../../components/CommonInputFields";

import type { EmployeeFormValues } from "./EmployeeFormValues";
import type { Company, Department, Grade, Section } from "../../types/interfaces";

import { API_ROUTES } from "../../api/routes";

type Props = {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  employeeId: string;
};

const EmployeeForm: React.FC<Props> = ({
  setActiveStep,
  employeeId
  }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useFormContext<EmployeeFormValues>();

  /* ======================================================
      API CALLS
  ====================================================== */

  const {data: Employee} = useGet<EmployeeFormValues>({
     key: ["employee", employeeId],
     url: `${API_ROUTES.EMPLOYEES}/${employeeId}`,
  })

  const {
    data: companies = [],
  } = useGet<Company[]>({
    key: ["company"],
    url: API_ROUTES.COMPANY,
  });

  const {
    data: departments = [],
  } = useGet<Department[]>({
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

  const {
    data: grades = [],
  } = useGet<Grade[]>({
    key: ["grades"],
    url: `${API_ROUTES.GRADE}?includeInactive=false`,
  });

  const { mutate: EmployeePost } =
  usePost<{ message: string }, any>(
    API_ROUTES.EMPLOYEES
  );


  useEffect(() => {
    if (!Employee) return;

    reset({
      employeeId: Employee.id || "",
      employeeNameEnglish:
        Employee.employeeNameEnglish || "",

      employeeNameBangla:
        Employee.employeeNameBangla || "",

      companyId: Employee.companyId || "",

      department: Employee.departmentId || "",

      section: Employee.sectionId || "",

      grade: Employee.grade || "",

      employeeType:
        Employee.employeeType || "",

      shift: Employee.shift || "",

      employeeNature:
        Employee.employeeNature || "",

      holiday: Employee.holiday || "",

      joiningDate: Employee.joiningDate
        ? Employee.joiningDate.split("T")[0]
        : "",

      confirmationDate:
        Employee.confirmationDate
          ? Employee.confirmationDate.split("T")[0]
          : "",

      dateOfBirth: Employee.dateOfBirth
        ? Employee.dateOfBirth.split("T")[0]
        : "",

      gender: Employee.gender ?? "",

      maritalStatus:
        Employee.maritalStatus || "",

      mobileNumber:
        Employee.mobileNumber || "",

      emailAddress:
        Employee.emailAddress || "",

      documentType:
        Employee.documentType || "",

      documentNumber:
        Employee.documentNumber || "",

      bloodGroup:
        Employee.bloodGroup || "",

      religion: Employee.religion || "",

      nationality:
        Employee.nationality || "",

      fatherNameEnglish:
        Employee.fatherNameEnglish || "",

      fatherNameBangla:
        Employee.fatherNameBangla || "",

      motherNameEnglish:
        Employee.motherNameEnglish || "",

      motherNameBangla:
        Employee.motherNameBangla || "",

      spouseName:
        Employee.spouseName || "",

      spouseMobile:
        Employee.spouseMobile || "",

      tinNumber: Employee.tinNumber || "",

      employeeReference:
        Employee.employeeReference || "",
    });
  }, [Employee, reset]);
  /* ======================================================
      SUBMIT
  ====================================================== */

  const onSubmit = (data: EmployeeFormValues) => {
    EmployeePost({
      employeeCode: data.employeeId,
      employeeNameEnglish: data.employeeNameEnglish,
      employeeNameBangla: data.employeeNameBangla,
    
      companyId: data.companyId,
      departmentId: data.department,
      sectionId: data.section,
      gradeId: data.grade,
      holidayId: data.holiday,
    
      employeeType: data.employeeType,
      shiftId: data.shift,
      employeeNature: Number(data.employeeNature),
    
      joiningDate: new Date(data.joiningDate).toISOString(),
    
      confirmationDate: data.confirmationDate
        ? new Date(data.confirmationDate).toISOString()
        : null,
    
      dateOfBirth: new Date(data.dateOfBirth).toISOString(),
    
      gender: Number(data.gender),
      maritalStatus: Number(data.maritalStatus),
    
      mobileNumber: data.mobileNumber,
      emailAddress: data.emailAddress,
    
      documentType: Number(data.documentType),
      documentNumber: data.documentNumber,
    
      bloodGroup: Number(data.bloodGroup),
      religion: Number(data.religion),
      nationality: Number(data.nationality),
    
      fatherNameEnglish: data.fatherNameEnglish,
      fatherNameBangla: data.fatherNameBangla,
    
      motherNameEnglish: data.motherNameEnglish,
      motherNameBangla: data.motherNameBangla,
    
      spouseName: data.spouseName,
      spouseMobile: data.spouseMobile,
    
      tinNumber: data.tinNumber,
      employeeReference: data.employeeReference,
    }, {
      onSuccess: (response) => {
        toast.success(response.message);
        setActiveStep(3);
      },
    });
  };

  /* ======================================================
      FIELD CONFIGS
  ====================================================== */

  const basicEmploymentFields = [
    {
      label: "Employee ID *",
      name: "employeeId",
      type: "text",
      rules: {
        required: "Employee ID is required",
      },
    },
  
    {
      label: "Employee Name (English) *",
      name: "employeeNameEnglish",
      type: "text",
      rules: {
        required: "Employee name is required",
      },
    },
  
    {
      label: "Employee Name (Bangla)",
      name: "employeeNameBangla",
      type: "text",
    },
  
    {
      label: "Company Name *",
      name: "companyId",
      type: "dropdown",
      options: companies.map((company) => ({
        label: company.companyName,
        value: company.id,
      })),
      rules: {
        required: "Company ID is required",
      },
    },
  
    {
      label: "Department *",
      name: "department",
      type: "dropdown",
      rules: {
        required: "Department is required",
      },
      options: departments.map((department) => ({
        label: department.departmentName,
        value: department.id,
      })),
    },
  
    {
      label: "Section *",
      name: "section",
      type: "dropdown",
      options: sections.map((section) => ({
        label: section.sectionName,
        value: section.id,
      })),
      rules: {
        required: "Section ID is required",
      },
    },
  
    {
      label: "Grade *",
      name: "grade",
      type: "dropdown",
      options: grades.map((grade) => ({
        label: grade.gradeName,
        value: grade.id,
      })),
      rules: {
        required: "Grade ID is required",
      },
    },
  
    {
      label: "Employee Type *",
      name: "employeeType",
      type: "dropdown",
      rules: {
        required: "Employee Type is required",
        valueAsNumber: true,
      },
      options: [
        { label: "Worker", value: 1 },
        { label: "Staff", value: 2 },
        { label: "Officer", value: 3 },
        { label: "Manager", value: 4 },
        { label: "Supervisor", value: 5 },
        { label: "Operator", value: 6 },
        { label: "Helper", value: 7 },
      ],
    },
  
    {
      label: "Shift *",
      name: "shift",
      type: "dropdown",
      options: [
        { label: "Day Shift", value: "12313" },
        // { label: "Night Shift", value: "213" },
      ],
      rules: {
        required: "Shift is required",
        valueAsNumber: false,
      }
    },
  
    {
      label: "Employee Nature *",
      name: "employeeNature",
      type: "dropdown",
      rules: {
        required: "Employee Nature is required",
        valueAsNumber: true,
      },
      options: [
        { label: "Provision", value: 1 },
        { label: "Permanent", value: 2 },
      ],
    },
  
    {
      label: "Holiday *",
      name: "holiday",
      type: "dropdown",
      options: [
        { label: "Friday", value: "123" },
        { label: "Saturday", value: "213" },
      ],
    },
  
    {
      label: "Joining Date *",
      name: "joiningDate",
      type: "date",
      rules: {
        required: "Joining Date is required",
      },
    },
  
    {
      label: "Confirmation Date",
      name: "confirmationDate",
      type: "date",
      rules: {
        required: "Confirmation Date is required",
      },
    },
  ];
  
  const personalFields = [
    {
      label: "Date of Birth *",
      name: "dateOfBirth",
      type: "date",
      rules: {
        required: "Date of birth is required",
      },
    },
  
    {
      label: "Gender *",
      name: "gender",
      type: "dropdown",
      options: [
        { label: "Male", value: 0 },
        { label: "Female", value: 1 },
      ],
    },
  
    {
      label: "Marital Status *",
      name: "maritalStatus",
      type: "dropdown",
      options: [
        { label: "Unmarried", value: 1 },
        { label: "Married", value: 2 },
      ],
      rules: {
        required: "Marital Status is required",
      },
    },
  
    {
      label: "Mobile Number *",
      name: "mobileNumber",
      type: "number",
      rules: {
        required: "Mobile number is required",
        pattern: {
          value: /^(?:\+8801|01)[3-9]\d{8}$/,
          message: "Invalid mobile number format",
        },
      },
    },
  
    {
      label: "Email Address",
      name: "emailAddress",
      type: "email",
      rules: {
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Invalid email format",
        },
      },
    },
  
    {
      label: "Document Type *",
      name: "documentType",
      type: "dropdown",
      options: [
        { label: "NID", value: 1 },
        { label: "Passport", value: 2 },
      ],
      rules: {
        required: "Document type is required",
      },
    },
  
    {
      label: "Document Number *",
      name: "documentNumber",
      type: "text",
      rules: {
        required: "Document number is required",
      },
    },
  
    {
      label: "Blood Group",
      name: "bloodGroup",
      type: "dropdown",
      options: [
        { label: "B+", value: 1 },
        { label: "A+", value: 2 },
        { label: "O+", value: 3 },
      ],
    },
  
    {
      label: "Religion *",
      name: "religion",
      type: "dropdown",
      options: [
        { label: "Islam", value: 1 },
        { label: "Hinduism", value: 2 },
      ],
      rules: {
        required: "Religion is required",
      },
    },
  
    {
      label: "Nationality *",
      name: "nationality",
      type: "dropdown",
      options: [{ label: "Bangladeshi", value: 1 }],
    },
  ];
  
  const additionalFields = [
    {
      label: "Father's Name (English) *",
      name: "fatherNameEnglish",
      type: "text",
      rules: {
        required: "Father's name (English) is required",
      },
    },
  
    {
      label: "Father's Name (Bangla)",
      name: "fatherNameBangla",
      type: "text",
    },
  
    {
      label: "Mother's Name (English) *",
      name: "motherNameEnglish",
      type: "text",
      rules: {
        required: "Mother's name (English) is required",
      },
    },
  
    {
      label: "Mother's Name (Bangla)",
      name: "motherNameBangla",
      type: "text",
    },
  
    {
      label: "Spouse Name",
      name: "spouseName",
      type: "text",
    },
  
    {
      label: "Spouse Mobile",
      name: "spouseMobile",
      type: "number",
    },
  
    {
      label: "TIN Number",
      name: "tinNumber",
      type: "text",
    },
  
    {
      label: "Employee Reference",
      name: "employeeReference",
      type: "text",
    },
  ];

  /* ======================================================
      RENDER SECTION
  ====================================================== */

  const renderFields = (fields: any[]) => {
    return fields.map((field) => (
      <CommonInputField<EmployeeFormValues>
        key={field.name}
        label={field.label}
        name={field.name}
        register={register}
        errors={errors}
        type={field.type}
        options={field.options}
        rules={field.rules}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-8"
      >
        {/* BASIC EMPLOYMENT INFO */}

        <div>
          <h2 className="text-xl font-semibold text-blue-700 mb-6">
            Basic Employment Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {renderFields(basicEmploymentFields)}
          </div>
        </div>

        {/* PERSONAL INFO */}

        <div>
          <h2 className="text-xl font-semibold text-blue-700 mb-6">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {renderFields(personalFields)}
          </div>
        </div>

        {/* ADDITIONAL INFO */}

        <div>
          <h2 className="text-xl font-semibold text-blue-700 mb-6">
            Additional Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {renderFields(additionalFields)}
          </div>
        </div>

        {/* BUTTONS */}

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
    </div>
  );
};

export default EmployeeForm;