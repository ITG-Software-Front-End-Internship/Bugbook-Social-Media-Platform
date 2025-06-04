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
  general: {
    title: "errors.general.title",
    description: "errors.general.description",
  },
  files: {
    upload: {
      failed: "errors.files.upload.failed",
      wait: "errors.files.upload.wait",
      maxLimit: "errors.files.upload.maxLimit",
    },
  },
} as const;

export const loginPageTranslations = {
  login: {
    buttonLabel: "login_page.login.button.label",
    googleLabel: "login_page.login.button.googleLabel",
    title: "login_page.login.button.title",
    account: {
      signup: "login_page.login.account.signup",
      or: "login_page.login.account.or",
    },
  },
  username: {
    label: "login_page.username.label",
    placeholder: "login_page.username.placeholder",
  },
  password: {
    label: "login_page.password.label",
    placeholder: "login_page.password.placeholder",
  },
} as const;

export const signupPageTranslations = {
  signup: {
    buttonLabel: "signup_page.signup.button.label",
    title: "signup_page.signup.bugbook.title",
    subTitle: "signup_page.signup.bugbook.subTitle",
    account: {
      login: "login_page.login.account.signup",
    },
  },
  username: {
    label: "signup_page.username.label",
    placeholder: "signup_page.username.placeholder",
  },
  email: {
    label: "signup_page.email.label",
    placeholder: "signup_page.email.placeholder",
  },
  password: {
    label: "signup_page.password.label",
    placeholder: "signup_page.password.placeholder",
  },
} as const;

export const bookmarksPageTranslations = {
  bookmarks: {
    title: "bookmarks_page.bookmarks.title",
  },
  queryStatues: {
    empty: "bookmarks_page.queryStatues.empty",
    error: "bookmarks_page.queryStatues.error",
  },
} as const;

export const postEditorTranslations = {
  placeholder: "postEditor.placeholder",
  post: "postEditor.post",
  postCreate: {
    success: {
      title: "postEditor.postCreate.success.title",
      description: "postEditor.postCreate.success.description",
    },
    failed: {
      title: "postEditor.postCreate.failed.title",
      description: "postEditor.postCreate.failed.description",
    },
  },
} as const;

export const headerTranslations = {
  searchField: {
    placeholder: "header.searchField.placeholder",
  },
  userButton: {
    loggedInAs: "header.userButton.loggedInAs",
    profile: "header.userButton.profile",
    theme: {
      title: "header.userButton.theme.title",
      systemDefault: "header.userButton.theme.systemDefault",
      light: "header.userButton.theme.light",
      dark: "header.userButton.theme.dark",
    },
    logout: "header.userButton.logout",
  },
} as const;

export const menuBarTranslations = {
  home: "menubar.home",
  bookmarks: "menubar.bookmarks",
  notifications: "menubar.notifications",
  messages: "menubar.messages",
} as const;

export const whoToFollowSidebarTranslations = {
  title: "whoToFollow.title",
  follow: "whoToFollow.follow",
  unfollow: "whoToFollow.unfollow",
  generalError: "whoToFollow.generalError",
  notFound: "whoToFollow.notFound",
} as const;

export const trendingTopicsTranslations = {
  title: "trendingTopics.title",
  generalError: "trendingTopics.generalError",
  notFound: "trendingTopics.notFound",
} as const;
