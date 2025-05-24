export const validationsMessages = {
  required: "validations.required",
  email: {
    invalid: "validations.email.invalid",
    alreadyTaken: "validations.email.alreadyTaken",
  },
  userName: {
    invalidChars: "validations.userName.invalidChars",
    alreadyTaken: "validations.userName.alreadyTaken",
    userDoseNotExist: "validations.userName.",
  },
  password: {
    minLength: "validations.password.minLength",
  },
  credentials: {
    invalid: "validations.credentials.invalid",
  },
  displayName: {
    maxLength: "validations.displayName.maxLength",
  },
} as const;

export const errorsMessages = {
  general: "errors.general",
};
