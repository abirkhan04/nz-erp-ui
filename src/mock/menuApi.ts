import type { MenuItemType } from "../types/types";

export const fetchMenu = async (): Promise<MenuItemType[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            label: "Homepage",
            path: "/",
          },
          {
            label: "Set Up",
            children: [
              { label: "Company", path: "/company" },
              { label: "Unit", path: "/unit" },
              { label: "Section", path: "/section" },
              { label: "Department", path: "/department" },
              { label: "Designation", path: "/designation" },
              { label: "Grade", path: "/grade" },
              { label: "Shift", path: "/shift" },
            ],
          },
          {
            label: "Employee Entry",
            children: [
              { label: "Journal Entry", path: "/journal" },
              { label: "Reports", path: "/reports" },
            ],
          },
          {
            label: "Voucher",
            path: "/voucher",
          },
        ]);
      }, 500); // simulate network delay
    });
  };
