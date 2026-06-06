// import { z } from "zod";

// export const loginSchema = z.object({
//   email: z.email(),
//   password: z.string().min(6),
// });

// validations/loginSchema.js

import { z } from "zod";

const emailOrMobile = z.string().refine(
  (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;

    return emailRegex.test(value) || mobileRegex.test(value);
  },
  {
    message: "Enter a valid email or mobile number",
  }
);

export const loginSchema = z.object({
  identifier: emailOrMobile,
  password: z.string().min(6, "Password must be at least 6 characters"),
});