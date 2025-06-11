import { QUERY_KEYS } from "@/lib/queryKeys";
import {
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { submitComment } from "../actions";
import { handleSubmitCommentOptimisticUpdate } from "../helpers/handleSubmitCommentOptimisticUpdate";
import { onSubmitCommentMutationError } from "../helpers/onSubmitCommentMutationError";

export function useSubmitCommentMutation(postId: string) {
  const queryClient = useQueryClient();

  const queryFilters: QueryFilters = {
    queryKey: QUERY_KEYS.getCommentPost(postId),
  };

  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: async (newComment) =>
      handleSubmitCommentOptimisticUpdate({
        newComment,
        queryClient,
        queryFilters,
      }),
    onError: onSubmitCommentMutationError,
  });
  return mutation;
}
