import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";

export function getFollowingFeed(pageParam: string | null) {
  return kyInstance
    .get(
      "/api/posts/following",
      pageParam ? { searchParams: { cursor: pageParam } } : {},
    )
    .json<PostsPage>();
}
