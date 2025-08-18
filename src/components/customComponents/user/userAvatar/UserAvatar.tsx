import { cn } from "@/lib/utils";
import Image from "next/image";
import { memo } from "react";

interface UserAvatarProps {
  avatarUrl?: string | null | undefined;
  size?: number;
  className?: string;
}

function UserAvatar({ avatarUrl, size, className }: UserAvatarProps) {
  console.log(`UserAvatar render ...`);

  const DEFAULT_USER_AVATAR_SIZE = 48;
  return (
    <Image
      src={avatarUrl || "/avatar-placeholder.png"}
      alt="User avatar image"
      width={size ?? DEFAULT_USER_AVATAR_SIZE}
      height={size ?? DEFAULT_USER_AVATAR_SIZE}
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
        className,
      )}
      priority={true}
    />
  );
}

export default memo(UserAvatar);
