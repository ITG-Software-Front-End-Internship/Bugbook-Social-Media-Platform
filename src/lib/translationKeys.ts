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

export const forYouFeedTranslations = {
  noPosts: "forYouFeed.noPosts",
  error: "forYouFeed.error",
  title: "forYouFeed.title",
} as const;

export const followingFeedTranslations = {
  noPosts: "followingFeed.noPosts",
  error: "followingFeed.error",
  title: "followingFeed.title",
} as const;

export const postTranslations = {
  header: {
    delete: {
      title: "post.header.delete.title",
      description: "post.header.delete.description",
      buttonLabel: "post.header.delete.buttonLabel",
      cancelButtonLabel: "post.header.delete.cancelButtonLabel",
      success: {
        title: "post.header.delete.success.title",
        description: "post.header.delete.success.description",
      },
      failed: {
        title: "post.header.delete.failed.title",
        description: "post.header.delete.failed.description",
      },
    },
  },
  media: {
    unsupported: "post.media.unsupported",
  },
  footer: {
    likes: "post.footer.likes",
    comments: {
      title: "post.footer.comments.title",
      writeAComment: "post.footer.comments.writeAComment",
      loadPrevComment: "post.footer.comments.loadPrevComment",
      noComments: "post.footer.comments.noComments",
      error: "post.footer.comments.error",
      delete: {
        deleteComment: "post.footer.comments.delete.deleteComment",
        title: "post.footer.comments.delete.title",
        cancel: "post.footer.comments.delete.cancel",
        description: "post.footer.comments.delete.description",
        failed: {
          title: "post.footer.comments.delete.failed.title",
          description: "post.footer.comments.delete.failed.description",
        },
        success: {
          title: "post.footer.comments.delete.success.title",
          description: "post.footer.comments.delete.success.description",
        },
      },
    },
    bookmarks: {
      bookmark: {
        success: {
          title: "post.footer.bookmarks.bookmark.success.title",
          description: "post.footer.bookmarks.bookmark.success.description",
        },
        failed: {
          title: "post.footer.bookmarks.bookmark.failed.title",
          description: "post.footer.bookmarks.bookmark.failed.description",
        },
      },
      unBookmark: {
        success: {
          title: "post.footer.bookmarks.unBookmark.success.title",
          description: "post.footer.bookmarks.unBookmark.success.description",
        },
        failed: {
          title: "post.footer.bookmarks.unBookmark.failed.title",
          description: "post.footer.bookmarks.unBookmark.failed.description",
        },
      },
    },
  },
};

export const followersTranslations = {
  title: "followers.title",
};

export const searchTranslations = {
  notFound: "search.notFound",
  error: "search.error",
  title: "search.title",
};

export const profileTranslations = {
  posts: {
    title: "profile.posts.title",
  },
  edit: {
    title: "profile.edit.title",
    description: "profile.edit.description",
    memberSince: "profile.edit.memberSince",
    save: "profile.edit.save",
    success: {
      title: "profile.edit.success.title",
      description: "profile.edit.success.description",
    },
    failed: {
      title: "profile.edit.failed.title",
      description: "profile.edit.failed.description",
    },
    user: {
      avatar: {
        title: "profile.edit.user.avatar.title",
      },
      displayName: {
        title: "profile.edit.user.displayName.title",
        placeholder: "profile.edit.user.displayName.placeholder",
      },
      bio: {
        title: "profile.edit.user.bio.title",
        placeholder: "profile.edit.user.bio.placeholder",
      },
    },
  },
};
