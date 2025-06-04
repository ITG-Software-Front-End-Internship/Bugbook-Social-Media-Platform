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
} as const;
