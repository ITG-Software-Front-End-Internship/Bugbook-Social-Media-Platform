"use client";

import kyInstance from "@/lib/ky";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { useSession } from "../../../SessionProvider";

export function useInitializeChatClient() {
  const { user } = useSession();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  useEffect(
    () => {
      const client = StreamChat.getInstance(
        process.env.NEXT_PUBLIC_STREAM_KEY!,
      );

      const connectChatUser = async () => {
        try {
          const { token } = await kyInstance
            .get("/api/get-token")
            .json<{ token: string }>();

          await client.connectUser(
            {
              id: user.id,
              username: user.username,
              name: user.displayName,
              image: user.avatarUrl ?? undefined,
            },
            token,
          );

          setChatClient(client);
        } catch (error) {
          console.error("Failed to connect user", error);
        }
      };

      connectChatUser();

      return () => {
        /*
         * Clean up the useEffect
         * This function will run before the next time the useEffect will runs or if this component with this hook inside of it is unmonuted
         */
        setChatClient(null);

        client
          .disconnectUser()
          .catch((error) => console.log("Failed to disconnect user", error))
          .then(() => console.log("Connection closed ..."));
      };
    },
    /** We pass the value to avoid passes the object shallow comparison
     * Every render the object has a different reference [] === []
     */
    [user.id, user.displayName, user.avatarUrl, user.username],
  );

  return chatClient;
}
