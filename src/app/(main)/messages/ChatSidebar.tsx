import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { MailPlus, X } from "lucide-react";
import { use, useCallback, useEffect, useState } from "react";
import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
  useChatContext,
} from "stream-chat-react";
import { useSession } from "../SessionProvider";
import NewChatDialog from "./NewChatDialog";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const { user } = useSession();

  const queryClient = useQueryClient();

  const { channel } = useChatContext();

  useEffect(() => {
    /*
    * Invalidate the unread message, when we click on the channel to show the real unread count from ourserver.
    
     * We can have different unread messages in different chats and we might not have read all of them when we open the messages page.
     
    */
    const isAChannelSelected = channel?.id;

    if (isAChannelSelected) {
      queryClient.invalidateQueries({
        queryKey: ["unread-messages-count"],
      });
    }
  }, [channel?.id, queryClient]);

  const ChannelPreviewCustom = useCallback(
    (props: ChannelPreviewUIComponentProps) => {
      return (
        <ChannelPreviewMessenger
          {...props}
          onSelect={() => {
            /** We override the default behavior to open the chat channel that we click on and close the sidebar */
            props.setActiveChannel?.(props.channel, props.watchers);
            onClose();
          }}
        />
      );
    },
    [onClose],
  );

  if (!user) {
    return <p>No user</p>;
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
        Preview={ChannelPreviewCustom}
      />
    </div>
  );
}

interface MenuHeaderProps {
  onClose: () => void;
}

function MenuHeader({ onClose }: MenuHeaderProps) {
  const [showNewChatDialog, setShowNewChatDialog] = useState<boolean>(false);

  return (
    <>
      <div className="flex items-center gap-3 p-2">
        <div className="h-full md:hidden">
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>
        <h1 className="me-auto text-xl font-bold md:ms-2">Messages</h1>
        <Button
          size="icon"
          variant="ghost"
          title="Start a new chat."
          onClick={() => setShowNewChatDialog(true)}
        >
          <MailPlus className="size-5" />
        </Button>
      </div>
      {showNewChatDialog && (
        <NewChatDialog
          onOpenChange={setShowNewChatDialog}
          onChatCreated={() => {
            setShowNewChatDialog(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
