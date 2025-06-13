import UserAvatar from "@/components/customComponents/user/userAvatar/UserAvatar";
import { NotificationType } from "@/generated/prisma";
import { NotificationData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { HeartIcon, MessageCircle, User2 } from "lucide-react";
import Link from "next/link";
import { JSX } from "react";

interface NotificationProps {
  notification: NotificationData;
}

export default function Notification({ notification }: NotificationProps) {
  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: JSX.Element; href: string }
  > = {
    LIKE: {
      message: `liked your post.`,
      icon: <HeartIcon className="size-7 fill-red-500 text-red-500" />,
      href: `/users/${notification.issuer.username}`,
    },
    FOLLOW: {
      message: `followed you.`,
      icon: <User2 className="size-7 text-primary" />,
      href: `/users/${notification.issuer.username}`,
    },
    COMMENT: {
      message: `comment on your post.`,
      icon: <MessageCircle className="size-7 fill-primary text-primary" />,
      href: `/posts/${notification.postId}`,
    },
  };

  const { message, icon, href } = notificationTypeMap[notification.type];

  return (
    <Link href={href} className="block">
      <article
        className={cn(
          "flex gap-3 rounded-2xl bg-card p-5 shadow-sm transition-colors hover:bg-card/70",
          !notification.isRead && "bg-primary/10",
        )}
      >
        <div className="my-1">{icon}</div>
        <div className="space-y-3">
          <UserAvatar avatarUrl={notification.issuer.avatarUrl} size={36} />
          <div>
            <span className="mx-2 font-bold">
              {notification.issuer.displayName}
            </span>
            {"  "}
            <span>{message}</span>
          </div>
          {notification.post && (
            <div className="line-clamp-3 whitespace-pre-line text-muted-foreground">
              {notification.post.content}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
