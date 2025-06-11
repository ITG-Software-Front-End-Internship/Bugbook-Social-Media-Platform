import { QUERY_KEYS } from "@/lib/queryKeys";
import { CommentsPage } from "@/lib/types";
import { InfiniteData, QueryClient, QueryFilters } from "@tanstack/react-query";
import { toast } from "sonner";
import { removeCommentFromCache } from "./removeCommentFromCache";

interface HandleDeleteCommentOptimisticUpdate {
  queryClient: QueryClient;
  deletedCommentId: string;
  deleteCommentMuationSuccessMessages: { [key: string]: string };
}

export async function handleDeleteCommentOptimisticUpdate({
  queryClient,
  deletedCommentId,
  deleteCommentMuationSuccessMessages,
}: HandleDeleteCommentOptimisticUpdate) {
  const queryFilters: QueryFilters = {
    queryKey: QUERY_KEYS.getCommentPost(deletedCommentId),
  };
  /**
   * Deleted comment is the returned value from deleteComment server action
   */

  /** The same key were we fetch the comments */

  await queryClient.cancelQueries(queryFilters);

  /** Modify the cache */

  type CursorTypePageParams = string | null;

  queryClient.setQueriesData<InfiniteData<CommentsPage, CursorTypePageParams>>(
    queryFilters,
    (oldData) =>
      removeCommentFromCache({ oldComments: oldData, deletedCommentId }),
  );

  toast.success(deleteCommentMuationSuccessMessages.title, {
    description: deleteCommentMuationSuccessMessages.description,
  });
}
