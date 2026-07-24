import { useState } from "react";
import { Search } from "lucide-react";

import BackButton from "../../../../components/BackButton.tsx";

import EmployeeCard from "./components/EmployeeCard.tsx";
import InfoCard from "./components/InfoCard.tsx";
import DocumentsCard from "./components/DocumentsCard.tsx";
import AppointmentCard from "./components/AppointmentCard.tsx";
import PromotionHistory from "./components/PromotionHistory.tsx";

import {
  formatAddress,
  formatCurrency,
  formatDate,
} from "./helpers/employeeDetailHelper";

import type { EmployeeDetailedProfile } from "./types/types";
import { useGet } from "../../../../hooks/useGet.ts";
import { API_ROUTES } from "../../../../api/routes.ts";

export default function EmployeeDetailedProfilePage() {
  const [employeeId, setEmployeeId] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const { data, isLoading } = useGet({
    key: ["employee-detail-profile", searchValue],
    url: `${API_ROUTES.EMPLOYEE_REPORTS}/employee-detailed-profile/${searchValue}`,
    enabled: !!searchValue
  });

  const employee = data as EmployeeDetailedProfile | undefined;

  const handleSearch = () => {
    if (!employeeId.trim()) return;
    setSearchValue(employeeId.trim());
  };

  return (
    <div className="space-y-5">

      <BackButton url={"/recruitment/recruitment-reports"}/>

      {/* Header */}

      <div className="rounded-xl border bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Employee Detailed Profile
            </h2>

            <p className="text-sm text-slate-500">
              View complete details of an employee.
            </p>
          </div>

          <div className="flex items-end gap-3">

            <div className="w-80">
              <label className="mb-1 block text-sm font-medium">
                Employee Code
              </label>

              <input
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="w-full rounded-md border px-3 py-2 outline-none focus:border-blue-500"
                placeholder="Enter Employee ID"
              />
            </div>

            <button
              onClick={handleSearch}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-blue-600 px-5 text-white hover:bg-blue-700"
            >
              <Search size={16} />
              Search
            </button>

          </div>

        </div>

      </div>

      {isLoading && (

        <div className="rounded-xl bg-white p-20 text-center shadow">
          Loading Employee Information...
        </div>
      )}

      {!isLoading && !employee && searchValue && (

        <div className="rounded-xl bg-white p-20 text-center shadow">

          No employee found.

        </div>

      )}

      {employee && (

        <>

          <div className="grid grid-cols-12 gap-4">

            {/* LEFT */}

            <div className="col-span-12 xl:col-span-3">

              <EmployeeCard employee={employee} />

            </div>

            {/* RIGHT */}

            <div className="col-span-12 space-y-4 xl:col-span-9">

              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">

                <InfoCard
                  title="Personal Information"
                  data={[
                    ["Full Name", employee.fullName],
                    ["Father Name", employee.fatherName],
                    ["Date of Birth", formatDate(employee.dateOfBirth)],
                    ["Gender", employee.gender],
                    ["Blood Group", employee.bloodGroup],
                    ["Religion", employee.religion],
                    ["Nationality", employee.nationality],
                    ["CNIC / NID", employee.idNumber],
                    ["Mobile", employee.mobile],
                  ]}
                />

                <InfoCard
                  title="Service Information"
                  data={[
                    ["Company", employee.company],
                    ["Department", employee.department],
                    ["Section", employee.section],
                    ["Cell", employee.cell],
                    ["Designation", employee.designation],
                    ["Grade", employee.grade],
                    ["Shift", employee.shift],
                    ["Weekly Off", employee.weeklyOff],
                    ["Reporting To", employee.reportingTo],
                  ]}
                />

                <InfoCard
                  title="Salary Information"
                  data={[
                    ["Pay Basis", "Monthly"],
                    ["Basic Salary", formatCurrency(employee.basicSalary)],
                    ["House Rent", formatCurrency(employee.houseRent)],
                    ["Other Allowances", employee.otherAllowances],
                    ["Gross Salary", formatCurrency(employee.grossSalary)],
                  ]}
                />

              </div>

              <div className="grid gap-4 lg:grid-cols-2">

                <InfoCard
                  title="Address Information"
                  data={[
                    [
                      "Present Address",
                      formatAddress(employee.presentAddress),
                    ],
                    [
                      "Permanent Address",
                      formatAddress(employee.permanentAddress),
                    ],
                  ]}
                />

                <InfoCard
                  title="Nominee Information"
                  data={[
                    [
                      "Nominee Name",
                      employee.nomineeInfo?.nomineeName,
                    ],
                    [
                      "Relation",
                      employee.nomineeInfo?.relation,
                    ],
                    [
                      "Mobile",
                      employee.nomineeInfo?.mobile,
                    ],
                    [
                      "Address",
                      employee.nomineeInfo?.address,
                    ],
                  ]}
                />

              </div>

              <InfoCard
                title="Medical Information"
                data={[
                  [
                    "Medical Status",
                    employee.medicalInfo?.medicalStatus,
                  ],
                  [
                    "Date",
                    formatDate(employee.medicalInfo?.dateOfMedical),
                  ],
                  [
                    "Medical Center",
                    employee.medicalInfo?.medicalCenter,
                  ],
                  [
                    "Blood Group",
                    employee.medicalInfo?.bloodGroupMedical,
                  ],
                ]}
              />

              <div className="grid gap-4 xl:grid-cols-3">

                <DocumentsCard
                  documents={employee.documents}
                />

                <AppointmentCard
                  letter={employee.appointmentLetterDetails}
                />

                <PromotionHistory
                  history={employee.promotionTransferHistory}
                />

              </div>

            </div>

          </div>

          {/* Bottom Buttons */}

        </>

      )}

    </div>
  );
}