import { QUERY_KEYS } from "@/lib/queryKeys";
import { FollowerInfo } from "@/lib/types";
import { getUserFollowers } from "@/services/getUserFollowers";
import { useQuery } from "@tanstack/react-query";

export default function useFollowerInfo(
  userId: string,
  initialState: FollowerInfo,
) {
  const followerInfoQuery = useQuery({
    queryKey: QUERY_KEYS.getUserFollowerInfoKey(userId),
    queryFn: () => getUserFollowers(userId),
    initialData: initialState,
    staleTime: Infinity,
  });

  return followerInfoQuery;
}
