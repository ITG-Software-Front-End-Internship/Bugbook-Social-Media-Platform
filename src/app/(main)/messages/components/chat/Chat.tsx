"use client";

import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useState } from "react";
import { Chat as StreamChat } from "stream-chat-react";
import { useInitializeChatClient } from "../../useInitializeChatClient";
import ChatChannel from "../chatChannel/ChatChannel";
import ChatSidebar from "../chatSidebar/ChatSidebar";

export default function Chat() {
  const { resolvedTheme } = useTheme();
  const streamChatTheme =
    resolvedTheme === "dark" ? "str-chat__theme-dark" : "str-chat__theme-light";

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const openSidebar = useCallback(() => setSidebarOpen(true), []);

  const chatClient = useInitializeChatClient();

  if (!chatClient) {
    return <Loader2 className="mx-auto my-3 animate-spin" />;
  }

  return (
    <main className="relative w-full overflow-hidden rounded-2xl bg-card shadow-sm">
      <div className="absolute bottom-0 top-0 flex w-full">
        <StreamChat client={chatClient} theme={streamChatTheme}>
          <ChatSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
          <ChatChannel isOpen={!sidebarOpen} openSidebar={openSidebar} />
        </StreamChat>
      </div>
    </main>
  );
}
