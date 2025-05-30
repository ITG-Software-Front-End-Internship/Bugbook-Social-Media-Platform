"use client";

import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { NotificationCountInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import Link from "next/link";

interface NotificationsButtonProps {
  /** We do not have to wait client to fetch this data instead after we refresh the page we immediately fetch the unread count from the server. */
  initialState: NotificationCountInfo;
}

const MILISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;

export default function NotificationsButton({
  initialState,
}: NotificationsButtonProps) {
  const { data } = useQuery({
    queryKey: ["unread-notification-count"],
    /** Server end point */
    queryFn: () =>
      kyInstance
        .get("/api/notifications/unread-count")
        .json<NotificationCountInfo>(),
    /**
     * To provide default data before the query actually fetches real data from the server.
     */
    initialData: initialState,
    /** Make req to the server every minute to fetch the latest unread count
     * TODO: change it later to real time notifications
     */
    refetchInterval: SECONDS_IN_MINUTE * MILISECONDS_IN_SECOND,
  });

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Notifications"
      asChild
    >
      <Link href="/notifications">
        <div className="relative">
          <Bell />
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {" "}
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Notifications</span>
      </Link>
    </Button>
  );
}
