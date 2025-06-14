import { QUERY_KEYS } from "@/lib/queryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getFollowingFeed } from "../services/followingFeedServices";

export function useFollowingFeedInfiniteQuery() {
  const followingFeedInfiniteQuery = useInfiniteQuery({
    queryKey: QUERY_KEYS.followingPostFeed,
    queryFn: ({ pageParam }) => getFollowingFeed(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return followingFeedInfiniteQuery;
}
