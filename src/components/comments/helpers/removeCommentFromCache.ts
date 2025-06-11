import { CommentsPage } from "@/lib/types";
import { InfiniteData } from "@tanstack/react-query";

type CursorTypePageParams = string | null;

interface RemoveCommentFromCache {
  oldComments: InfiniteData<CommentsPage, CursorTypePageParams> | undefined;
  deletedCommentId: string;
}

export function removeCommentFromCache({
  oldComments,
  deletedCommentId,
}: RemoveCommentFromCache) {
  if (!oldComments) {
    /* Nothing to mutate we have not loading the page yet */
    return;
  }

  return {
    pageParams: oldComments.pageParams,
    pages: oldComments.pages.map((page) => {
      return {
        previousCursor: page.previousCursor,
        comments: page.comments.filter((comment) => {
          return comment.id !== deletedCommentId;
        }),
      };
    }),
  };
}
