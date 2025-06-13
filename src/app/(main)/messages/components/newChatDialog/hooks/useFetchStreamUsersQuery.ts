import { QUERY_KEYS } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { StreamChat } from "stream-chat";
import { fetchChatSearchResults } from "../services/fetchChatSearchResults";

interface UseFetchStreamUsersQuery {
  searchInputDebounced: string;
  loggedInUserId: string;
  streamClientChat: StreamChat;
}

export function useFetchStreamUsersQuery({
  searchInputDebounced,
  loggedInUserId,
  streamClientChat,
}: UseFetchStreamUsersQuery) {
  /**
     * We want to wrap them in react query so they are cached (fetched data from 3rd part library).
     
    * This is good when we search about user we get the result from cache immedaitely and also we avoid race conditions.
     */

  const streamUsersQuery = useQuery({
    queryKey: QUERY_KEYS.streamUsersSearch(searchInputDebounced),
    queryFn: async () =>
      fetchChatSearchResults({
        streamClientChat,
        searchInputDebounced,
        loggedInUserId,
      }),
  });

  return streamUsersQuery;
}
