import { InfinitePostsPageData, PostData, PostsPage } from "@/lib/types";

export const updatedCacheWithNewPost = (
  oldPosts: InfinitePostsPageData | undefined,
  newPost: PostData,
) => {
  const firstPage = oldPosts?.pages[0];

  if (firstPage) {
    const updatedPosts = [newPost, ...firstPage.posts];
    const nextCursor = firstPage.nextCursor;

    const newPage = {
      posts: updatedPosts,
      nextCursor: nextCursor,
    };

    const updatedPages = [newPage, ...oldPosts.pages.slice(1)];

    const updatedInfiniteData = {
      pageParams: oldPosts.pageParams,
      pages: updatedPages,
    };

    return updatedInfiniteData;
  }
};
