import { API_ENDPOINTS } from "@/lib/constants";
import kyInstance from "@/lib/ky";
import { UserData } from "@/lib/types";

export function getUserData(username: string) {
  return kyInstance
    .get(API_ENDPOINTS.getUserDataEndpoint(username))
    .json<UserData>();
}
