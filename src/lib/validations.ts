import { z, ZodString } from "zod";
import { validationsMessages } from "./constants";

export type SignUpValuesType = z.infer<ReturnType<typeof getSignUpSchema>>;
export type LoginValuesType = z.infer<ReturnType<typeof getLoginSchema>>;
type TranslationsType = (key: string) => string;

const requiredString: ZodString = z
  .string()
  .trim()
  .min(1, validationsMessages.required);
const userNameRegex: RegExp = /^[a-zA-Z0-9_-]+$/;

export const getSignUpSchema = (t: TranslationsType) => {
  return z.object({
    email: requiredString.email(validationsMessages.email.invalid),
    userName: requiredString.regex(
      userNameRegex,
      validationsMessages.userName.invalidChars,
    ),
    password: requiredString.min(8, validationsMessages.password.minLength),
  });
};

export const getLoginSchema = (t: TranslationsType) => {
  return z.object({
    userName: requiredString,
    password: requiredString.min(8, validationsMessages.password.minLength),
  });
};
