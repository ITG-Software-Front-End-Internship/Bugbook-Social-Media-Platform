"use client";

import InfiniteScrollContainer from "@/components/customComponents/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

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
  } = useInfiniteQuery({
    /** We want to re-excute this query function when the query changes
     * So it has to be part of the key.
     */
    queryKey: ["post-feed", "search", query],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get("/api/search", {
          searchParams: {
            q: query,
            ...(pageParam ? { cursor: pageParam } : {}),
          },
        })
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    /**
     * Time untill this result will become garbage collected.
    
    * We configure it to this value to ensure that the latest search results will appeare.
     
    * No need to display search results from cache, when i run search i want to see the latest result data (this depend on user preference) */
    gcTime: 0,
  });

  /**
   * TODO: we can later apply optimistic mutations
   * useMutate...
   */

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No posts found for this query.
      </p>
    );
  }
  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts.
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
