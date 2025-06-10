import { postTranslations } from "@/lib/translationKeys";
import { PostData } from "@/lib/types";
import { MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";

interface CommentButtonProps {
  post: PostData;
  onClick: () => void;
}

export function CommentButton({ post, onClick }: CommentButtonProps) {
  const t = useTranslations();
  const numberOfComments = post._count.comments;

  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquare className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {numberOfComments}{" "}
        <span className="hide sm:inline">
          {t(postTranslations.footer.comments)}
        </span>
      </span>
    </button>
  );
}
