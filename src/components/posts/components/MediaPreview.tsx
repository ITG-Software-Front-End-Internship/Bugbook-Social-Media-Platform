import { Media } from "@/generated/prisma";
import { postTranslations } from "@/lib/translationKeys";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface MediaPreviewProps {
  media: Media;
}

export default function MediaPreview({ media }: MediaPreviewProps) {
  const t = useTranslations();

  if (media.type === "IMAGE") {
    return (
      <Image
        src={media.url}
        alt="Attachment"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
        priority
      />
    );
  }
  if (media.type === "VIDEO") {
    return (
      <div>
        <video
          src={media.url}
          controls
          className="mx-auto size-fit max-h-[30rem] rounded-2xl"
        />
      </div>
    );
  }

  return (
    <p className="text-destructive">{t(postTranslations.media.unsupported)}</p>
  );
}
