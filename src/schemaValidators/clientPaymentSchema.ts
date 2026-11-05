import { z } from "zod";

export const PAYMENT_TYPES = [
  { label: "Bank Transfer", value: "bank_transfer" },
  { label: "Cash", value: "cash" },
  { label: "Card", value: "card" },
  { label: "Online", value: "online" },
] as const;

export const PAYMENT_TYPE_VALUES = ["card", "cash", "bank_transfer", "online"] as const;

export const paymentSchema = z.object({
  amountPaid: z.coerce
    .number({ message: "Amount must be a number" })
    .positive("Payment amount must be greater than 0"),
  
  monthYear: z
    .string()
    .regex(/^\d{4}-(?:0[1-9]|1[0-2])$/, "Month must be in YYYY-MM format (e.g., 2026-10)"),

  paymentType: z.enum(PAYMENT_TYPE_VALUES, {
    message: "Please select a valid payment method",
  }),

  paymentDate: z.coerce.date().default(() => new Date()),

  file: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;