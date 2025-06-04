import kyInstance from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";
import { QueryClient, QueryKey, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseUpdateFollowStatusMutation {
  userId: string;
  isFollowedByUser: boolean;
  queryClient: QueryClient;
}

export function useUpdateFollowStatusMutation({
  userId,
  isFollowedByUser,
  queryClient,
}: UseUpdateFollowStatusMutation) {
  const queryKey: QueryKey = ["follower-info", userId];

  const updateFollowStatusMutation = useMutation({
    mutationFn: () =>
      isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
    onMutate: async () => {
      /** Cancel any running Queries */

      await queryClient.cancelQueries({ queryKey });

      /** Get current caches data */

      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

      /** Know we want to apply the optimistic update (on caches data) */

      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          (previousState?.followers || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser,
      }));

      /** To roll back to it on error */
      return { previousState };
    },
    onError: (error, variables, context) => {
      /**
       * Return to the prev snapshot if an error happen when mutate
       */
      queryClient.setQueryData(queryKey, context?.previousState);

      console.error(error);
      toast.error("Something went wrong!", {
        description: "Something went wrong!. Please try again",
      });
    },
  });

  return updateFollowStatusMutation;
}
