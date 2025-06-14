import { useLocaleSettings } from "@/hooks/useLocaleSettings";
import { postTranslations } from "@/lib/translationKeys";
import { CommentData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import LoadingButton from "../../customComponents/LoadingButton";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { useDeleteCommentMutation } from "../hooks/useDeleteCommentMutation";

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
  console.log(`Delete comment dialog ....`);

  const t = useTranslations();

  const { isPending, mutate: deleteCommentMutate } = useDeleteCommentMutation();

  const { direction } = useLocaleSettings();
  const aligningDirection =
    direction === "rtl" ? "sm:justify-start" : "sm:justify-end";

  console.log({ direction });

  function handleOpenChange(open: boolean) {
    if (!open || !isPending) {
      onClose();
    }
  }

  function handleOnDeletePress() {
    deleteCommentMutate(comment.id, {
      onSuccess: onClose,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className={aligningDirection} dir={direction}>
        <DialogHeader>
          <DialogTitle
            className={cn(direction === "rtl" ? "text-right" : "text-left")}
          >
            {t(postTranslations.footer.comments.delete.title)}
          </DialogTitle>
          <DialogDescription>
            {t(postTranslations.footer.comments.delete.description)}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className={aligningDirection}>
          <LoadingButton
            variant="destructive"
            onClick={handleOnDeletePress}
            isLoading={isPending}
          >
            {t(postTranslations.footer.comments.delete.deleteComment)}
          </LoadingButton>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {t(postTranslations.footer.comments.delete.cancel)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
