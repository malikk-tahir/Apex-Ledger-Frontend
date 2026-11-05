import { z } from "zod";

export const businessCategoryEnum = [
  "Restaurant & Cafe",
  "Real Estate",
  "E-Commerce & Retail",
  "Health & Fitness",
  "Education",
  "Corporate & Professional Services",
  "Automotive",
  "Events & Entertainment",
  "Other",
] as const;

export const clientTypeEnum = ["retainer", "one_time"] as const;

export const serviceTypeEnum = [
  "media",
  "graphic",
  "web",
  "package",
  "all",
] as const;

export const clientSchema = z
  .object({
    companyName: z
      .string()
      .min(1, "Company name is required")
      .trim(),
    ownerName: z
      .string()
      .min(1, "Owner name is required")
      .trim(),
    category: z.enum(businessCategoryEnum, {
      errorMap: () => ({ message: "Please select a valid business category" }),
    } as any),
    contact: z
      .string()
      .min(1, "Contact number is required"),
    address: z
      .string()
      .min(1, "Address is required"),
    type: z.enum(clientTypeEnum, {
      errorMap: () => ({ message: "Please select a client type" }),
    } as any),
    services: z
      .array(z.enum(serviceTypeEnum))
      .min(1, "Select at least one service"),
    monthlyContractAmount: z
      .number({ message: "Amount must be a number" })
      .positive("Contract amount must be greater than 0")
      .optional(),
    date: z.coerce.date({
      message: "Please select a valid date",
    }),
  })
  .refine(
    (data) => {
      if (data.type === "retainer") {
        return (
          data.monthlyContractAmount !== undefined &&
          data.monthlyContractAmount > 0
        );
      }
      return true;
    },
    {
      message: "Monthly contract amount is required for retainer clients",
      path: ["monthlyContractAmount"],
    }
  );

export type ClientFormValues = z.infer<typeof clientSchema>;