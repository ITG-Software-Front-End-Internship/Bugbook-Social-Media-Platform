import { toast } from "sonner";

export function onSubmitCommentMutationError(error: Error) {
  console.error(error);
  toast.error("Faild to comment !", {
    description: "Faild to submit comment. Please try again",
  });
}
