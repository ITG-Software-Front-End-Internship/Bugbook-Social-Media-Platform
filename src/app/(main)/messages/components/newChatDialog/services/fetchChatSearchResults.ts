import { StreamChat } from "stream-chat";

interface FetchChatSearchResults {
  streamClientChat: StreamChat;
  searchInputDebounced: string;
  loggedInUserId: string;
}

export async function fetchChatSearchResults({
  streamClientChat,
  searchInputDebounced,
  loggedInUserId,
}: FetchChatSearchResults) {
  const response = await streamClientChat.queryUsers(
    searchInputDebounced
      ? {
          $or: [
            /** Finds partial natures */
            { name: { $autocomplete: searchInputDebounced } },
            { username: { $autocomplete: searchInputDebounced } },
          ],
        }
      : {},
    [{ name: 1 }, { username: 1 }],
    { limit: 15 },
  );

  // Client-side filtering
  /** When u create a new stream chat app, there is an admin user created, and there no exist for this user in our app so we filtter it.  */

  return response.users.filter(
    (user) => user.id !== loggedInUserId && user.role !== "admin",
  );
}
