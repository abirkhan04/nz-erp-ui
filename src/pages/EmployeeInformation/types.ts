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
      1: "Male",
      2: "Female",
      3: "Other",
    };

export type PhysicalExaminationSetting = {
  id: string;
  fieldName: string;
  displayOrder: number;
  fieldType: number;
  optionValuesJson: string | null;
  isActive: boolean;
};
