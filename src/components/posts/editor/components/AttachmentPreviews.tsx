import { cn } from "@/lib/utils";
import { Attachment } from "../useMediaUpload";
import { AttachmentPreview } from "./AttachmentPreview";

interface AttachmentPreviewsProps {
  attachments: Attachment[];
  removeAttachment: (fileName: string) => void;
}

export function AttachmentPreviews({
  attachments,
  removeAttachment,
}: AttachmentPreviewsProps) {
  console.log(`AttachmentPreviews render . . .`);

  /** If there is one attachment we wannt show them bellow each other
   * more than one attachment we want to create a grid  with 2 columns
   */
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
            onRemoveClick={() => {
              removeAttachment(attachment.file.name);
            }}
          />
        );
      })}
    </div>
  );
}
