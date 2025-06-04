import { API_ENDPOINTS } from "@/lib/constants";
import kyInstance from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";

export const getUserFollowers = (userId: string) => {
  return kyInstance
    .get(API_ENDPOINTS.getUserFollowersEndpoint(userId))
    .json<FollowerInfo>();
};
