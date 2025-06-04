import UserAvatar from "@/components/customComponents/UserAvatar";
import Link from "next/link";
import React from "react";

interface UserToFollowSidebarInfoProps {
  displayName: string;
  username: string;
  userAvatarUrl: string | null;
}

export default function UserToFollowSidebarInfo({
  displayName,
  username,
  userAvatarUrl,
}: UserToFollowSidebarInfoProps) {
  console.log(`UserToFollowSidebarInfo render . . .`);

  return (
    <Link href={`/users/${username}`} className="flex items-center gap-3">
      <UserAvatar avatarUrl={userAvatarUrl} className="flex-none" />
      <div className="flex-grow text-start">
        <p className="line-clamp-1 break-all font-semibold hover:underline">
          {displayName}
        </p>
        <p className="line-clamp-1 break-all text-muted-foreground">
          @{username}
        </p>
      </div>
    </Link>
  );
}
