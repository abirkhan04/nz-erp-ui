
export interface MenuItemType {
  label: string;
  icon?: any;
  url?: string;
  path?: string;
  children?: MenuItemType[];
};


export interface Company {
  name: string;
  address: string;
  id: string;
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

