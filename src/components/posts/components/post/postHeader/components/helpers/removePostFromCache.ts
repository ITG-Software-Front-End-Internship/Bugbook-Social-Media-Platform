import { PostsPage } from "@/lib/types";
import { InfiniteData } from "@tanstack/react-query";

interface RemovePostFromCache {
  oldPosts: InfiniteData<PostsPage, string | null> | undefined;
  deletedPostId: string;
}

export function removePostFromCache({
  oldPosts,
  deletedPostId,
}: RemovePostFromCache) {
  const hasPostToDelete = oldPosts;
  if (!hasPostToDelete) return;

  return {
    pageParams: oldPosts.pageParams,
    pages: oldPosts.pages.map((page) => ({
      nextCursor: page.nextCursor,
      posts: page.posts.filter((post) => {
        return post.id !== deletedPostId;
      }),
    })),
  };
}
