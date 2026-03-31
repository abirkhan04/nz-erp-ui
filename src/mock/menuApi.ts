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
            label: "Configuration",
            children: [
              { label: "Currency", path: "/currency" },
              { label: "Branch", path: "/branch" },
              { label: "Fiscal Year", path: "/fiscal-year" },
            ],
          },
          {
            label: "GL Module",
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
