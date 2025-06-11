import { useLocaleSettings } from "@/hooks/useLocaleSettings";
import { postTranslations } from "@/lib/translationKeys";
import { PostData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import LoadingButton from "../../../../../customComponents/LoadingButton";
import { Button } from "../../../../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../../ui/dialog";
import { useDeletePostMutation } from "../hooks/useDeletePostMutation";

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
  console.log(`DeletePostDialog render ...`);

  const { mutate: deletePostMutate, isPending } = useDeletePostMutation();

  const t = useTranslations();

  const { direction } = useLocaleSettings();
  const alignDirection =
    direction === "rtl" ? "sm:justify-start" : "sm:justify-end";
  const textDirection = direction === "rtl" ? "sm:text-right" : "sm:text-left";

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open || !isPending) {
        onClose();
      }
    },
    [isPending, onClose],
  );

  useEffect(() => {
    console.log(`handleOpenChange instance changed ....`);
  }, [handleOpenChange]);

  const handleOnDeletePress = useCallback(() => {
    deletePostMutate(post.id, {
      onSuccess: onClose,
    });
  }, [deletePostMutate, onClose, post.id]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent dir={direction}>
        <DialogHeader className={cn(textDirection)}>
          <DialogTitle> {t(postTranslations.header.delete.title)}</DialogTitle>
          <DialogDescription>
            {t(postTranslations.header.delete.description)}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className={alignDirection}>
          <LoadingButton
            variant="destructive"
            onClick={handleOnDeletePress}
            isLoading={isPending}
          >
            {t(postTranslations.header.delete.buttonLabel)}
          </LoadingButton>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {t(postTranslations.header.delete.cancelButtonLabel)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
