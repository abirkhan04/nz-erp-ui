export type EmployeeFormValues = {

   companyLocation: string;
   idNumber: number;
   idType: string;
   guardianType: string;
   enrollmentId: string;
   securityClearance: string;
   cell: string;
   enrollmentBy: string;
   biometricEnrolledBy: string;
   /* ======================================================
      EMPLOYEE INFORMATION
   ====================================================== */

   employeeId: string;
   employeeNameEnglish: string;
   employeeNameBangla: string;

   companyName: string;
   companyId: String;
   department: string;
   section: string;
   grade: string;

   employeeType: string;
   shift: string;
   employeeNature: string;
   holiday: string;

   joiningDate: string;
   confirmationDate: string;

   /* ======================================================
      PERSONAL INFORMATION
   ====================================================== */

   dateOfBirth: string;
   gender: string;
   maritalStatus: string;

   mobileNumber: string;
   emailAddress: string;

   documentType: string;
   documentNumber: string;

   bloodGroup: string;
   religion: string;
   nationality: string;

   fatherNameEnglish: string;
   fatherNameBangla: string;

   motherNameEnglish: string;
   motherNameBangla: string;

   spouseName: string;
   spouseMobile: string;

   tinNumber: string;
   employeeReference: string;

   /* ======================================================
      FINANCIAL DETAILS
   ====================================================== */

   basicSalary: string;
   houseRentAllowance: string;
   medicalAllowance: string;
   conveyanceAllowance: string;
   foodAllowance: string;
   grossSalary: string;

   paymentMethod: string;

   bankName: string;
   bankBranchName: string;
   bankAccountNumber: string;
   routingNumber: string;

   mobileBankingProvider: string;
   mobileBankingNumber: string;

   otherAllowance: string;
   bankAccountNo: string;
   accountType: string;
   branch: string;

   taxStatus: string;
   taxExempted: string;
   nidNumber: string;

   providentFund: string;
   pfAccountNo: string;

   gratuityApplicable: string;
   esiApplicable: string;

   salaryEffectiveFrom: string;
   remarks: string;

   /* ======================================================
      ADDRESS DETAILS
   ====================================================== */

   // ADDRESS DETAILS
   sameAsPresentAddress: boolean;

   presentVillageRoadHouse: string;
   presentPostOffice: string;
   presentThanaUpazila: string;
   presentDistrict: string;
   presentDivision: string;

   presentAddressBangla: string;
   presentPostOfficeBangla: string;
   presentThanaUpazilaBangla: string;
   presentDistrictBangla: string;
   presentDivisionBangla: string;

   permanentVillageRoadHouse: string;
   permanentPostOffice: string;
   permanentThanaUpazila: string;
   permanentDistrict: string;
   permanentDivision: string;

   permanentAddressBangla: string;
   permanentPostOfficeBangla: string;
   permanentThanaUpazilaBangla: string;
   permanentDistrictBangla: string;
   permanentDivisionBangla: string;



   /* ======================================================
      FAMILY INFORMATION
   ====================================================== */

   familyMembers: {
      familyMemberNameEnglish: string;
      familyMemberNameBangla: string;
      relation: string;
      dateOfBirth: string;
      occupation: string;
      mobileNumber: string;
   }[];

   // NOMINEE
   nomineeNameEnglish: string;
   nomineeNameBangla: string;
   relationWithEmployee: string;
   nomineeNidBirthRegNo: string;
   nomineeMobileNumber: string;

   nomineeAddressBangla: string;
   nomineePostOfficeBangla: string;
   nomineeThanaUpazilaBangla: string;
   nomineeDistrictBangla: string;
   nomineeDivisionBangla: string;

   /* ======================================================
      DOCUMENTS
   ====================================================== */

   nidBirthCertificate: FileList;
   educationalDocument: FileList;
   signature: FileList;
   medicalCertificate: FileList;
   characterCertificate: FileList;
   experienceCertificate: FileList;
   womenNightDutyConcern: FileList;
   others: FileList;
};
