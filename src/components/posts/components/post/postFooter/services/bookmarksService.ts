import { API_ENDPOINTS } from "@/lib/constants";
import kyInstance from "@/lib/ky";
import { BookmarkInfo } from "@/lib/types";

export function getPostBookmarks(postId: string) {
  return kyInstance
    .get(API_ENDPOINTS.getPostBookmarksEndPoint(postId))
    .json<BookmarkInfo>();
}

export function bookmarkPost(postId: string) {
  return kyInstance.post(API_ENDPOINTS.getPostBookmarksEndPoint(postId));
}

export function unBookmarkPost(postId: string) {
  return kyInstance.delete(API_ENDPOINTS.getPostBookmarksEndPoint(postId));
}
