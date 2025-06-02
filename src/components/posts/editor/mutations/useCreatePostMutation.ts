"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { InfinitePostsPageData, PostsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import submitPost from "../actions";
import { onErrorCreatePostMutation } from "./helpers/onErrorCreatePostMutation";
import { onSuccessCreatePostMutation } from "./helpers/onSuccessCreatePostMutation";

export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  const { user } = useSession();

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: (newPost) =>
      onSuccessCreatePostMutation({ queryClient, newPost, userId: user.id }),
    onError: onErrorCreatePostMutation,
  });

  return mutation;
}
