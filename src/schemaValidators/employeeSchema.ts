import { z } from "zod";

export const employeeFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  
  contact: z
    .string()
    .min(7, { message: "Please provide a valid contact number" }),
  
  designation: z
    .string()
    .min(2, { message: "Designation is required" }),
  
  baseSalary: z
    .coerce 
    .number({ message: "Base salary must be a valid number" })
    .min(0, { message: "Base salary cannot be negative" }),
  
  startDay: z
    .coerce
    .number({ message: "Start day must be a valid number" })
    .int({ message: "Start day must be a whole number" })
    .min(1, { message: "Start day must be at least 1" })
    .max(28, { message: "Start day cannot exceed 28" })
    .default(1),
  
  isActive: z.boolean().default(true),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export type Employee = EmployeeFormValues & { _id: string; createdAt?: string };