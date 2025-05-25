"use client";

import { PostsPage } from "@/lib/types";
import { useUploadThing } from "@/lib/uploadthing";
import { UpdateUserProfileValues } from "@/lib/validations";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateUserProfile } from "./action";

export function useUpdateProfileMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async ({
      values: userProfileValues,
      avatar,
    }: {
      values: UpdateUserProfileValues;
      avatar?: File;
    }) => {
      return Promise.all([
        updateUserProfile(userProfileValues),
        avatar && startAvatarUpload([avatar]),
      ]);
    },
    async onSuccess([updatedUser, uploadResult]) {
      const newAvatarUrl = uploadResult?.[0].serverData.newAvatarUrl;

      const queryFilter: QueryFilters = {
        queryKey: ["post-feed"],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) {
            return;
          }
          /**
          Take each posts and update user information in this post
          
          inifinite loading return type
          {
            pageParams: any , note : "cursor ....",
            pages: Pages[]
          }

          pages type : 
          {
            nextCursor: any (id of next page if it exist),
            posts : Post[]
          }
           */
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => {
              return {
                nextCursor: page.nextCursor,
                posts: page.posts.map((post) => {
                  const isPostOwnedByUser = post.user.id === updatedUser.id;
                  if (isPostOwnedByUser) {
                    return {
                      ...post,
                      user: {
                        ...updatedUser,
                        avatarUrl: newAvatarUrl || updatedUser.avatarUrl,
                      },
                    };
                  }

                  // We dont wanna to modify it
                  return post;
                }),
              };
            }),
          };
        },
      );

      router.refresh();

      toast.success("Profile updated", {
        description: "Profile updated successfully",
      });
    },
    onError(error) {
      console.error(error);
      toast("Failed to update", {
        description: "Failed to update profile. Please try again.",
      });
    },
  });

  return mutation;
}
