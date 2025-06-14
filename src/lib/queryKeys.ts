export const QUERY_KEYS = {
  postFeed: ["post-feed"],
  bookmarkedPosts: ["post-feed", "bookmarks"],

  unreadNotificationsCount: ["unread-notification-count"],
  unreadMessagesCount: ["unread-messages-count"],
  getUserFollowerInfoKey: (userId: string): Array<string> => [
    "follower-info",
    userId,
  ],
  forYouPostFeed: ["post-feed", "for-you"],
  getLikeInfoPost: (postId: string) => ["like-info", postId],
  getBookmarkInfoPost: (postId: string) => ["bookmark-info", postId],
  getCommentPost: (postId: string) => ["comments", postId],
  getUserData: (username: string) => ["user-data", username],
  followingPostFeed: ["post-feed", "following"],
  postFeedSearch: (query: string) => ["post-feed", "search", query],
  userForYouPostFeed: (userId: string) => ["post-feed", "for-you", userId],
  streamUsersSearch: (searchInputDebounced: string) => [
    "stream-users",
    searchInputDebounced,
  ],
  notifications: ["notifications"],
} as const;
