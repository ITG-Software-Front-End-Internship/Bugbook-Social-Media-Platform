import { toast } from "sonner";

interface OnErrorCreatePostMutationProps {
  error: Error;
  onErrorCreatePostMessages: { [key: string]: string };
}

export const onErrorCreatePostMutation = ({
  error,
  onErrorCreatePostMessages,
}: OnErrorCreatePostMutationProps) => {
  console.error(error);
  toast.error(onErrorCreatePostMessages.title, {
    description: onErrorCreatePostMessages.description,
  });
};
