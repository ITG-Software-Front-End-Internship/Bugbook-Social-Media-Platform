import { LikeInfo } from "@/lib/types";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { getPostLikes } from "../services/likeService";

interface UseFetchPostLikesProps {
  postId: string;
  queryKey: QueryKey;
  initialState: LikeInfo;
}

export const useFetchPostLikes = ({
  postId,
  queryKey,
  initialState,
}: UseFetchPostLikesProps) => {
  const postLikesQuery = useQuery({
    queryKey: queryKey,
    queryFn: () => getPostLikes(postId),
    initialData: initialState,
    staleTime: Infinity,
  });

  return postLikesQuery;
};
