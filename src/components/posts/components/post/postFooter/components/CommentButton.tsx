import { postTranslations } from "@/lib/translationKeys";
import { PostData } from "@/lib/types";
import { MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";

interface CommentButtonProps {
  post: PostData;
  onClick: () => void;
}

function CommentButton({ post, onClick }: CommentButtonProps) {
  console.log(`Comment button render ...`);

  useEffect(() => {
    console.log(`post comment button instance changed`);
  }, [post]);

  useEffect(() => {
    console.log(`onClick comment button instance changed`);
  }, [onClick]);

  const t = useTranslations();
  const numberOfComments = post._count.comments;

  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquare className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {numberOfComments}{" "}
        <span className="hide sm:inline">
          {t(postTranslations.footer.comments.title)}
        </span>
      </span>
    </button>
  );
}

export default React.memo(CommentButton);
