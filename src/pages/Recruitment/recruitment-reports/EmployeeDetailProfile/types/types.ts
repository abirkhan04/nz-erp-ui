export interface Address {
  villageAreaRoad: string;
  postOffice: string;
  thanaName: string;
  districtName: string;
  divisionName: string;
  country: string;
}

export interface NomineeInfo {
  nomineeName: string;
  relation: string;
  mobile: string;
  address: string;
}

export interface MedicalInfo {
  medicalStatus: string;
  dateOfMedical: string;
  medicalCenter: string;
  bloodGroupMedical: string;
}

export interface EmployeeDocument {
  documentType: string;
  status: string;
  isAvailable: boolean;
}

export interface PromotionTransferHistory {
  date: string;
  type: string;
  from: string;
  to: string;
  remarks: string;
}

export interface EmployeeDetailedProfile {
  employeeId: string;
  permanentId: string;
  dateOfJoining: string;
  employmentType: string;
  status: string;
  isActive: boolean;

  fullName: string;
  fatherName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  religion: string;
  nationality: string;
  idNumber: string;
  mobile: string;
  photoUrl: string;

  company: string;
  department: string;
  section: string;
  cell: string;
  designation: string;
  grade: string;
  shift: string;
  weeklyOff: string;
  reportingTo: string;

  basicSalary: number;
  houseRent: number;
  otherAllowances: string;
  grossSalary: number;
  monthlySalary: number;

  presentAddress: Address;
  permanentAddress: Address;

  nomineeInfo: NomineeInfo;

  medicalInfo: MedicalInfo;

  documents: EmployeeDocument[];

  appointmentLetterDetails: string;

  promotionTransferHistory: PromotionTransferHistory[];
}