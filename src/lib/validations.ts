import { z } from "zod";

export type SignUpValuesType = z.infer<ReturnType<typeof getSignUpSchema>>;
export type LoginValuesType = z.infer<ReturnType<typeof getLoginSchema>>;

const requiredString = (messages: { required: string }) => {
  return z.string().trim().min(1, messages.required);
};

const userNameRegex: RegExp = /^[a-zA-Z0-9_-]+$/;

export const getSignUpSchema = (messages: {
  emailInvalid: string;
  userNameInvalidChars: string;
  passwordMinLength: string;
  required: string;
}) => {
  return z.object({
    email: requiredString({
      required: messages.required,
    }).email(messages.emailInvalid),
    username: requiredString({
      required: messages.required,
    }).regex(userNameRegex, messages.userNameInvalidChars),
    password: requiredString({
      required: messages.required,
    }).min(8, messages.passwordMinLength),
  });
};

export const getLoginSchema = (messages: {
  passwordMinLength: string;
  required: string;
}) => {
  return z.object({
    userName: requiredString({
      required: messages.required,
    }),
    password: requiredString({
      required: messages.required,
    }).min(8, messages.passwordMinLength),
  });
};
