"use client";

import UserAvatar from "@/components/customComponents/user/userAvatar/UserAvatar";
import UserTooltip from "@/components/userTooltip/UserTooltip";
import { useLocaleSettings } from "@/hooks/useLocaleSettings";
import { PostData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import PostMoreButton from "./components/PostMoreButton";

interface PostHeaderProps {
  post: PostData;
  isCurrentUserPost: boolean;
}

export default function PostHeader({
  post,
  isCurrentUserPost,
}: PostHeaderProps) {
  console.log(`PostHeader render ...`);

  const { locale, direction } = useLocaleSettings();

  return (
    <div className="flex justify-between gap-3" dir={direction}>
      <div className="flex flex-wrap gap-3">
        <UserTooltip user={post.user}>
          <Link href={`/users/${post.user.username}`}>
            <UserAvatar avatarUrl={post.user.avatarUrl} />
          </Link>
        </UserTooltip>
        <div>
          <UserTooltip user={post.user}>
            <Link
              href={`/users/${post.user.username}`}
              className="block font-medium hover:underline"
            >
              {post.user.displayName}
            </Link>
          </UserTooltip>
          <Link
            href={`/posts/${post.id}`}
            className="block text-sm text-muted-foreground hover:underline"
          >
            {formatRelativeDate(post.createdAt, locale as "ar" | "en")}
          </Link>
        </div>
      </div>
      {isCurrentUserPost && (
        <PostMoreButton
          post={post}
          className="opacity-0 transition-opacity group-hover/post:opacity-100"
        />
      )}
    </div>
  );
}
