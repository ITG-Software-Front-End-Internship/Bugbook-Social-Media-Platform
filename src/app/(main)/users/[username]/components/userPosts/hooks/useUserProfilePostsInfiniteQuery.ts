import { QUERY_KEYS } from "@/lib/queryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserPosts } from "../services/getUserPosts";

interface UseUserProfilePostsInfiniteQuery {
  userId: string;
}

export function useUserProfilePostsInfiniteQuery({
  userId,
}: UseUserProfilePostsInfiniteQuery) {
  const userProfilePostsInfiniteQuery = useInfiniteQuery({
    queryKey: QUERY_KEYS.userForYouPostFeed(userId),
    queryFn: ({ pageParam }) =>
      getUserPosts({
        userId,
        pageParam,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return userProfilePostsInfiniteQuery;
}
