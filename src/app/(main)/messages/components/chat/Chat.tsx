"use client";

import { useLocaleSettings } from "@/hooks/useLocaleSettings";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useMemo, useState } from "react";
import { Chat as StreamChat, Streami18n } from "stream-chat-react";
import arStreamChattranslations from "../../../../../../messages/arStreamChattranslations.json";
import { useInitializeChatClient } from "../../useInitializeChatClient";
import ChatChannel from "../chatChannel/ChatChannel";
import ChatSidebar from "../chatSidebar/ChatSidebar";

export default function Chat() {
  console.log(`Chat component redner ...`);

  const { resolvedTheme } = useTheme();
  const streamChatTheme =
    resolvedTheme === "dark" ? "str-chat__theme-dark" : "str-chat__theme-light";

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const openSidebar = useCallback(() => setSidebarOpen(true), []);

  const chatClient = useInitializeChatClient();

  const { locale } = useLocaleSettings();

  const i18nInstance = useMemo(() => {
    return new Streami18n({
      language: locale,
      translationsForLanguage:
        locale === "ar" ? arStreamChattranslations : undefined,
    });
  }, [locale]);

  if (!chatClient) {
    return <Loader2 className="mx-auto my-3 animate-spin" />;
  }

  return (
    <main className="relative w-full overflow-hidden rounded-2xl bg-card shadow-sm">
      <div className="absolute bottom-0 top-0 flex w-full">
        <StreamChat
          client={chatClient}
          theme={streamChatTheme}
          i18nInstance={i18nInstance}
        >
          <ChatSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
          <ChatChannel isOpen={!sidebarOpen} openSidebar={openSidebar} />
        </StreamChat>
      </div>
    </main>
  );
}
