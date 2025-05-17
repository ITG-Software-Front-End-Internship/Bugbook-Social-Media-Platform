export const validationsMessages = {
  required: "validations.required",
  email: {
    invalid: "validations.email.invalid",
    alreadyTaken: "validations.email.alreadyTaken",
  },
  userName: {
    invalidChars: "validations.userName.invalidChars",
    alreadyTaken: "validations.userName.alreadyTaken",
  },
  password: {
    minLength: "validations.password.minLength",
  },
} as const;

export const errorsMessages = {
  general: "errors.general",
};
