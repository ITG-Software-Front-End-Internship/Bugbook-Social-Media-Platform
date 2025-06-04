import {
  API_ENDPOINTS,
  MILISECONDS_IN_SECOND,
  SECONDS_IN_MINUTE,
} from "@/lib/constants";
import kyInstance from "@/lib/ky";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { MessageCountInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

interface UseFetchUnreadMessagesCount {
  initialState: MessageCountInfo;
}

export function useFetchUnreadMessagesCount({
  initialState,
}: UseFetchUnreadMessagesCount) {
  const unreadMessagesCountQuery = useQuery({
    queryKey: QUERY_KEYS.unreadMessagesCount,
    queryFn: () =>
      kyInstance
        .get(API_ENDPOINTS.unreadMessagesCount)
        .json<MessageCountInfo>(),
    /**
     * To provide default data before the query actually fetches real data from the server.
     */
    initialData: initialState,
    /** Make req to the server every minute to fetch the latest unread count
     * TODO: change it later to real time notifications
     */
    refetchInterval: SECONDS_IN_MINUTE * MILISECONDS_IN_SECOND,
  });

  return unreadMessagesCountQuery;
}
