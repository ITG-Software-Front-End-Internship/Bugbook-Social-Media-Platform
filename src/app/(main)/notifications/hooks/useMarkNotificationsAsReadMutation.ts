import { QUERY_KEYS } from "@/lib/queryKeys";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { markNotificationAsRead } from "../services/markNotificationAsRead";

interface UseMarkNotificationsAsReadMutation {
  queryClient: QueryClient;
}

export function useMarkNotificationsAsReadMutation({
  queryClient,
}: UseMarkNotificationsAsReadMutation) {
  const markNotificationsAsReadMutation = useMutation({
    mutationFn: () => markNotificationAsRead(),
    onSuccess: () => {
      /** We dont want to wait until notificationsCount cache revalidated
       * We cant set it to 0 directly.
       */
      queryClient.setQueryData(QUERY_KEYS.unreadNotificationsCount, {
        unreadCount: 0,
      });
    },
    onError: (error) => {
      console.error("Failed to mark notifications as read", error);
    },
  });

  return markNotificationsAsReadMutation;
}
