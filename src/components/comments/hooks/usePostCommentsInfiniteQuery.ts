import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostComments } from "../services/commentService";

interface UsePostCommentsInfiniteQuery {
  postId: string;
}

export function usePostCommentsInfiniteQuery({
  postId,
}: UsePostCommentsInfiniteQuery) {
  const postCommentsInfiniteQuery = useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam }) => {
      return getPostComments(postId, pageParam);
    },
    /** Initally page params is null but we have to infer it to the type pageParam  */
    initialPageParam: null as string | null,
    /** Upward pagination */
    getNextPageParam: (firstPage) => firstPage.previousCursor,
    /** Select function to modify data before we then recive it up */
    select: (data) => {
      return {
        /** Last comment at the top and the newest at the comment */
        /** React query documnation */
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      };
    },
  });

  return postCommentsInfiniteQuery;
}
