import kyInstance from "@/lib/ky";
import { BookmarkInfo } from "@/lib/types";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { getPostBookmarks } from "../services/bookmarksService";

interface UseFetchPostBookmarks {
  queryKey: QueryKey;
  postId: string;
  initialState: BookmarkInfo;
}

export function useFetchPostBookmarks({
  queryKey,
  initialState,
  postId,
}: UseFetchPostBookmarks) {
  const postBookmarksQuery = useQuery({
    queryKey: queryKey,
    queryFn: () => getPostBookmarks(postId),
    initialData: initialState,
    staleTime: Infinity,
  });

  return postBookmarksQuery;
}
