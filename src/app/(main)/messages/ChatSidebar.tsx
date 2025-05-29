import { ChannelList } from "stream-chat-react";
import { useSession } from "../SessionProvider";

export default function ChatSidebar() {
  const { user } = useSession();

  if (!user) {
    return <p>No user</p>;
  }

  return (
    <div className="size-full flex-col border-e md:w-72">
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
      />
    </div>
  );
}
