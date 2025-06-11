import Linkify from "@/components/linkify/Linkify";
import { Media } from "@/generated/prisma";
import MediaPreviews from "./components/postMedia/MediaPreviews";

interface PostContentProps {
  postTextContent: string;
  postAttachments: Media[];
}

export default function PostContent({
  postTextContent,
  postAttachments,
}: PostContentProps) {
  console.log(`PostContent render ...`);

  return (
    <>
      <Linkify>
        <div className="whitespace-pre-line break-words" dir="rtl">
          {postTextContent}
        </div>
      </Linkify>
      {!!postAttachments.length && (
        <MediaPreviews attachments={postAttachments} />
      )}
    </>
  );
}
