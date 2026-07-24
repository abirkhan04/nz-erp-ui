import {
  BadgeCheck,
  Building2,
  Calendar,
  CreditCard,
  Phone,
  User,
} from "lucide-react";

import type { EmployeeDetailedProfile } from "../types/types";
import { formatDate } from "../helpers/employeeDetailHelper";

interface Props {
  employee: EmployeeDetailedProfile;
}

export default function EmployeeCard({ employee }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-center">

        <img
          src={
            employee.photoUrl ||
            "https://placehold.co/160x160?text=Photo"
          }
          alt={employee.fullName}
          className="mx-auto h-36 w-36 rounded-full border-4 border-white object-cover bg-white"
        />

        <h2 className="mt-4 text-xl font-semibold text-white">
          {employee.fullName}
        </h2>

        <p className="text-blue-100">
          {employee.designation}
        </p>

      </div>

      <div className="space-y-4 p-5">

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Status</span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              employee.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {employee.status}
          </span>
        </div>

        <InfoRow
          icon={<CreditCard size={16} />}
          label="Employee ID"
          value={employee.employeeId}
        />

        <InfoRow
          icon={<BadgeCheck size={16} />}
          label="Permanent ID"
          value={employee.permanentId}
        />

        <InfoRow
          icon={<Calendar size={16} />}
          label="Joining Date"
          value={formatDate(employee.dateOfJoining)}
        />

        <InfoRow
          icon={<Building2 size={16} />}
          label="Employment Type"
          value={employee.employmentType}
        />

        <InfoRow
          icon={<Phone size={16} />}
          label="Mobile"
          value={employee.mobile}
        />

        <InfoRow
          icon={<User size={16} />}
          label="Reporting To"
          value={employee.reportingTo}
        />

      </div>
    </div>
  );
}

interface RowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
}

function InfoRow({
  icon,
  label,
  value,
}: RowProps) {
  return (
    <div className="flex items-start gap-3">

      <div className="mt-1 rounded bg-blue-50 p-2 text-blue-600">
        {icon}
      </div>

      <div className="flex-1">

        <p className="text-xs text-gray-500">
          {label}
        </p>

        <p className="font-medium">
          {value || "-"}
        </p>

      </div>

    </div>
  );
}