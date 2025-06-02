import { API_ENDPOINTS } from "@/lib/constants";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";

interface FetchBookmarkedPostsProps {
  pageParam: string | null;
}

export const fetchBookmarkedPosts = ({
  pageParam,
}: FetchBookmarkedPostsProps) => {
  console.log(`fetchBookmarkedPosts`);

  return kyInstance
    .get(
      API_ENDPOINTS.bookmarkedPosts,
      pageParam ? { searchParams: { cursor: pageParam } } : {},
    )
    .json<PostsPage>();
};
