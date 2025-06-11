import { QUERY_KEYS } from "@/lib/queryKeys";
import { PostsPage } from "@/lib/types";
import { InfiniteData, QueryClient, QueryFilters } from "@tanstack/react-query";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";
import { removePostFromCache } from "./removePostFromCache";

interface HandleDeletePostOptimisticUpdate {
  queryClient: QueryClient;
  deletedPostId: string;
  postCreatorUsername: string;
  router: AppRouterInstance;
  pathname: string;
  deletePostMutationSuccessMessages: { [key: string]: string };
}

export async function handleDeletePostOptimisticUpdate({
  queryClient,
  deletedPostId,
  postCreatorUsername,
  router,
  pathname,
  deletePostMutationSuccessMessages,
}: HandleDeletePostOptimisticUpdate) {
  const queryFilter: QueryFilters = {
    queryKey: QUERY_KEYS.postFeed,
  };

  await queryClient.cancelQueries(queryFilter);

  queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
    queryFilter,
    (oldData) =>
      removePostFromCache({
        oldPosts: oldData,
        deletedPostId,
      }),
  );

  // For empty pages we cant see delete button
  queryClient.invalidateQueries({
    queryKey: queryFilter.queryKey,
    predicate(query) {
      // Invalidate query if its undefined, null,...
      return !query.state.data;
    },
  });

  toast.success(deletePostMutationSuccessMessages.title, {
    description: deletePostMutationSuccessMessages.description,
  });

  if (pathname === `/posts/${deletedPostId}`) {
    router.push(`/users/${postCreatorUsername}`);
  }
}
