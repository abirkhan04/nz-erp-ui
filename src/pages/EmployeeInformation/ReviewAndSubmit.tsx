import React from "react";
import { useFormContext } from "react-hook-form";
import type { EmployeeFormValues } from "./EmployeeFormValues";
import {
    CheckCircle,
    Pencil,
    Clock3,
} from "lucide-react";

type ReviewAndSubmitProps = {
    onEditStep: (step: number) => void;
    formData: any;
};

const ReviewAndSubmit: React.FC<
    ReviewAndSubmitProps
> = ({ onEditStep }) => {

    const { watch } =
        useFormContext<EmployeeFormValues>();

    const formData = watch();
    const cardClass =
        "bg-white border rounded-2xl p-5";

    const titleClass =
        "text-lg font-semibold text-blue-700";

    const editButtonClass = `
    flex items-center gap-2
    border border-blue-200
    text-blue-600
    px-3 py-1.5
    rounded-lg
    text-sm
    hover:bg-blue-50
  `;

    const renderValue = (
        value?: string | number
    ) => {
        if (!value) return "-";

        return value;
    };

    return (
        <div className="space-y-6">
            {/* TOP INFO */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle
                    size={18}
                    className="text-blue-600"
                />

                <p className="text-sm text-gray-700">
                    Please review all information carefully
                    before submission. You can go back to any
                    section to edit if needed.
                </p>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                {/* EMPLOYEE INFO */}
                <div className={cardClass}>
                    <div className="flex justify-between items-center mb-5">
                        <h2 className={titleClass}>
                            1. Employee Information
                        </h2>

                        <button
                            type="button"
                            onClick={() => onEditStep(1)}
                            className={editButtonClass}
                        >
                            <Pencil size={14} />
                            Edit
                        </button>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between gap-4">
                            <span>Employee ID</span>

                            <span>
                                {renderValue(
                                    formData?.employeeId
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Name (English)</span>

                            <span>
                                {renderValue(
                                    formData?.employeeNameEnglish
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Company</span>

                            <span>
                                {renderValue(
                                    formData?.companyName
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Department</span>

                            <span>
                                {renderValue(
                                    formData?.department
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Employee Type</span>

                            <span>
                                {renderValue(
                                    formData?.employeeType
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Joining Date</span>

                            <span>
                                {renderValue(
                                    formData?.joiningDate
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {/* FINANCIAL DETAILS */}
                <div className={cardClass}>
                    <div className="flex justify-between items-center mb-5">
                        <h2 className={titleClass}>
                            2. Financial Details
                        </h2>

                        <button
                            type="button"
                            onClick={() => onEditStep(2)}
                            className={editButtonClass}
                        >
                            <Pencil size={14} />
                            Edit
                        </button>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between gap-4">
                            <span>Basic Salary</span>

                            <span>
                                {renderValue(
                                    formData?.basicSalary
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>House Rent</span>

                            <span>
                                {renderValue(
                                    formData?.houseRentAllowance
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Medical</span>

                            <span>
                                {renderValue(
                                    formData?.medicalAllowance
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4 font-semibold text-blue-700">
                            <span>Gross Salary</span>

                            <span>
                                {renderValue(
                                    formData?.grossSalary
                                )}
                            </span>
                        </div>

                        <hr className="my-3" />

                        <div className="flex justify-between gap-4">
                            <span>Payment Method</span>

                            <span>
                                {renderValue(
                                    formData?.paymentMethod
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Bank Name</span>

                            <span>
                                {renderValue(
                                    formData?.bankName
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {/* PERSONAL INFO */}
                <div className={cardClass}>
                    <div className="flex justify-between items-center mb-5">
                        <h2 className={titleClass}>
                            3. Personal Information
                        </h2>

                        <button
                            type="button"
                            onClick={() => onEditStep(1)}
                            className={editButtonClass}
                        >
                            <Pencil size={14} />
                            Edit
                        </button>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between gap-4">
                            <span>Date of Birth</span>

                            <span>
                                {renderValue(
                                    formData?.dateOfBirth
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Gender</span>

                            <span>
                                {renderValue(
                                    formData?.gender
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Marital Status</span>

                            <span>
                                {renderValue(
                                    formData?.maritalStatus
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Mobile</span>

                            <span>
                                {renderValue(
                                    formData?.mobileNumber
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Email</span>

                            <span>
                                {renderValue(
                                    formData?.emailAddress
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ADDRESS DETAILS */}
                <div className={cardClass}>
                    <div className="flex justify-between items-center mb-5">
                        <h2 className={titleClass}>
                            4. Address Details
                        </h2>

                        <button
                            type="button"
                            onClick={() => onEditStep(3)}
                            className={editButtonClass}
                        >
                            <Pencil size={14} />
                            Edit
                        </button>
                    </div>

                    <div className="space-y-5 text-sm">
                        <div>
                            <h3 className="font-semibold text-blue-700 mb-2">
                                Present Address
                            </h3>

                            <p>
                                {renderValue(
                                    formData?.presentVillageRoadHouse
                                )}
                            </p>

                            <p>
                                {renderValue(
                                    formData?.presentThanaUpazila
                                )}
                            </p>

                            <p>
                                {renderValue(
                                    formData?.presentDivision
                                )}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-blue-700 mb-2">
                                Permanent Address
                            </h3>

                            <p>
                                {renderValue(
                                    formData?.permanentVillageRoadHouse
                                )}
                            </p>

                            <p>
                                {renderValue(
                                    formData?.permanentThanaUpazila
                                )}
                            </p>

                            <p>
                                {renderValue(
                                    formData?.permanentDivision
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* FAMILY DETAILS */}
                <div className={cardClass}>
                    <div className="flex justify-between items-center mb-5">
                        <h2 className={titleClass}>
                            5. Family Details
                        </h2>

                        <button
                            type="button"
                            onClick={() => onEditStep(4)}
                            className={editButtonClass}
                        >
                            <Pencil size={14} />
                            Edit
                        </button>
                    </div>

                    <div className="overflow-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left border-b">
                                    <th className="pb-2">
                                        Relation
                                    </th>

                                    <th className="pb-2">
                                        Name
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {formData?.familyMembers?.length >
                                    0 ? (
                                    formData.familyMembers.map(
                                        (
                                            member: any,
                                            index: number
                                        ) => (
                                            <tr
                                                key={index}
                                                className="border-b"
                                            >
                                                <td className="py-2">
                                                    {renderValue(
                                                        member?.relation
                                                    )}
                                                </td>

                                                <td className="py-2">
                                                    {renderValue(
                                                        member?.familyMemberNameEnglish
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={2}
                                            className="py-3 text-center text-gray-400"
                                        >
                                            No family information added
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* NOMINEE DETAILS */}
                <div className={cardClass}>
                    <div className="flex justify-between items-center mb-5">
                        <h2 className={titleClass}>
                            6. Nominee Details
                        </h2>

                        <button
                            type="button"
                            onClick={() => onEditStep(4)}
                            className={editButtonClass}
                        >
                            <Pencil size={14} />
                            Edit
                        </button>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between gap-4">
                            <span>Nominee Name</span>

                            <span>
                                {renderValue(
                                    formData?.nomineeNameEnglish
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Relation</span>

                            <span>
                                {renderValue(
                                    formData?.relationWithEmployee
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span>Nominee Mobile</span>

                            <span>
                                {renderValue(
                                    formData?.nomineeMobileNumber
                                )}
                            </span>
                        </div>

                        <div className="pt-3">
                            <h3 className="font-semibold text-blue-700 mb-2">
                                Nominee Address
                            </h3>

                            <p>
                                {renderValue(
                                    formData?.nomineeAddressBangla
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* DOCUMENTS */}
                <div className={cardClass}>
                    <div className="flex justify-between items-center mb-5">
                        <h2 className={titleClass}>
                            7. Documents Uploaded
                        </h2>

                        <button
                            type="button"
                            onClick={() => onEditStep(5)}
                            className={editButtonClass}
                        >
                            <Pencil size={14} />
                            Edit
                        </button>
                    </div>

                    <div className="space-y-3 text-sm">
                        {[
                            {
                                label:
                                    "NID / Birth Certificate",
                                value:
                                    formData?.nidBirthCertificate?.[0]
                                        ?.name,
                            },
                            {
                                label:
                                    "Educational Document",
                                value:
                                    formData?.educationalDocument?.[0]
                                        ?.name,
                            },
                            {
                                label: "Signature",
                                value:
                                    formData?.signature?.[0]
                                        ?.name,
                            },
                            {
                                label:
                                    "Medical Certificate",
                                value:
                                    formData?.medicalCertificate?.[0]
                                        ?.name,
                            },
                        ].map((doc, index) => (
                            <div
                                key={index}
                                className="flex justify-between gap-3"
                            >
                                <span>{doc.label}</span>

                                <span className="text-right break-all">
                                    {renderValue(doc.value)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* WORKFLOW */}
                <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5">
                    <h2 className={titleClass}>
                        Workflow & Next Steps
                    </h2>

                    <div className="mt-5 space-y-5">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">
                                1
                            </div>

                            <div>
                                <h3 className="font-semibold text-sm">
                                    HR Executive
                                </h3>

                                <p className="text-xs text-gray-500">
                                    Data Entry
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
                                2
                            </div>

                            <div>
                                <h3 className="font-semibold text-sm">
                                    HR Manager
                                </h3>

                                <p className="text-xs text-gray-500">
                                    Review & Approval
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center text-sm">
                                3
                            </div>

                            <div>
                                <h3 className="font-semibold text-sm">
                                    IT Department
                                </h3>

                                <p className="text-xs text-gray-500">
                                    Final Approval
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    className="
            px-6 py-2
            border border-gray-300
            rounded-lg
            hover:bg-gray-50
          "
                >
                    Save as Draft
                </button>

                <button
                    type="button"
                    className="
            px-6 py-2
            bg-blue-600
            text-white
            rounded-lg
            hover:bg-blue-700
          "
                >
                    Submit to HR Manager
                </button>
            </div>
        </div>
    );
};

export default ReviewAndSubmit;