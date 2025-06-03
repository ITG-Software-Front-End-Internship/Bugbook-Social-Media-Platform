"use client";

import { menuBarTranslations } from "@/lib/translationKeys";
import { NotificationCountInfo } from "@/lib/types";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFetchUnreadNotificationsCount } from "../hooks/useFetchUnreadNotificationsCount";
import MenubarButton from "./MenubarButton";

interface NotificationsButtonProps {
  /** We do not have to wait client to fetch this data instead after we refresh the page we immediately fetch the unread count from the server. */
  initialState: NotificationCountInfo;
}

export default function NotificationsButton({
  initialState,
}: NotificationsButtonProps) {
  const t = useTranslations();

  const {
    data: { unreadCount: unreadNotificationsCount },
  } = useFetchUnreadNotificationsCount({ initialState });

  return (
    <MenubarButton
      title="Notifications"
      path="/notifications"
      MenubarIconButton={<Bell />}
      menubarIconLabel={t(menuBarTranslations.notifications)}
      isBadge={true}
      badgeCount={unreadNotificationsCount}
    />
  );
}
