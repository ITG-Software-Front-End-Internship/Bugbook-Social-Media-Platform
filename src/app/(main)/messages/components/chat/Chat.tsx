"use client";

import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Chat as StreamChat } from "stream-chat-react";
import { useInitializeChatClient } from "../../useInitializeChatClient";
import ChatChannel from "../chatChannel/ChatChannel";
import ChatSidebar from "../chatSidebar/ChatSidebar";

export default function Chat() {
  const { resolvedTheme } = useTheme();
  const chatClient = useInitializeChatClient();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const streamChatTheme =
    resolvedTheme === "dark" ? "str-chat__theme-dark" : "str-chat__theme-light";

  if (!chatClient) {
    return <Loader2 className="mx-auto my-3 animate-spin" />;
  }

  return (
    <main className="relative w-full overflow-hidden rounded-2xl bg-card shadow-sm">
      <div className="absolute bottom-0 top-0 flex w-full">
        <StreamChat client={chatClient} theme={streamChatTheme}>
          <ChatSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <ChatChannel
            isOpen={!sidebarOpen}
            openSidebar={() => setSidebarOpen(true)}
          />
        </StreamChat>
      </div>
    </main>
  );
}
