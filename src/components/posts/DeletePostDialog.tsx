import { PostData } from "@/lib/types";
import LoadingButton from "../customComponents/LoadingButton";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useDeletePostMutations } from "./mutations";

interface DeletePostDialogProps {
  post: PostData;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeletePostDialog({
  post,
  isOpen,
  onClose,
}: DeletePostDialogProps) {
  const deletePostMutations = useDeletePostMutations();

  function handleOpenChange(open: boolean) {
    if (!open || !deletePostMutations.isPending) {
      onClose();
    }
  }

  function handleOnDeletePress() {
    deletePostMutations.mutate(post.id, {
      onSuccess: onClose,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete post ?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post ? This action can not be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={handleOnDeletePress}
            isLoading={deletePostMutations.isPending}
          >
            Delete
          </LoadingButton>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={deletePostMutations.isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
