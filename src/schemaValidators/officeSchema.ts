import { z } from "zod";

export const EXPENSE_PURPOSES = [
  "Office Rent",
  "Utility Bill",
  "Employee Salary",
  "Internet & Communication",
  "Software Subscriptions",
  "Marketing & Ads",
  "Office Supplies",
  "Maintenance & Repairs",
  "Miscellaneous",
] as const;

export const TRANSACTION_TYPES = ["in", "out"] as const;
export const TRANSACTION_PAYMENT_TYPES = ["cash", "bank_transfer"] as const;

export const createTransactionSchema = z.object({
  type: z.enum(TRANSACTION_TYPES, {
    message: "Transaction type must be either 'in' or 'out'",
  }),
  
  purpose: z.enum(EXPENSE_PURPOSES, {
    message: "Please select a valid purpose",
  }),
  
  amount: z
    .coerce
    .number({ message: "Amount must be a valid number" })
    .min(1, { message: "Amount must be greater than 0" }),
  
  paymentType: z.enum(TRANSACTION_PAYMENT_TYPES, {
    message: "Please select a valid payment method",
  }),
  
  transactionDate: z
    .string()
    .min(1, { message: "Transaction date is required" }),
  
  file: z
    .instanceof(File)
    .optional()
    .nullable(),
});

export type CreateTransactionFormValues = z.infer<typeof createTransactionSchema>;

// Optional: Update schema if you need it later
// export const updateTransactionSchema = createTransactionSchema.partial();
// export type UpdateTransactionFormValues = z.infer<typeof updateTransactionSchema>;