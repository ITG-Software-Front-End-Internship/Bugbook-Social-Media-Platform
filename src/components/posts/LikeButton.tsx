"use client";

import kyInstance from "@/lib/ky";
import { LikeInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface LikeButtonProps {
  postId: string;
  initialState: LikeInfo;
}

export default function LikeButton({ postId, initialState }: LikeButtonProps) {
  const queryClient = useQueryClient();

  /** TODO: move it to sperate hook */

  const queryKey: QueryKey = ["like-info", postId];

  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/likes`).json<LikeInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  /*
   useMutation: For add or update 

   * onMutate:
    Runs immediately before the mutation function is called.
   */

  const { mutate } = useMutation({
    mutationFn: () => {
      return data.isLikedByUser
        ? kyInstance.delete(`/api/posts/${postId}/likes`)
        : kyInstance.post(`/api/posts/${postId}/likes`);
    },
    onMutate: async () => {
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
    },
    onError(error, variables, context) {
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
    <button onClick={() => mutate()} className="flex items-center gap-2">
      <Heart
        className={cn(
          "size-5",
          data.isLikedByUser && "fill-red-500 text-red-500",
        )}
      />
      <span className="text-sm font-medium tabular-nums">
        {data.likes} <span className="hidden sm:inline">Likes</span>
      </span>
    </button>
  );
}
