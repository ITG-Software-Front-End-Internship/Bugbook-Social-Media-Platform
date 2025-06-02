import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import { Attachment } from "../hooks/useMediaUpload";

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemoveClick: () => void;
}

export function AttachmentPreview({
  attachment: { file, isUploading },
  onRemoveClick,
}: AttachmentPreviewProps) {
  const src = URL.createObjectURL(file);

  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="Attachment preview"
          width={500}
          height={500}
          className="size-fit max-h-[30rem] rounded-2xl"
        ></Image>
      ) : (
        <video controls className="size-fit max-h-[30rem] rounded-2xl">
          <source src={src} type={file.type} />
        </video>
      )}
      {/** Allow deleting an attachment if it is not currntly uploading
       * We cant cancel a running upload (uploadthing limitation)
       */}
      {!isUploading && (
        <>
          <button>
            <X
              size={25}
              className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
              onClick={onRemoveClick}
            />
          </button>
        </>
      )}
    </div>
  );
}
