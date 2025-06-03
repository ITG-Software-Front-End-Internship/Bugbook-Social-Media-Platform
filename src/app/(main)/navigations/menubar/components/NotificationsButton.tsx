"use client";

import kyInstance from "@/lib/ky";
import { menuBarTranslations } from "@/lib/translationKeys";
import { NotificationCountInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import MenubarButton from "./MenubarButton";

interface NotificationsButtonProps {
  /** We do not have to wait client to fetch this data instead after we refresh the page we immediately fetch the unread count from the server. */
  initialState: NotificationCountInfo;
}

const MILISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;

export default function NotificationsButton({
  initialState,
}: NotificationsButtonProps) {
  const t = useTranslations();

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
    <MenubarButton
      title="Notifications"
      path="/notifications"
      MenubarIconButton={<Bell />}
      menubarIconLabel={t(menuBarTranslations.notifications)}
      isBadge={true}
      badgeCount={data.unreadCount}
    />
  );
}
