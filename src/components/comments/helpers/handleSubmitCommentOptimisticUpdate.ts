import { CommentData, CommentsPage } from "@/lib/types";
import { InfiniteData, QueryClient, QueryFilters } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateCacheWithNewComment } from "./updateCacheWithNewComment";

interface HandleSubmitCommentOptimisticUpdate {
  newComment: CommentData;
  queryClient: QueryClient;
  queryFilters: QueryFilters;
}

export async function handleSubmitCommentOptimisticUpdate({
  newComment,
  queryClient,
  queryFilters,
}: HandleSubmitCommentOptimisticUpdate) {
  /** Cancel any running queries on [comments, postId] */
  await queryClient.cancelQueries(queryFilters);

  type CursorType = string | null;

  queryClient.setQueriesData<InfiniteData<CommentsPage, CursorType>>(
    queryFilters,
    (oldData) =>
      updateCacheWithNewComment({
        oldComments: oldData,
        newComment,
      }),
  );

  /* 
    In the case of we cancel the query before 1st page has loaded
    We need to invalidate the nulll (canceling one) and loaded
    This could happen if we make a new post before the first page has loaded
  */
  queryClient.invalidateQueries({
    queryKey: queryFilters.queryKey,
    predicate(query) {
      // Invalidate query if its undefined, null,...
      const queryHasData = query.state.data;
      return !queryHasData;
    },
  });

  toast.success("Comment created!", {
    description: "Comment created successfully",
  });
}
