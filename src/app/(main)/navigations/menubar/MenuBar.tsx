"use server";

import { cachedValidateRequest } from "@/auth";
import { menuBarTranslations } from "@/lib/translationKeys";
import { Bookmark, Home } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getUnreadMessagesCount } from "../../../services/getUnreadMessagesCount";
import { getUnreadNotificationsCount } from "../../../services/getUnreadNotificationsCount";
import MenubarButton from "./components/MenubarButton";
import MessagesButton from "./components/MessagesButton";
import NotificationsButton from "./components/NotificationsButton";

interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const t = await getTranslations();
  const { user: loggedInUser } = await cachedValidateRequest();

  if (!loggedInUser) {
    return null;
  }

  const [unreadNotificationsCount, unreadMessagesCount] = await Promise.all([
    getUnreadNotificationsCount(loggedInUser.id),
    getUnreadMessagesCount(loggedInUser.id),
  ]);

  return (
    <div className={className}>
      <MenubarButton
        title="Home"
        path="/"
        MenubarIconButton={<Home />}
        menubarIconLabel={t(menuBarTranslations.home)}
      />
      <NotificationsButton
        initialState={{
          unreadCount: unreadNotificationsCount,
        }}
      />
      <MessagesButton
        initialState={{
          unreadCount: unreadMessagesCount,
        }}
      />
      <MenubarButton
        title="Bookmarks"
        path="/bookmarks"
        MenubarIconButton={<Bookmark />}
        menubarIconLabel={t(menuBarTranslations.bookmarks)}
      />
    </div>
  );
}
