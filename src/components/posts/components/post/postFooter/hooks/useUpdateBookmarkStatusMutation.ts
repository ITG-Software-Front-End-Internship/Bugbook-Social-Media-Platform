import { errorsMessages, postTranslations } from "@/lib/translationKeys";
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
    onMutate: () => {
      const successUpdateBookmarkStatusTitle = isBookedmarkByUser
        ? t(postTranslations.footer.bookmarks.unBookmark.success.title)
        : t(postTranslations.footer.bookmarks.bookmark.success.title);

      const successUpdateBookmarkStatusDescription = isBookedmarkByUser
        ? t(postTranslations.footer.bookmarks.unBookmark.success.description)
        : t(postTranslations.footer.bookmarks.bookmark.success.description);

      const onUpdateBookmarkStatusMutationSuccessMessages = {
        title: successUpdateBookmarkStatusTitle,
        description: successUpdateBookmarkStatusDescription,
      };

      return handleBookmarkStatusOptimisticUpdate({
        queryClient,
        queryKey,
        onUpdateBookmarkStatusMutationSuccessMessages,
      });
    },
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
