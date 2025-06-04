import { FollowerInfo } from "@/lib/types";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateFollowStatusContext {
  previousState: FollowerInfo | undefined;
}

interface OnErrorMutation {
  error: Error;
  variables: void;
  context: UpdateFollowStatusContext | undefined;
}

interface handleOnUpdateFollowStatusMutationError {
  errorMutation: OnErrorMutation;
  queryClient: QueryClient;
  queryKey: QueryKey;
  onUpdateFollowStatusMutationErrorMessages: {
    [key: string]: string;
  };
}

export const handleOnUpdateFollowStatusMutationError = ({
  errorMutation,
  queryClient,
  queryKey,
  onUpdateFollowStatusMutationErrorMessages,
}: handleOnUpdateFollowStatusMutationError) => {
  /* Return to the prev snapshot if an error happen when mutate */
  queryClient.setQueryData(queryKey, errorMutation.context?.previousState);

  console.error(errorMutation.error);
  toast.error(onUpdateFollowStatusMutationErrorMessages.errorGeneralTitle, {
    description:
      onUpdateFollowStatusMutationErrorMessages.errorGeneralDescription,
  });
};
