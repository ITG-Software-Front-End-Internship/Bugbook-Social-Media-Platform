import { API_ENDPOINTS } from "@/lib/constants";
import kyInstance from "@/lib/ky";

export function markNotificationAsRead() {
  return kyInstance.patch(API_ENDPOINTS.markNotificationAsReadEndpoint);
}
