import {
    Home,
    Settings,
    Database,
    FileText,
  } from "lucide-react";
  
import type { MenuItemType } from "../types/interfaces";

export const mockMenu: MenuItemType[] = [
    {
        label: "Homepage",
        icon: Home,
        path: "/",
      },
      {
        label: "Configuration",
        icon: Settings,
        children: [
          { label: "Currency", path: "/currency" },
          { label: "Branch", path: "/branch" },
          { label: "Fiscal Year", path: "/fiscal-year" },
        ],
      },
      {
        label: "GL Module",
        icon: Database,
        children: [
          { label: "Journal Entry", path: "/journal" },
          { label: "Reports", path: "/reports" },
        ],
      },
      {
        label: "Voucher",
        icon: FileText,
        path: "/voucher",
      },
  ];
