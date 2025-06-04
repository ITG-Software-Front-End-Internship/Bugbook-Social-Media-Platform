import { Media } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import MediaPreview from "./MediaPreview";

interface MediaPreviewsProps {
  attachments: Media[];
}

export default function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((media) => {
        return <MediaPreview key={media.id} media={media} />;
      })}
    </div>
  );
}
