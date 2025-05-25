import avatarPlaceHolder from "@/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface UserAvatarProps {
  avatarUrl?: string | null | undefined;
  size?: number;
  className?: string;
}

export default function UserAvatar({
  avatarUrl,
  size,
  className,
}: UserAvatarProps) {
  const DEFAULT_USER_AVATAR_SIZE = 48;
  return (
    <Image
      src={avatarUrl || avatarPlaceHolder}
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
