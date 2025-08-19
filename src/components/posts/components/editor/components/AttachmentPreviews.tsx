import { cn } from "@/lib/utils";
import { memo, useEffect } from "react";
import { Attachment } from "../hooks/useMediaUpload";
import AttachmentPreview from "./AttachmentPreview";

interface AttachmentPreviewsProps {
  attachments: Attachment[];
  removeAttachment: (fileName: string) => void;
}

function AttachmentPreviews({
  attachments,
  removeAttachment,
}: AttachmentPreviewsProps) {
  console.log(`AttachmentPreviews render . . .`);

  /** If there is one attachment we wannt show them bellow each other
   * more than one attachment we want to create a grid  with 2 columns
   */

  useEffect(() => {
    console.log("attachments instance changed:", attachments);
  }, [attachments]);

  useEffect(() => {
    console.log("removeAttachment instance changed:", removeAttachment);
  }, [removeAttachment]);

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((attachment) => {
        return (
          <AttachmentPreview
            key={attachment.file.name}
            attachment={attachment}
            onRemoveClick={removeAttachment}
          />
        );
      })}
    </div>
  );
}

export default memo(AttachmentPreviews);
