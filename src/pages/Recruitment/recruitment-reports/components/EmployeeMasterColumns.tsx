import type { ColumnDef } from "@tanstack/react-table";
import type { EmployeeMasterDto } from "../../../../types/interfaces";

const formatDate = (date?: string) => {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export const employeeMasterColumns: ColumnDef<EmployeeMasterDto>[] = [
  {
    accessorKey: "employeeCode",
    header: "Employee ID",

    cell: ({ row }) => (
      <span className="font-semibold text-blue-600">
        {row.original.employeeCode}
      </span>
    ),
  },

  {
    accessorKey: "employeeName",
    header: "Full Name",
  },

  {
    accessorKey: "departmentName",
    header: "Department",
  },

  {
    accessorKey: "sectionName",
    header: "Section",
  },

  {
    accessorKey: "cellName",
    header: "Cell",
  },

  {
    accessorKey: "designationName",
    header: "Designation",
  },

  {
    accessorKey: "employeeNature",
    header: "Type",
  },

  {
    accessorKey: "joiningDate",
    header: "Date of Joining",

    cell: ({ row }) => (
      <span>
        {formatDate(row.original.joiningDate)}
      </span>
    ),
  },

  {
    accessorKey: "active",
    header: "Status",

    cell: ({ row }) =>
      row.original.isActive ? (
        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          Active
        </span>
      ) : (
        <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          Inactive
        </span>
      ),
  },
];