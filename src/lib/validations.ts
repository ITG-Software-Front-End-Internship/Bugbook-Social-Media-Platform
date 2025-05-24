import { z } from "zod";

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

export type SignUpValuesType = z.infer<ReturnType<typeof getSignUpSchema>>;

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

export type LoginValuesType = z.infer<ReturnType<typeof getLoginSchema>>;

export const getCreatePostSchema = (messages: { required: string }) => {
  return z.object({
    content: requiredString({
      required: messages.required,
    }),
  });
};

export const getUpdateUserProfileSchema = (messages: {
  required: string;
  maxLength: string;
}) => {
  return z.object({
    displayName: requiredString({
      required: messages.required,
    }),
    bio: z.string().max(1000, "Must be at most 1000 characters"),
  });
};

export type getUpdateUserProfileValues = z.infer<
  ReturnType<typeof getUpdateUserProfileSchema>
>;
