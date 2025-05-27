"use client";

import useFollowerInfo from "@/hooks/useFollowerInfo";
import kyInstance from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface FollowButtonProps {
  userId: string;
  initialState: FollowerInfo;
}

export default function FollowButton({
  userId,
  initialState,
}: FollowButtonProps) {
  const queryClient = useQueryClient();

  const { data } = useFollowerInfo(userId, initialState);

  const queryKey: QueryKey = ["follower-info", userId];

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
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

  return (
    <Button
      variant={data.isFollowedByUser ? "secondary" : "default"}
      onClick={() => mutate()}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}
