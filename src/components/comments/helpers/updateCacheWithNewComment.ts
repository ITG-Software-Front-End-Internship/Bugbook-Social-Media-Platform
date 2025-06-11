import { CommentData, CommentsPage } from "@/lib/types";
import { InfiniteData } from "@tanstack/react-query";

type CursorType = string | null;

interface UpdateCacheWithNewComment {
  oldComments: InfiniteData<CommentsPage, CursorType> | undefined;
  newComment: CommentData;
}

export function updateCacheWithNewComment({
  oldComments,
  newComment,
}: UpdateCacheWithNewComment) {
  const firstPage = oldComments?.pages[0];

  if (firstPage) {
    /**
     * We want to add the new comment to the first page.
     * In this context, the "first page" refers to the bottom page (i.e., the comment page).
     */
    return {
      pageParams: oldComments.pageParams,
      pages: [
        {
          comments: [...firstPage.comments, newComment],
          previousCursor: firstPage.previousCursor,
        },
        /** Skip cursor */
        ...oldComments.pages.slice(1),
      ],
    };
  }
}
