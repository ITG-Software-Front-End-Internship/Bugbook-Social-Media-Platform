import { CommentData, CommentsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteComment, submitComment } from "./actions";

export function useDeleteCommentMutation() {
  /**
   * Note : We dont need to pass the comment id since we can return the deleted comment from the server action
   */

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteComment,
    async onSuccess(deletedComment) {
      /**
       * Deleted comment is the returned value from deleteComment server action
       */

      /** The same key were we fetch the comments */
      const queryFilters: QueryFilters = {
        queryKey: ["comments", deletedComment.postId],
      };

      await queryClient.cancelQueries(queryFilters);

      /** Modify the cache */

      type CursorTypePageParams = string | null;

      queryClient.setQueriesData<
        InfiniteData<CommentsPage, CursorTypePageParams>
      >(queryFilters, (oldData) => {
        /**
         * To remove this comment from this feed
         */

        /**      
          inifinite loading return type
          {
            pageParams: any , note : "[cursor1, ....]",
            pages: Pages[]
          }

          pages type : 
          {
            previousCursor: any (id of next page if it exist),
            comments : Comment[]
          }
           */

        if (!oldData) {
          /* Nothing to mutate we have not loading the page yet */
          return;
        }

        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => {
            return {
              previousCursor: page.previousCursor,
              comments: page.comments.filter((comment) => {
                return comment.id !== deletedComment.id;
              }),
            };
          }),
        };
      });

      toast.success("Comment deleted", {
        description: "Comment deleted successfully!",
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Faild to delete comment !", {
        description: "Faild to delete comment. Please try again",
      });
    },
  });

  return mutation;
}
