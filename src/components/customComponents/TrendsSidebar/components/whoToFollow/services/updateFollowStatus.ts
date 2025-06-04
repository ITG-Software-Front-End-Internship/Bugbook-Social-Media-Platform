import { API_ENDPOINTS } from "@/lib/constants";
import kyInstance from "@/lib/ky";

export function unFollowUser(userId: string) {
  return kyInstance.delete(API_ENDPOINTS.getUserFollowersEndpoint(userId));
}

export function followUser(userId: string) {
  return kyInstance.post(API_ENDPOINTS.getUserFollowersEndpoint(userId));
}
