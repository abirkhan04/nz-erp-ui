import type { Path } from "react-hook-form";

export interface MenuItemType {
  name?: string;
  label?: string;
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

export interface Location {
  locationName: string;
  districtId: string;
  district: string | null;
  companies: unknown[] | null;
  id: string;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
  isActive: boolean;
}


export interface Designation {
  id: string;
  designationName: string;
  designationCode: string;
  parentId: string;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
  isActive: boolean;
}

export interface Cell {
  id: string;
  nameEnglish: string;
  nameBangla: string;
  sectionId: string;
  sectionName: string;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
  isActive: boolean;
}

interface FieldRules {
  required?: string;
}

export interface FieldConfig<T> {
  label: string;
  name: Path<T>;
  type: string;
  placeholder?: string;
  readOnly?: boolean;
  options?: any[];
  rules?: FieldRules;
  className?: string;
  disabled?: boolean;
}

export interface Employee {
  id: string;
  enrollmentId: string;
  employeeCode: string;
  employeeNameEnglish: string;
  employeeNameBangla: string;

  companyId: string;
  companyName: string;

  departmentId: string;
  departmentName: string;

  sectionId: string;
  sectionName: string;

  gradeId: string | null;
  gradeName: string;

  designationId: string | null;
  designationName: string;

  employeeType: number;

  shiftId: string | null;
  shiftName: string;

  employeeNatureId: string | null;
  employeeNatureName: string;

  holiday: string | null;

  proposedMonthlySalary: number;

  joiningDate: string;
  confirmationDate: string | null;

  status: number;

  personalInfoId: string;

  dateOfBirth: string;

  gender: number;
  maritalStatus: number | null;

  mobileNumber: string;
  emailAddress: string | null;

  documentType: number | null;
  documentNumber: string | null;

  bloodGroup: number;

  religion: string | null;
  nationality: string | null;

  fatherNameEnglish: string;
  fatherNameBangla: string | null;

  motherNameEnglish: string;
  motherNameBangla: string | null;

  spouseName: string | null;
  spouseMobile: string | null;

  tinNumber: string;

  employeeReference: string;
  referencePersonId: string;

  permanentVillageAreaRoad: string;
  permanentPostOffice: string;
  permanentThana: string;
  permanentDistrict: string;
  permanentDivision: string;

  presentVillageAreaRoad: string;
  presentPostOffice: string;
  presentThana: string;
  presentDistrict: string;
  presentDivision: string;

  verificationInfoId: string;

  securityClearanceBy: string;
  securityClearanceDate: string;

  enrolledBy: string;
  enrolledDate: string;

  biometricEnrolledBy: string;
  biometricEnrolledDate: string;

  createdOn: string;
  createdBy: string;

  updatedOn: string;
  updatedBy: string;

  isActive: boolean;

  idType: number;
  idNumber: string;
}

export type PhysicalExaminationSetting = {
  id: string;
  fieldName: string;
  displayOrder: number;
  fieldType: number;
  optionValuesJson: string | null;
  isActive: boolean;
};

export interface Unit {
  id: string;
  unitCode: string;
  unitName: string;
  unitNameBangla: string;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
  isActive: boolean;
  isCompliant: boolean;
}

export interface EmployeeMasterDto {
  employeeId: number;
  employeeCode: string;
  employeeName: string;

  departmentName: string;
  sectionName: string;
  cellName: string;

  designationName: string;

  employeeNature: string;

  joiningDate: string;

  isActive: boolean;
}

export interface EmployeeMasterFilterModel {
  unitId?: number;
  subUnitId?: number;
  departmentId?: number;
  sectionId?: number;
  cellId?: number;
  employeeNatureId?: number;
  includeInactive?: boolean;

  joiningFromDate?: string;
  joiningToDate?: string;
}