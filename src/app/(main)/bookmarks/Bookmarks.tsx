"use client";

import InfiniteScrollContainer from "@/components/customComponents/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import { bookmarksPageTranslations } from "@/lib/translationKeys";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import useInfiniteBookmarkedPosts from "./hooks/useInfiniteBookmarkedPosts";

export default function Bookmarks() {
  const t = useTranslations();
  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    status,
    handleOnBottomReached,
  } = useInfiniteBookmarkedPosts();

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  const noMorePosts: boolean = !posts.length && !hasNextPage;

  if (status === "success" && noMorePosts) {
    return (
      <p className="text-center text-muted-foreground">
        {t(bookmarksPageTranslations.queryStatues.empty)}
      </p>
    );
  }
  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        {t(bookmarksPageTranslations.queryStatues.error)}
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
