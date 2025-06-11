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
} as const;

export const MAX_ATTACHMENT_NUMBER = 5;
export const MILISECONDS_IN_SECOND = 1000;
export const SECONDS_IN_MINUTE = 60;
