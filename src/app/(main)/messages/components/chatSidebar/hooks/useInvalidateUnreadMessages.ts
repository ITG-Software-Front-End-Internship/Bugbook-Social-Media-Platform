import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useChatContext } from "stream-chat-react";

export function useInvalidateUnreadMessages() {
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
}
