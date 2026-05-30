// components/EmployeeSearchSection.tsx

import React from "react";
import { Search } from "lucide-react";
import SearchableDropdown, {
  type SearchableDropdownOption,
} from "../../components/SearchableDropdown";

type Props = {
  employeeId: string;
  setEmployeeId: (id: string) => void;
};

const EmployeeSearchSection: React.FC<Props> = ({
  employeeId,
  setEmployeeId,
}) => {
  const [employees, setEmployees] = React.useState<
    SearchableDropdownOption[]
  >([]);

  const [loading, setLoading] = React.useState(false);

  const fetchEmployee = async (text: string) => {
    // alert("fired");
    setLoading(true);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/Employees/search?searchText=${encodeURIComponent(text)}`
      );

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 items-end">
      <div className="col-span-9 md:col-span-4">
        <SearchableDropdown
          value={employeeId}
          options={employees}
          isLoading={loading}
          placeholder="Search Employee"
          debounceDelay={300}
          onSearch={fetchEmployee}
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
  );
};

export default EmployeeSearchSection;
