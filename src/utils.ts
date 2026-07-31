import { format, parseISO, isValid } from "date-fns";

export const formatDate = (dateString: string): string => {
  if (!dateString) return "";

  const date = parseISO(dateString);

  return isValid(date) ? format(date, "dd/MM/yyyy") : "";
};