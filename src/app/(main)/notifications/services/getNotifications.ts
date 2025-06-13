import { API_ENDPOINTS } from "@/lib/constants";
import kyInstance from "@/lib/ky";
import { NotificationsPage } from "@/lib/types";

interface GetNotifications {
  pageParam: string | null;
}

export function getNotifications({ pageParam }: GetNotifications) {
  return kyInstance
    .get(
      API_ENDPOINTS.notificationsEndpoint,
      pageParam ? { searchParams: { cursor: pageParam } } : {},
    )
    .json<NotificationsPage>();
}
