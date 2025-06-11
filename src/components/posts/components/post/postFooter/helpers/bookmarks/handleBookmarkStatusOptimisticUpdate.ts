import { BookmarkInfo } from "@/lib/types";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";

interface HandleBookmarkStatusOptimisticUpdateProps {
  isBookedmarkByUser: boolean;
  queryClient: QueryClient;
  queryKey: QueryKey;
}

export default async function handleBookmarkStatusOptimisticUpdate({
  isBookedmarkByUser,
  queryClient,
  queryKey,
}: HandleBookmarkStatusOptimisticUpdateProps) {
  toast.success(`Post ${isBookedmarkByUser ? "un" : ""}bookmarked`, {
    description: `Post ${isBookedmarkByUser ? "un" : ""}bookmarked successfully`,
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

  /** To roll back to it if an error happen */
  return { previousState };
}
