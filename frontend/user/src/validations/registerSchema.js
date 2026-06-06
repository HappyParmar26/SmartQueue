// validations/registerSchema.js

import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.email("Invalid email"),

    mobile: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Enter a valid mobile number"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });