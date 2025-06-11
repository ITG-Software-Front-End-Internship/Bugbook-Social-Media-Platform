import { postTranslations } from "@/lib/translationKeys";
import { CommentData } from "@/lib/types";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import DeleteCommentDialog from "./DeleteCommentDialog";

interface CommentMoreButtonProps {
  comment: CommentData;
  className?: string;
}

export default function CommentMoreButton({
  comment,
  className,
}: CommentMoreButtonProps) {
  console.log(`Comment more button render ...`);

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const t = useTranslations();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className={className}>
            <MoreHorizontal className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            <span className="flex cursor-pointer select-none items-center gap-3 text-destructive">
              <Trash2 className="size-4" />
              {t(postTranslations.footer.comments.delete.deleteComment)}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteCommentDialog
        comment={comment}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(!showDeleteDialog)}
      />
    </>
  );
}
