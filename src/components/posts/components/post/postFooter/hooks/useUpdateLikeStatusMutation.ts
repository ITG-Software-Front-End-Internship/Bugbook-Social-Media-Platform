import { errorsMessages } from "@/lib/translationKeys";
import { QueryClient, QueryKey, useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { handleLikeStatusOptimisticUpdate } from "../helpers/likes/handleLikeStatusOptimisticUpdate";
import { handleOnUpdateLikeStatusError } from "../helpers/likes/handleOnUpdateLikeStatusError";
import { likePost, unLikePost } from "../services/likeService";

interface UseUpdateLikeStatusMutation {
  postId: string;
  queryClient: QueryClient;
  queryKey: QueryKey;
  isLikedByUser: boolean;
}

export const useUpdateLikeStatusMutation = ({
  postId,
  queryClient,
  queryKey,
  isLikedByUser,
}: UseUpdateLikeStatusMutation) => {
  const t = useTranslations();

  /** useMutation: For add or update */
  const updateLikeStatusMutation = useMutation({
    mutationFn: () => {
      return isLikedByUser ? unLikePost(postId) : likePost(postId);
    },
    /* onMutate: Runs immediately before the mutation function is called.*/
    onMutate: () => handleLikeStatusOptimisticUpdate({ queryClient, queryKey }),
    onError(error, variables, context) {
      const errorMutation = {
        error,
        variables,
        context,
      };

      const onUpdateLikeStatusMutationErrorMessages = {
        title: t(errorsMessages.general.title),
        description: t(errorsMessages.general.description),
      };

      handleOnUpdateLikeStatusError({
        errorMutation,
        queryClient,
        queryKey,
        onUpdateLikeStatusMutationErrorMessages,
      });
    },
  });

  return updateLikeStatusMutation;
};
