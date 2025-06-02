import { QUERY_KEYS } from "@/lib/queryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchBookmarkedPosts } from "../services/fetchBookmarkedPosts";

export default function useInfiniteBookmarkedPosts() {
  /** TODO: we can later apply optimistic mutations, useMutate... */

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: QUERY_KEYS.bookmarkedPosts,
    queryFn: fetchBookmarkedPosts,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  function handleOnBottomReached() {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    handleOnBottomReached,
  };
}
