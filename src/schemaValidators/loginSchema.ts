import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter email" })
    .email({ message: "Please provide a valid email" })
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, { message: "Please provide password" })
    .min(4, { message: "Password must be at least 4 characters" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;