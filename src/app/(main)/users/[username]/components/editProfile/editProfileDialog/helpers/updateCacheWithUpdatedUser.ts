import { PostsPage, UserData } from "@/lib/types";
import { InfiniteData } from "@tanstack/react-query";

interface UpdateCacheWithUpdatedUser {
  oldPosts: InfiniteData<PostsPage, string | null> | undefined;
  updatedUser: UserData;
  newAvatarUrl: string | undefined;
}

export function updateCacheWithUpdatedUser({
  oldPosts,
  updatedUser,
  newAvatarUrl,
}: UpdateCacheWithUpdatedUser) {
  if (!oldPosts) {
    return;
  }

  return {
    pageParams: oldPosts.pageParams,
    pages: oldPosts.pages.map((page) => {
      return {
        nextCursor: page.nextCursor,
        posts: page.posts.map((userPost) => {
          const isPostOwnedByUser = userPost.user.id === updatedUser.id;
          if (isPostOwnedByUser) {
            const updatedUserWithAvatar = {
              ...updatedUser,
              avatarUrl: newAvatarUrl || updatedUser.avatarUrl,
            };

            const userPostWithUpdatedUserDetails = {
              ...userPost,
              user: updatedUserWithAvatar,
            };

            return userPostWithUpdatedUserDetails;
          }

          /** Nothing to update, not post for updated user */
          return userPost;
        }),
      };
    }),
  };
}
