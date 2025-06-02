/*"use client";

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

      /** Cancel any running queries 
await queryClient.cancelQueries(queryFilters);

/** Now mutate the cache 
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
            posts : Post[]
          }

          nextCursor : A value returned by API for the next page.
          pageParams: A value passed to the API to get a page	
           

      type CursorPageParamsType = string | null;
      queryClient.setQueriesData<InfiniteData<PostsPage, CursorPageParamsType>>(
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
*/
