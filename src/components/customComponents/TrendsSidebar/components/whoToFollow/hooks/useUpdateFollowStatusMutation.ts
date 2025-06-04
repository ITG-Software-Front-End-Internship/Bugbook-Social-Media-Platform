import { API_ENDPOINTS } from "@/lib/constants";
import kyInstance from "@/lib/ky";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { errorsMessages } from "@/lib/translationKeys";
import { QueryClient, QueryKey, useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { handleFollowStatusOptimisticUpdate } from "../helpers/handleFollowStatusOptimisticUpdate ";
import { handleOnUpdateFollowStatusMutationError } from "../helpers/handleOnUpdateFollowStatusMutationError";
import { followUser, unFollowUser } from "../services/updateFollowStatus";

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
  const t = useTranslations();
  const queryKey: QueryKey = QUERY_KEYS.getUserFollowerInfoKey(userId);

  const updateFollowStatusMutation = useMutation({
    mutationFn: () =>
      isFollowedByUser ? unFollowUser(userId) : followUser(userId),
    onMutate: () =>
      handleFollowStatusOptimisticUpdate({ queryClient, queryKey }),
    onError: (error, variables, context) => {
      const onUpdateFollowStatusMutationErrorMessages = {
        errorGeneralTitle: t(errorsMessages.general.title),
        errorGeneralDescription: t(errorsMessages.general.description),
      } as const;

      const errorMutation = {
        error,
        variables,
        context,
      } as const;

      handleOnUpdateFollowStatusMutationError({
        errorMutation,
        queryClient,
        queryKey,
        onUpdateFollowStatusMutationErrorMessages,
      });
    },
  });

  return updateFollowStatusMutation;
}
