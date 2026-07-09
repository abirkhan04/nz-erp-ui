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
  "AB+": 4,
  "AB-": 5,
  "O+": 6,
  "O-": 7,
};

export const bloodGroupMapBangla: Record<string, number> = {
  "এ+": 0,
  "এ−": 1,
  "বি+": 2,
  "বি−": 3,
  "এবি+": 4,
  "এবি−": 5,
  "ও+": 6,
  "ও−": 7,
};

export const reverseBloodGroupMap: Record<number, string> = {
  0: "A+",
  1: "A-",
  2: "B+",
  3: "B-",
  4: "AB+",
  5: "AB-",
  6: "O+",
  7: "O-",
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