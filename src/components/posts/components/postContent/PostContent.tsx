import Linkify from "@/components/Linkify";
import { Media } from "@/generated/prisma";
import MediaPreviews from "../MediaPreviews";

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
        <div className="whitespace-pre-line break-words">{postTextContent}</div>
      </Linkify>
      {!!postAttachments.length && (
        <>
          <MediaPreviews attachments={postAttachments} />
        </>
      )}
    </>
  );
}
