export const API_ENDPOINTS = {
  bookmarkedPosts: "/api/posts/bookmarked",
  unreadNotificationsCount: "/api/notifications/unread-count",
  unreadMessagesCount: "/api/messages/unread-count",
  getUserFollowersEndpoint: (userId: string): string =>
    `/api/users/${userId}/followers`,
  forYouPostFeed: "/api/posts/for-you",
  getPostLikesEndPoint: (postId: string): string =>
    `/api/posts/${postId}/likes`,
  getPostBookmarksEndPoint: (postId: string) => `/api/posts/${postId}/bookmark`,
  getPostCommentsEndPoint: (postId: string) => `/api/posts/${postId}/comments`,
  getUserDataEndpoint: (username: string) => `/api/users/username/${username}`,
  search: "/api/search",
  getUserPostsEndpoint: (userId: string) => `/api/users/${userId}/posts`,
  notificationsEndpoint: "/api/notifications",
  markNotificationAsReadEndpoint: "/api/notifications/mark-as-read",
} as const;

export const MAX_ATTACHMENT_NUMBER = 5;
export const MILISECONDS_IN_SECOND = 1000;
export const SECONDS_IN_MINUTE = 60;
