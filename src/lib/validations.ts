import { z } from "zod";

const requiredString = z.string().trim().min(1, "Email is Required.");

const userNameRegex: RegExp = /^[a-zA-Z0-9_-]+$/;

const signUpSchema = z.object({
  email: requiredString.email("Invalid email."),
  userName: requiredString.regex(
    userNameRegex,
    "Only letters, numbers, - and _ are allowed.",
  ),
  password: requiredString.min(8, "Password must be at least 8 characters"),
});

export type SignUpValuesType = z.infer<typeof signUpSchema>;
