import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocaleSettings } from "@/hooks/useLocaleSettings";
import { postTranslations } from "@/lib/translationKeys";
import { PostData } from "@/lib/types";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useCallback, useState } from "react";
import DeletePostDialog from "./DeletePostDialog";

interface PostMoreButtonProps {
  post: PostData;
  className?: string;
}

function PostMoreButton({ post, className }: PostMoreButtonProps) {
  console.log(`PostMoreButton render ...`);

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const t = useTranslations();
  const { direction } = useLocaleSettings();

  const onPostDialogClose = useCallback(() => {
    setShowDeleteDialog((previousState) => !previousState);
  }, []);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className={className}>
            <MoreHorizontal className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            dir={direction}
          >
            <span className="flex cursor-pointer select-none items-center gap-3 text-destructive">
              <Trash2 className="size-4" />
              {t(postTranslations.header.delete.title)}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeletePostDialog
        post={post}
        isOpen={showDeleteDialog}
        onClose={onPostDialogClose}
      />
    </>
  );
}

export default React.memo(PostMoreButton);
