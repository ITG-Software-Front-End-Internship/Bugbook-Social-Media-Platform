import { QUERY_KEYS } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { getUserData } from "../services/tooltipServices";

interface UseFetchUserData {
  username: string;
}

export function useFetchUserData({ username }: UseFetchUserData) {
  const userDataQuery = useQuery({
    queryKey: QUERY_KEYS.getUserData(username),
    queryFn: () => getUserData(username),
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: Infinity,
  });

  return userDataQuery;
}
