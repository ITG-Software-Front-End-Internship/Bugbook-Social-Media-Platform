import { QUERY_KEYS } from "@/lib/queryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotifications } from "../services/getNotifications";

export function useFetchNotificationsInfiniteQuery() {
  const notificationsInfiniteQuery = useInfiniteQuery({
    queryKey: QUERY_KEYS.notifications,
    queryFn: ({ pageParam }) => getNotifications({ pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return notificationsInfiniteQuery;
}
