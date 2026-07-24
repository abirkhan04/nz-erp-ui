import type { Address } from "../types/types.ts";

export const displayValue = (
  value: string | number | null | undefined
): string => {
  if (value === null || value === undefined) return "-";

  if (typeof value === "string" && value.trim() === "") return "-";

  return String(value);
};

export const formatCurrency = (
  value: number | null | undefined
): string => {
  if (value === null || value === undefined) return "-";

  return new Intl.NumberFormat("en-BD").format(value);
};

export const formatDate = (
  value: string | null | undefined
): string => {
  if (!value) return "-";

  const date = new Date(value);

  if (isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatAddress = (address?: Address): string => {
  if (!address) return "-";

  return [
    address.villageAreaRoad,
    address.postOffice,
    address.thanaName,
    address.districtName,
    address.divisionName,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
};