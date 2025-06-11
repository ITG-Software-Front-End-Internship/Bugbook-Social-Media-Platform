import { LikeInfo } from "@/lib/types";
import { QueryClient, QueryKey } from "@tanstack/react-query";

interface HandleLikeStatusOptimisticUpdate {
  queryClient: QueryClient;
  queryKey: QueryKey;
}

export const handleLikeStatusOptimisticUpdate = async ({
  queryClient,
  queryKey,
}: HandleLikeStatusOptimisticUpdate) => {
  /** Cancel any running Queries */
  await queryClient.cancelQueries({ queryKey });

  /** Get current caches data */
  const previousState = queryClient.getQueryData<LikeInfo>(queryKey);

  /** Know we want to apply the optimistic update */

  queryClient.setQueryData<LikeInfo>(queryKey, () => {
    const currentLikes = previousState?.likes || 0;
    const likeChange = previousState?.isLikedByUser ? -1 : 1;
    const toggledLikeState = !previousState?.isLikedByUser;

    return {
      likes: currentLikes + likeChange,
      isLikedByUser: toggledLikeState,
    };
  });

  /** To roll back to it on error */
  return { previousState };
};
