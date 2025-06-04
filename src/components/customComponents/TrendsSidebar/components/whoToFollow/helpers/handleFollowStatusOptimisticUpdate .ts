import { FollowerInfo } from "@/lib/types";
import { QueryClient, QueryKey } from "@tanstack/react-query";

interface HandleFollowStatusOptimisticUpdate {
  queryClient: QueryClient;
  queryKey: QueryKey;
}

export const handleFollowStatusOptimisticUpdate = async ({
  queryClient,
  queryKey,
}: HandleFollowStatusOptimisticUpdate) => {
  /** Cancel any running Queries */
  await queryClient.cancelQueries({ queryKey });

  /** Get current caches data */
  const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

  /** Know we want to apply the optimistic update (on caches data) */

  const previousFollowersNumber = previousState?.followers || 0;
  const wasFollowedByUser = previousState?.isFollowedByUser || false;
  const followersChange = wasFollowedByUser ? -1 : 1;

  const updatedFollowers = previousFollowersNumber + followersChange;

  const updatedFollowInfo: FollowerInfo = {
    followers: updatedFollowers,
    isFollowedByUser: !wasFollowedByUser,
  };

  queryClient.setQueryData<FollowerInfo>(queryKey, () => updatedFollowInfo);

  /** Return the prevState caches To roll back to it if an error happen */
  return { previousState };
};
