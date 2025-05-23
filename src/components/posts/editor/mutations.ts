"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { PostsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import submitPost from "./actions";

export function useSubmitFormMutation() {
  const queryClient = useQueryClient();

  const { user } = useSession();

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async (newPost) => {
      const queryFilters = {
        queryKey: ["post-feed"],
        predicate(query) {
          return (
            query.queryKey.includes("for-you") ||
            (query.queryKey.includes("user-posts") &&
              query.queryKey.includes(user.id))
          );
        },
      } satisfies QueryFilters;

      await queryClient.cancelQueries(queryFilters);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilters,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  posts: [newPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor,
                },
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
          return !query.state.data && queryFilters.predicate(query);
        },
      });

      toast.success("Post created!", {
        description: "Post created successfully",
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Faild to post !", {
        description: "Faild to post. Please try again",
      });
    },
  });

  return mutation;
}
