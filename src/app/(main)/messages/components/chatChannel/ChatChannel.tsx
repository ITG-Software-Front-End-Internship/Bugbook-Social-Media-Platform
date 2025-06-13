import { cn } from "@/lib/utils";
import { Channel, MessageInput, MessageList, Window } from "stream-chat-react";
import CustomChannelHeader from "./components/CustomChannelHeader";

interface ChatChannelProps {
  isOpen: boolean;
  openSidebar: () => void;
}

export default function ChatChannel({ isOpen, openSidebar }: ChatChannelProps) {
  return (
    <div className={cn("w-full md:block", !isOpen && "hidden")}>
      <Channel>
        <Window>
          <CustomChannelHeader openSidebar={openSidebar} />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
}
