export type Props = {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  setEmployeeId: React.Dispatch<React.SetStateAction<string>>;
  employeeId: string;
};


export const bloodGroupMap: Record<string, number> = {
  "A+": 0,
  "A-": 1,
  "B+": 2,
  "B-": 3,
  "O+": 4,
  "O-": 5,
  "AB+": 6,
  "AB-": 7,
};

export const bloodGroupMapBangla: Record<string, number> = {
  "এ+": 0,
  "এ−": 1,
  "বি+": 2,
  "বি−": 3,
  "ও+": 4,
  "ও−": 5,
  "এবি+": 6,
  "এবি−": 7,
};

export const reverseBloodGroupMap: Record<number, string> = {
  0: "A+",
  1: "A-",
  2: "B+",
  3: "B-",
  4: "O+",
  5: "O-",
  6: "AB+",
  7: "AB-",
};

export const medicalResultMap = new Map<number, string>([
  [0, "Fit"],
  [1, "Unfit"],
]);


export const genderMapFromNumber: Record<number, string> = {
  0: "Male",
  1: "Female",
  2: "Third Gender",
};

export const genderMapBengali: Record<number, string> = {
  0: "পুরুষ",
  1: "মহিলা",
  2: "তৃতীয় লিঙ্গ",
};

export const WeekOffDayMap = {
  0: "Friday",
  1: "Saturday",
  2: "Sunday",
  3: "Monday",
  4: "Tuesday",
  5: "Wednesday",
  6: "Thursday",
};

export const EmployeeNature = {
    Worker: 0,
    Staff: 1,
    Management: 2,
};

export const EmployeeCategory = {
  Permanent: 0,
  Temporary: 1,
  Provisional: 2
}

export type PhysicalExaminationSetting = {
  id: string;
  fieldName: string;
  displayOrder: number;
  fieldType: number;
  optionValuesJson: string | null;
  isActive: boolean;
};

export const religionMap: Record<string, number> = {
  Islam: 0,
  Hinduism: 1,
  Buddhism: 2,
  Christianity: 3,
  Other: 4,
};

export const reverseReligionMap: Record<number, string> = {
  0: "Islam",
  1: "Hinduism",
  2: "Buddhism",
  3: "Christianity",
  4: "Other",
};

export const religionMapBangla: Record<string, number> = {
  ইসলাম: 0,
  হিন্দুধর্ম: 1,
  বৌদ্ধধর্ম: 2,
  খ্রিস্টধর্ম: 3,
  অন্যান্য: 4,
};

export const reverseDocumentTypeMap: Record<number, string> = {
    0: "NID",
    1: "Passport",
    2: "Birth Certificate",
    3: "Driving License",
    4: "Photo",
    5: "Biometric",
    6: "FingerPrint",
    7: "Education Certificate",
    8: "Police Clearance",
    9: "Experience Certificate",
    10: "Passport Photo",
    11: "Chairman Certificate",
    12: "Signature",
    13: "Appointment Letter",
    14: "Joining Letter",
    15: "Medical Report",
    16: "ID Card Bangla",
    17: "ID Card English",
    18: "Applied CV",
    19: "Nominee NID",
    20: "Other",
};

export const idTypeMapBangla: Record<string, number> = {
  "জাতীয় পরিচয়পত্র": 0,
  "জন্ম নিবন্ধন": 1,
  "পাসপোর্ট": 2,
};