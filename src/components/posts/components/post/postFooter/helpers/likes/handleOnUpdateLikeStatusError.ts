import { LikeInfo } from "@/lib/types";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateFollowStatusContext {
  previousState: LikeInfo | undefined;
}

interface OnErrorMutation {
  error: Error;
  variables: void;
  context: UpdateFollowStatusContext | undefined;
}

interface HandleOnUpdateLikeStatusError {
  errorMutation: OnErrorMutation;
  queryClient: QueryClient;
  queryKey: QueryKey;
  onUpdateLikeStatusMutationErrorMessages: {
    [key: string]: string;
  };
}

export const handleOnUpdateLikeStatusError = ({
  errorMutation,
  queryClient,
  queryKey,
  onUpdateLikeStatusMutationErrorMessages,
}: HandleOnUpdateLikeStatusError) => {
  /**
   * Return to the prev snapshot if an error happen when mutate
   */
  queryClient.setQueryData(queryKey, errorMutation.context?.previousState);

  console.error(errorMutation.error);
  toast.error(onUpdateLikeStatusMutationErrorMessages.err, {
    description: "Something went wrong!. Please try again",
  });
};
