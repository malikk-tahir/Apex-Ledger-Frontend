import { z } from "zod";

export const PAYMENT_CATEGORIES = [
  { label: "Client Amount", value: "client_amount" },
  { label: "Influencer Expense", value: "influencer_expense" },
  { label: "Fuel Expense", value: "fuel_expense" },
] as const;

export const PAYMENT_CATEGORY_VALUES = [
  "client_amount",
  "influencer_expense",
  "fuel_expense",
] as const;

export const PAYMENT_TYPES = [
  { label: "Bank Transfer", value: "bank_transfer" },
  { label: "Cash", value: "cash" },
  { label: "Card", value: "card" },
  { label: "Online", value: "online" },
] as const;

export const PAYMENT_TYPE_VALUES = [
  "card",
  "cash",
  "bank_transfer",
  "online",
] as const;

export const paymentSchema = z.object({
  category: z
    .enum(PAYMENT_CATEGORY_VALUES, {
      message: "Please select a valid payment category",
    })
    .default("client_amount"),

  amountPaid: z.coerce
    .number({ message: "Amount must be a number" })
    .finite("Amount must be a valid number")
    .positive("Payment amount must be greater than 0"),

  monthYear: z
    .string()
    .regex(
      /^\d{4}-(?:0[1-9]|1[0-2])$/,
      "Month must be in YYYY-MM format (e.g., 2026-10)"
    ),

  paymentType: z.enum(PAYMENT_TYPE_VALUES, {
    message: "Please select a valid payment method",
  }),

  paymentDate: z.coerce.date().default(() => new Date()),

  note: z
    .string()
    .trim()
    .max(500, "Note cannot exceed 500 characters")
    .optional(),

  file: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;