import { QUERY_KEYS } from "@/lib/queryKeys";
import { postEditorTranslations } from "@/lib/translationKeys";
import { PostData, PostsPage } from "@/lib/types";
import { InfiniteData, QueryClient, QueryFilters } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { toast } from "sonner";
import { updatedCacheWithNewPost } from "./updatedCacheWithNewPost";

interface OnSuccessCreatePostMutationProps {
  userId: string;
  queryClient: QueryClient;
  newPost: PostData;
  onSuccessCreatePostMessages: { [key: string]: string };
}

export const onSuccessCreatePostMutation = async ({
  queryClient,
  newPost,
  userId,
  onSuccessCreatePostMessages,
}: OnSuccessCreatePostMutationProps) => {
  /** New post is the new post returned from submitPost action */

  const queryFilters = {
    queryKey: QUERY_KEYS.postFeed,
    predicate(query) {
      /** Query is an object representing a single cached query managed by TanStack Query like : ["user-posts,...."].
       * We will check if the query matches our filtter, so if it return false it will be ignored, otherwise it will apply the operation we want (create post)
       */

      const hasForYouQueryKey = query.queryKey.includes("for-you");
      const hasUserPostsQueryKey = query.queryKey.includes("user-posts");
      const hasUserIdQueryKey = query.queryKey.includes(userId);
      const matchesQuery =
        hasForYouQueryKey || (hasUserPostsQueryKey && hasUserIdQueryKey);

      return matchesQuery;
    },
  } satisfies QueryFilters;

  /** Now mutate the cache */
  await queryClient.cancelQueries(queryFilters);
  type CursorPageParamsType = string | null;

  queryClient.setQueriesData<InfiniteData<PostsPage, CursorPageParamsType>>(
    queryFilters,
    (oldData) => updatedCacheWithNewPost(oldData, newPost),
  );

  /*
   *  If we cancel the query before 1st page has loaded We need to invalidate the nulll (canceling one) and loaded.
   *  This could happen if we make a new post before the first page has loaded
   */
  queryClient.invalidateQueries({
    queryKey: queryFilters.queryKey,
    predicate(query) {
      // Invalidate query if its undefined, null,...
      const queryHasData = query.state.data;
      return !queryHasData && queryFilters.predicate(query);
    },
  });

  toast.success(onSuccessCreatePostMessages.title, {
    description: onSuccessCreatePostMessages.description,
  });
};
