import { BookmarkInfo } from "@/lib/types";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateBookmarkStatusContext {
  previousState: BookmarkInfo | undefined;
}

interface OnErrorMutation {
  error: Error;
  variables: void;
  context: UpdateBookmarkStatusContext | undefined;
}

interface HandleOnUpdateBookmarkStatusError {
  errorMutation: OnErrorMutation;
  queryClient: QueryClient;
  queryKey: QueryKey;
  onUpdateBookmarkStatusMutationErrorMessages: {
    [key: string]: string;
  };
}

export function handleOnUpdateBookmarkStatusError({
  errorMutation,
  queryClient,
  queryKey,
  onUpdateBookmarkStatusMutationErrorMessages,
}: HandleOnUpdateBookmarkStatusError) {
  /**
   * Return to the prev snapshot if an error happen when mutate
   */
  queryClient.setQueryData(queryKey, errorMutation.context?.previousState);

  console.error(errorMutation.error);
  toast.error(onUpdateBookmarkStatusMutationErrorMessages.title, {
    description: onUpdateBookmarkStatusMutationErrorMessages.description,
  });
}
