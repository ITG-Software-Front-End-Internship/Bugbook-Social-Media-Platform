import { toast } from "sonner";

interface HandleDeletePostMutationError {
  error: Error;
  deletePostMutationErrorMessages: { [key: string]: string };
}

export function handleDeletePostMutationError({
  error,
  deletePostMutationErrorMessages,
}: HandleDeletePostMutationError) {
  console.error(error);
  toast.error(deletePostMutationErrorMessages.title, {
    description: deletePostMutationErrorMessages.description,
  });
}
