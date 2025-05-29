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

export function useSubmitCommentMutation(postId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: async (newComment) => {
      /**
       * Note newComment is returned value from our server action submitComment (mutationFn)
       */
      /**
       * We want to update our cache after we created our comment
       */

      const queryFilters: QueryFilters = {
        queryKey: ["comments", postId],
      };

      /** Cancel any running queries on [comments, postId] */

      await queryClient.cancelQueries(queryFilters);

      /**
       * Mutate the cache
       */

      /**
          Take each posts and update user information in this post
          
          inifinite loading return type
          {
            pageParams: any , note : "cursor ....",
            pages: Pages[]
          }

          pages type : 
          {
            nextCursor: any (id of next page if it exist),
            comments : Post[]
          }

          nextCursor : A value returned by API for the next page.
          pageParams: A value passed to the API to get a page	
           */

      type CursorType = string | null;

      queryClient.setQueriesData<InfiniteData<CommentsPage, CursorType>>(
        queryFilters,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            /**
             * If this is the case we want to put this new comment into this first page.
             
             * The first page here in this case is the page at the bottom (comment). 
             */

            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  comments: [...firstPage.comments, newComment],
                  previousCursor: firstPage.previousCursor,
                },
                /** Skip cursor */
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
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
    },
    onError: (error) => {
      console.error(error);
      toast.error("Faild to comment !", {
        description: "Faild to submit comment. Please try again",
      });
    },
  });

  return mutation;
}

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
