import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Search,
  CalendarDays,
} from "lucide-react";
import type { Employee, PhysicalExaminationSetting } from "../../types/interfaces";

import CommonInputField from "./../../components/CommonInputFields";
import { SectionCard } from "../../components/SectionCard";
import { bloodGroupMap, type Props } from "./types";
import { API_ROUTES } from "../../api/routes";
import { useGet } from "../../hooks/useGet";
import { usePost } from "../../hooks/usePost";
import SearchableDropdown, { type SearchableDropdownOption } from "../../components/SearchableDropdown";


type PhysicalExaminationData = {
  vision: string;
  hearing: string;
  heart: string;
  chestLungs: string;
};

type FitnessFormValues = {
  employeeId: string;
  enrollmentId: string;
  bloodGroup: number;
  heightCm: number;
  weightKg: number;
  identificationMarks: string;
  physicalExaminationDataJson: PhysicalExaminationData;
  isFit: boolean;
  remarks: string;
  examinedByDoctor: string;
  examinationDateTime: string;
  examinationDate: string;
  fitnessDecision: string;
};

const DoctorFitnessCheck: React.FC<Props> = ({ employeeId, setActiveStep, setEmployeeId }) => {

  const [employees, setEmployees] = React.useState<Array<SearchableDropdownOption>>([])

  const { data: Employee } = useGet<Employee>({
    key: ["employee", employeeId],
    url: `${API_ROUTES.EMPLOYEES}/${employeeId}`,
    enabled: !!employeeId,
  });

  const { data: physicalExaminationSettings } = useGet<PhysicalExaminationSetting[]>({
    key: ["physicalExaminationSettings"],
    url: API_ROUTES.PHYSICAL_EXAMINATION_SETTINGS,
  });

  const { mutate: EmployeeFitnessPost } =
    usePost<{ message: string; id: string }, any>(
      API_ROUTES.MEDICAL_FITNESS_CHECK
    );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FitnessFormValues>({
    defaultValues: {
      employeeId: employeeId,

      enrollmentId: "",

      bloodGroup: 1,

      heightCm: 165,

      weightKg: 58,

      physicalExaminationDataJson: {
        vision: "Normal",
        hearing: "Normal",
        heart: "Normal",
        chestLungs: "Normal",
      },
      isFit: true,

      remarks: "",

      examinedByDoctor: "Dr. S. Rahman",

      examinationDate: new Date().toISOString(),
    },
  });

  const onSubmit = (data: FitnessFormValues) => {
    const fitnessPost: any = { ...data };
    fitnessPost.bloodGroup = Number(data.bloodGroup);
    fitnessPost.employeeId = employeeId;
    fitnessPost.enrollmentId = Employee?.enrollmentId;
    fitnessPost.physicalExaminationDataJson = JSON.stringify(data.physicalExaminationDataJson);
    EmployeeFitnessPost(fitnessPost, {
      onSuccess: (response) => {
        toast.success(response.message);
        setActiveStep(3);
        setEmployeeId(employeeId);
      },

      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const [
    loading,
    setLoading,
  ] = React.useState(false);

  const fetchEmployee = async (text: string) => {

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/Employees/search?searchText=${encodeURIComponent(text)}`
      );

      setLoading(false);

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();

      const employeeOptions = data?.map((employee: any) => ({
        label: employee.employeeNameBangla,
        value: employee.id,
      }));

      setEmployees(employeeOptions);
    } catch (error) {
      console.error("Employee fetch error:", error);
      setEmployees([]);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-12 gap-6"
      >
        {/* LEFT SECTION */}

        <div className="col-span-12 xl:col-span-9 space-y-6">
          {/* SEARCH */}

          <SectionCard title="Search Candidate">
            <div className="grid grid-cols-12 gap-4 items-end">
              <div className="col-span-9 md:col-span-4">
                <SearchableDropdown
                  value={employeeId}
                  options={employees}
                  isLoading={loading}
                  placeholder="Search Employee"
                  debounceDelay={300}
                  onSearch={(text) => {
                    fetchEmployee(text);
                  }}
                  onChange={(option) => {
                    setEmployeeId(String(option.value));
                  }}
                />
              </div>
              <div className="col-span-2 md:col-span-4">
                <button
                  type="button"
                  className="
                    h-[42px]
                    w-full
                    rounded-lg
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    text-sm
                    font-medium
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  <Search size={16} />
                  Search
                </button>
              </div>
            </div>
          </SectionCard>

          {/* CANDIDATE INFORMATION */}

          <SectionCard
            title="Candidate Information"
            color="blue"
          >
            <div className="grid grid-cols-12 gap-6">
              {/* IMAGE */}

              <div className="col-span-12 md:col-span-2">
                <div
                  className="
                    w-28
                    h-32
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-100
                    flex
                    items-center
                    justify-center
                    text-gray-400
                    text-sm
                    "
                >
                  Candidate
                </div>
              </div>

              {/* PERSONAL */}

              <div className="col-span-12 md:col-span-4 space-y-2 text-sm">
                <InfoRow
                  label="Employee ID"
                  value={Employee?.enrollmentId || ""}
                />

                <InfoRow
                  label="Employee Code"
                  value={Employee?.employeeCode || ""}
                />

                <InfoRow
                  label="Candidate Name"
                  value={
                    Employee?.employeeNameEnglish ||
                    Employee?.employeeNameBangla ||
                    ""
                  }
                />

                <InfoRow
                  label="Father's Name"
                  value={Employee?.fatherNameEnglish || ""}
                />

                <InfoRow
                  label="Mother's Name"
                  value={
                    Employee?.motherNameEnglish ||
                    Employee?.motherNameBangla ||
                    ""
                  }
                />

                <InfoRow
                  label="Date of Birth"
                  value={
                    Employee?.dateOfBirth
                      ? new Date(
                        Employee.dateOfBirth
                      ).toLocaleDateString()
                      : ""
                  }
                />

                <InfoRow
                  label="Gender"
                  value={
                    Employee?.gender === 1
                      ? "Male"
                      : Employee?.gender === 2
                        ? "Female"
                        : "Other"
                  }
                />

                <InfoRow
                  label="Blood Group"
                  value={Object.keys(bloodGroupMap).find(
                    (key) =>
                      bloodGroupMap[key] === Number(Employee?.bloodGroup)
                  ) || ""}
                />

                <InfoRow
                  label="Mobile Number"
                  value={Employee?.mobileNumber || ""}
                />
              </div>

              {/* ADDRESS */}

              <div className="col-span-12 md:col-span-3 space-y-2 text-sm">
                <InfoRow
                  label="Village / Road"
                  value={
                    Employee?.presentVillageAreaRoad || ""
                  }
                />

                <InfoRow
                  label="Post Office"
                  value={Employee?.presentPostOffice || ""}
                />

                <InfoRow
                  label="Thana"
                  value={Employee?.presentThana || ""}
                />

                <InfoRow
                  label="District"
                  value={Employee?.presentDistrict || ""}
                />

                <InfoRow
                  label="Division"
                  value={Employee?.presentDivision || ""}
                />
              </div>

              {/* JOB */}

              <div className="col-span-12 md:col-span-3 space-y-2 text-sm">
                <InfoRow
                  label="Company"
                  value={Employee?.companyName || ""}
                />

                <InfoRow
                  label="Department"
                  value={Employee?.departmentName || ""}
                />

                <InfoRow
                  label="Section"
                  value={Employee?.sectionName || ""}
                />

                <InfoRow
                  label="Designation"
                  value={Employee?.designationName || ""}
                />

                <InfoRow
                  label="Employee Type"
                  value={String(Employee?.employeeType || "")}
                />

                <InfoRow
                  label="Joining Date"
                  value={
                    Employee?.joiningDate
                      ? new Date(
                        Employee.joiningDate
                      ).toLocaleDateString()
                      : ""
                  }
                />
              </div>
            </div>
          </SectionCard>

          {/* MEDICAL EXAMINATION */}

          <SectionCard
            title="Medical Examination"
            color="green"
          >
            <div className="grid grid-cols-12 gap-6">
              {/* LEFT */}

              <div className="col-span-12 lg:col-span-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <CommonInputField<FitnessFormValues>
                    label="Height (cm)"
                    name="heightCm"
                    register={register}
                    errors={errors}
                    type="number"
                    placeholder="165"
                  />

                  <CommonInputField<FitnessFormValues>
                    label="Weight (kg)"
                    name="weightKg"
                    register={register}
                    errors={errors}
                    type="number"
                    placeholder="58"
                  />
                </div>

                <CommonInputField<FitnessFormValues>
                  label="Blood Group"
                  name="bloodGroup"
                  register={register}
                  errors={errors}
                  type="dropdown"
                  options={Object.entries(bloodGroupMap).map(([label, value]) => ({
                    label,
                    value,
                  }))}
                />

                <div>
                  <label
                    className="
                      block
                      text-sm
                      font-medium
                      text-gray-700
                      mb-1
                    "
                  >
                    Identification Marks
                  </label>

                  <textarea
                    rows={4}
                    {...register("identificationMarks")}
                    placeholder="Small mole on left cheek"
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-lg
                      px-3
                      py-2
                      text-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />
                </div>

                <CommonInputField<FitnessFormValues>
                  label="Examined By (Doctor)"
                  name="examinedByDoctor"
                  register={register}
                  errors={errors}
                />
              </div>

              {/* MIDDLE */}

              <div className="col-span-12 lg:col-span-4 space-y-5">
                <h3 className="font-semibold text-gray-700">
                  Physical Examination
                </h3>

                {
                  physicalExaminationSettings
                    ?.filter((item) => item.isActive)
                    ?.sort((a, b) => a.displayOrder - b.displayOrder)
                    ?.map((item) => {
                      const fieldKey = item.fieldName
                        .replace(/[^\w\s]/gi, "")
                        .replace(/\s+/g, "")
                        .replace(/^./, (str) => str.toLowerCase());

                      const options =
                        item.optionValuesJson
                          ?.split(",")
                          ?.map((value) => ({
                            label: value.trim(),
                            value: value.trim(),
                          })) || [];

                      if (item.fieldType === 2) {
                        return (
                          <CommonInputField<any>
                            key={item.id}
                            label={item.fieldName}
                            name={`physicalExaminationDataJson.${fieldKey}`}
                            register={register}
                            errors={errors}
                            type="radio"
                            options={options}
                          />
                        );
                      }

                      if (item.fieldType === 3) {
                        return (
                          <div key={item.id}>
                            <label
                              className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-1
              "
                            >
                              {item.fieldName}
                            </label>

                            <textarea
                              rows={3}
                              {...register(
                                `physicalExaminationDataJson.${fieldKey}` as any
                              )}
                              placeholder={`Enter ${item.fieldName}`}
                              className="
                w-full
                border
                border-gray-300
                rounded-lg
                px-3
                py-2
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
                            />
                          </div>
                        );
                      }

                      return null;
                    })
                }
              </div>

              {/* RIGHT */}

              <div className="col-span-12 lg:col-span-4 space-y-4">
                <CommonInputField<FitnessFormValues>
                  label="Fitness Decision"
                  name="fitnessDecision"
                  register={register}
                  errors={errors}
                  type="radio"
                  options={[
                    {
                      label: "Fit",
                      value: "Fit",
                    },
                    {
                      label: "Not Fit",
                      value: "Not Fit",
                    },
                  ]}
                />

                <div>
                  <label
                    className="
                      block
                      text-sm
                      font-medium
                      text-gray-700
                      mb-1
                    "
                  >
                    Remarks
                  </label>

                  <textarea
                    rows={6}
                    {...register("remarks")}
                    placeholder="Enter remarks"
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-lg
                      px-3
                      py-2
                      text-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />
                </div>

                <CommonInputField<FitnessFormValues>
                  label="Examination Date"
                  name="examinationDate"
                  register={register}
                  errors={errors}
                  type="date"
                />

                <button
                  type="submit"
                  className="
                    w-full
                    h-11
                    rounded-lg
                    bg-green-600
                    hover:bg-green-700
                    text-white
                    font-medium
                  "
                >
                  Save Fitness Report
                </button>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* RIGHT SIDE */}

        <div className="col-span-12 xl:col-span-3 space-y-6">
          {/* SUMMARY */}

          <SectionCard
            title="Medical Check Summary"
            color="purple"
          >
            <div className="space-y-4 text-sm">
              <InfoRow
                label="Examination Date"
                value="27 Apr 2026"
              />

              <InfoRow
                label="Examined By"
                value="Dr. S. Rahman"
              />

              <InfoRow
                label="Blood Group"
                value="B+"
              />

              <div className="flex justify-between items-center">
                <span className="text-gray-500">
                  Overall Status
                </span>

                <span
                  className="
                    px-3
                    py-1
                    rounded-full
                    bg-green-100
                    text-green-700
                    text-xs
                    font-semibold
                  "
                >
                  FIT
                </span>
              </div>

              <InfoRow
                label="Remarks"
                value="Fit for employment"
              />
            </div>
          </SectionCard>

          {/* NOTES */}

          <SectionCard
            title="Important Notes"
            color="orange"
          >
            <ul className="space-y-3 text-sm text-gray-700 list-disc pl-5">
              <li>
                If candidate is marked as Not Fit,
                process will stop.
              </li>

              <li>
                If candidate is Fit, provide
                fitness slip to HR.
              </li>

              <li>
                This medical fitness clearance
                will be used for recruitment.
              </li>
            </ul>

            <div className="flex justify-end mt-4">
              <button
                className="
                  h-10
                  w-10
                  rounded-full
                  bg-gray-100
                  hover:bg-gray-200
                  flex
                  items-center
                  justify-center
                "
              >
                <CalendarDays size={18} />
              </button>
            </div>
          </SectionCard>
        </div>
      </form>
    </div>
  );
};

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="flex gap-2">
      <span className="text-gray-500 w-[140px]">
        {label}
      </span>

      <span className="font-medium text-gray-800">
        : {value}
      </span>
    </div>
  );
};

export default DoctorFitnessCheck;