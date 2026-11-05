import { z } from "zod";

export const PAYMENT_TYPES = [
  "bank_transfer",
  "cash",
  "card",
] as const;

export const paySalaryFormSchema = z.object({
  amountPaid: z
    .coerce
    .number({ message: "Amount must be a valid number" })
    .min(1, { message: "Amount paid must be greater than 0" }),
  
  paymentType: z
    .enum(PAYMENT_TYPES, { message: "Please select a valid payment method" }),
  
  paymentDate: z
    .string()
    .min(1, { message: "Payment date is required" }),
  
  file: z
    .instanceof(File)
    .optional()
    .nullable(),
});

export type PaySalaryFormValues = z.infer<typeof paySalaryFormSchema>;