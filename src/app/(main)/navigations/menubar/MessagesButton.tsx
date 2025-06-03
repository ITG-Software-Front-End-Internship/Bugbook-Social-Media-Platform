"use client";

import kyInstance from "@/lib/ky";
import { menuBarTranslations } from "@/lib/translationKeys";
import { MessageCountInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import MenubarButton from "./components/MenubarButton";

interface MessagesButtonProps {
  initialState: MessageCountInfo;
}

const MILISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;

export default function MessagesButton({ initialState }: MessagesButtonProps) {
  const t = useTranslations();

  const { data } = useQuery({
    queryKey: ["unread-messages-count"],
    queryFn: () =>
      kyInstance.get("/api/messages/unread-count").json<MessageCountInfo>(),
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
      title="Messages"
      path="/messages"
      MenubarIconButton={<Mail />}
      menubarIconLabel={t(menuBarTranslations.messages)}
      isBadge={true}
      badgeCount={data.unreadCount}
    />
  );
}
