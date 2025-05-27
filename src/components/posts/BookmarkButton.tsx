"use client";

import kyInstance from "@/lib/ky";
import { BookmarkInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Bookmark, Heart } from "lucide-react";
import { toast } from "sonner";

interface BookmarkButtonProps {
  postId: string;
  initialState: BookmarkInfo;
}

export default function BookmarkButton({
  postId,
  initialState,
}: BookmarkButtonProps) {
  const queryClient = useQueryClient();

  /** TODO: move it to sperate hook */

  const queryKey: QueryKey = ["bookmark-info", postId];

  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/bookmark`).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  /** For add or update */
  /*
   useMutation: For add or update 

   * onMutate:
    Runs immediately before the mutation function is called.
   */

  const { mutate } = useMutation({
    mutationFn: () => {
      return data.isBookedmarkByUser
        ? kyInstance.delete(`/api/posts/${postId}/bookmark`)
        : kyInstance.post(`/api/posts/${postId}/bookmark`);
    },
    onMutate: async () => {
      toast.success(`Post ${data.isBookedmarkByUser ? "un" : ""}bookmarked`, {
        description: `Post ${data.isBookedmarkByUser ? "un" : ""}bookmarked successfully`,
      });

      /** Cancel any running Queries */
      await queryClient.cancelQueries({ queryKey });

      /** Get current caches data */
      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

      /** Know we want to apply the optimistic update */

      queryClient.setQueryData<BookmarkInfo>(queryKey, () => {
        const toggledBookedmarkState = !previousState?.isBookedmarkByUser;

        return {
          isBookedmarkByUser: toggledBookedmarkState,
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
      <Bookmark
        className={cn(
          "size-5",
          data.isBookedmarkByUser && "fill-primary text-primary",
        )}
      />
    </button>
  );
}
