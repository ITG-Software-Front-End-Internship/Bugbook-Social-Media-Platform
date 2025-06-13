"use client";

import InfiniteScrollContainer from "@/components/customComponents/InfiniteScrollContainer";
import { notificationsTranslations } from "@/lib/translationKeys";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { useFetchNotificationsInfiniteQuery } from "../../hooks/useFetchNotificationsInfiniteQuery";
import { useMarkNotificationsAsReadMutation } from "../../hooks/useMarkNotificationsAsReadMutation";
import NotificationsLoadingSkeleton from "../loadingSkeleton/NotificationsLoadingSkeleton";
import Notification from "./Notification";

export default function Notifications() {
  /*
   * Notes:
   * For intial page we dont have an initialPage so we put it as null,and it should be as string infer or null so we add string | null to help typescript determine the type of pageParam in queryFn.
   */

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useFetchNotificationsInfiniteQuery();

  const queryClient = useQueryClient();

  const t = useTranslations();

  const { mutate: markNotificationsAsReadMutate } =
    useMarkNotificationsAsReadMutation({ queryClient });

  useEffect(() => {
    /** It mark all notifications as read */
    markNotificationsAsReadMutate();
  }, [markNotificationsAsReadMutate]);

  const handleOnBottomReached = useCallback(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetching]);

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  if (status === "pending") {
    return <NotificationsLoadingSkeleton />;
  }

  if (status === "success" && !notifications.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        {t(notificationsTranslations.notFound)}
      </p>
    );
  }
  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        {t(notificationsTranslations.error)}
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      onBottomReached={handleOnBottomReached}
      className="space-y-5"
    >
      {notifications.map((notification) => {
        return (
          <Notification key={notification.id} notification={notification} />
        );
      })}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
