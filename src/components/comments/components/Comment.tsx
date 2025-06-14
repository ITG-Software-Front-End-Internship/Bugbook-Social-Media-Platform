import { useSession } from "@/app/(main)/SessionProvider";
import { useLocaleSettings } from "@/hooks/useLocaleSettings";
import { CommentData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import UserAvatar from "../../customComponents/user/userAvatar/UserAvatar";
import UserToolTip from "../../userTooltip/UserTooltip";
import CommentMoreButton from "./CommentMoreButton";

interface CommentProps {
  comment: CommentData;
}

export default function Comment({ comment }: CommentProps) {
  console.log(`Comment render ....`);

  const { user: loggedInUser } = useSession();

  const { locale } = useLocaleSettings();

  return (
    <div className="group/comment flex gap-3 py-3">
      <span className="hidden sm:inline">
        <UserToolTip user={comment.user}>
          <Link href={`/users/${comment.user.username}`}>
            <UserAvatar avatarUrl={comment.user.avatarUrl} />
          </Link>
        </UserToolTip>
      </span>
      <div>
        <div className="flex items-center gap-3 text-sm">
          <UserToolTip user={comment.user}>
            <Link
              href={`/users/${comment.user.username}`}
              className="font-medium hover:underline"
            >
              {comment.user.displayName}
            </Link>
          </UserToolTip>
          <span className="text-muted-foreground">
            {formatRelativeDate(comment.createdAt, locale as "ar" | "en")}
          </span>
        </div>
        <div>{comment.content}</div>
      </div>
      {comment.user.id === loggedInUser.id && (
        <CommentMoreButton
          comment={comment}
          className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
        />
      )}
    </div>
  );
}
