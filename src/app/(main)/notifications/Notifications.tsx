"use client";

import InfiniteScrollContainer from "@/components/customComponents/InfiniteScrollContainer";
import kyInstance from "@/lib/ky";
import { NotificationsPage, PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Notification from "./Notification";
import NotificationsLoadingSkeleton from "./NotificationsLoadingSkeleton";

export default function Notifications() {
  /**
   * Notes: 
    * For intial page we dont have an initialPage so we put it as null, 
    and it should be as string infer or null 
    so we add string | null to help typescript determine the type of pageParam in queryFn.
   */

  /**
   * TODO: move it to sperate custom hook later
   */
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/notifications",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<NotificationsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  if (status === "pending") {
    return <NotificationsLoadingSkeleton />;
  }

  if (status === "success" && !notifications.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        You do not have any notifications yet.
      </p>
    );
  }
  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading notifications
      </p>
    );
  }

  function handleOnBottomReached() {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
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
