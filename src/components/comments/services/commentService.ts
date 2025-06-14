import { API_ENDPOINTS } from "@/lib/constants";
import kyInstance from "@/lib/ky";
import { CommentsPage } from "@/lib/types";

export function getPostComments(postId: string, pageParam: string | null) {
  return kyInstance
    .get(
      API_ENDPOINTS.getPostCommentsEndPoint(postId),
      pageParam ? { searchParams: { cursor: pageParam } } : {},
    )
    .json<CommentsPage>();
}
