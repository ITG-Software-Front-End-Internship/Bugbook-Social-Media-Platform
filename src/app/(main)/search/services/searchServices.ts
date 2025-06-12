import { API_ENDPOINTS } from "@/lib/constants";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";

interface GetSearchResults {
  query: string;
  pageParam: string | null;
}

export function getSearchResults({ query, pageParam }: GetSearchResults) {
  return kyInstance
    .get(API_ENDPOINTS.search, {
      searchParams: {
        q: query,
        ...(pageParam ? { cursor: pageParam } : {}),
      },
    })
    .json<PostsPage>();
}
