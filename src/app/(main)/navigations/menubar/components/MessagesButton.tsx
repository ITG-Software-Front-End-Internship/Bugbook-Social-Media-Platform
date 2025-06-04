"use client";

import { menuBarTranslations } from "@/lib/translationKeys";
import { MessageCountInfo } from "@/lib/types";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFetchUnreadMessagesCount } from "../hooks/useFetchUnreadMessagesCount";
import MenubarButton from "./MenubarButton";

interface MessagesButtonProps {
  initialState: MessageCountInfo;
}

export default function MessagesButton({ initialState }: MessagesButtonProps) {
  const t = useTranslations();

  const {
    data: { unreadCount: unreadMessagesCount },
  } = useFetchUnreadMessagesCount({ initialState });

  return (
    <MenubarButton
      title="Messages"
      path="/messages"
      MenubarIconButton={<Mail />}
      menubarIconLabel={t(menuBarTranslations.messages)}
      isBadge={true}
      badgeCount={unreadMessagesCount}
    />
  );
}
