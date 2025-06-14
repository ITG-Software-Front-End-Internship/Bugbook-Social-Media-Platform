import { toast } from "sonner";

interface HandleDeleteCommentMuationError {
  error: Error;
  deleteCommentMuationErrorMessages: { [key: string]: string };
}

export function handleDeleteCommentMuationError({
  error,
  deleteCommentMuationErrorMessages,
}: HandleDeleteCommentMuationError) {
  console.error(error);
  toast.error(deleteCommentMuationErrorMessages.title, {
    description: deleteCommentMuationErrorMessages.description,
  });
}
