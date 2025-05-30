"use client";

import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Chat as StreamChat } from "stream-chat-react";
import ChatChannel from "./ChatChannel";
import ChatSidebar from "./ChatSidebar";
import { useInitializeChatClient } from "./useInitializeChatClient";

export default function Chat() {
  /**
   * resolvedTheme: if always light or dark (no system choice)
   */
  const { resolvedTheme } = useTheme();

  /**
   * We could initialize the chat client in the rootlayout (as a sidebar for ex) so it starts as soon as we open any page in our website.
   
  * I decided to create it in here, in chat page because we do not create an unnecessry connection (The more connections the more you pay)
   */
  const chatClient = useInitializeChatClient();

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  /** chatClient can be null before the userclient has been initialized */
  if (!chatClient) {
    return <Loader2 className="mx-auto my-3 animate-spin" />;
  }

  return (
    <main className="relative w-full overflow-hidden rounded-2xl bg-card shadow-sm">
      <div className="absolute bottom-0 top-0 flex w-full">
        <StreamChat
          client={chatClient}
          theme={
            resolvedTheme === "dark"
              ? "str-chat__theme-dark"
              : "str-chat__theme-light"
          }
        >
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
