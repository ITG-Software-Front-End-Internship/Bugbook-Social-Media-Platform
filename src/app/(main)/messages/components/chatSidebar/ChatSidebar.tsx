"use client";

import { chatTranslations } from "@/lib/translationKeys";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { ChannelList, ChannelPreviewUIComponentProps } from "stream-chat-react";
import { useSession } from "../../../SessionProvider";
import { ChannelPreviewCustom } from "./components/ChannelPreviewCustom";
import MenuHeader from "./components/MenuHeader";
import { useInvalidateUnreadMessages } from "./hooks/useInvalidateUnreadMessages";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  console.log(`ChatSidebar redner ...`);

  const { user } = useSession();

  useInvalidateUnreadMessages();

  const CustomPreviewWrapper = (props: ChannelPreviewUIComponentProps) => {
    return <ChannelPreviewCustom props={props} onClose={onClose} />;
  };

  const t = useTranslations();

  if (!user) {
    return <p>{t(chatTranslations.users.notFound)}</p>;
  }

  return (
    <div
      className={cn(
        "size-full flex-col border-e md:flex md:w-72",
        isOpen ? "flex" : "hidden",
      )}
    >
      <MenuHeader onClose={onClose} />
      <ChannelList
        filters={{
          type: "messaging",
          members: { $in: [user.id] },
        }}
        showChannelSearch
        options={{
          state: true,
          presence: true,
          limit: 8,
        }}
        sort={{
          /** To put it all the way at the top */
          last_message_at: -1,
        }}
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: {
              filters: {
                members: { $in: [user.id] },
              },
            },
          },
        }}
        Preview={CustomPreviewWrapper}
      />
    </div>
  );
}
