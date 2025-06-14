import { deletePost } from "@/components/posts/actions";
import { postTranslations } from "@/lib/translationKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { handleDeletePostMutationError } from "../components/helpers/handleDeletePostMutationError";
import { handleDeletePostOptimisticUpdate } from "../components/helpers/handleDeletePostOptimisticUpdate";

export function useDeletePostMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      const deletePostMutationSuccessMessages = {
        title: t(postTranslations.header.delete.success.title),
        description: t(postTranslations.header.delete.success.description),
      };

      handleDeletePostOptimisticUpdate({
        queryClient,
        deletedPostId: deletedPost.id,
        postCreatorUsername: deletedPost.user.username,
        router,
        pathname,
        deletePostMutationSuccessMessages,
      });
    },
    onError: (error) => {
      const deletePostMutationErrorMessages = {
        title: t(postTranslations.header.delete.failed.title),
        description: t(postTranslations.header.delete.failed.description),
      };

      handleDeletePostMutationError({
        error,
        deletePostMutationErrorMessages,
      });
    },
  });

  return mutation;
}
