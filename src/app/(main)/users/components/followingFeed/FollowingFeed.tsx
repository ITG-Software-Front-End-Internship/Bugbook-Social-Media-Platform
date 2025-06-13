"use client";

import InfiniteScrollContainer from "@/components/customComponents/InfiniteScrollContainer";
import PostsLoadingSkeleton from "@/components/posts/components/loadingSkeleton/PostsLoadingSkeleton";
import Post from "@/components/posts/components/post/Post";
import { followingFeedTranslations } from "@/lib/translationKeys";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { useFollowingFeedInfiniteQuery } from "./hooks/useFollowingFeedInfiniteQuery";

export default function FollowingFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useFollowingFeedInfiniteQuery();

  console.log({ followingFeedData: data });

  const t = useTranslations();

  const handleOnBottomReached = useCallback(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetching]);

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        {t(followingFeedTranslations.noPosts)}
      </p>
    );
  }
  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        {t(followingFeedTranslations.error)}
      </p>
    );
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
