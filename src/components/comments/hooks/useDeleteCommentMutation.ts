import { postTranslations } from "@/lib/translationKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { deleteComment } from "../actions";
import { handleDeleteCommentMuationError } from "../helpers/handleDeleteCommentMuationError";
import { handleDeleteCommentOptimisticUpdate } from "../helpers/handleDeleteCommentOptimisticUpdate";

export function useDeleteCommentMutation() {
  const queryClient = useQueryClient();
  const t = useTranslations();

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: (deletedComment) => {
      const deleteCommentMuationSuccessMessages = {
        title: t(postTranslations.footer.comments.delete.success.title),
        description: t(
          postTranslations.footer.comments.delete.success.description,
        ),
      };

      handleDeleteCommentOptimisticUpdate({
        queryClient,
        deletedCommentId: deletedComment.postId,
        deleteCommentMuationSuccessMessages,
      });
    },
    onError: (error) => {
      const deleteCommentMuationErrorMessages = {
        title: t(postTranslations.footer.comments.delete.failed.title),
        description: t(
          postTranslations.footer.comments.delete.failed.description,
        ),
      };

      handleDeleteCommentMuationError({
        error,
        deleteCommentMuationErrorMessages,
      });
    },
  });

  return mutation;
}
