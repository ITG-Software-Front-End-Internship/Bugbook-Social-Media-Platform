import { CommentData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import UserAvatar from "../customComponents/UserAvatar";
import UserToolTip from "../UserTooltip";

interface CommentProps {
  comment: CommentData;
}

export default function Comment({ comment }: CommentProps) {
  return (
    <div className="flex gap-3 py-3">
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
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>
        <div>{comment.content}</div>
      </div>
    </div>
  );
}
