import { CommentData } from "@/lib/types";
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
import { useDeleteCommentMutation } from "./mutations";

interface DeleteCommentDialogProps {
  comment: CommentData;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteCommentDialog({
  comment,
  isOpen,
  onClose,
}: DeleteCommentDialogProps) {
  const deleteCommentMutation = useDeleteCommentMutation();

  function handleOpenChange(open: boolean) {
    if (!open || !deleteCommentMutation.isPending) {
      onClose();
    }
  }

  function handleOnDeletePress() {
    deleteCommentMutation.mutate(comment.id, {
      onSuccess: onClose,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete comment ?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this comment ? This action can not
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={handleOnDeletePress}
            isLoading={deleteCommentMutation.isPending}
          >
            Delete
          </LoadingButton>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={deleteCommentMutation.isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
