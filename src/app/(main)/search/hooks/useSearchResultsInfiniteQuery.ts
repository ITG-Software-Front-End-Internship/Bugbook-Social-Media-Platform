import { QUERY_KEYS } from "@/lib/queryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getSearchResults } from "../services/searchServices";

interface UseSearchResultsInfiniteQuery {
  query: string;
}

export function useSearchResultsInfiniteQuery({
  query,
}: UseSearchResultsInfiniteQuery) {
  const searchResultsInfiniteQuery = useInfiniteQuery({
    /** We want to re-excute this query function when the query changes
     * So it has to be part of the key.
     */
    queryKey: QUERY_KEYS.postFeedSearch(query),
    queryFn: ({ pageParam }) =>
      getSearchResults({
        query: query,
        pageParam,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    /**
     * Time untill this result will become garbage collected.
    
    * We configure it to this value to ensure that the latest search results will appeare.
     
    * No need to display search results from cache, when i run search i want to see the latest result data (this depend on user preference) */
    gcTime: 0,
  });

  return searchResultsInfiniteQuery;
}
