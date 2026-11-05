import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDateForInput = (date: string | number | Date | null | undefined): string => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

export interface DefaultDatesResult {
  startDate: string;
  endDate: string;
}

export const getDefaultDates = (): DefaultDatesResult => {
  const today = new Date();
  const pastMonth = new Date();
  pastMonth.setDate(today.getDate() - 30);

  return {
    startDate: formatDateForInput(pastMonth),
    endDate: formatDateForInput(today),
  };
};