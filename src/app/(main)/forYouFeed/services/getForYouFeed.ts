import { API_ENDPOINTS } from "@/lib/constants";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";

interface GetForYouFeed {
  pageParam: string | null;
}

export const getForYouFeed = ({ pageParam }: GetForYouFeed) => {
  const cursorParam = { searchParams: { cursor: pageParam } };
  const options = pageParam !== null ? cursorParam : {};
  return kyInstance
    .get(API_ENDPOINTS.forYouPostFeed, options)
    .json<PostsPage>();
};
