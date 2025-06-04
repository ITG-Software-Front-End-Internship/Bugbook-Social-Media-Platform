"use client";

import InfiniteScrollContainer from "@/components/customComponents/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import { forYouFeedTranslations } from "@/lib/translationKeys";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForYouFeedInfiniteQuery } from "./hooks/useForYouFeedInfiniteQuery";

export default function ForYouFeed() {
  const t = useTranslations();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useForYouFeedInfiniteQuery();

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        {t(forYouFeedTranslations.noPosts)}
      </p>
    );
  }
  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        {t(forYouFeedTranslations.error)}
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
      {posts.map((post) => {
        return <Post key={post.id} post={post} />;
      })}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
