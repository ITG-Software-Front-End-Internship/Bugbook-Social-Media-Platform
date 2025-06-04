import { QUERY_KEYS } from "@/lib/queryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getForYouFeed } from "../services/getForYouFeed";

export function useForYouFeedInfiniteQuery() {
  const forYouFeedInfiniteQuery = useInfiniteQuery({
    queryKey: QUERY_KEYS.forYouPostFeed,
    queryFn: ({ pageParam }) => getForYouFeed({ pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return forYouFeedInfiniteQuery;
}
