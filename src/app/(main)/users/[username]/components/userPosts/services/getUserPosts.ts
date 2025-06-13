import { API_ENDPOINTS } from "@/lib/constants";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";

interface GetUserPosts {
  userId: string;
  pageParam: string | null;
}

export function getUserPosts({ userId, pageParam }: GetUserPosts) {
  return kyInstance
    .get(
      API_ENDPOINTS.getUserPostsEndpoint(userId),
      pageParam ? { searchParams: { cursor: pageParam } } : {},
    )
    .json<PostsPage>();
}
