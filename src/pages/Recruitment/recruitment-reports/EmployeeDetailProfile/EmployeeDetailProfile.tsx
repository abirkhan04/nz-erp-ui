import { useState, useEffect } from "react";
import { Search } from "lucide-react";

import BackButton from "../../../../components/BackButton.tsx";

import EmployeeCard from "./components/EmployeeCard.tsx";
import InfoCard from "./components/InfoCard.tsx";
import PromotionHistory from "./components/PromotionHistory.tsx";
import type { Document } from "../../../../types/interfaces.ts";

import {
  formatAddress,
  formatCurrency,
  formatDate,
} from "./helpers/employeeDetailHelper";

import type { EmployeeDetailedProfile } from "./types/types";
import { useGet } from "../../../../hooks/useGet.ts";
import { API_ROUTES } from "../../../../api/routes.ts";
import { useParams } from "react-router-dom";
import { api } from "../../../../api/client.ts";
import { genderMapFromNumber, reverseBloodGroupMap, reverseDocumentTypeMap, reverseReligionMap } from "../../../EmployeeInformation/types.ts";

export default function EmployeeDetailedProfilePage() {

  const { employeeCode } = useParams<{ employeeCode?: string }>();
  const [employeeId, setEmployeeId] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const { data, isLoading } = useGet({
    key: ["employee-detail-profile", searchValue],
    url: `${API_ROUTES.EMPLOYEE_REPORTS}/employee-detailed-profile/${searchValue}`,
    enabled: !!searchValue
  });



  const loadDocument = async (doc: Document) => {
    try {
      const response = await api.get(
        `${API_ROUTES.EMPLOYEES}/image-by-path?path=${encodeURIComponent(doc.filePath)}`,
        {
          responseType: "blob",
        }
      );

      const blob = response.data;

      console.log(blob.type); // Check this

      if (blob.type === "application/octet-stream") {
        const pdfBlob = new Blob([response.data], {
          type: "application/pdf",
        });

        const url = URL.createObjectURL(pdfBlob);
        window.open(url, "_blank");
      } else {
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
      }

    } catch (error) {
      console.error("Failed to load document", error);
    }
  };




  useEffect(() => {
    if (employeeCode) {
      setEmployeeId(employeeCode);
      setSearchValue(employeeCode);
    }
  }, [employeeCode]);

  const employee = data as EmployeeDetailedProfile | undefined;

  const { data: documentResponse = {} } = useGet<any>({
    key: ["documents", employee?.employeeId],
    url: `${API_ROUTES.EMPLOYEES}/uploaded-documents/${employee?.employeeId}`,
    enabled: !!employee?.employeeId
  })

  const documents = documentResponse?.files || [];

  const handleSearch = () => {
    if (!employeeId.trim()) return;
    setSearchValue(employeeId.trim());
  };

  return (
    <div className="space-y-5">

      <BackButton url={"/recruitment/recruitment-reports"} />

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
                    ["Gender", genderMapFromNumber[Number(employee.gender)]],
                    ["Blood Group", reverseBloodGroupMap[Number(employee.bloodGroup)]],
                    ["Religion", reverseReligionMap[Number(employee.religion)]],
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
                    ["Weekly Off", employee.weeklyOff]
                  ]}
                />

                <InfoCard
                  title="Salary Information"
                  data={[
                    ["Pay Basis", "Monthly"],
                    ["Basic Salary", formatCurrency(employee.basicSalary)],
                    ["House Rent", formatCurrency(employee.houseRent)],
                    ["Conveyance", employee.conveyanceAllowance],
                    ["Medical", employee.medicalAllowance],
                    ["Food", employee.foodAllowance],
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
                    ]
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
                    reverseBloodGroupMap[Number(employee.bloodGroup)],
                  ],
                ]}
              />

              <div className="grid gap-4 xl:grid-cols-3">
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #d9e2ef",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow:
                      "0 1px 2px rgba(15,23,42,.04), 0 6px 16px rgba(15,23,42,.08)",
                  }}
                >
                  <div style={{ padding: 16, overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                          {["#", "Document Type"].map(h => (
                            <th key={h} style={{
                              padding: "8px 12px", textAlign: "left",
                              color: "#374151", fontWeight: 700, fontSize: 12,
                            }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {documents?.map((doc: Document, i: number) => (
                          <tr key={i} style={{
                            borderBottom: "1px solid #f3f4f6",
                            background: i % 2 === 0 ? "#fff" : "#fafafa",
                          }}>
                            <td style={{ padding: "9px 12px", color: "#6b7280", fontWeight: 600 }}>{i + 1}</td>
                            <td style={{ padding: "9px 12px", color: "#0f172a", fontWeight: 600, cursor: "pointer" }} onClick={() => loadDocument(doc)}>{reverseDocumentTypeMap[doc.documentType]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

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