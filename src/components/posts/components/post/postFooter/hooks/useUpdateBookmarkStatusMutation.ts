import { errorsMessages } from "@/lib/translationKeys";
import { QueryClient, QueryKey, useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import handleBookmarkStatusOptimisticUpdate from "../helpers/bookmarks/handleBookmarkStatusOptimisticUpdate";
import { handleOnUpdateBookmarkStatusError } from "../helpers/bookmarks/handleOnUpdateBookmarkStatusError";
import { bookmarkPost, unBookmarkPost } from "../services/bookmarksService";

interface UseUpdateBookmarkStatusMutation {
  queryClient: QueryClient;
  queryKey: QueryKey;
  isBookedmarkByUser: boolean;
  postId: string;
}

export function useUpdateBookmarkStatusMutation({
  queryClient,
  queryKey,
  isBookedmarkByUser,
  postId,
}: UseUpdateBookmarkStatusMutation) {
  const t = useTranslations();

  const updateBookmarkStatusMutation = useMutation({
    mutationFn: () => {
      return isBookedmarkByUser ? unBookmarkPost(postId) : bookmarkPost(postId);
    },
    onMutate: () =>
      handleBookmarkStatusOptimisticUpdate({
        isBookedmarkByUser,
        queryClient,
        queryKey,
      }),
    onError(error, variables, context) {
      const errorMutation = { error, variables, context };

      const onUpdateBookmarkStatusMutationErrorMessages = {
        title: t(errorsMessages.general.title),
        description: t(errorsMessages.general.description),
      };

      handleOnUpdateBookmarkStatusError({
        errorMutation,
        queryClient,
        queryKey,
        onUpdateBookmarkStatusMutationErrorMessages,
      });
    },
  });

  return updateBookmarkStatusMutation;
}
