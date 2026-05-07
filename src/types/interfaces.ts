
export interface MenuItemType {
  label: string;
  icon?: any;
  url?: string;
  path?: string;
  children?: MenuItemType[];
};


export interface Company {
  id: string;
  companyCode: string;
  companyName: string;
  locationId: string;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
  isActive: boolean;
  isCompliant: boolean;
}

export interface Department {
  id: string;
  departmentName: string;
  departmentCode: string;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
  isActive: boolean;
}

export interface Section {
  id: string;
  departmentId: string;
  departmentName: string;
  sectionName: string;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
  isActive: boolean;
}

export interface Grade {
  id: string;
  gradeName: string;
  minSalary: number;
  maxSalary: number;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
  isActive: boolean;
}

