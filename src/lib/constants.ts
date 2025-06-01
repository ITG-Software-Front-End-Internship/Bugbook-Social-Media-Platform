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
  attachments: {
    maxLength: "validations.attachments.maxLength",
  },
} as const;

export const errorsMessages = {
  general: "errors.general",
} as const;

export const loginPage = {
  login: {
    buttonLabel: "login_page.login.button.label",
  },
  username: {
    label: "login_page.username.label",
    placeholder: "login_page.username.placeholder",
  },
  password: {
    label: "login_page.password.label",
    placeholder: "login_page.password.placeholder",
  },
};
