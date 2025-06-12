"use client";

import InfiniteScrollContainer from "@/components/customComponents/InfiniteScrollContainer";
import Post from "@/components/posts/components/post/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import { searchTranslations } from "@/lib/translationKeys";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { useSearchResultsInfiniteQuery } from "../hooks/useSearchResultsInfiniteQuery";

interface SearchResultsProps {
  query: string;
}

export default function SearchResults({ query }: SearchResultsProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useSearchResultsInfiniteQuery({ query });

  const handleOnBottomReached = useCallback(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetching]);

  const t = useTranslations();

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        {t(searchTranslations.notFound)}
      </p>
    );
  }
  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        {t(searchTranslations.error)}
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
